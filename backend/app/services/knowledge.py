import re

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.knowledge import KnowledgeDocument
from app.schemas.knowledge import KnowledgeDocumentCreate, KnowledgeDocumentResponse
from app.seed_data import get_seed_documents


class KnowledgeService:
    async def search_knowledge(
        self, db: AsyncSession, query: str, category: str | None = None
    ) -> list[KnowledgeDocumentResponse]:
        result = await db.execute(select(KnowledgeDocument))
        documents = result.scalars().all()

        query_words = set(re.findall(r"[a-z0-9]+", query.lower()))

        scored: list[tuple[KnowledgeDocument, float]] = []
        for doc in documents:
            if category and doc.category.lower() != category.lower():
                continue
            doc_text = f"{doc.title} {doc.content}".lower()
            doc_words = set(re.findall(r"[a-z0-9]+", doc_text))
            overlap = len(query_words & doc_words)
            if overlap > 0:
                scored.append((doc, overlap / max(len(query_words), 1)))

        scored.sort(key=lambda x: x[1], reverse=True)
        return [KnowledgeDocumentResponse.model_validate(doc) for doc, _ in scored[:20]]

    async def get_documents(
        self, db: AsyncSession, category: str | None = None
    ) -> list[KnowledgeDocumentResponse]:
        if category:
            result = await db.execute(
                select(KnowledgeDocument)
                .where(KnowledgeDocument.category == category)
                .order_by(KnowledgeDocument.created_at.desc())
            )
        else:
            result = await db.execute(
                select(KnowledgeDocument).order_by(KnowledgeDocument.created_at.desc())
            )
        documents = result.scalars().all()
        return [KnowledgeDocumentResponse.model_validate(d) for d in documents]

    async def add_document(
        self, db: AsyncSession, doc_data: KnowledgeDocumentCreate
    ) -> KnowledgeDocumentResponse:
        doc = KnowledgeDocument(
            title=doc_data.title,
            source=doc_data.source,
            category=doc_data.category,
            content=doc_data.content,
        )
        db.add(doc)
        await db.commit()
        await db.refresh(doc)
        return KnowledgeDocumentResponse.model_validate(doc)

    async def seed_knowledge_base(self, db: AsyncSession) -> int:
        result = await db.execute(select(KnowledgeDocument).limit(1))
        if result.scalar_one_or_none() is not None:
            return 0

        seed_docs = get_seed_documents()
        count = 0
        for doc_data in seed_docs:
            doc = KnowledgeDocument(**doc_data)
            db.add(doc)
            count += 1
        await db.commit()
        return count


knowledge_service = KnowledgeService()
