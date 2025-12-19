from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from decimal import Decimal

from app.db.database import get_db
from app.db.models import User, Transaction
from app.schemas.transfer import TransferRequest
from app.core.auth_dependency import get_current_user
from app.db.models import AuditLog

router = APIRouter(prefix="/transfer", tags=["Transfer"])

@router.post("/")
def transfer_funds(
    data: TransferRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sender = current_user

    if sender.id == data.receiver_id:
        raise HTTPException(status_code=400, detail="Sender and receiver cannot be same")

    receiver = db.query(User).filter(User.id == data.receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")

    if sender.balance < data.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    try:
        # 🔒 ATOMIC OPERATION (SINGLE TRANSACTION)
        sender.balance = sender.balance - data.amount
        receiver.balance = receiver.balance + data.amount

        transaction = Transaction(
            sender_id=sender.id,
            receiver_id=receiver.id,
            amount=data.amount,
            status="SUCCESS"
        )
        
        audit_log = AuditLog(
            sender_id=sender.id,
            receiver_id=receiver.id,
            amount=data.amount,
            status="SUCCESS"
        )

        db.add(transaction)
        db.add(audit_log)
        db.commit()

        return {
            "message": "Transfer successful",
            "amount": data.amount,
            "receiver_id": receiver.id,
            "current_balance": sender.balance
        }

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
