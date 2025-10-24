from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from .base import BaseModel, validate_required_fields, validate_email, validate_phone, ValidationError

class BookingModel(BaseModel):
    """Booking model for room reservations"""
    
    def __init__(self, db):
        super().__init__(db, 'bookings')
    
    def create_booking(self, booking_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new booking with validation"""
        # Validate required fields
        required_fields = [
            'guest_name', 'guest_email', 'guest_phone', 'room_type',
            'check_in_date', 'check_out_date', 'guests_count'
        ]
        validate_required_fields(booking_data, required_fields)
        
        # Validate email and phone
        if not validate_email(booking_data['guest_email']):
            raise ValidationError("Invalid email format")
        
        if not validate_phone(booking_data['guest_phone']):
            raise ValidationError("Invalid phone number format")
        
        # Validate dates
        check_in = datetime.fromisoformat(booking_data['check_in_date'].replace('Z', '+00:00'))
        check_out = datetime.fromisoformat(booking_data['check_out_date'].replace('Z', '+00:00'))
        
        if check_in >= check_out:
            raise ValidationError("Check-out date must be after check-in date")
        
        if check_in < datetime.utcnow().replace(tzinfo=None):
            raise ValidationError("Check-in date cannot be in the past")
        
        # Calculate nights and total amount
        nights = (check_out - check_in).days
        room_rates = {
            'Deluxe Garden View': 2500,
            'Heritage Suite': 1500
        }
        
        rate_per_night = room_rates.get(booking_data['room_type'], 1500)
        total_amount = rate_per_night * nights
        
        # Generate booking ID
        booking_count = self.count() + 1
        booking_id = f"BK{booking_count:03d}"
        
        # Prepare booking document
        booking_doc = {
            'booking_id': booking_id,
            'guest_name': booking_data['guest_name'],
            'guest_email': booking_data['guest_email'],
            'guest_phone': booking_data['guest_phone'],
            'room_type': booking_data['room_type'],
            'check_in_date': check_in,
            'check_out_date': check_out,
            'guests_count': int(booking_data['guests_count']),
            'nights': nights,
            'rate_per_night': rate_per_night,
            'total_amount': total_amount,
            'status': 'pending',
            'payment_status': 'pending',
            'special_requests': booking_data.get('special_requests', ''),
            'booking_source': booking_data.get('booking_source', 'website')
        }
        
        return self.create(booking_doc)
    
    def get_bookings_by_status(self, status: str) -> List[Dict[str, Any]]:
        """Get bookings by status"""
        return self.find_many({'status': status}, sort=[('created_at', -1)])
    
    def get_bookings_by_date_range(self, start_date: datetime, end_date: datetime) -> List[Dict[str, Any]]:
        """Get bookings within date range"""
        query = {
            'check_in_date': {
                '$gte': start_date,
                '$lte': end_date
            }
        }
        return self.find_many(query, sort=[('check_in_date', 1)])
    
    def update_booking_status(self, booking_id: str, status: str) -> Optional[Dict[str, Any]]:
        """Update booking status"""
        valid_statuses = ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled']
        if status not in valid_statuses:
            raise ValidationError(f"Invalid status. Must be one of: {', '.join(valid_statuses)}")
        
        return self.update_by_id(booking_id, {'status': status})
    
    def update_payment_status(self, booking_id: str, payment_status: str, payment_reference: str = None) -> Optional[Dict[str, Any]]:
        """Update payment status"""
        valid_statuses = ['pending', 'partial', 'paid', 'refunded']
        if payment_status not in valid_statuses:
            raise ValidationError(f"Invalid payment status. Must be one of: {', '.join(valid_statuses)}")
        
        update_data = {'payment_status': payment_status}
        if payment_reference:
            update_data['payment_reference'] = payment_reference
        
        return self.update_by_id(booking_id, update_data)
    
    def get_booking_by_booking_id(self, booking_id: str) -> Optional[Dict[str, Any]]:
        """Get booking by booking ID"""
        return self.find_one({'booking_id': booking_id})
    
    def get_guest_bookings(self, guest_email: str) -> List[Dict[str, Any]]:
        """Get all bookings for a guest"""
        return self.find_many({'guest_email': guest_email}, sort=[('created_at', -1)])
    
    def get_occupancy_stats(self, start_date: datetime, end_date: datetime) -> Dict[str, Any]:
        """Get occupancy statistics for date range"""
        if self.collection is None:
            return {'total_bookings': 0, 'total_nights': 0, 'total_revenue': 0}
        
        pipeline = [
            {
                '$match': {
                    'check_in_date': {'$gte': start_date, '$lte': end_date},
                    'status': {'$in': ['confirmed', 'checked-in', 'checked-out']}
                }
            },
            {
                '$group': {
                    '_id': None,
                    'total_bookings': {'$sum': 1},
                    'total_nights': {'$sum': '$nights'},
                    'total_revenue': {'$sum': '$total_amount'},
                    'avg_booking_value': {'$avg': '$total_amount'}
                }
            }
        ]
        
        result = list(self.collection.aggregate(pipeline))
        if result:
            stats = result[0]
            del stats['_id']
            return stats
        
        return {'total_bookings': 0, 'total_nights': 0, 'total_revenue': 0, 'avg_booking_value': 0}

