from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Transaction, User
from app.schemas.transaction import TransactionResponse
from app.core.auth_dependency import get_current_user

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.get("/me", response_model=list[TransactionResponse])
def get_my_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transactions = (
        db.query(Transaction)
        .filter(
            (Transaction.sender_id == current_user.id) |
            (Transaction.receiver_id == current_user.id)
        )
        .order_by(Transaction.created_at.desc())
        .all()
    )

    return transactions
