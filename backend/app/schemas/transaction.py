from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal

class TransactionResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    amount: Decimal
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
