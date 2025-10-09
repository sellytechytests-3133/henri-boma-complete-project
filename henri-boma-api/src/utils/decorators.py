from functools import wraps
from flask import jsonify, request, current_app
from flask_jwt_extended import get_jwt, get_jwt_identity
import logging
from datetime import datetime

def require_permission(permission):
    """Decorator to check user permissions"""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            permissions = claims.get('permissions', [])
            if 'all' not in permissions and permission not in permissions:
                return jsonify({'message': 'Insufficient permissions'}), 403
            return f(*args, **kwargs)
        return wrapper
    return decorator

def require_role(required_role):
    """Decorator to check user role"""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            user_role = claims.get('role')
            
            role_hierarchy = {
                'customer': 1,
                'staff': 2,
                'manager': 3,
                'admin': 4,
                'super_admin': 5
            }
            
            user_level = role_hierarchy.get(user_role, 0)
            required_level = role_hierarchy.get(required_role, 5)
            
            if user_level < required_level:
                return jsonify({'message': f'{required_role} role required'}), 403
            
            return f(*args, **kwargs)
        return wrapper
    return decorator

def log_api_call(f):
    """Decorator to log API calls"""
    @wraps(f)
    def wrapper(*args, **kwargs):
        logger = logging.getLogger(__name__)
        
        # Log request
        logger.info(f"API Call: {request.method} {request.path}")
        logger.debug(f"Request args: {request.args}")
        logger.debug(f"Request data: {request.get_json()}")
        
        start_time = datetime.now()
        
        try:
            result = f(*args, **kwargs)
            
            # Log successful response
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            logger.info(f"API Success: {request.method} {request.path} - {duration:.3f}s")
            
            return result
            
        except Exception as e:
            # Log error
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            logger.error(f"API Error: {request.method} {request.path} - {duration:.3f}s - {str(e)}")
            raise
    
    return wrapper

def validate_json(required_fields=None):
    """Decorator to validate JSON request data"""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            if not request.is_json:
                return jsonify({'message': 'Request must be JSON'}), 400
            
            data = request.get_json()
            if not data:
                return jsonify({'message': 'Request data is required'}), 400
            
            if required_fields:
                missing_fields = [field for field in required_fields if field not in data]
                if missing_fields:
                    return jsonify({
                        'message': f'Missing required fields: {", ".join(missing_fields)}'
                    }), 400
            
            return f(*args, **kwargs)
        return wrapper
    return decorator

def rate_limit(max_requests=100, window_minutes=60):
    """Simple rate limiting decorator"""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            # This is a simplified rate limiter
            # In production, you'd use Redis or a proper rate limiting service
            
            client_ip = request.remote_addr
            current_time = datetime.now()
            
            # For now, just log the request
            logger = logging.getLogger(__name__)
            logger.debug(f"Rate limit check for {client_ip}: {request.method} {request.path}")
            
            return f(*args, **kwargs)
        return wrapper
    return decorator

def handle_exceptions(f):
    """Decorator to handle common exceptions"""
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except ValueError as e:
            return jsonify({'message': f'Invalid value: {str(e)}'}), 400
        except KeyError as e:
            return jsonify({'message': f'Missing key: {str(e)}'}), 400
        except Exception as e:
            logger = logging.getLogger(__name__)
            logger.error(f"Unhandled exception in {f.__name__}: {str(e)}")
            return jsonify({'message': 'Internal server error'}), 500
    return wrapper

def cache_response(timeout=300):
    """Decorator to cache responses (simplified version)"""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            # This is a placeholder for response caching
            # In production, you'd use Redis or memcached
            return f(*args, **kwargs)
        return wrapper
    return decorator

def audit_log(action):
    """Decorator to log user actions for auditing"""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            try:
                user_id = get_jwt_identity()
                claims = get_jwt()
                username = claims.get('username', 'unknown')
                
                logger = logging.getLogger('audit')
                logger.info(f"Audit: {action} by user {username} ({user_id}) - {request.method} {request.path}")
                
            except:
                # If JWT is not available, still proceed
                pass
            
            return f(*args, **kwargs)
        return wrapper
    return decorator

