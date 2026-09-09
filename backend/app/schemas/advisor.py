from pydantic import BaseModel


class AdvisorRequest(BaseModel):
    household_size: int
    weekly_waste: float
    plastic_usage: str
    food_waste: str
    recycling_habits: str


class AdvisorResponse(BaseModel):
    suggestions: list[str]
    priority_actions: list[str]
    estimated_impact: dict[str, str]
