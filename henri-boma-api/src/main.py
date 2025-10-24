import os
import sys
from datetime import timedelta
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from flask import jsonify
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
from dotenv import load_dotenv
from urllib.parse import urlparse

# Load environment variables
load_dotenv()

# Import blueprints
from src.routes.auth import auth_bp
from src.routes.bookings import bookings_bp
from src.routes.rooms import rooms_bp
from src.routes.menu import menu_bp
from src.routes.events import events_bp
from src.routes.payments import payments_bp
from src.routes.admin import admin_bp
from src.routes.content import content_bp
from src.routes.tickets import tickets_bp
from src.routes.analytics import analytics_bp
app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'henri-boma-secret-key-2025')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'henri-boma-jwt-secret-2025')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['MAX_CONTENT_LENGTH'] = int(os.getenv('MAX_FILE_SIZE', 10485760))  # 10MB
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', '/var/www/henri-boma-complete-project/henri-boma-media')
app.config['MEDIA_BASE_URL'] = os.getenv('MEDIA_BASE_URL', 'https://media.thehenriboma.com')
# MongoDB Configuration
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
mongo_client = MongoClient(MONGO_URI)

try:
    mongo_client.admin.command('ping')
    # Prefer database from URI if present:
    parsed = urlparse(MONGO_URI)
    db_name = (parsed.path or '/').lstrip('/') or 'henri_boma_resort'
    db = mongo_client[db_name]
    print("✅ Connected to MongoDB successfully")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    db = None


# Make database available to routes
app.config['DB'] = db

# Trigger one-time seeding for empty collections
if db is not None:
    from src.models.room import RoomModel
    from src.models.menu import MenuModel
    from src.models.auth_user import AuthUserModel

    RoomModel(db)     # seeds default rooms if empty
    MenuModel(db)     # seeds default menu if empty
    AuthUserModel(db) # seeds default admin if not production

# Initialize extensions
# Line 65: Replace the existing CORS line
CORS(app, origins=[
    "https://www.thehenriboma.com",
    "https://admin.thehenriboma.com", 
    "https://api.thehenriboma.com",
    "https://media.thehenriboma.com"
]) # Allow all origins for development
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
app.register_blueprint(rooms_bp, url_prefix='/api/rooms')
app.register_blueprint(menu_bp, url_prefix='/api/menu')
app.register_blueprint(events_bp, url_prefix='/api/events')
app.register_blueprint(payments_bp, url_prefix='/api/payments')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(content_bp, url_prefix='/api/content')
app.register_blueprint(tickets_bp, url_prefix='/api/tickets')
app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
# Health check endpoint
@app.route('/api/health')
def health_check():
    return {
        'status': 'healthy',
        'service': 'Henri Boma Resort API',
        'version': '1.0.0',
        'database': 'connected' if db is not None else 'disconnected'
    }

# Serve frontend files
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return {
                'message': 'Henri Boma Resort API',
                'status': 'running',
                'endpoints': {
                    'health': '/api/health',
                    'auth': '/api/auth/*',
                    'bookings': '/api/bookings/*',
                    'rooms': '/api/rooms/*',
                    'menu': '/api/menu/*',
                    'events': '/api/events/*',
                    'payments': '/api/payments/*',
                    'admin': '/api/admin/*'
                }
            }

# JWT error handlers
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return {'message': 'Token has expired'}, 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return {'message': 'Invalid token'}, 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    return {'message': 'Authorization token is required'}, 401

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

