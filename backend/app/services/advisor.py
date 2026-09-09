import json

from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.factory import get_ai_service
from app.ai.prompts.advisor import SYSTEM_PROMPT_ADVISOR
from app.models.sustainability_assessment import SustainabilityAssessment
from app.schemas.advisor import AdvisorRequest, AdvisorResponse


class AdvisorService:
    def __init__(self):
        self.ai_service = get_ai_service()

    async def generate_recommendations(
        self, data: AdvisorRequest, db: AsyncSession, user_id: int | None = None
    ) -> AdvisorResponse:
        prompt = f"""Based on the following household profile, generate personalized sustainability recommendations:

Household size: {data.household_size}
Weekly waste generation: {data.weekly_waste} kg
Plastic usage level: {data.plastic_usage}
Food waste level: {data.food_waste}
Recycling habits: {data.recycling_habits}

Please provide:
1. Suggestions (list of 5-8 practical recommendations)
2. Priority actions (top 3-5 most impactful changes)
3. Estimated impact (waste_reduction_percent, co2_savings_kg, energy_savings_percent)"""

        full_prompt = f"{SYSTEM_PROMPT_ADVISOR}\n\n{prompt}"

        try:
            response_text = await self.ai_service.generate_response(full_prompt)
            parsed = self._parse_response(response_text, data)
        except Exception:
            parsed = self._generate_demo_response(data)

        assessment = SustainabilityAssessment(
            user_id=user_id,
            household_size=data.household_size,
            weekly_waste=data.weekly_waste,
            plastic_usage=data.plastic_usage,
            food_waste=data.food_waste,
            recycling_habits=data.recycling_habits,
            recommendations=json.dumps(parsed.suggestions),
        )
        db.add(assessment)
        await db.commit()

        return parsed

    def _generate_demo_response(self, data: AdvisorRequest) -> AdvisorResponse:
        suggestions = []
        waste_factor = data.weekly_waste / max(data.household_size, 1)

        if data.plastic_usage in ("high", "very_high", "very high"):
            suggestions.extend([
                "Switch to reusable water bottles and coffee cups to eliminate single-use plastics",
                "Use beeswax wraps or silicone lids instead of plastic wrap",
                "Buy products in bulk using your own containers to reduce plastic packaging",
                "Replace plastic bags with reusable shopping bags",
            ])
        elif data.plastic_usage in ("medium", "moderate"):
            suggestions.extend([
                "Gradually replace remaining single-use plastics with reusable alternatives",
                "Choose products with recyclable or compostable packaging",
            ])

        if data.food_waste in ("high", "very_high", "very high"):
            suggestions.extend([
                "Plan weekly meals to buy only what you need",
                "Learn to use vegetable scraps for homemade broths",
                "Start composting food waste to divert it from landfills",
                "Store fruits and vegetables properly to extend freshness",
            ])
        elif data.food_waste in ("medium", "moderate"):
            suggestions.extend([
                "Start composting food scraps that would otherwise go to waste",
                "Freeze leftovers before they spoil for later use",
            ])

        if data.recycling_habits in ("poor", "none", "minimal"):
            suggestions.extend([
                "Set up clearly labeled bins for paper, plastic, glass, and metal",
                "Learn your local recycling guidelines to avoid contamination",
                "Rinse containers before placing them in recycling bins",
            ])
        elif data.recycling_habits in ("moderate", "fair"):
            suggestions.extend([
                "Improve recycling consistency by setting up a convenient sorting system",
                "Research specialty recycling options for items like batteries and electronics",
            ])

        if waste_factor > 5:
            suggestions.append(
                "Your per-person waste generation is above average. Focus on reducing consumption at the source."
            )

        suggestions.extend([
            "Choose products with minimal packaging when shopping",
            "Support local producers to reduce transportation emissions",
            "Repair items instead of replacing them when possible",
        ])

        priority_actions = suggestions[:5]

        waste_reduction = min(35, 10 + (len(suggestions) * 3))
        co2_savings = round(data.weekly_waste * 0.5 * 52 / 1000, 1)
        energy_savings = min(25, 5 + (len(suggestions) * 2))

        return AdvisorResponse(
            suggestions=suggestions,
            priority_actions=priority_actions,
            estimated_impact={
                "waste_reduction_percent": str(waste_reduction),
                "co2_savings_kg_per_year": str(co2_savings),
                "energy_savings_percent": str(energy_savings),
            },
        )

    def _parse_response(self, text: str, data: AdvisorRequest) -> AdvisorResponse:
        lines = text.strip().split("\n")
        suggestions = []
        priority_actions = []
        estimated_impact = {}

        current_section = None
        for line in lines:
            line = line.strip()
            if not line:
                continue
            lower = line.lower()
            if "suggestion" in lower or "recommend" in lower:
                current_section = "suggestions"
                continue
            if "priority" in lower and ("action" in lower or "change" in lower):
                current_section = "priority"
                continue
            if "impact" in lower or "estimate" in lower:
                current_section = "impact"
                continue
            if line.startswith(("-", "•", "*", "1", "2", "3", "4", "5", "6", "7", "8", "9")):
                cleaned = line.lstrip("-•*0123456789. ")
                if current_section == "suggestions" and cleaned:
                    suggestions.append(cleaned)
                elif current_section == "priority" and cleaned:
                    priority_actions.append(cleaned)
                elif current_section == "impact" and ":" in cleaned:
                    key, val = cleaned.split(":", 1)
                    estimated_impact[key.strip()] = val.strip()

        if not suggestions:
            return self._generate_demo_response(data)

        if not priority_actions:
            priority_actions = suggestions[:5]
        if not estimated_impact:
            estimated_impact = {"waste_reduction_percent": "15", "co2_savings_kg_per_year": "50", "energy_savings_percent": "10"}

        return AdvisorResponse(
            suggestions=suggestions,
            priority_actions=priority_actions,
            estimated_impact=estimated_impact,
        )


advisor_service = AdvisorService()
