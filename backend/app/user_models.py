"""User and calculation history database models"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Float, JSON, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    """User account model"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    language_preference = Column(String, default="en")  # en, ur, ar
    
    # Relationships
    calculations = relationship("CalculationHistory", back_populates="user", cascade="all, delete-orphan")
    bookmarks = relationship("Bookmark", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User {self.email}>"

class CalculationHistory(Base):
    """Store calculation history for users"""
    __tablename__ = "calculation_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    estate_value = Column(Float)
    relatives = Column(JSON)  # Store the relatives list as JSON
    result = Column(JSON)  # Store the calculation result
    created_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(String, nullable=True)  # User notes about the calculation
    
    # Relationships
    user = relationship("User", back_populates="calculations")
    
    def __repr__(self):
        return f"<CalculationHistory user_id={self.user_id}>"

class Bookmark(Base):
    """Bookmarked fatwas and references"""
    __tablename__ = "bookmarks"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    title = Column(String)
    url = Column(String)
    fatwa_source = Column(String)  # e.g., "darul_ifta_deoband", "binoria"
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="bookmarks")
    
    def __repr__(self):
        return f"<Bookmark {self.title}>"
