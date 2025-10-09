from datetime import datetime
from typing import Dict, Any, List, Optional
from .base import BaseModel, validate_required_fields, validate_phone, ValidationError

class MenuModel(BaseModel):
    """Menu model for managing food items and categories"""
    
    def __init__(self, db):
        super().__init__(db, 'menu_items')
        self._initialize_default_menu()
    
    def _initialize_default_menu(self):
        """Initialize default menu items if collection is empty"""
        if self.collection is None or self.count() > 0:    
            return
        
        default_items = [
            # Appetizers
            {
                'name': 'Heritage Spring Rolls',
                'description': 'Traditional spring rolls with local vegetables and herbs',
                'price': 1200,
                'category': 'appetizers',
                'image': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
                'available': True,
                'preparation_time': 15,
                'tags': ['vegetarian', 'local', 'popular'],
                'allergens': ['gluten'],
                'spice_level': 'mild'
            },
            {
                'name': 'Cultural Sampler Platter',
                'description': 'Assorted local delicacies and traditional dips',
                'price': 1800,
                'category': 'appetizers',
                'image': 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400',
                'available': True,
                'preparation_time': 20,
                'tags': ['local', 'sharing', 'traditional'],
                'allergens': ['nuts', 'dairy'],
                'spice_level': 'medium'
            },
            {
                'name': 'Coconut Fish Cakes',
                'description': 'Fresh fish cakes with coconut and coastal spices',
                'price': 1500,
                'category': 'appetizers',
                'image': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
                'available': True,
                'preparation_time': 18,
                'tags': ['seafood', 'coastal', 'gluten-free'],
                'allergens': ['fish'],
                'spice_level': 'medium'
            },
            
            # Main Courses
            {
                'name': 'Nyama Choma Platter',
                'description': 'Grilled meat with traditional sides and ugali',
                'price': 2500,
                'category': 'mains',
                'image': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400',
                'available': True,
                'preparation_time': 35,
                'tags': ['meat', 'local', 'grilled', 'signature'],
                'allergens': [],
                'spice_level': 'medium'
            },
            {
                'name': 'Tilapia Fish Curry',
                'description': 'Fresh tilapia in rich coconut curry sauce with rice',
                'price': 2200,
                'category': 'mains',
                'image': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
                'available': True,
                'preparation_time': 30,
                'tags': ['fish', 'curry', 'local', 'coconut'],
                'allergens': ['fish'],
                'spice_level': 'hot'
            },
            {
                'name': 'Vegetarian Pilau',
                'description': 'Aromatic spiced rice with vegetables and nuts',
                'price': 1800,
                'category': 'mains',
                'image': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400',
                'available': True,
                'preparation_time': 25,
                'tags': ['vegetarian', 'rice', 'spiced', 'nuts'],
                'allergens': ['nuts'],
                'spice_level': 'medium'
            },
            {
                'name': 'Grilled Chicken Mishkaki',
                'description': 'Marinated chicken skewers with traditional spices',
                'price': 2000,
                'category': 'mains',
                'image': 'https://images.unsplash.com/photo-1532636875304-0c89119d9b4d?w=400',
                'available': True,
                'preparation_time': 28,
                'tags': ['chicken', 'grilled', 'spiced', 'popular'],
                'allergens': [],
                'spice_level': 'medium'
            },
            
            # Beverages
            {
                'name': 'Fresh Passion Juice',
                'description': 'Freshly squeezed passion fruit juice',
                'price': 500,
                'category': 'beverages',
                'image': 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400',
                'available': True,
                'preparation_time': 5,
                'tags': ['fresh', 'fruit', 'healthy', 'local'],
                'allergens': [],
                'spice_level': 'none'
            },
            {
                'name': 'Kenyan Coffee',
                'description': 'Premium Kenyan coffee beans, freshly brewed',
                'price': 400,
                'category': 'beverages',
                'image': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
                'available': True,
                'preparation_time': 8,
                'tags': ['coffee', 'local', 'premium', 'hot'],
                'allergens': [],
                'spice_level': 'none'
            },
            {
                'name': 'Dawa Tea',
                'description': 'Traditional herbal tea with honey, ginger, and lemon',
                'price': 350,
                'category': 'beverages',
                'image': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
                'available': True,
                'preparation_time': 10,
                'tags': ['tea', 'herbal', 'traditional', 'healthy'],
                'allergens': [],
                'spice_level': 'mild'
            },
            
            # Desserts
            {
                'name': 'Coconut Mandazi',
                'description': 'Traditional fried doughnuts with coconut and cardamom',
                'price': 800,
                'category': 'desserts',
                'image': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
                'available': True,
                'preparation_time': 20,
                'tags': ['traditional', 'sweet', 'coconut', 'fried'],
                'allergens': ['gluten', 'dairy'],
                'spice_level': 'none'
            },
            {
                'name': 'Tropical Fruit Salad',
                'description': 'Fresh seasonal fruits with honey and mint',
                'price': 900,
                'category': 'desserts',
                'image': 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400',
                'available': True,
                'preparation_time': 10,
                'tags': ['fresh', 'healthy', 'fruit', 'light'],
                'allergens': [],
                'spice_level': 'none'
            }
        ]
        
        for item in default_items:
            self.create(item)
    
    def create_menu_item(self, item_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new menu item"""
        required_fields = ['name', 'description', 'price', 'category']
        validate_required_fields(item_data, required_fields)
        
        # Check if item already exists
        existing_item = self.find_one({'name': item_data['name']})
        if existing_item:
            raise ValidationError(f"Menu item '{item_data['name']}' already exists")
        
        # Validate price
        if item_data['price'] <= 0:
            raise ValidationError("Price must be greater than 0")
        
        # Set defaults
        item_data.setdefault('available', True)
        item_data.setdefault('preparation_time', 15)
        item_data.setdefault('tags', [])
        item_data.setdefault('allergens', [])
        item_data.setdefault('spice_level', 'none')
        
        return self.create(item_data)
    
    def get_menu_by_category(self, category: str = None) -> List[Dict[str, Any]]:
        """Get menu items by category"""
        query = {'available': True}
        if category:
            query['category'] = category
        
        return self.find_many(query, sort=[('category', 1), ('name', 1)])
    
    def get_categories(self) -> List[str]:
        """Get all menu categories"""
        if self.collection is None:
            return []
        
        categories = self.collection.distinct('category', {'available': True})
        return sorted(categories)
    
    def update_availability(self, item_id: str, available: bool) -> Optional[Dict[str, Any]]:
        """Update item availability"""
        return self.update_by_id(item_id, {'available': available})
    
    def search_menu_items(self, search_term: str) -> List[Dict[str, Any]]:
        """Search menu items by name or description"""
        if self.collection is None:
            return []
        
        query = {
            'available': True,
            '$or': [
                {'name': {'$regex': search_term, '$options': 'i'}},
                {'description': {'$regex': search_term, '$options': 'i'}},
                {'tags': {'$in': [search_term.lower()]}}
            ]
        }
        
        return self.find_many(query, sort=[('name', 1)])

class OrderModel(BaseModel):
    """Order model for managing food orders"""
    
    def __init__(self, db):
        super().__init__(db, 'orders')
    
    def create_order(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new food order"""
        required_fields = ['customer_name', 'customer_phone', 'items', 'delivery_location']
        validate_required_fields(order_data, required_fields)
        
        # Validate phone
        if not validate_phone(order_data['customer_phone']):
            raise ValidationError("Invalid phone number format")
        
        # Validate items
        if not order_data['items'] or len(order_data['items']) == 0:
            raise ValidationError("Order must contain at least one item")
        
        # Calculate total
        total_amount = 0
        for item in order_data['items']:
            if 'price' not in item or 'quantity' not in item:
                raise ValidationError("Each item must have price and quantity")
            total_amount += item['price'] * item['quantity']
        
        # Generate order ID
        order_count = self.count() + 1
        order_id = f"ORD{order_count:03d}"
        
        # Prepare order document
        order_doc = {
            'order_id': order_id,
            'customer_name': order_data['customer_name'],
            'customer_phone': order_data['customer_phone'],
            'customer_email': order_data.get('customer_email'),
            'items': order_data['items'],
            'total_amount': total_amount,
            'delivery_location': order_data['delivery_location'],
            'special_instructions': order_data.get('special_instructions', ''),
            'status': 'received',
            'payment_status': 'pending',
            'estimated_delivery': order_data.get('estimated_delivery'),
            'assigned_staff': None
        }
        
        return self.create(order_doc)
    
    def update_order_status(self, order_id: str, status: str, assigned_staff: str = None) -> Optional[Dict[str, Any]]:
        """Update order status"""
        valid_statuses = ['received', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled']
        if status not in valid_statuses:
            raise ValidationError(f"Invalid status. Must be one of: {', '.join(valid_statuses)}")
        
        update_data = {'status': status}
        if assigned_staff:
            update_data['assigned_staff'] = assigned_staff
        
        return self.update_by_id(order_id, update_data)
    
    def get_orders_by_status(self, status: str) -> List[Dict[str, Any]]:
        """Get orders by status"""
        return self.find_many({'status': status}, sort=[('created_at', -1)])
    
    def get_order_by_order_id(self, order_id: str) -> Optional[Dict[str, Any]]:
        """Get order by order ID"""
        return self.find_one({'order_id': order_id})
    
    def get_customer_orders(self, customer_phone: str) -> List[Dict[str, Any]]:
        """Get all orders for a customer"""
        return self.find_many({'customer_phone': customer_phone}, sort=[('created_at', -1)])
    
    def get_daily_orders(self, date: datetime) -> List[Dict[str, Any]]:
        """Get orders for a specific date"""
        start_of_day = date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = date.replace(hour=23, minute=59, second=59, microsecond=999999)
        
        query = {
            'created_at': {
                '$gte': start_of_day,
                '$lte': end_of_day
            }
        }
        
        return self.find_many(query, sort=[('created_at', -1)])
    
    def get_order_statistics(self, start_date: datetime, end_date: datetime) -> Dict[str, Any]:
        """Get order statistics for date range"""
        if self.collection is None:
            return {
                'total_orders': 0,
                'total_revenue': 0,
                'avg_order_value': 0,
                'orders_by_status': {}
            }
        
        pipeline = [
            {
                '$match': {
                    'created_at': {'$gte': start_date, '$lte': end_date}
                }
            },
            {
                '$group': {
                    '_id': None,
                    'total_orders': {'$sum': 1},
                    'total_revenue': {'$sum': '$total_amount'},
                    'avg_order_value': {'$avg': '$total_amount'}
                }
            }
        ]
        
        result = list(self.collection.aggregate(pipeline))
        stats = result[0] if result else {
            'total_orders': 0,
            'total_revenue': 0,
            'avg_order_value': 0
        }
        
        if '_id' in stats:
            del stats['_id']
        
        # Get orders by status
        status_pipeline = [
            {
                '$match': {
                    'created_at': {'$gte': start_date, '$lte': end_date}
                }
            },
            {
                '$group': {
                    '_id': '$status',
                    'count': {'$sum': 1}
                }
            }
        ]
        
        status_result = list(self.collection.aggregate(status_pipeline))
        orders_by_status = {item['_id']: item['count'] for item in status_result}
        stats['orders_by_status'] = orders_by_status
        
        return stats

