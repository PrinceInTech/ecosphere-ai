from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.schemas.knowledge import (
    KnowledgeDocumentCreate,
    KnowledgeDocumentResponse,
    KnowledgeSearchRequest,
    KnowledgeSearchResponse,
)
from app.services.knowledge import knowledge_service

router = APIRouter(prefix="/api/knowledge", tags=["knowledge"])


@router.get("", response_model=list[KnowledgeDocumentResponse])
async def get_documents(
    category: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    return await knowledge_service.get_documents(db, category)


@router.post("", response_model=KnowledgeDocumentResponse)
async def add_document(
    data: KnowledgeDocumentCreate,
    db: AsyncSession = Depends(get_db),
):
    return await knowledge_service.add_document(db, data)


@router.post("/search", response_model=KnowledgeSearchResponse)
async def search_documents(
    data: KnowledgeSearchRequest,
    db: AsyncSession = Depends(get_db),
):
    results = await knowledge_service.search_knowledge(db, data.query, data.category)
    return KnowledgeSearchResponse(results=results, query=data.query)
