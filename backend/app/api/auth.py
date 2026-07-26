from typing import Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.schemas.user import (
    UserCreate,
    UserResponse,
    Token,
    LoginRequest,
    RefreshTokenRequest,
)
from backend.app.services.auth_service import AuthService
from backend.app.api.deps import get_current_active_user
from backend.app.core.rate_limit import auth_rate_limiter
from backend.app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(auth_rate_limiter)],
)
def register(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    return AuthService.register_user(db, user_in)


@router.post(
    "/login", response_model=Token, dependencies=[Depends(auth_rate_limiter)]
)
def login(
    login_data: Optional[LoginRequest] = None,
    db: Session = Depends(get_db),
) -> Any:
    if not login_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required",
        )
    user = AuthService.authenticate_user(
        db, email=login_data.email, password=login_data.password
    )
    return AuthService.create_tokens_for_user(db, user)


@router.post(
    "/refresh", response_model=Token, dependencies=[Depends(auth_rate_limiter)]
)
def refresh_token(
    req: RefreshTokenRequest, db: Session = Depends(get_db)
) -> Any:
    return AuthService.refresh_access_token(db, req.refresh_token)


@router.post("/logout")
def logout(
    req: RefreshTokenRequest, db: Session = Depends(get_db)
) -> Any:
    AuthService.revoke_refresh_token(db, req.refresh_token)
    return {"detail": "Successfully logged out"}


@router.get("/me", response_model=UserResponse)
def get_current_user_me(
    current_user: User = Depends(get_current_active_user),
) -> Any:
    return current_user
