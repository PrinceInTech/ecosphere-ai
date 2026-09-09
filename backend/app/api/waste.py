from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database.connection import get_db
from app.models.user import User
from app.schemas.analytics import AnalyticsResponse, ImpactResponse
from app.schemas.waste import WasteAnalysisResponse
from app.services.analytics import analytics_service
from app.services.auth import get_current_user
from app.services.waste_analysis import waste_service

router = APIRouter(prefix="/api", tags=["waste"])


@router.post("/analyze-image", response_model=WasteAnalysisResponse)
async def analyze_image(
    file: UploadFile,
    current_user: User | None = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{ext}' not allowed. Supported: {', '.join(settings.ALLOWED_EXTENSIONS)}",
        )

    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size: {settings.MAX_UPLOAD_SIZE // (1024 * 1024)}MB",
        )

    user_id = current_user.id if current_user else None
    return await waste_service.analyze_image(content, file.filename, user_id, db)


@router.get("/history", response_model=list[WasteAnalysisResponse])
async def get_history(
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    return await waste_service.get_history(db, limit)


@router.get("/analytics", response_model=AnalyticsResponse)
async def get_analytics(db: AsyncSession = Depends(get_db)):
    data = await waste_service.get_analytics(db)
    return AnalyticsResponse(**data)


@router.get("/impact", response_model=ImpactResponse)
async def get_impact(db: AsyncSession = Depends(get_db)):
    data = await waste_service.get_impact(db)
    return ImpactResponse(**data)
