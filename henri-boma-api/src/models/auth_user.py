from datetime import datetime
from typing import Dict, Any, List, Optional
import bcrypt
from .base import BaseModel, validate_required_fields, validate_email, ValidationError

class AuthUserModel(BaseModel):
    def __init__(self, db):
        super().__init__(db, 'auth_users')
        import os
        # Only seed default admin in development, NOT production
        if os.getenv('FLASK_ENV', 'development') != 'production':
            self._initialize_default_admin()

    def _initialize_default_admin(self):
        """Create default admin if no users exist"""
        if self.count() > 0:  # don’t recreate if users already exist
            return

        admin_data = {
            'username': 'admin',
            'email': 'admin@henriboma.com',
            'password': 'admin123',  # will be hashed inside create_user
            'full_name': 'System Administrator',
            'role': 'super_admin',
            'status': 'active',
            'permissions': ['all']
        }

        self.create_user(admin_data)
    
    def _hash_password(self, password: str) -> str:
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    def _verify_password(self, password: str, hashed: str) -> bool:
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new user"""
        required_fields = ['username', 'email', 'password', 'full_name', 'role']
        validate_required_fields(user_data, required_fields)
        
        # Validate email
        if not validate_email(user_data['email']):
            raise ValidationError("Invalid email format")
        
        # Check if username or email already exists
        existing_user = self.find_one({
            '$or': [
                {'username': user_data['username']},
                {'email': user_data['email']}
            ]
        })
        
        if existing_user:
            raise ValidationError("Username or email already exists")
        
        # Validate role
        valid_roles = ['super_admin', 'admin', 'manager', 'staff', 'customer']
        if user_data['role'] not in valid_roles:
            raise ValidationError(f"Invalid role. Must be one of: {', '.join(valid_roles)}")
        
        # Hash password
        user_data['password'] = self._hash_password(user_data['password'])
        
        # Set defaults
        user_data.setdefault('status', 'active')
        user_data.setdefault('permissions', self._get_default_permissions(user_data['role']))
        user_data.setdefault('last_login', None)
        user_data.setdefault('login_count', 0)
        
        # Remove sensitive data from response
        user = self.create(user_data)
        user.pop('password', None)
        
        return user
    
    def _get_default_permissions(self, role: str) -> List[str]:
        """Get default permissions for role"""
        role_permissions = {
            'super_admin': ['all'],
            'admin': ['bookings', 'rooms', 'menu', 'orders', 'events', 'payments', 'analytics', 'users'],
            'manager': ['bookings', 'rooms', 'menu', 'orders', 'events', 'analytics'],
            'staff': ['bookings', 'menu', 'orders'],
            'customer': ['profile']
        }
        
        return role_permissions.get(role, ['profile'])
    
    def authenticate_user(self, username_or_email: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate user with username/email and password"""
        user = self.find_one({
            '$or': [
                {'username': username_or_email},
                {'email': username_or_email}
            ]
        })
        
        if not user:
            return None
        
        if user['status'] != 'active':
            raise ValidationError("User account is not active")
        
        if not self._verify_password(password, user['password']):
            return None
        
        # Update last login
        self.update_by_id(user['id'], {
            'last_login': datetime.utcnow(),
            'login_count': user.get('login_count', 0) + 1
        })
        
        # Remove password from response
        user.pop('password', None)
        return user
    
    def get_user_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        """Get user by username"""
        user = self.find_one({'username': username})
        if user:
            user.pop('password', None)
        return user
    
    def has_permission(self, user_id: str, permission: str) -> bool:
        """Check if user has specific permission"""
        user = self.find_by_id(user_id)
        if not user or user['status'] != 'active':
            return False
        
        permissions = user.get('permissions', [])
        return 'all' in permissions or permission in permissions

