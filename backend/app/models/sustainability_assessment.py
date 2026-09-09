from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.connection import Base


class SustainabilityAssessment(Base):
    __tablename__ = "sustainability_assessments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    household_size: Mapped[int] = mapped_column(Integer)
    weekly_waste: Mapped[float] = mapped_column(Float)
    plastic_usage: Mapped[str] = mapped_column(String(50))
    food_waste: Mapped[str] = mapped_column(String(50))
    recycling_habits: Mapped[str] = mapped_column(String(50))
    recommendations: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
