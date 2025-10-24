from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import uuid
from src.models.base import BaseModel, validate_required_fields, ValidationError
from src.utils.decorators import require_permission

content_bp = Blueprint('content', __name__)

def get_content_model(collection_name):
    """Get content model instance"""
    db = current_app.config.get('DB')
    return BaseModel(db, collection_name)

def allowed_file(filename, allowed_extensions):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

@content_bp.route('/blogs', methods=['POST'])
@jwt_required()
@require_permission('content')
def create_blog():
    """Create a new blog post"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Request data is required'}), 400
        
        required_fields = ['title', 'content', 'category']
        validate_required_fields(data, required_fields)
        
        blogs_model = get_content_model('blogs')
        
        # Generate slug from title
        slug = data['title'].lower().replace(' ', '-').replace('&', 'and')
        
        blog_data = {
            'title': data['title'],
            'slug': slug,
            'content': data['content'],
            'excerpt': data.get('excerpt', data['content'][:200] + '...'),
            'category': data['category'],
            'author': data.get('author', 'Admin'),
            'status': data.get('status', 'draft'),
            'featured_image': data.get('featured_image'),
            'tags': data.get('tags', []),
            'published_at': datetime.utcnow() if data.get('status') == 'published' else None
        }
        
        blog = blogs_model.create(blog_data)
        
        return jsonify({
            'message': 'Blog created successfully',
            'blog': blog
        }), 201
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to create blog', 'error': str(e)}), 500

@content_bp.route('/gallery', methods=['POST'])
@jwt_required()
@require_permission('content')
def upload_gallery_item():
    """Upload gallery item (image or video)"""
    try:
        if 'file' not in request.files:
            return jsonify({'message': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'message': 'No file selected'}), 400
        
        # Get additional data
        title = request.form.get('title', '')
        category = request.form.get('category', 'general')
        item_type = request.form.get('type', 'image')  # image or video
        
        # Validate file type
        if item_type == 'image':
            allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
        else:
            allowed_extensions = {'mp4', 'mov', 'avi', 'webm'}
        
        if not allowed_file(file.filename, allowed_extensions):
            return jsonify({'message': f'Invalid file type. Allowed: {", ".join(allowed_extensions)}'}), 400
        
        # Generate secure filename
        filename = secure_filename(file.filename)
        file_extension = filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
        
        # Create upload directory if it doesn't exist
        upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], 'gallery')
        os.makedirs(upload_folder, exist_ok=True)
        
        # Save file
        file_path = os.path.join(upload_folder, unique_filename)
        file.save(file_path)
        
        # Generate public URL
        public_url = f"{current_app.config['MEDIA_BASE_URL']}/gallery/{unique_filename}"
        
        # Save to database
        gallery_model = get_content_model('gallery')
        gallery_item = {
            'title': title or filename,
            'category': category,
            'type': item_type,
            'filename': unique_filename,
            'original_filename': filename,
            'file_path': file_path,
            'public_url': public_url,
            'file_size': os.path.getsize(file_path),
            'mime_type': file.content_type,
            'uploaded_by': get_jwt().get('username', 'admin')
        }
        
        item = gallery_model.create(gallery_item)
        
        return jsonify({
            'message': 'File uploaded successfully',
            'item': item
        }), 201
        
    except Exception as e:
        return jsonify({'message': 'Failed to upload file', 'error': str(e)}), 500

@content_bp.route('/events', methods=['POST'])
@jwt_required()
@require_permission('content')
def create_event():
    """Create a new event"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Request data is required'}), 400
        
        required_fields = ['title', 'description', 'event_date', 'location']
        validate_required_fields(data, required_fields)
        
        events_model = get_content_model('events')
        
        event_data = {
            'title': data['title'],
            'description': data['description'],
            'event_date': datetime.fromisoformat(data['event_date'].replace('Z', '+00:00')),
            'location': data['location'],
            'category': data.get('category', 'general'),
            'price': data.get('price', 0),
            'capacity': data.get('capacity'),
            'banner_image': data.get('banner_image'),
            'status': data.get('status', 'active'),
            'featured': data.get('featured', False),
            'tags': data.get('tags', []),
            'created_by': get_jwt().get('username', 'admin')
        }
        
        event = events_model.create(event_data)
        
        return jsonify({
            'message': 'Event created successfully',
            'event': event
        }), 201
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to create event', 'error': str(e)}), 500

@content_bp.route('/public/<collection>', methods=['GET'])
def get_public_content(collection):
    """Get public content (blogs, gallery, events)"""
    try:
        if collection not in ['blogs', 'gallery', 'events']:
            return jsonify({'message': 'Invalid collection'}), 400
        
        content_model = get_content_model(collection)
        
        # Get query parameters
        limit = request.args.get('limit', 20, type=int)
        skip = request.args.get('skip', 0, type=int)
        category = request.args.get('category')
        status = 'published' if collection == 'blogs' else 'active'
        
        # Build query
        query = {'status': status}
        if category:
            query['category'] = category
        
        items = content_model.find_many(
            query=query,
            limit=limit,
            skip=skip,
            sort=[('created_at', -1)]
        )
        
        return jsonify({
            'items': items,
            'total': len(items)
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get content', 'error': str(e)}), 500

@content_bp.route('/blogs/<blog_id>', methods=['GET'])
def get_blog(blog_id):
    """Get single blog post"""
    try:
        blogs_model = get_content_model('blogs')
        blog = blogs_model.find_by_id(blog_id)
        
        if not blog:
            return jsonify({'message': 'Blog not found'}), 404
        
        return jsonify({'blog': blog}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get blog', 'error': str(e)}), 500

@content_bp.route('/events/<event_id>', methods=['GET'])
def get_event(event_id):
    """Get single event"""
    try:
        events_model = get_content_model('events')
        event = events_model.find_by_id(event_id)
        
        if not event:
            return jsonify({'message': 'Event not found'}), 404
        
        return jsonify({'event': event}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get event', 'error': str(e)}), 500