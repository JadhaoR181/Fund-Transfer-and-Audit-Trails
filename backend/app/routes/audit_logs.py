from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import AuditLog
from app.schemas.audit_logs import AuditLogResponse
from app.core.auth_dependency import get_current_user
from app.db.models import User

router = APIRouter(
    prefix="/audit-logs",
    tags=["Audit Logs"]
)

@router.get("/me", response_model=list[AuditLogResponse])
def get_my_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    logs = (
        db.query(AuditLog)
        .filter(
            (AuditLog.sender_id == current_user.id) |
            (AuditLog.receiver_id == current_user.id)
        )
        .order_by(AuditLog.timestamp.desc())
        .all()
    )

    return logs
