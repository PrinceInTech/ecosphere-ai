import httpx

from app.ai.base import AIService
from app.ai.demo_service import DemoAIService
from app.config import settings


class GraniteAIService(AIService):
    def __init__(self):
        self.api_key = settings.IBM_GRANITE_API_KEY
        self.api_url = settings.IBM_GRANITE_URL
        self.demo_fallback = DemoAIService()
        self.configured = bool(self.api_key and self.api_url)

    async def analyze_image(self, image_path: str, filename: str) -> dict:
        if not self.configured:
            return await self.demo_fallback.analyze_image(image_path, filename)
        try:
            prompt = "Classify this waste item and provide: category, material, recyclable status, confidence, disposal method, environmental tip, and safety warning."
            response = await self._call_api(prompt)
            return self._parse_waste_response(response, filename)
        except Exception:
            return await self.demo_fallback.analyze_image(image_path, filename)

    async def generate_response(self, prompt: str, context: str | None = None) -> str:
        if not self.configured:
            return await self.demo_fallback.generate_response(prompt, context)
        try:
            full_prompt = prompt
            if context:
                full_prompt = f"Context from knowledge base:\n{context}\n\nUser question: {prompt}"
            return await self._call_api(full_prompt)
        except Exception:
            return await self.demo_fallback.generate_response(prompt, context)

    async def classify_waste(self, image_path: str) -> dict:
        return await self.analyze_image(image_path, "classified_item")

    async def _call_api(self, prompt: str) -> str:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": "ibm/granite-3-8b-instruct",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 1024,
            "temperature": 0.7,
        }
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(self.api_url, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]

    def _parse_waste_response(self, response: str, filename: str) -> dict:
        try:
            import json
            text = response.strip()
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0]
            elif "```" in text:
                text = text.split("```")[1].split("```")[0]
            return json.loads(text)
        except Exception:
            return {
                "category": "other",
                "material": "Unknown material",
                "recyclable": False,
                "confidence": 0.5,
                "disposal_method": "Check local waste management guidelines for proper disposal.",
                "environmental_tip": "When in doubt about waste disposal, consult your local recycling authority.",
                "safety_warning": None,
            }
