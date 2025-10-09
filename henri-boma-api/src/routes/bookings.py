from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime, timedelta
from src.models.booking import BookingModel, ValidationError

bookings_bp = Blueprint('bookings', __name__)

def get_booking_model():
    """Get BookingModel instance"""
    db = current_app.config.get('DB')
    return BookingModel(db)

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

@bookings_bp.route('/', methods=['POST'])
def create_booking():
    """Create a new booking (public endpoint)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Request data is required'}), 400
        
        booking_model = get_booking_model()
        booking = booking_model.create_booking(data)
        
        return jsonify({
            'message': 'Booking created successfully',
            'booking': booking
        }), 201
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to create booking', 'error': str(e)}), 500

@bookings_bp.route('/', methods=['GET'])
@jwt_required()
@require_permission('bookings')
def get_bookings():
    """Get all bookings (admin endpoint)"""
    try:
        booking_model = get_booking_model()
        
        # Get query parameters
        status = request.args.get('status')
        limit = request.args.get('limit', type=int)
        skip = request.args.get('skip', 0, type=int)
        
        if status:
            bookings = booking_model.get_bookings_by_status(status)
        else:
            bookings = booking_model.find_many(
                query={},
                limit=limit,
                skip=skip,
                sort=[('created_at', -1)]
            )
        
        return jsonify({
            'bookings': bookings,
            'total': len(bookings)
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get bookings', 'error': str(e)}), 500

@bookings_bp.route('/<booking_id>', methods=['GET'])
@jwt_required()
@require_permission('bookings')
def get_booking(booking_id):
    """Get booking by ID"""
    try:
        booking_model = get_booking_model()
        booking = booking_model.find_by_id(booking_id)
        
        if not booking:
            return jsonify({'message': 'Booking not found'}), 404
        
        return jsonify({'booking': booking}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get booking', 'error': str(e)}), 500

@bookings_bp.route('/booking-id/<booking_id>', methods=['GET'])
def get_booking_by_booking_id(booking_id):
    """Get booking by booking ID (public endpoint for guests)"""
    try:
        booking_model = get_booking_model()
        booking = booking_model.get_booking_by_booking_id(booking_id)
        
        if not booking:
            return jsonify({'message': 'Booking not found'}), 404
        
        # Return limited information for public access
        public_booking = {
            'booking_id': booking['booking_id'],
            'guest_name': booking['guest_name'],
            'room_type': booking['room_type'],
            'check_in_date': booking['check_in_date'],
            'check_out_date': booking['check_out_date'],
            'guests_count': booking['guests_count'],
            'status': booking['status'],
            'total_amount': booking['total_amount']
        }
        
        return jsonify({'booking': public_booking}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get booking', 'error': str(e)}), 500

@bookings_bp.route('/<booking_id>', methods=['PUT'])
@jwt_required()
@require_permission('bookings')
def update_booking(booking_id):
    """Update booking"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Request data is required'}), 400
        
        booking_model = get_booking_model()
        booking = booking_model.update_by_id(booking_id, data)
        
        if not booking:
            return jsonify({'message': 'Booking not found'}), 404
        
        return jsonify({
            'message': 'Booking updated successfully',
            'booking': booking
        }), 200
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to update booking', 'error': str(e)}), 500

@bookings_bp.route('/<booking_id>/status', methods=['PUT'])
@jwt_required()
@require_permission('bookings')
def update_booking_status(booking_id):
    """Update booking status"""
    try:
        data = request.get_json()
        
        if not data or 'status' not in data:
            return jsonify({'message': 'Status is required'}), 400
        
        booking_model = get_booking_model()
        booking = booking_model.update_booking_status(booking_id, data['status'])
        
        if not booking:
            return jsonify({'message': 'Booking not found'}), 404
        
        return jsonify({
            'message': 'Booking status updated successfully',
            'booking': booking
        }), 200
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to update booking status', 'error': str(e)}), 500

