import os
import uuid
from pathlib import Path

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.factory import get_ai_service
from app.config import settings
from app.models.waste_analysis import WasteAnalysis
from app.schemas.waste import WasteAnalysisCreate, WasteAnalysisResponse

UPLOAD_DIR = Path("uploads")


class WasteAnalysisService:
    def __init__(self):
        self.ai_service = get_ai_service()

    async def analyze_image(
        self, file_content: bytes, filename: str, user_id: int | None, db: AsyncSession
    ) -> WasteAnalysisResponse:
        ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
        unique_name = f"{uuid.uuid4().hex}.{ext}"
        file_path = UPLOAD_DIR / unique_name

        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        with open(file_path, "wb") as f:
            f.write(file_content)

        try:
            result = await self.ai_service.analyze_image(str(file_path), filename)
        except Exception:
            result = {
                "category": "other",
                "material": "Unknown",
                "recyclable": False,
                "confidence": 0.5,
                "disposal_method": "Check local guidelines.",
                "environmental_tip": "When in doubt, reduce and reuse.",
                "safety_warning": None,
            }

        analysis_data = WasteAnalysisCreate(
            user_id=user_id,
            image_filename=unique_name,
            category=result.get("category", "other"),
            material=result.get("material", "Unknown"),
            recyclable=result.get("recyclable", False),
            confidence=result.get("confidence", 0.5),
            disposal_method=result.get("disposal_method", ""),
            environmental_tip=result.get("environmental_tip", ""),
            safety_warning=result.get("safety_warning"),
        )

        db_analysis = WasteAnalysis(
            user_id=analysis_data.user_id,
            image_filename=analysis_data.image_filename,
            category=analysis_data.category,
            material=analysis_data.material,
            recyclable=analysis_data.recyclable,
            confidence=analysis_data.confidence,
            disposal_method=analysis_data.disposal_method,
            environmental_tip=analysis_data.environmental_tip,
            safety_warning=analysis_data.safety_warning,
        )
        db.add(db_analysis)
        await db.commit()
        await db.refresh(db_analysis)

        return WasteAnalysisResponse.model_validate(db_analysis)

    async def get_analytics(self, db: AsyncSession) -> dict:
        result = await db.execute(select(WasteAnalysis))
        analyses = result.scalars().all()

        total = len(analyses)
        if total == 0:
            return {
                "total_analyses": 0,
                "category_distribution": {},
                "recyclable_percentage": 0.0,
                "top_materials": [],
            }

        category_counts: dict[str, int] = {}
        material_counts: dict[str, int] = {}
        recyclable_count = 0

        for a in analyses:
            category_counts[a.category] = category_counts.get(a.category, 0) + 1
            material_counts[a.material] = material_counts.get(a.material, 0) + 1
            if a.recyclable:
                recyclable_count += 1

        top_materials = sorted(material_counts.items(), key=lambda x: x[1], reverse=True)[:5]

        return {
            "total_analyses": total,
            "category_distribution": category_counts,
            "recyclable_percentage": round((recyclable_count / total) * 100, 1) if total else 0.0,
            "top_materials": [{"material": m, "count": c} for m, c in top_materials],
        }

    async def get_history(self, db: AsyncSession, limit: int = 50) -> list[WasteAnalysisResponse]:
        result = await db.execute(
            select(WasteAnalysis).order_by(WasteAnalysis.created_at.desc()).limit(limit)
        )
        analyses = result.scalars().all()
        return [WasteAnalysisResponse.model_validate(a) for a in analyses]

    async def get_impact(self, db: AsyncSession) -> dict:
        result = await db.execute(select(WasteAnalysis))
        analyses = result.scalars().all()

        total = len(analyses)
        recyclable = sum(1 for a in analyses if a.recyclable)
        diversion_rate = (recyclable / total * 100) if total else 0.0
        co2_per_item_kg = 0.5
        estimated_co2_saved = recyclable * co2_per_item_kg

        return {
            "total_items_analyzed": total,
            "recyclable_items": recyclable,
            "diversion_rate": round(diversion_rate, 1),
            "estimated_co2_saved_kg": round(estimated_co2_saved, 2),
            "waste_tips_given": total,
        }


waste_service = WasteAnalysisService()
