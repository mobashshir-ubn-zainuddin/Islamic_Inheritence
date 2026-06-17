"""Pydantic schemas for authentication"""
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    full_name: str
    password: str
    language_preference: Optional[str] = "en"

class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str

class Token(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"

class UserResponse(BaseModel):
    """User response schema"""
    id: int
    email: str
    full_name: str
    is_active: bool
    language_preference: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class CalculationSave(BaseModel):
    """Schema for saving a calculation"""
    estate_value: float
    relatives: list
    result: dict
    notes: Optional[str] = None

class CalculationHistoryResponse(BaseModel):
    """Calculation history response"""
    id: int
    estate_value: float
    relatives: list
    result: dict
    created_at: datetime
    notes: Optional[str]
    
    class Config:
        from_attributes = True

class BookmarkCreate(BaseModel):
    """Schema for creating a bookmark"""
    title: str
    url: str
    fatwa_source: str

class BookmarkResponse(BaseModel):
    """Bookmark response"""
    id: int
    title: str
    url: str
    fatwa_source: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class PasswordChange(BaseModel):
    """Schema for changing password"""
    old_password: str
    new_password: str

class UserUpdate(BaseModel):
    """Schema for updating user profile"""
    full_name: Optional[str] = None
    language_preference: Optional[str] = None
