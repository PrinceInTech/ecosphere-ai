from pydantic import BaseModel


class TopMaterialItem(BaseModel):
    material: str
    count: int


class AnalyticsResponse(BaseModel):
    total_analyses: int
    category_distribution: dict[str, int]
    recyclable_percentage: float
    top_materials: list[TopMaterialItem]


class ImpactResponse(BaseModel):
    total_items_analyzed: int
    recyclable_items: int
    diversion_rate: float
    estimated_co2_saved_kg: float
    waste_tips_given: int
