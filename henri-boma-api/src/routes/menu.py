from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt
from datetime import datetime, timedelta
from src.models.menu import MenuModel, OrderModel, ValidationError

menu_bp = Blueprint('menu', __name__)

def get_menu_model():
    """Get MenuModel instance"""
    db = current_app.config.get('DB')
    return MenuModel(db)

def get_order_model():
    """Get OrderModel instance"""
    db = current_app.config.get('DB')
    return OrderModel(db)

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

# Menu endpoints
@menu_bp.route('/items', methods=['GET'])
def get_menu_items():
    """Get menu items (public endpoint)"""
    try:
        menu_model = get_menu_model()
        
        category = request.args.get('category')
        search = request.args.get('search')
        
        if search:
            items = menu_model.search_menu_items(search)
        else:
            items = menu_model.get_menu_by_category(category)
        
        categories = menu_model.get_categories()
        
        return jsonify({
            'items': items,
            'categories': categories,
            'total': len(items)
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get menu items', 'error': str(e)}), 500

@menu_bp.route('/items', methods=['POST'])
@jwt_required()
@require_permission('menu')
def create_menu_item():
    """Create a new menu item"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Request data is required'}), 400
        
        menu_model = get_menu_model()
        item = menu_model.create_menu_item(data)
        
        return jsonify({
            'message': 'Menu item created successfully',
            'item': item
        }), 201
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to create menu item', 'error': str(e)}), 500

@menu_bp.route('/items/<item_id>', methods=['GET'])
def get_menu_item(item_id):
    """Get menu item by ID"""
    try:
        menu_model = get_menu_model()
        item = menu_model.find_by_id(item_id)
        
        if not item:
            return jsonify({'message': 'Menu item not found'}), 404
        
        return jsonify({'item': item}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get menu item', 'error': str(e)}), 500

@menu_bp.route('/items/<item_id>', methods=['PUT'])
@jwt_required()
@require_permission('menu')
def update_menu_item(item_id):
    """Update menu item"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Request data is required'}), 400
        
        menu_model = get_menu_model()
        item = menu_model.update_by_id(item_id, data)
        
        if not item:
            return jsonify({'message': 'Menu item not found'}), 404
        
        return jsonify({
            'message': 'Menu item updated successfully',
            'item': item
        }), 200
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to update menu item', 'error': str(e)}), 500

@menu_bp.route('/items/<item_id>/availability', methods=['PUT'])
@jwt_required()
@require_permission('menu')
def update_item_availability(item_id):
    """Update menu item availability"""
    try:
        data = request.get_json()
        
        if not data or 'available' not in data:
            return jsonify({'message': 'Available status is required'}), 400
        
        menu_model = get_menu_model()
        item = menu_model.update_availability(item_id, data['available'])
        
        if not item:
            return jsonify({'message': 'Menu item not found'}), 404
        
        return jsonify({
            'message': 'Item availability updated successfully',
            'item': item
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to update item availability', 'error': str(e)}), 500

@menu_bp.route('/items/<item_id>', methods=['DELETE'])
@jwt_required()
@require_permission('menu')
def delete_menu_item(item_id):
    """Delete menu item"""
    try:
        menu_model = get_menu_model()
        success = menu_model.delete_by_id(item_id)
        
        if not success:
            return jsonify({'message': 'Menu item not found'}), 404
        
        return jsonify({'message': 'Menu item deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to delete menu item', 'error': str(e)}), 500

@menu_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all menu categories"""
    try:
        menu_model = get_menu_model()
        categories = menu_model.get_categories()
        
        return jsonify({'categories': categories}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get categories', 'error': str(e)}), 500

# Order endpoints
@menu_bp.route('/orders', methods=['POST'])
def create_order():
    """Create a new food order (public endpoint)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Request data is required'}), 400
        
        order_model = get_order_model()
        order = order_model.create_order(data)
        
        return jsonify({
            'message': 'Order created successfully',
            'order': order
        }), 201
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to create order', 'error': str(e)}), 500

@menu_bp.route('/orders', methods=['GET'])
@jwt_required()
@require_permission('orders')
def get_orders():
    """Get all orders (admin endpoint)"""
    try:
        order_model = get_order_model()
        
        # Get query parameters
        status = request.args.get('status')
        limit = request.args.get('limit', type=int)
        skip = request.args.get('skip', 0, type=int)
        date_str = request.args.get('date')
        
        if date_str:
            try:
                date = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                orders = order_model.get_daily_orders(date)
            except ValueError:
                return jsonify({'message': 'Invalid date format'}), 400
        elif status:
            orders = order_model.get_orders_by_status(status)
        else:
            orders = order_model.find_many(
                query={},
                limit=limit,
                skip=skip,
                sort=[('created_at', -1)]
            )
        
        return jsonify({
            'orders': orders,
            'total': len(orders)
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get orders', 'error': str(e)}), 500

@menu_bp.route('/orders/<order_id>', methods=['GET'])
@jwt_required()
@require_permission('orders')
def get_order(order_id):
    """Get order by ID"""
    try:
        order_model = get_order_model()
        order = order_model.find_by_id(order_id)
        
        if not order:
            return jsonify({'message': 'Order not found'}), 404
        
        return jsonify({'order': order}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get order', 'error': str(e)}), 500

@menu_bp.route('/orders/order-id/<order_id>', methods=['GET'])
def get_order_by_order_id(order_id):
    """Get order by order ID (public endpoint)"""
    try:
        order_model = get_order_model()
        order = order_model.get_order_by_order_id(order_id)
        
        if not order:
            return jsonify({'message': 'Order not found'}), 404
        
        # Return limited information for public access
        public_order = {
            'order_id': order['order_id'],
            'customer_name': order['customer_name'],
            'items': order['items'],
            'total_amount': order['total_amount'],
            'status': order['status'],
            'created_at': order['created_at'],
            'estimated_delivery': order.get('estimated_delivery')
        }
        
        return jsonify({'order': public_order}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get order', 'error': str(e)}), 500

@menu_bp.route('/orders/<order_id>/status', methods=['PUT'])
@jwt_required()
@require_permission('orders')
def update_order_status(order_id):
    """Update order status"""
    try:
        data = request.get_json()
        
        if not data or 'status' not in data:
            return jsonify({'message': 'Status is required'}), 400
        
        order_model = get_order_model()
        order = order_model.update_order_status(
            order_id,
            data['status'],
            data.get('assigned_staff')
        )
        
        if not order:
            return jsonify({'message': 'Order not found'}), 404
        
        return jsonify({
            'message': 'Order status updated successfully',
            'order': order
        }), 200
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to update order status', 'error': str(e)}), 500

@menu_bp.route('/orders/<order_id>', methods=['DELETE'])
@jwt_required()
@require_permission('orders')
def delete_order(order_id):
    """Delete order"""
    try:
        order_model = get_order_model()
        success = order_model.delete_by_id(order_id)
        
        if not success:
            return jsonify({'message': 'Order not found'}), 404
        
        return jsonify({'message': 'Order deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to delete order', 'error': str(e)}), 500

@menu_bp.route('/orders/customer/<customer_phone>', methods=['GET'])
def get_customer_orders(customer_phone):
    """Get orders for a specific customer (public endpoint)"""
    try:
        order_model = get_order_model()
        orders = order_model.get_customer_orders(customer_phone)
        
        # Return limited information for public access
        public_orders = []
        for order in orders:
            public_orders.append({
                'order_id': order['order_id'],
                'items': order['items'],
                'total_amount': order['total_amount'],
                'status': order['status'],
                'created_at': order['created_at'],
                'estimated_delivery': order.get('estimated_delivery')
            })
        
        return jsonify({
            'orders': public_orders,
            'total': len(public_orders)
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get customer orders', 'error': str(e)}), 500

@menu_bp.route('/orders/stats', methods=['GET'])
@jwt_required()
@require_permission('orders')
def get_order_stats():
    """Get order statistics"""
    try:
        order_model = get_order_model()
        
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
        
        stats = order_model.get_order_statistics(start_date, end_date)
        
        # Get additional stats
        total_orders = order_model.count()
        pending_orders = order_model.count({'status': 'received'})
        preparing_orders = order_model.count({'status': 'preparing'})
        
        stats.update({
            'total_orders_all_time': total_orders,
            'pending_orders': pending_orders,
            'preparing_orders': preparing_orders,
            'date_range': {
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat()
            }
        })
        
        return jsonify({'stats': stats}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get order stats', 'error': str(e)}), 500

