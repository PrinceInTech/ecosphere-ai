from datetime import datetime

from pydantic import BaseModel, computed_field


def derive_status(category: str, recyclable: bool) -> str:
    cat = (category or "").strip().lower()
    if not cat or cat in ("mixed", "other"):
        return "Not Recyclable"
    if cat == "organic":
        return "Compostable"
    if cat == "hazardous":
        return "Hazardous Waste"
    if cat == "electronic":
        return "Recyclable (E-Waste)" if recyclable else "Not Recyclable"
    if cat == "textile":
        return "Recyclable (Textile)" if recyclable else "Not Recyclable"
    return "Recyclable" if recyclable else "Not Recyclable"


class WasteAnalysisCreate(BaseModel):
    user_id: int | None = None
    image_filename: str
    category: str
    material: str
    recyclable: bool
    confidence: float
    disposal_method: str
    environmental_tip: str
    safety_warning: str | None = None


class WasteAnalysisResponse(BaseModel):
    id: int
    image_filename: str
    category: str
    material: str
    recyclable: bool
    confidence: float
    disposal_method: str
    environmental_tip: str
    safety_warning: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}

    @computed_field
    @property
    def status(self) -> str:
        return derive_status(self.category, self.recyclable)
