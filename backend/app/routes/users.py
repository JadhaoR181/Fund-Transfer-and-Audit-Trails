from fastapi import APIRouter, Depends
from app.core.auth_dependency import get_current_user
from app.db.models import User

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "balance": float(current_user.balance),
        "created_at": current_user.created_at
    }
