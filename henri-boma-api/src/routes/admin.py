from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from datetime import datetime, timedelta
from src.models.auth_user import AuthUserModel, ValidationError

admin_bp = Blueprint('admin', __name__)

def get_auth_user_model():
    """Get AuthUserModel instance"""
    db = current_app.config.get('DB')
    return AuthUserModel(db)

def require_admin():
    """Decorator to check admin permissions"""
    def decorator(f):
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            role = claims.get('role')
            permissions = claims.get('permissions', [])
            
            if role not in ['super_admin', 'admin'] and 'all' not in permissions:
                return jsonify({'message': 'Admin access required'}), 403
            return f(*args, **kwargs)
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator

def require_super_admin():
    """Decorator to check super admin permissions"""
    def decorator(f):
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            role = claims.get('role')
            permissions = claims.get('permissions', [])
            
            if role != 'super_admin' and 'all' not in permissions:
                return jsonify({'message': 'Super admin access required'}), 403
            return f(*args, **kwargs)
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator

# User Management endpoints
@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@require_admin()
def get_users():
    """Get all users"""
    try:
        auth_user_model = get_auth_user_model()
        
        role = request.args.get('role')
        status = request.args.get('status')
        limit = request.args.get('limit', type=int)
        skip = request.args.get('skip', 0, type=int)
        
        # Build query
        query = {}
        if role:
            query['role'] = role
        if status:
            query['status'] = status
        
        users = auth_user_model.find_many(
            query=query,
            limit=limit,
            skip=skip,
            sort=[('created_at', -1)]
        )
        
        # Remove passwords from response
        for user in users:
            user.pop('password', None)
        
        return jsonify({
            'users': users,
            'total': len(users)
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get users', 'error': str(e)}), 500

@admin_bp.route('/users', methods=['POST'])
@jwt_required()
@require_admin()
def create_user():
    """Create a new user"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Request data is required'}), 400
        
        auth_user_model = get_auth_user_model()
        user = auth_user_model.create_user(data)
        
        return jsonify({
            'message': 'User created successfully',
            'user': user
        }), 201
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to create user', 'error': str(e)}), 500

@admin_bp.route('/users/<user_id>', methods=['GET'])
@jwt_required()
@require_admin()
def get_user(user_id):
    """Get user by ID"""
    try:
        auth_user_model = get_auth_user_model()
        user = auth_user_model.find_by_id(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        user.pop('password', None)
        return jsonify({'user': user}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get user', 'error': str(e)}), 500

@admin_bp.route('/users/<user_id>', methods=['PUT'])
@jwt_required()
@require_admin()
def update_user(user_id):
    """Update user"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Request data is required'}), 400
        
        # Check if trying to update super admin (only super admin can do this)
        auth_user_model = get_auth_user_model()
        target_user = auth_user_model.find_by_id(user_id)
        
        if not target_user:
            return jsonify({'message': 'User not found'}), 404
        
        claims = get_jwt()
        current_role = claims.get('role')
        
        if target_user['role'] == 'super_admin' and current_role != 'super_admin':
            return jsonify({'message': 'Only super admin can update super admin users'}), 403
        
        # Prevent role escalation
        if 'role' in data and current_role != 'super_admin':
            if data['role'] in ['super_admin', 'admin'] and target_user['role'] not in ['super_admin', 'admin']:
                return jsonify({'message': 'Cannot escalate user to admin role'}), 403
        
        user = auth_user_model.update_by_id(user_id, data)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({
            'message': 'User updated successfully',
            'user': user
        }), 200
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to update user', 'error': str(e)}), 500

@admin_bp.route('/users/<user_id>/status', methods=['PUT'])
@jwt_required()
@require_admin()
def update_user_status(user_id):
    """Update user status"""
    try:
        data = request.get_json()
        
        if not data or 'status' not in data:
            return jsonify({'message': 'Status is required'}), 400
        
        # Check if trying to update super admin
        auth_user_model = get_auth_user_model()
        target_user = auth_user_model.find_by_id(user_id)
        
        if not target_user:
            return jsonify({'message': 'User not found'}), 404
        
        claims = get_jwt()
        current_role = claims.get('role')
        current_user_id = get_jwt_identity()
        
        if target_user['role'] == 'super_admin' and current_role != 'super_admin':
            return jsonify({'message': 'Only super admin can update super admin status'}), 403
        
        # Prevent self-deactivation
        if user_id == current_user_id and data['status'] != 'active':
            return jsonify({'message': 'Cannot deactivate your own account'}), 400
        
        user = auth_user_model.update_user_status(user_id, data['status'])
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({
            'message': 'User status updated successfully',
            'user': user
        }), 200
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to update user status', 'error': str(e)}), 500

@admin_bp.route('/users/<user_id>/reset-password', methods=['POST'])
@jwt_required()
@require_admin()
def reset_user_password(user_id):
    """Reset user password"""
    try:
        data = request.get_json()
        
        if not data or 'new_password' not in data:
            return jsonify({'message': 'New password is required'}), 400
        
        # Check if trying to reset super admin password
        auth_user_model = get_auth_user_model()
        target_user = auth_user_model.find_by_id(user_id)
        
        if not target_user:
            return jsonify({'message': 'User not found'}), 404
        
        claims = get_jwt()
        current_role = claims.get('role')
        
        if target_user['role'] == 'super_admin' and current_role != 'super_admin':
            return jsonify({'message': 'Only super admin can reset super admin password'}), 403
        
        success = auth_user_model.reset_password(user_id, data['new_password'])
        
        if not success:
            return jsonify({'message': 'Failed to reset password'}), 400
        
        return jsonify({'message': 'Password reset successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to reset password', 'error': str(e)}), 500

@admin_bp.route('/users/<user_id>', methods=['DELETE'])
@jwt_required()
@require_super_admin()
def delete_user(user_id):
    """Delete user (super admin only)"""
    try:
        current_user_id = get_jwt_identity()
        
        # Prevent self-deletion
        if user_id == current_user_id:
            return jsonify({'message': 'Cannot delete your own account'}), 400
        
        auth_user_model = get_auth_user_model()
        success = auth_user_model.delete_by_id(user_id)
        
        if not success:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({'message': 'User deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to delete user', 'error': str(e)}), 500

# Dashboard Statistics endpoints
@admin_bp.route('/dashboard/stats', methods=['GET'])
@jwt_required()
@require_admin()
def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        db = current_app.config.get('DB')
        
        if not db:
            return jsonify({
                'stats': {
                    'total_bookings': 0,
                    'total_orders': 0,
                    'total_revenue': 0,
                    'total_users': 0,
                    'recent_bookings': 0,
                    'recent_orders': 0,
                    'pending_payments': 0
                }
            }), 200
        
        # Get date range for recent stats (last 7 days)
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=7)
        
        stats = {}
        
        # Bookings stats
        try:
            bookings_collection = db['bookings']
            stats['total_bookings'] = bookings_collection.count_documents({})
            stats['recent_bookings'] = bookings_collection.count_documents({
                'created_at': {'$gte': start_date}
            })
            
            # Revenue from bookings
            booking_revenue = list(bookings_collection.aggregate([
                {'$match': {'payment_status': 'paid'}},
                {'$group': {'_id': None, 'total': {'$sum': '$total_amount'}}}
            ]))
            booking_revenue_total = booking_revenue[0]['total'] if booking_revenue else 0
            
        except:
            stats['total_bookings'] = 0
            stats['recent_bookings'] = 0
            booking_revenue_total = 0
        
        # Orders stats
        try:
            orders_collection = db['orders']
            stats['total_orders'] = orders_collection.count_documents({})
            stats['recent_orders'] = orders_collection.count_documents({
                'created_at': {'$gte': start_date}
            })
            
            # Revenue from orders
            order_revenue = list(orders_collection.aggregate([
                {'$match': {'status': {'$ne': 'cancelled'}}},
                {'$group': {'_id': None, 'total': {'$sum': '$total_amount'}}}
            ]))
            order_revenue_total = order_revenue[0]['total'] if order_revenue else 0
            
        except:
            stats['total_orders'] = 0
            stats['recent_orders'] = 0
            order_revenue_total = 0
        
        # Users stats
        try:
            users_collection = db['auth_users']
            stats['total_users'] = users_collection.count_documents({})
        except:
            stats['total_users'] = 0
        
        # Payments stats
        try:
            payments_collection = db['payments']
            stats['pending_payments'] = payments_collection.count_documents({
                'status': {'$in': ['pending', 'processing']}
            })
        except:
            stats['pending_payments'] = 0
        
        # Total revenue
        stats['total_revenue'] = booking_revenue_total + order_revenue_total
        
        return jsonify({'stats': stats}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get dashboard stats', 'error': str(e)}), 500

@admin_bp.route('/dashboard/recent-activity', methods=['GET'])
@jwt_required()
@require_admin()
def get_recent_activity():
    """Get recent activity"""
    try:
        db = current_app.config.get('DB')
        
        if not db:
            return jsonify({'activities': []}), 200
        
        activities = []
        
        # Recent bookings
        try:
            bookings_collection = db['bookings']
            recent_bookings = list(bookings_collection.find({}).sort('created_at', -1).limit(5))
            
            for booking in recent_bookings:
                activities.append({
                    'type': 'booking',
                    'title': f"New booking: {booking.get('booking_id', 'N/A')}",
                    'description': f"{booking.get('guest_name', 'Guest')} booked {booking.get('room_type', 'room')}",
                    'timestamp': booking.get('created_at', datetime.utcnow()).isoformat(),
                    'status': booking.get('status', 'pending')
                })
        except:
            pass
        
        # Recent orders
        try:
            orders_collection = db['orders']
            recent_orders = list(orders_collection.find({}).sort('created_at', -1).limit(5))
            
            for order in recent_orders:
                activities.append({
                    'type': 'order',
                    'title': f"New order: {order.get('order_id', 'N/A')}",
                    'description': f"{order.get('customer_name', 'Customer')} placed food order",
                    'timestamp': order.get('created_at', datetime.utcnow()).isoformat(),
                    'status': order.get('status', 'received')
                })
        except:
            pass
        
        # Recent payments
        try:
            payments_collection = db['payments']
            recent_payments = list(payments_collection.find({}).sort('initiated_at', -1).limit(5))
            
            for payment in recent_payments:
                activities.append({
                    'type': 'payment',
                    'title': f"Payment: {payment.get('payment_id', 'N/A')}",
                    'description': f"KES {payment.get('amount', 0):,.0f} via {payment.get('payment_method', 'unknown')}",
                    'timestamp': payment.get('initiated_at', datetime.utcnow()).isoformat(),
                    'status': payment.get('status', 'pending')
                })
        except:
            pass
        
        # Sort activities by timestamp
        activities.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return jsonify({
            'activities': activities[:10]  # Return top 10 most recent
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get recent activity', 'error': str(e)}), 500

@admin_bp.route('/system/health', methods=['GET'])
@jwt_required()
@require_admin()
def system_health():
    """Get system health status"""
    try:
        db = current_app.config.get('DB')
        
        health_status = {
            'database': 'disconnected',
            'api': 'healthy',
            'timestamp': datetime.utcnow().isoformat()
        }
        
        # Check database connection
        if db is not None:
            try:
                # Try to ping the database
                db.command('ping')
                health_status['database'] = 'connected'
            except:
                health_status['database'] = 'error'
        
        # Check collections
        collections_status = {}
        if db is not None:
            try:
                collections = ['bookings', 'orders', 'auth_users', 'rooms', 'menu_items', 'payments']
                for collection_name in collections:
                    try:
                        count = db[collection_name].count_documents({})
                        collections_status[collection_name] = {
                            'status': 'healthy',
                            'document_count': count
                        }
                    except:
                        collections_status[collection_name] = {
                            'status': 'error',
                            'document_count': 0
                        }
            except:
                pass
        
        health_status['collections'] = collections_status
        
        return jsonify({'health': health_status}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get system health', 'error': str(e)}), 500

