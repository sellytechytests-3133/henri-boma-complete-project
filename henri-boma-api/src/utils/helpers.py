import re
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import hashlib
import secrets
import string

def generate_id(prefix: str = "", length: int = 8) -> str:
    """Generate a unique ID with optional prefix"""
    random_part = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(length))
    return f"{prefix}{random_part}" if prefix else random_part

def generate_uuid() -> str:
    """Generate a UUID4 string"""
    return str(uuid.uuid4())

def format_phone_number(phone: str, country_code: str = "254") -> str:
    """Format phone number to international format"""
    # Remove all non-digit characters
    phone = re.sub(r'\D', '', phone)
    
    if phone.startswith('0'):
        phone = country_code + phone[1:]
    elif not phone.startswith(country_code):
        phone = country_code + phone
    
    return f"+{phone}"

def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone: str) -> bool:
    """Validate phone number format"""
    # Remove all non-digit characters
    phone = re.sub(r'\D', '', phone)
    
    # Check if it's a valid Kenyan number
    if len(phone) == 9 and phone.startswith(('7', '1')):
        return True
    elif len(phone) == 10 and phone.startswith('0'):
        return True
    elif len(phone) == 12 and phone.startswith('254'):
        return True
    
    return False

def sanitize_string(text: str, max_length: int = None) -> str:
    """Sanitize string input"""
    if not text:
        return ""
    
    # Remove leading/trailing whitespace
    text = text.strip()
    
    # Remove potentially dangerous characters
    text = re.sub(r'[<>"\']', '', text)
    
    # Limit length if specified
    if max_length and len(text) > max_length:
        text = text[:max_length]
    
    return text

def calculate_age(birth_date: datetime) -> int:
    """Calculate age from birth date"""
    today = datetime.now()
    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))

def format_currency(amount: float, currency: str = "KES") -> str:
    """Format currency amount"""
    return f"{currency} {amount:,.2f}"

def parse_date_string(date_string: str) -> Optional[datetime]:
    """Parse date string in various formats"""
    formats = [
        '%Y-%m-%d',
        '%Y-%m-%dT%H:%M:%S',
        '%Y-%m-%dT%H:%M:%SZ',
        '%Y-%m-%d %H:%M:%S',
        '%d/%m/%Y',
        '%d-%m-%Y'
    ]
    
    for fmt in formats:
        try:
            return datetime.strptime(date_string, fmt)
        except ValueError:
            continue
    
    return None

def get_date_range(period: str) -> tuple:
    """Get date range for common periods"""
    end_date = datetime.now()
    
    if period == 'today':
        start_date = end_date.replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == 'yesterday':
        start_date = (end_date - timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = start_date.replace(hour=23, minute=59, second=59, microsecond=999999)
    elif period == 'this_week':
        start_date = end_date - timedelta(days=end_date.weekday())
        start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == 'last_week':
        start_date = end_date - timedelta(days=end_date.weekday() + 7)
        start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = start_date + timedelta(days=6, hours=23, minutes=59, seconds=59, microseconds=999999)
    elif period == 'this_month':
        start_date = end_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    elif period == 'last_month':
        first_day_this_month = end_date.replace(day=1)
        end_date = first_day_this_month - timedelta(days=1)
        start_date = end_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_date = end_date.replace(hour=23, minute=59, second=59, microsecond=999999)
    elif period == 'last_7_days':
        start_date = end_date - timedelta(days=7)
    elif period == 'last_30_days':
        start_date = end_date - timedelta(days=30)
    elif period == 'last_90_days':
        start_date = end_date - timedelta(days=90)
    else:
        # Default to last 30 days
        start_date = end_date - timedelta(days=30)
    
    return start_date, end_date

def hash_password(password: str) -> str:
    """Hash password using SHA-256 (for simple cases)"""
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token(length: int = 32) -> str:
    """Generate a secure random token"""
    return secrets.token_urlsafe(length)

def paginate_results(results: List[Any], page: int = 1, per_page: int = 20) -> Dict[str, Any]:
    """Paginate results"""
    total = len(results)
    start = (page - 1) * per_page
    end = start + per_page
    
    paginated_results = results[start:end]
    
    return {
        'data': paginated_results,
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': total,
            'pages': (total + per_page - 1) // per_page,
            'has_prev': page > 1,
            'has_next': end < total
        }
    }

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two coordinates in kilometers"""
    import math
    
    # Convert latitude and longitude from degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    # Radius of earth in kilometers
    r = 6371
    
    return c * r

def slugify(text: str) -> str:
    """Convert text to URL-friendly slug"""
    # Convert to lowercase
    text = text.lower()
    
    # Replace spaces and special characters with hyphens
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    
    # Remove leading/trailing hyphens
    text = text.strip('-')
    
    return text

def mask_sensitive_data(data: str, mask_char: str = '*', visible_chars: int = 4) -> str:
    """Mask sensitive data like phone numbers or emails"""
    if len(data) <= visible_chars:
        return mask_char * len(data)
    
    if '@' in data:  # Email
        username, domain = data.split('@', 1)
        masked_username = username[:2] + mask_char * (len(username) - 2)
        return f"{masked_username}@{domain}"
    else:  # Phone or other
        return data[:visible_chars] + mask_char * (len(data) - visible_chars)

def get_file_extension(filename: str) -> str:
    """Get file extension from filename"""
    return filename.split('.')[-1].lower() if '.' in filename else ''

def is_valid_file_type(filename: str, allowed_types: List[str]) -> bool:
    """Check if file type is allowed"""
    extension = get_file_extension(filename)
    return extension in [ext.lower() for ext in allowed_types]

def format_file_size(size_bytes: int) -> str:
    """Format file size in human readable format"""
    if size_bytes == 0:
        return "0B"
    
    size_names = ["B", "KB", "MB", "GB", "TB"]
    i = 0
    while size_bytes >= 1024 and i < len(size_names) - 1:
        size_bytes /= 1024.0
        i += 1
    
    return f"{size_bytes:.1f}{size_names[i]}"

def clean_dict(data: Dict[str, Any], remove_none: bool = True, remove_empty: bool = False) -> Dict[str, Any]:
    """Clean dictionary by removing None or empty values"""
    cleaned = {}
    
    for key, value in data.items():
        if remove_none and value is None:
            continue
        if remove_empty and value == "":
            continue
        
        cleaned[key] = value
    
    return cleaned

def merge_dicts(*dicts: Dict[str, Any]) -> Dict[str, Any]:
    """Merge multiple dictionaries"""
    result = {}
    for d in dicts:
        result.update(d)
    return result

