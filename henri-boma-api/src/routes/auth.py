from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from datetime import timedelta
from src.models.auth_user import AuthUserModel, ValidationError

auth_bp = Blueprint('auth', __name__)

def get_auth_user_model():
    """Get AuthUserModel instance"""
    db = current_app.config.get('DB')
    return AuthUserModel(db)

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'username' not in data or 'password' not in data:
            return jsonify({'message': 'Username and password are required'}), 400
        
        auth_user_model = get_auth_user_model()
        user = auth_user_model.authenticate_user(data['username'], data['password'])
        
        if not user:
            return jsonify({'message': 'Invalid credentials'}), 401
        
        # Create tokens
        access_token = create_access_token(
            identity=user['id'],
            additional_claims={
                'username': user['username'],
                'role': user['role'],
                'permissions': user['permissions']
            }
        )
        
        refresh_token = create_refresh_token(identity=user['id'])
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'full_name': user['full_name'],
                'role': user['role'],
                'permissions': user['permissions']
            }
        }), 200
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Login failed', 'error': str(e)}), 500

@auth_bp.route('/register', methods=['POST'])
def register():
    """User registration endpoint"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Request data is required'}), 400
        
        # Set default role for registration
        data.setdefault('role', 'customer')
        
        auth_user_model = get_auth_user_model()
        user = auth_user_model.create_user(data)
        
        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'full_name': user['full_name'],
                'role': user['role']
            }
        }), 201
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Registration failed', 'error': str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        current_user_id = get_jwt_identity()
        
        auth_user_model = get_auth_user_model()
        user = auth_user_model.find_by_id(current_user_id)
        
        if not user or user['status'] != 'active':
            return jsonify({'message': 'User not found or inactive'}), 404
        
        # Create new access token
        access_token = create_access_token(
            identity=user['id'],
            additional_claims={
                'username': user['username'],
                'role': user['role'],
                'permissions': user['permissions']
            }
        )
        
        return jsonify({
            'access_token': access_token
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Token refresh failed', 'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        current_user_id = get_jwt_identity()
        
        auth_user_model = get_auth_user_model()
        user = auth_user_model.find_by_id(current_user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'full_name': user['full_name'],
                'role': user['role'],
                'permissions': user['permissions'],
                'status': user['status'],
                'last_login': user.get('last_login'),
                'created_at': user.get('created_at')
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get profile', 'error': str(e)}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update current user profile"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Request data is required'}), 400
        
        # Remove sensitive fields that shouldn't be updated via this endpoint
        data.pop('role', None)
        data.pop('permissions', None)
        data.pop('status', None)
        data.pop('password', None)
        
        auth_user_model = get_auth_user_model()
        user = auth_user_model.update_by_id(current_user_id, data)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'full_name': user['full_name'],
                'role': user['role']
            }
        }), 200
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to update profile', 'error': str(e)}), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'current_password' not in data or 'new_password' not in data:
            return jsonify({'message': 'Current password and new password are required'}), 400
        
        auth_user_model = get_auth_user_model()
        success = auth_user_model.change_password(
            current_user_id,
            data['current_password'],
            data['new_password']
        )
        
        if success:
            return jsonify({'message': 'Password changed successfully'}), 200
        else:
            return jsonify({'message': 'Failed to change password'}), 400
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to change password', 'error': str(e)}), 500

@auth_bp.route('/verify-token', methods=['GET'])
@jwt_required()
def verify_token():
    """Verify if token is valid"""
    try:
        current_user_id = get_jwt_identity()
        
        auth_user_model = get_auth_user_model()
        user = auth_user_model.find_by_id(current_user_id)
        
        if not user or user['status'] != 'active':
            return jsonify({'message': 'Invalid token or user inactive'}), 401
        
        return jsonify({
            'valid': True,
            'user': {
                'id': user['id'],
                'username': user['username'],
                'role': user['role'],
                'permissions': user['permissions']
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Token verification failed', 'error': str(e)}), 401

