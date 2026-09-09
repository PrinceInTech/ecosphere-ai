from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.factory import get_ai_service
from app.models.waste_analysis import WasteAnalysis


class AnalyticsService:
    def __init__(self):
        self.ai_service = get_ai_service()

    async def get_waste_trends(self, db: AsyncSession) -> list[dict]:
        result = await db.execute(
            select(WasteAnalysis).order_by(WasteAnalysis.created_at.desc()).limit(200)
        )
        analyses = result.scalars().all()

        weekly: dict[str, dict[str, int]] = {}
        for a in analyses:
            week_key = a.created_at.strftime("%Y-W%U")
            if week_key not in weekly:
                weekly[week_key] = {"count": 0, "recyclable": 0}
            weekly[week_key]["count"] += 1
            if a.recyclable:
                weekly[week_key]["recyclable"] += 1

        trends = []
        for week, data in sorted(weekly.items()):
            trends.append({
                "week": week,
                "total": data["count"],
                "recyclable": data["recyclable"],
            })
        return trends

    async def get_category_distribution(self, db: AsyncSession) -> dict[str, int]:
        result = await db.execute(
            select(WasteAnalysis.category, func.count(WasteAnalysis.id))
            .group_by(WasteAnalysis.category)
        )
        return {row[0]: row[1] for row in result.all()}

    async def get_summary_stats(self, db: AsyncSession) -> dict:
        result = await db.execute(select(WasteAnalysis))
        analyses = result.scalars().all()

        total = len(analyses)
        recyclable = sum(1 for a in analyses if a.recyclable)
        avg_confidence = (
            round(sum(a.confidence for a in analyses) / total, 3) if total else 0
        )
        category_dist = await self.get_category_distribution(db)

        return {
            "total_analyses": total,
            "recyclable_count": recyclable,
            "recyclable_percentage": round((recyclable / total) * 100, 1) if total else 0,
            "average_confidence": avg_confidence,
            "category_distribution": category_dist,
        }

    async def generate_insights(self, db: AsyncSession) -> list[str]:
        stats = await self.get_summary_stats(db)

        if stats["total_analyses"] == 0:
            return [
                "No waste analyses yet. Upload your first image to start receiving insights!",
                "Tip: You can analyze waste items by uploading photos through the waste analysis feature.",
            ]

        insights = []

        recyclable_pct = stats["recyclable_percentage"]
        if recyclable_pct > 60:
            insights.append(
                f"Great job! {recyclable_pct}% of your analyzed items are recyclable. "
                "Keep up the excellent sorting habits!"
            )
        elif recyclable_pct > 30:
            insights.append(
                f"{recyclable_pct}% of analyzed items are recyclable. "
                "There's room for improvement in identifying recyclable materials."
            )
        else:
            insights.append(
                f"Only {recyclable_pct}% of analyzed items are recyclable. "
                "Consider learning more about local recycling guidelines."
            )

        categories = stats["category_distribution"]
        if categories:
            top_category = max(categories, key=categories.get)
            insights.append(
                f"Your most common waste category is '{top_category}' "
                f"({categories[top_category]} items). "
                "Look for ways to reduce this category specifically."
            )

        if "plastic" in categories and categories["plastic"] > 2:
            insights.append(
                "You have a high volume of plastic waste. "
                "Consider switching to reusable alternatives for common plastic items."
            )

        if "organic" in categories:
            insights.append(
                "Organic waste detected! Composting can divert this waste from landfills "
                "and reduce methane emissions."
            )

        insights.append(
            "Remember: The waste hierarchy prioritizes Reduce, Reuse, then Recycle. "
            "Reducing consumption is the most impactful action."
        )

        return insights


analytics_service = AnalyticsService()
