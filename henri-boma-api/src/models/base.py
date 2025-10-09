from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId
from typing import Dict, Any, Optional, List
import json

class BaseModel:
    """Base model class for MongoDB operations"""
    
    def __init__(self, db, collection_name: str):
        self.db = db
        self.collection_name = collection_name
        self.collection = db[collection_name] if db is not None else None

    
    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new document"""
        if self.collection is None:
            raise Exception("Database not connected")
        
        # Add timestamps
        data['created_at'] = datetime.utcnow()
        data['updated_at'] = datetime.utcnow()
        
        result = self.collection.insert_one(data)
        data['_id'] = result.inserted_id
        return self._serialize_document(data)
    
    def find_by_id(self, doc_id: str) -> Optional[Dict[str, Any]]:
        """Find document by ID"""
        if self.collection is None:
            return None
        
        try:
            doc = self.collection.find_one({'_id': ObjectId(doc_id)})
            return self._serialize_document(doc) if doc else None
        except (InvalidId, Exception):
            return None
    
    def find_one(self, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Find one document by query"""
        if self.collection is None:
            return None
        
        doc = self.collection.find_one(query)
        return self._serialize_document(doc) if doc else None
    
    def find_many(self, query: Dict[str, Any] = None, limit: int = None, skip: int = 0, sort: List = None) -> List[Dict[str, Any]]:
        """Find multiple documents"""
        if self.collection is None:
            return []
        
        query = query or {}
        cursor = self.collection.find(query).skip(skip)
        
        if limit:
            cursor = cursor.limit(limit)
        
        if sort:
            cursor = cursor.sort(sort)
        
        return [self._serialize_document(doc) for doc in cursor]
    
    def update_by_id(self, doc_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update document by ID"""
        if self.collection is None:
            return None
        
        try:
            # Add updated timestamp
            data['updated_at'] = datetime.utcnow()
            
            result = self.collection.update_one(
                {'_id': ObjectId(doc_id)},
                {'$set': data}
            )
            
            if result.matched_count > 0:
                return self.find_by_id(doc_id)
            return None
        except:
            return None
    
    def delete_by_id(self, doc_id: str) -> bool:
        """Delete document by ID"""
        if self.collection is None:
            return False
        
        try:
            result = self.collection.delete_one({'_id': ObjectId(doc_id)})
            return result.deleted_count > 0
        except:
            return False
    
    def count(self, query: Dict[str, Any] = None) -> int:
        """Count documents"""
        if self.collection is None:
            return 0
        
        query = query or {}
        return self.collection.count_documents(query)
    
    def _serialize_document(self, doc: Dict[str, Any]) -> Dict[str, Any]:
        """Convert MongoDB document to JSON serializable format"""
        if not doc:
            return doc
        
        # Convert ObjectId to string
        if '_id' in doc:
            doc['id'] = str(doc['_id'])
            del doc['_id']
        
        # Convert datetime objects to ISO format
        for key, value in doc.items():
            if isinstance(value, datetime):
                doc[key] = value.isoformat()
            elif isinstance(value, ObjectId):
                doc[key] = str(value)
        
        return doc

class ValidationError(Exception):
    """Custom validation error"""
    pass

def validate_required_fields(data: Dict[str, Any], required_fields: List[str]):
    """Validate that required fields are present"""
    missing_fields = [field for field in required_fields if field not in data or data[field] is None]
    if missing_fields:
        raise ValidationError(f"Missing required fields: {', '.join(missing_fields)}")

def validate_email(email: str) -> bool:
    """Basic email validation"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone: str) -> bool:
    """Basic phone validation for Kenyan numbers"""
    import re
    # Kenyan phone number patterns
    patterns = [
        r'^\+254[17]\d{8}$',  # +254 format
        r'^0[17]\d{8}$',      # 0 format
        r'^[17]\d{8}$'        # Without country code
    ]
    return any(re.match(pattern, phone) for pattern in patterns)

