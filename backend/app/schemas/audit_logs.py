from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal

class AuditLogResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    amount: Decimal
    status: str
    timestamp: datetime

    class Config:
        orm_mode = True
