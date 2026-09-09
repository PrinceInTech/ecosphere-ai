import json

from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.factory import get_ai_service
from app.ai.prompts.sustainability_assistant import SYSTEM_PROMPT_SUSTAINABILITY_ASSISTANT
from app.rag.retriever import retrieve_relevant


class RAGGenerator:
    def __init__(self):
        self.ai_service = get_ai_service()

    async def generate(self, db: AsyncSession, query: str) -> dict:
        relevant_docs = await retrieve_relevant(db, query, top_k=3)

        context_parts = []
        sources = []
        for doc, score in relevant_docs:
            context_parts.append(f"Title: {doc.title}\nContent: {doc.content}")
            sources.append(f"{doc.title} ({doc.source})")

        context = "\n\n---\n\n".join(context_parts) if context_parts else None

        prompt = f"{SYSTEM_PROMPT_SUSTAINABILITY_ASSISTANT}\n\nUser question: {query}"

        response = await self.ai_service.generate_response(prompt, context)

        return {
            "response": response,
            "sources": sources,
        }


rag_generator = RAGGenerator()
