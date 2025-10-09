from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt
from datetime import datetime
from src.models.base import BaseModel, validate_required_fields, validate_email, validate_phone, ValidationError

events_bp = Blueprint('events', __name__)

def get_events_model():
    """Get Events model instance"""
    db = current_app.config.get('DB')
    return BaseModel(db, 'events')

def get_rsvp_model():
    """Get RSVP model instance"""
    db = current_app.config.get('DB')
    return BaseModel(db, 'rsvps')

def get_private_inquiries_model():
    """Get Private Inquiries model instance"""
    db = current_app.config.get('DB')
    return BaseModel(db, 'private_inquiries')

def require_permission(permission):
    """Decorator to check user permissions"""
    def decorator(f):
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            permissions = claims.get('permissions', [])
            if 'all' not in permissions and permission not in permissions:
                return jsonify({'message': 'Insufficient permissions'}), 403
            return f(*args, **kwargs)
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator

# Resort Events endpoints
@events_bp.route('/resort-events', methods=['GET'])
def get_resort_events():
    """Get all resort-hosted events (public endpoint)"""
    try:
        events_model = get_events_model()
        
        # Get upcoming events by default
        upcoming_only = request.args.get('upcoming', 'true').lower() == 'true'
        
        if upcoming_only:
            query = {
                'event_date': {'$gte': datetime.utcnow()},
                'status': 'active'
            }
        else:
            query = {'status': 'active'}
        
        events = events_model.find_many(query, sort=[('event_date', 1)])
        
        return jsonify({
            'events': events,
            'total': len(events)
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get resort events', 'error': str(e)}), 500

@events_bp.route('/resort-events', methods=['POST'])
@jwt_required()
@require_permission('events')
def create_resort_event():
    """Create a new resort event"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Request data is required'}), 400
        
        # Validate required fields
        required_fields = ['title', 'description', 'event_date', 'event_time', 'location']
        validate_required_fields(data, required_fields)
        
        # Parse event date
        event_date = datetime.fromisoformat(data['event_date'].replace('Z', '+00:00'))
        
        # Prepare event document
        event_doc = {
            'title': data['title'],
            'description': data['description'],
            'event_date': event_date,
            'event_time': data['event_time'],
            'location': data['location'],
            'max_attendees': data.get('max_attendees'),
            'price': data.get('price', 0),
            'image': data.get('image'),
            'category': data.get('category', 'cultural'),
            'status': data.get('status', 'active'),
            'tags': data.get('tags', []),
            'requirements': data.get('requirements', ''),
            'contact_info': data.get('contact_info', ''),
            'rsvp_count': 0
        }
        
        events_model = get_events_model()
        event = events_model.create(event_doc)
        
        return jsonify({
            'message': 'Resort event created successfully',
            'event': event
        }), 201
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to create resort event', 'error': str(e)}), 500

@events_bp.route('/resort-events/<event_id>', methods=['GET'])
def get_resort_event(event_id):
    """Get resort event by ID"""
    try:
        events_model = get_events_model()
        event = events_model.find_by_id(event_id)
        
        if not event:
            return jsonify({'message': 'Event not found'}), 404
        
        return jsonify({'event': event}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get resort event', 'error': str(e)}), 500

@events_bp.route('/resort-events/<event_id>', methods=['PUT'])
@jwt_required()
@require_permission('events')
def update_resort_event(event_id):
    """Update resort event"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Request data is required'}), 400
        
        # Parse event date if provided
        if 'event_date' in data:
            data['event_date'] = datetime.fromisoformat(data['event_date'].replace('Z', '+00:00'))
        
        events_model = get_events_model()
        event = events_model.update_by_id(event_id, data)
        
        if not event:
            return jsonify({'message': 'Event not found'}), 404
        
        return jsonify({
            'message': 'Resort event updated successfully',
            'event': event
        }), 200
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to update resort event', 'error': str(e)}), 500

@events_bp.route('/resort-events/<event_id>', methods=['DELETE'])
@jwt_required()
@require_permission('events')
def delete_resort_event(event_id):
    """Delete resort event"""
    try:
        events_model = get_events_model()
        success = events_model.delete_by_id(event_id)
        
        if not success:
            return jsonify({'message': 'Event not found'}), 404
        
        return jsonify({'message': 'Resort event deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to delete resort event', 'error': str(e)}), 500

# RSVP endpoints
@events_bp.route('/rsvp', methods=['POST'])
def create_rsvp():
    """Create RSVP for resort event (public endpoint)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Request data is required'}), 400
        
        # Validate required fields
        required_fields = ['event_id', 'guest_name', 'guest_email', 'guest_phone', 'attendees_count']
        validate_required_fields(data, required_fields)
        
        # Validate email and phone
        if not validate_email(data['guest_email']):
            raise ValidationError("Invalid email format")
        
        if not validate_phone(data['guest_phone']):
            raise ValidationError("Invalid phone number format")
        
        # Check if event exists
        events_model = get_events_model()
        event = events_model.find_by_id(data['event_id'])
        
        if not event:
            return jsonify({'message': 'Event not found'}), 404
        
        if event['status'] != 'active':
            return jsonify({'message': 'Event is not available for RSVP'}), 400
        
        # Check if already RSVP'd
        rsvp_model = get_rsvp_model()
        existing_rsvp = rsvp_model.find_one({
            'event_id': data['event_id'],
            'guest_email': data['guest_email']
        })
        
        if existing_rsvp:
            return jsonify({'message': 'You have already RSVP\'d for this event'}), 400
        
        # Check capacity
        if event.get('max_attendees'):
            current_rsvps = rsvp_model.count({'event_id': data['event_id'], 'status': 'confirmed'})
            if current_rsvps + int(data['attendees_count']) > event['max_attendees']:
                return jsonify({'message': 'Event is at full capacity'}), 400
        
        # Generate RSVP ID
        rsvp_count = rsvp_model.count() + 1
        rsvp_id = f"RSVP{rsvp_count:03d}"
        
        # Prepare RSVP document
        rsvp_doc = {
            'rsvp_id': rsvp_id,
            'event_id': data['event_id'],
            'event_title': event['title'],
            'guest_name': data['guest_name'],
            'guest_email': data['guest_email'],
            'guest_phone': data['guest_phone'],
            'attendees_count': int(data['attendees_count']),
            'special_requirements': data.get('special_requirements', ''),
            'status': 'confirmed'
        }
        
        rsvp = rsvp_model.create(rsvp_doc)
        
        # Update event RSVP count
        events_model.update_by_id(data['event_id'], {
            'rsvp_count': event.get('rsvp_count', 0) + int(data['attendees_count'])
        })
        
        return jsonify({
            'message': 'RSVP created successfully',
            'rsvp': rsvp
        }), 201
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to create RSVP', 'error': str(e)}), 500

@events_bp.route('/rsvp/<rsvp_id>', methods=['GET'])
def get_rsvp(rsvp_id):
    """Get RSVP by ID (public endpoint)"""
    try:
        rsvp_model = get_rsvp_model()
        rsvp = rsvp_model.find_by_id(rsvp_id)
        
        if not rsvp:
            return jsonify({'message': 'RSVP not found'}), 404
        
        return jsonify({'rsvp': rsvp}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get RSVP', 'error': str(e)}), 500

@events_bp.route('/rsvp/rsvp-id/<rsvp_id>', methods=['GET'])
def get_rsvp_by_rsvp_id(rsvp_id):
    """Get RSVP by RSVP ID (public endpoint)"""
    try:
        rsvp_model = get_rsvp_model()
        rsvp = rsvp_model.find_one({'rsvp_id': rsvp_id})
        
        if not rsvp:
            return jsonify({'message': 'RSVP not found'}), 404
        
        return jsonify({'rsvp': rsvp}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get RSVP', 'error': str(e)}), 500

@events_bp.route('/rsvp/event/<event_id>', methods=['GET'])
@jwt_required()
@require_permission('events')
def get_event_rsvps(event_id):
    """Get all RSVPs for an event (admin endpoint)"""
    try:
        rsvp_model = get_rsvp_model()
        rsvps = rsvp_model.find_many({'event_id': event_id}, sort=[('created_at', -1)])
        
        return jsonify({
            'rsvps': rsvps,
            'total': len(rsvps)
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get event RSVPs', 'error': str(e)}), 500

# Private Event Inquiries endpoints
@events_bp.route('/private-inquiries', methods=['POST'])
def create_private_inquiry():
    """Create private event inquiry (public endpoint)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Request data is required'}), 400
        
        # Validate required fields
        required_fields = ['client_name', 'client_email', 'client_phone', 'event_type', 'event_date', 'guest_count']
        validate_required_fields(data, required_fields)
        
        # Validate email and phone
        if not validate_email(data['client_email']):
            raise ValidationError("Invalid email format")
        
        if not validate_phone(data['client_phone']):
            raise ValidationError("Invalid phone number format")
        
        # Parse event date
        event_date = datetime.fromisoformat(data['event_date'].replace('Z', '+00:00'))
        
        # Generate inquiry ID
        inquiries_model = get_private_inquiries_model()
        inquiry_count = inquiries_model.count() + 1
        inquiry_id = f"INQ{inquiry_count:03d}"
        
        # Prepare inquiry document
        inquiry_doc = {
            'inquiry_id': inquiry_id,
            'client_name': data['client_name'],
            'client_email': data['client_email'],
            'client_phone': data['client_phone'],
            'event_type': data['event_type'],
            'event_date': event_date,
            'guest_count': int(data['guest_count']),
            'budget_range': data.get('budget_range'),
            'venue_preference': data.get('venue_preference'),
            'catering_required': data.get('catering_required', False),
            'special_requirements': data.get('special_requirements', ''),
            'additional_services': data.get('additional_services', []),
            'status': 'pending',
            'assigned_staff': None,
            'estimated_cost': None,
            'notes': ''
        }
        
        inquiry = inquiries_model.create(inquiry_doc)
        
        return jsonify({
            'message': 'Private event inquiry submitted successfully',
            'inquiry': inquiry
        }), 201
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to create private inquiry', 'error': str(e)}), 500

@events_bp.route('/private-inquiries', methods=['GET'])
@jwt_required()
@require_permission('events')
def get_private_inquiries():
    """Get all private event inquiries (admin endpoint)"""
    try:
        inquiries_model = get_private_inquiries_model()
        
        status = request.args.get('status')
        limit = request.args.get('limit', type=int)
        skip = request.args.get('skip', 0, type=int)
        
        query = {}
        if status:
            query['status'] = status
        
        inquiries = inquiries_model.find_many(
            query=query,
            limit=limit,
            skip=skip,
            sort=[('created_at', -1)]
        )
        
        return jsonify({
            'inquiries': inquiries,
            'total': len(inquiries)
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get private inquiries', 'error': str(e)}), 500

@events_bp.route('/private-inquiries/<inquiry_id>', methods=['GET'])
@jwt_required()
@require_permission('events')
def get_private_inquiry(inquiry_id):
    """Get private inquiry by ID"""
    try:
        inquiries_model = get_private_inquiries_model()
        inquiry = inquiries_model.find_by_id(inquiry_id)
        
        if not inquiry:
            return jsonify({'message': 'Private inquiry not found'}), 404
        
        return jsonify({'inquiry': inquiry}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get private inquiry', 'error': str(e)}), 500

@events_bp.route('/private-inquiries/inquiry-id/<inquiry_id>', methods=['GET'])
def get_private_inquiry_by_inquiry_id(inquiry_id):
    """Get private inquiry by inquiry ID (public endpoint)"""
    try:
        inquiries_model = get_private_inquiries_model()
        inquiry = inquiries_model.find_one({'inquiry_id': inquiry_id})
        
        if not inquiry:
            return jsonify({'message': 'Private inquiry not found'}), 404
        
        # Return limited information for public access
        public_inquiry = {
            'inquiry_id': inquiry['inquiry_id'],
            'client_name': inquiry['client_name'],
            'event_type': inquiry['event_type'],
            'event_date': inquiry['event_date'],
            'guest_count': inquiry['guest_count'],
            'status': inquiry['status'],
            'estimated_cost': inquiry.get('estimated_cost'),
            'created_at': inquiry['created_at']
        }
        
        return jsonify({'inquiry': public_inquiry}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get private inquiry', 'error': str(e)}), 500

@events_bp.route('/private-inquiries/<inquiry_id>', methods=['PUT'])
@jwt_required()
@require_permission('events')
def update_private_inquiry(inquiry_id):
    """Update private inquiry"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Request data is required'}), 400
        
        # Parse event date if provided
        if 'event_date' in data:
            data['event_date'] = datetime.fromisoformat(data['event_date'].replace('Z', '+00:00'))
        
        inquiries_model = get_private_inquiries_model()
        inquiry = inquiries_model.update_by_id(inquiry_id, data)
        
        if not inquiry:
            return jsonify({'message': 'Private inquiry not found'}), 404
        
        return jsonify({
            'message': 'Private inquiry updated successfully',
            'inquiry': inquiry
        }), 200
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to update private inquiry', 'error': str(e)}), 500

