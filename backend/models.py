"""
Pydantic models for SafeDoser backend API
Defines request/response schemas for all endpoints
"""

from datetime import datetime, date
from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, EmailStr, validator, Field
import json

# Base models
class TimestampMixin(BaseModel):
    """Mixin for models with timestamps"""
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

# User models
class UserBase(BaseModel):
    """Base user model"""
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=255)
    age: int = Field(..., ge=13, le=120)

class UserCreate(UserBase):
    """User creation model"""
    password: str = Field(..., min_length=6)
    avatar: Optional[str] = None  # Base64 encoded image

class UserLogin(BaseModel):
    """User login model"""
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    """User update model"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    age: Optional[int] = Field(None, ge=13, le=120)
    avatar: Optional[str] = None  # Base64 encoded image

class UserInDB(UserBase, TimestampMixin):
    """User model as stored in database"""
    id: str
    avatar_url: Optional[str] = None
    password_hash: str

class UserResponse(BaseModel):
    """User response model"""
    user: Dict[str, Any]
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

# Supplement models
class DoseInfo(BaseModel):
    """Dose information model"""
    quantity: str
    unit: str

class TimesOfDay(BaseModel):
    """Times of day model"""
    Morning: List[str] = []
    Afternoon: List[str] = []
    Evening: List[str] = []

class SupplementBase(BaseModel):
    """Base supplement model"""
    name: str = Field(..., min_length=1, max_length=255)
    brand: str = Field(..., min_length=1, max_length=255)
    dosage_form: str = Field(..., min_length=1, max_length=100)
    dose_quantity: str = Field(..., min_length=1, max_length=50)
    dose_unit: str = Field(..., min_length=1, max_length=50)
    frequency: str = Field(..., min_length=1, max_length=100)
    times_of_day: Dict[str, Any] = Field(default_factory=dict)
    interactions: List[str] = Field(default_factory=list)
    remind_me: bool = True
    expiration_date: date
    quantity: str = Field(..., min_length=1, max_length=100)
    image_url: Optional[str] = None

class SupplementCreate(SupplementBase):
    """Supplement creation model"""
    pass

class SupplementUpdate(BaseModel):
    """Supplement update model"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    brand: Optional[str] = Field(None, min_length=1, max_length=255)
    dosage_form: Optional[str] = Field(None, min_length=1, max_length=100)
    dose_quantity: Optional[str] = Field(None, min_length=1, max_length=50)
    dose_unit: Optional[str] = Field(None, min_length=1, max_length=50)
    frequency: Optional[str] = Field(None, min_length=1, max_length=100)
    times_of_day: Optional[Dict[str, Any]] = None
    interactions: Optional[List[str]] = None
    remind_me: Optional[bool] = None
    expiration_date: Optional[date] = None
    quantity: Optional[str] = Field(None, min_length=1, max_length=100)
    image_url: Optional[str] = None

class SupplementInDB(SupplementBase, TimestampMixin):
    """Supplement model as stored in database"""
    id: int
    user_id: str

class SupplementResponse(BaseModel):
    """Supplement response model"""
    id: int
    user_id: str
    name: str
    brand: str
    dosage_form: str
    dose_quantity: str
    dose_unit: str
    frequency: str
    times_of_day: Dict[str, Any]
    interactions: List[str]
    remind_me: bool
    expiration_date: date
    quantity: str
    image_url: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

# Chat models
class ChatMessage(BaseModel):
    """Chat message model"""
    message: str = Field(..., min_length=1, max_length=2000)

class ChatMessageInDB(BaseModel):
    """Chat message as stored in database"""
    id: str
    user_id: str
    sender: str  # 'user' or 'assistant'
    message: str
    timestamp: datetime
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    """Chat response model"""
    reply: str

class ChatHistoryResponse(BaseModel):
    """Chat history response model"""
    messages: List[Dict[str, Any]]

# Supplement log models
class SupplementLogBase(BaseModel):
    """Base supplement log model"""
    supplement_id: int
    scheduled_time: str  # Time in HH:MM format
    status: str = Field(default="pending", regex="^(pending|taken|missed|skipped)$")
    notes: Optional[str] = None

class SupplementLogCreate(SupplementLogBase):
    """Supplement log creation model"""
    pass

class SupplementLogUpdate(BaseModel):
    """Supplement log update model"""
    status: Optional[str] = Field(None, regex="^(pending|taken|missed|skipped)$")
    taken_at: Optional[datetime] = None
    notes: Optional[str] = None

class SupplementLogInDB(SupplementLogBase, TimestampMixin):
    """Supplement log as stored in database"""
    id: str
    user_id: str
    taken_at: Optional[datetime] = None

class SupplementLogResponse(BaseModel):
    """Supplement log response model"""
    id: str
    user_id: str
    supplement_id: int
    scheduled_time: str
    taken_at: Optional[datetime] = None
    status: str
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

# Health check model
class HealthResponse(BaseModel):
    """Health check response model"""
    status: str
    timestamp: datetime
    gemini_configured: bool
    supabase_configured: bool

# Error models
class ErrorResponse(BaseModel):
    """Error response model"""
    error: str
    detail: Optional[str] = None

# Token models
class Token(BaseModel):
    """Token model"""
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """Token data model"""
    user_id: Optional[str] = None

# File upload models
class ImageUploadResponse(BaseModel):
    """Image upload response model"""
    image_url: str

# Validation helpers
class ConfigModel(BaseModel):
    """Configuration model for Pydantic settings"""
    
    class Config:
        # Allow population by field name and alias
        allow_population_by_field_name = True
        # Use enum values instead of enum objects
        use_enum_values = True
        # Validate assignment
        validate_assignment = True
        # Allow extra fields
        extra = "forbid"

# Custom validators
def validate_time_format(v: str) -> str:
    """Validate time format (HH:MM)"""
    import re
    if not re.match(r'^([01]\d|2[0-3]):[0-5]\d$', v):
        raise ValueError('Time must be in HH:MM format')
    return v

def validate_base64_image(v: str) -> str:
    """Validate base64 encoded image"""
    import base64
    import re
    
    # Check if it's a data URL
    if v.startswith('data:image/'):
        # Extract base64 part
        try:
            header, data = v.split(',', 1)
            base64.b64decode(data)
            return v
        except Exception:
            raise ValueError('Invalid base64 image data')
    else:
        # Assume it's raw base64
        try:
            base64.b64decode(v)
            return v
        except Exception:
            raise ValueError('Invalid base64 image data')

# Apply validators to relevant models
SupplementLogBase.__validators__['scheduled_time'] = validator('scheduled_time', allow_reuse=True)(validate_time_format)
UserCreate.__validators__['avatar'] = validator('avatar', allow_reuse=True)(validate_base64_image)
UserUpdate.__validators__['avatar'] = validator('avatar', allow_reuse=True)(validate_base64_image)