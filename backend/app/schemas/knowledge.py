from datetime import datetime

from pydantic import BaseModel


class KnowledgeDocumentCreate(BaseModel):
    title: str
    source: str
    category: str
    content: str


class KnowledgeDocumentResponse(BaseModel):
    id: int
    title: str
    source: str
    category: str
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}


class KnowledgeSearchRequest(BaseModel):
    query: str
    category: str | None = None


class KnowledgeSearchResponse(BaseModel):
    results: list[KnowledgeDocumentResponse]
    query: str
