from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt
from src.models.room import RoomModel, ValidationError

rooms_bp = Blueprint('rooms', __name__)

def get_room_model():
    """Get RoomModel instance"""
    db = current_app.config.get('DB')
    return RoomModel(db)

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

@rooms_bp.route('/', methods=['GET'])
def get_rooms():
    """Get all room types (public endpoint)"""
    try:
        room_model = get_room_model()
        rooms = room_model.get_active_rooms()
        
        return jsonify({
            'rooms': rooms,
            'total': len(rooms)
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get rooms', 'error': str(e)}), 500

@rooms_bp.route('/admin', methods=['GET'])
@jwt_required()
@require_permission('rooms')
def get_all_rooms():
    """Get all room types including inactive (admin endpoint)"""
    try:
        room_model = get_room_model()
        rooms = room_model.find_many({}, sort=[('name', 1)])
        
        return jsonify({
            'rooms': rooms,
            'total': len(rooms)
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get rooms', 'error': str(e)}), 500

@rooms_bp.route('/', methods=['POST'])
@jwt_required()
@require_permission('rooms')
def create_room():
    """Create a new room type"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Request data is required'}), 400
        
        room_model = get_room_model()
        room = room_model.create_room_type(data)
        
        return jsonify({
            'message': 'Room type created successfully',
            'room': room
        }), 201
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to create room type', 'error': str(e)}), 500

@rooms_bp.route('/<room_id>', methods=['GET'])
def get_room(room_id):
    """Get room type by ID"""
    try:
        room_model = get_room_model()
        room = room_model.find_by_id(room_id)
        
        if not room:
            return jsonify({'message': 'Room type not found'}), 404
        
        return jsonify({'room': room}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get room type', 'error': str(e)}), 500

@rooms_bp.route('/name/<room_name>', methods=['GET'])
def get_room_by_name(room_name):
    """Get room type by name"""
    try:
        room_model = get_room_model()
        room = room_model.get_room_by_name(room_name)
        
        if not room:
            return jsonify({'message': 'Room type not found'}), 404
        
        return jsonify({'room': room}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get room type', 'error': str(e)}), 500

@rooms_bp.route('/<room_id>', methods=['PUT'])
@jwt_required()
@require_permission('rooms')
def update_room(room_id):
    """Update room type"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Request data is required'}), 400
        
        room_model = get_room_model()
        room = room_model.update_room_type(room_id, data)
        
        if not room:
            return jsonify({'message': 'Room type not found'}), 404
        
        return jsonify({
            'message': 'Room type updated successfully',
            'room': room
        }), 200
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to update room type', 'error': str(e)}), 500

@rooms_bp.route('/<room_id>/status', methods=['PUT'])
@jwt_required()
@require_permission('rooms')
def update_room_status(room_id):
    """Update room status"""
    try:
        data = request.get_json()
        
        if not data or 'status' not in data:
            return jsonify({'message': 'Status is required'}), 400
        
        room_model = get_room_model()
        room = room_model.update_room_status(room_id, data['status'])
        
        if not room:
            return jsonify({'message': 'Room type not found'}), 404
        
        return jsonify({
            'message': 'Room status updated successfully',
            'room': room
        }), 200
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to update room status', 'error': str(e)}), 500

@rooms_bp.route('/<room_id>', methods=['DELETE'])
@jwt_required()
@require_permission('rooms')
def delete_room(room_id):
    """Delete room type"""
    try:
        room_model = get_room_model()
        success = room_model.delete_by_id(room_id)
        
        if not success:
            return jsonify({'message': 'Room type not found'}), 404
        
        return jsonify({'message': 'Room type deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to delete room type', 'error': str(e)}), 500

@rooms_bp.route('/stats', methods=['GET'])
@jwt_required()
@require_permission('rooms')
def get_room_stats():
    """Get room statistics"""
    try:
        room_model = get_room_model()
        stats = room_model.get_room_statistics()
        
        return jsonify({'stats': stats}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get room stats', 'error': str(e)}), 500

@rooms_bp.route('/availability', methods=['GET'])
def check_room_availability():
    """Check room availability for specific dates"""
    try:
        from datetime import datetime
        
        check_in_str = request.args.get('check_in')
        check_out_str = request.args.get('check_out')
        
        if not check_in_str or not check_out_str:
            return jsonify({'message': 'Check-in and check-out dates are required'}), 400
        
        try:
            check_in = datetime.fromisoformat(check_in_str.replace('Z', '+00:00'))
            check_out = datetime.fromisoformat(check_out_str.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'message': 'Invalid date format. Use ISO format.'}), 400
        
        room_model = get_room_model()
        available_rooms = room_model.get_available_rooms(check_in, check_out)
        
        return jsonify({
            'available_rooms': available_rooms,
            'check_in': check_in.isoformat(),
            'check_out': check_out.isoformat(),
            'nights': (check_out - check_in).days
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to check availability', 'error': str(e)}), 500

@rooms_bp.route('/search', methods=['GET'])
def search_rooms():
    """Search rooms by criteria"""
    try:
        room_model = get_room_model()
        
        # Get search parameters
        max_price = request.args.get('max_price', type=int)
        min_price = request.args.get('min_price', type=int)
        max_occupancy = request.args.get('max_occupancy', type=int)
        amenities = request.args.getlist('amenities')
        
        # Build query
        query = {'status': 'active'}
        
        if max_price:
            query['price_per_night'] = query.get('price_per_night', {})
            query['price_per_night']['$lte'] = max_price
        
        if min_price:
            query['price_per_night'] = query.get('price_per_night', {})
            query['price_per_night']['$gte'] = min_price
        
        if max_occupancy:
            query['max_occupancy'] = {'$gte': max_occupancy}
        
        if amenities:
            query['amenities'] = {'$all': amenities}
        
        rooms = room_model.find_many(query, sort=[('price_per_night', 1)])
        
        return jsonify({
            'rooms': rooms,
            'total': len(rooms),
            'filters': {
                'max_price': max_price,
                'min_price': min_price,
                'max_occupancy': max_occupancy,
                'amenities': amenities
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to search rooms', 'error': str(e)}), 500

