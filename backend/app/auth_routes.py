"""Authentication routes"""
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.user_models import User
from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from app.auth_schemas import (
    UserCreate,
    UserLogin,
    Token,
    UserResponse,
    PasswordChange,
    UserUpdate,
    CalculationHistoryResponse,
    CalculationSave,
    BookmarkCreate,
    BookmarkResponse
)
from app.user_models import CalculationHistory, Bookmark

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=Token)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    db_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hashed_password,
        language_preference=user_data.language_preference
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": db_user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(db_user)
    }

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(user)
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse.from_orm(current_user)

@router.put("/me", response_model=UserResponse)
async def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    if user_update.full_name:
        current_user.full_name = user_update.full_name
    if user_update.language_preference:
        current_user.language_preference = user_update.language_preference
    
    db.commit()
    db.refresh(current_user)
    return UserResponse.from_orm(current_user)

@router.post("/change-password")
async def change_password(
    password_change: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change user password"""
    if not verify_password(password_change.old_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid current password"
        )
    
    current_user.hashed_password = hash_password(password_change.new_password)
    db.commit()
    
    return {"message": "Password changed successfully"}

# Calculation history routes
@router.post("/calculations/save", response_model=CalculationHistoryResponse)
async def save_calculation(
    calc_data: CalculationSave,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save a calculation to user history"""
    calculation = CalculationHistory(
        user_id=current_user.id,
        estate_value=calc_data.estate_value,
        relatives=calc_data.relatives,
        result=calc_data.result,
        notes=calc_data.notes
    )
    db.add(calculation)
    db.commit()
    db.refresh(calculation)
    return CalculationHistoryResponse.from_orm(calculation)

@router.get("/calculations/history", response_model=list[CalculationHistoryResponse])
async def get_calculation_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's calculation history"""
    calculations = db.query(CalculationHistory).filter(
        CalculationHistory.user_id == current_user.id
    ).order_by(CalculationHistory.created_at.desc()).all()
    
    return [CalculationHistoryResponse.from_orm(calc) for calc in calculations]

@router.get("/calculations/history/{calc_id}", response_model=CalculationHistoryResponse)
async def get_calculation(
    calc_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific calculation"""
    calculation = db.query(CalculationHistory).filter(
        CalculationHistory.id == calc_id,
        CalculationHistory.user_id == current_user.id
    ).first()
    
    if not calculation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Calculation not found"
        )
    
    return CalculationHistoryResponse.from_orm(calculation)

@router.delete("/calculations/history/{calc_id}")
async def delete_calculation(
    calc_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a calculation"""
    calculation = db.query(CalculationHistory).filter(
        CalculationHistory.id == calc_id,
        CalculationHistory.user_id == current_user.id
    ).first()
    
    if not calculation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Calculation not found"
        )
    
    db.delete(calculation)
    db.commit()
    return {"message": "Calculation deleted"}

# Bookmark routes
@router.post("/bookmarks", response_model=BookmarkResponse)
async def create_bookmark(
    bookmark_data: BookmarkCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a bookmark"""
    bookmark = Bookmark(
        user_id=current_user.id,
        title=bookmark_data.title,
        url=bookmark_data.url,
        fatwa_source=bookmark_data.fatwa_source
    )
    db.add(bookmark)
    db.commit()
    db.refresh(bookmark)
    return BookmarkResponse.from_orm(bookmark)

@router.get("/bookmarks", response_model=list[BookmarkResponse])
async def get_bookmarks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's bookmarks"""
    bookmarks = db.query(Bookmark).filter(
        Bookmark.user_id == current_user.id
    ).order_by(Bookmark.created_at.desc()).all()
    
    return [BookmarkResponse.from_orm(b) for b in bookmarks]

@router.delete("/bookmarks/{bookmark_id}")
async def delete_bookmark(
    bookmark_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a bookmark"""
    bookmark = db.query(Bookmark).filter(
        Bookmark.id == bookmark_id,
        Bookmark.user_id == current_user.id
    ).first()
    
    if not bookmark:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bookmark not found"
        )
    
    db.delete(bookmark)
    db.commit()
    return {"message": "Bookmark deleted"}
