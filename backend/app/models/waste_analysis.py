from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.connection import Base


class WasteAnalysis(Base):
    __tablename__ = "waste_analyses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    image_filename: Mapped[str] = mapped_column(String(255))
    category: Mapped[str] = mapped_column(String(50))
    material: Mapped[str] = mapped_column(String(100))
    recyclable: Mapped[bool] = mapped_column(Boolean)
    confidence: Mapped[float] = mapped_column(Float)
    disposal_method: Mapped[str] = mapped_column(String(255))
    environmental_tip: Mapped[str] = mapped_column(String(500))
    safety_warning: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
