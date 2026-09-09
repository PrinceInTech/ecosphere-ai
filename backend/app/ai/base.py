from abc import ABC, abstractmethod


class AIService(ABC):
    @abstractmethod
    async def analyze_image(self, image_path: str, filename: str) -> dict:
        pass

    @abstractmethod
    async def generate_response(self, prompt: str, context: str | None = None) -> str:
        pass

    @abstractmethod
    async def classify_waste(self, image_path: str) -> dict:
        pass
