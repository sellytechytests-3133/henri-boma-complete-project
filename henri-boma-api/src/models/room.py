from datetime import datetime
from typing import Dict, Any, List, Optional
from .base import BaseModel, validate_required_fields, ValidationError

class RoomModel(BaseModel):
    """Room model for managing room types and availability"""
    
    def __init__(self, db):
        super().__init__(db, 'rooms')
        self._initialize_default_rooms()
    
    def _initialize_default_rooms(self):
        """Initialize default room types if collection is empty"""
        if self.collection is not None is None or self.count() > 0:
            return
        
        default_rooms = [
            {
                'name': 'Deluxe Garden View',
                'description': 'Spacious room with beautiful garden views and modern amenities',
                'price_per_night': 2500,
                'max_occupancy': 2,
                'total_rooms': 8,
                'amenities': [
                    'King Size Bed',
                    'Garden View',
                    'Free WiFi',
                    'Private Bathroom',
                    'Room Service'
                ],
                'images': [
                    'https://media.thehenriboma.com/accomodation.jpg?w=800',
                    'https://media.thehenriboma.com/accomodation.jpg?w=800'
                ],
                'status': 'active',
                'room_size': '35 sqm',
                'bed_type': 'King Size',
                'view_type': 'Garden'
            },
            {
                'name': 'Heritage Suite',
                'description': 'Luxurious suite with cultural elements and premium amenities',
                'price_per_night': 1500,
                'max_occupancy': 3,
                'total_rooms': 6,
                'amenities': [
                    'Cultural huts',
                    'Cultural Decor',
                    'Premium Amenities',
                    'Room Service',
                ],
                'images': [
                    'https://media.thehenriboma.com/huts1.jpg?w=800',
                    'https://media.thehenriboma.com/huts1.jpg?w=800'
                ],
                'status': 'active',
                'room_size': '55 sqm',
                'bed_type': 'King Size + Sofa Bed',
                'view_type': 'Heritage Garden'
            }
        ]
        
        for room in default_rooms:
            self.create(room)
    
    def create_room_type(self, room_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new room type"""
        required_fields = ['name', 'description', 'price_per_night', 'max_occupancy', 'total_rooms']
        validate_required_fields(room_data, required_fields)
        
        # Check if room type already exists
        existing_room = self.find_one({'name': room_data['name']})
        if existing_room:
            raise ValidationError(f"Room type '{room_data['name']}' already exists")
        
        # Validate numeric fields
        if room_data['price_per_night'] <= 0:
            raise ValidationError("Price per night must be greater than 0")
        
        if room_data['max_occupancy'] <= 0:
            raise ValidationError("Max occupancy must be greater than 0")
        
        if room_data['total_rooms'] <= 0:
            raise ValidationError("Total rooms must be greater than 0")
        
        # Set defaults
        room_data.setdefault('amenities', [])
        room_data.setdefault('images', [])
        room_data.setdefault('status', 'active')
        
        return self.create(room_data)
    
    def get_available_rooms(self, check_in_date: datetime, check_out_date: datetime) -> List[Dict[str, Any]]:
        """Get available room types for given dates"""
        # This is a simplified version - in production, you'd check actual bookings
        rooms = self.find_many({'status': 'active'})
        
        # For each room type, calculate availability
        # This would typically involve checking against actual bookings
        for room in rooms:
            # Simplified: assume some rooms are always available
            room['available_rooms'] = max(1, room['total_rooms'] - 2)
            room['is_available'] = room['available_rooms'] > 0
        
        return rooms
    
    def update_room_type(self, room_id: str, room_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update room type"""
        # Remove fields that shouldn't be updated directly
        room_data.pop('id', None)
        room_data.pop('_id', None)
        
        return self.update_by_id(room_id, room_data)
    
    def get_room_by_name(self, name: str) -> Optional[Dict[str, Any]]:
        """Get room type by name"""
        return self.find_one({'name': name})
    
    def get_active_rooms(self) -> List[Dict[str, Any]]:
        """Get all active room types"""
        return self.find_many({'status': 'active'}, sort=[('price_per_night', 1)])
    
    def update_room_status(self, room_id: str, status: str) -> Optional[Dict[str, Any]]:
        """Update room status"""
        valid_statuses = ['active', 'inactive', 'maintenance']
        if status not in valid_statuses:
            raise ValidationError(f"Invalid status. Must be one of: {', '.join(valid_statuses)}")
        
        return self.update_by_id(room_id, {'status': status})
    
    def get_room_statistics(self) -> Dict[str, Any]:
        """Get room statistics"""
        if self.collection is None:
            return {
                'total_room_types': 0,
                'total_rooms': 0,
                'active_room_types': 0,
                'avg_price': 0
            }
        
        pipeline = [
            {
                '$group': {
                    '_id': None,
                    'total_room_types': {'$sum': 1},
                    'total_rooms': {'$sum': '$total_rooms'},
                    'active_room_types': {
                        '$sum': {'$cond': [{'$eq': ['$status', 'active']}, 1, 0]}
                    },
                    'avg_price': {'$avg': '$price_per_night'},
                    'min_price': {'$min': '$price_per_night'},
                    'max_price': {'$max': '$price_per_night'}
                }
            }
        ]
        
        result = list(self.collection.aggregate(pipeline))
        if result:
            stats = result[0]
            del stats['_id']
            return stats
        
        return {
            'total_room_types': 0,
            'total_rooms': 0,
            'active_room_types': 0,
            'avg_price': 0,
            'min_price': 0,
            'max_price': 0
        }

