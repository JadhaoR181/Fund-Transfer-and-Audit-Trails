from pydantic import BaseModel, Field
from decimal import Decimal

class TransferRequest(BaseModel):
    receiver_id: int
    amount: Decimal = Field(..., gt=0)