@bookings_bp.route('/<booking_id>/payment', methods=['PUT'])
@jwt_required()
@require_permission('bookings')
def update_payment_status(booking_id):
    """Update payment status"""
    try:
        data = request.get_json()
        
        if not data or 'payment_status' not in data:
            return jsonify({'message': 'Payment status is required'}), 400
        
        booking_model = get_booking_model()
        booking = booking_model.update_payment_status(
            booking_id,
            data['payment_status'],
            data.get('payment_reference')
        )
        
        if not booking:
            return jsonify({'message': 'Booking not found'}), 404
        
        return jsonify({
            'message': 'Payment status updated successfully',
            'booking': booking
        }), 200
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to update payment status', 'error': str(e)}), 500

@bookings_bp.route('/<booking_id>', methods=['DELETE'])
@jwt_required()
@require_permission('bookings')
def delete_booking(booking_id):
    """Delete booking"""
    try:
        booking_model = get_booking_model()
        success = booking_model.delete_by_id(booking_id)
        
        if not success:
            return jsonify({'message': 'Booking not found'}), 404
        
        return jsonify({'message': 'Booking deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to delete booking', 'error': str(e)}), 500

@bookings_bp.route('/guest/<guest_email>', methods=['GET'])
def get_guest_bookings(guest_email):
    """Get bookings for a specific guest (public endpoint)"""
    try:
        booking_model = get_booking_model()
        bookings = booking_model.get_guest_bookings(guest_email)
        
        # Return limited information for public access
        public_bookings = []
        for booking in bookings:
            public_bookings.append({
                'booking_id': booking['booking_id'],
                'room_type': booking['room_type'],
                'check_in_date': booking['check_in_date'],
                'check_out_date': booking['check_out_date'],
                'guests_count': booking['guests_count'],
                'status': booking['status'],
                'total_amount': booking['total_amount'],
                'created_at': booking['created_at']
            })
        
        return jsonify({
            'bookings': public_bookings,
            'total': len(public_bookings)
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get guest bookings', 'error': str(e)}), 500

@bookings_bp.route('/stats', methods=['GET'])
@jwt_required()
@require_permission('bookings')
def get_booking_stats():
    """Get booking statistics"""
    try:
        booking_model = get_booking_model()
        
        # Get date range from query parameters
        start_date_str = request.args.get('start_date')
        end_date_str = request.args.get('end_date')
        
        if start_date_str and end_date_str:
            start_date = datetime.fromisoformat(start_date_str.replace('Z', '+00:00'))
            end_date = datetime.fromisoformat(end_date_str.replace('Z', '+00:00'))
        else:
            # Default to last 30 days
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=30)
        
        stats = booking_model.get_occupancy_stats(start_date, end_date)
        
        # Get additional stats
        total_bookings = booking_model.count()
        pending_bookings = booking_model.count({'status': 'pending'})
        confirmed_bookings = booking_model.count({'status': 'confirmed'})
        
        stats.update({
            'total_bookings_all_time': total_bookings,
            'pending_bookings': pending_bookings,
            'confirmed_bookings': confirmed_bookings,
            'date_range': {
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat()
            }
        })
        
        return jsonify({'stats': stats}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get booking stats', 'error': str(e)}), 500

@bookings_bp.route('/availability', methods=['GET'])
def check_availability():
    """Check room availability for given dates"""
    try:
        check_in_str = request.args.get('check_in')
        check_out_str = request.args.get('check_out')
        
        if not check_in_str or not check_out_str:
            return jsonify({'message': 'Check-in and check-out dates are required'}), 400
        
        check_in = datetime.fromisoformat(check_in_str.replace('Z', '+00:00'))
        check_out = datetime.fromisoformat(check_out_str.replace('Z', '+00:00'))
        
        # Import room model here to avoid circular imports
        from src.models.room import RoomModel
        room_model = RoomModel(current_app.config.get('DB'))
        
        available_rooms = room_model.get_available_rooms(check_in, check_out)
        
        return jsonify({
            'available_rooms': available_rooms,
            'check_in': check_in.isoformat(),
            'check_out': check_out.isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to check availability', 'error': str(e)}), 500

