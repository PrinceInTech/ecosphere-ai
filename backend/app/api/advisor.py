from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.models.user import User
from app.schemas.advisor import AdvisorRequest, AdvisorResponse
from app.services.advisor import advisor_service
from app.services.auth import get_current_user

router = APIRouter(prefix="/api/advisor", tags=["advisor"])


@router.post("", response_model=AdvisorResponse)
async def get_recommendations(
    data: AdvisorRequest,
    current_user: User | None = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    user_id = current_user.id if current_user else None
    return await advisor_service.generate_recommendations(data, db, user_id)
