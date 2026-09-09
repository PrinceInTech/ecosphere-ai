from app.ai.base import AIService
from app.ai.demo_service import DemoAIService
from app.ai.granite_service import GraniteAIService
from app.config import settings


def get_ai_service() -> AIService:
    if settings.DEMO_MODE:
        return DemoAIService()
    if settings.IBM_GRANITE_API_KEY and settings.IBM_GRANITE_URL:
        return GraniteAIService()
    return DemoAIService()
