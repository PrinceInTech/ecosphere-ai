import math
import re
from collections import Counter

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.knowledge import KnowledgeDocument


def _tokenize(text: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", text.lower())


def _compute_tf(tokens: list[str]) -> dict[str, float]:
    counts = Counter(tokens)
    total = len(tokens)
    if total == 0:
        return {}
    return {word: count / total for word, count in counts.items()}


def _cosine_similarity(vec1: dict[str, float], vec2: dict[str, float]) -> float:
    common_keys = set(vec1.keys()) & set(vec2.keys())
    if not common_keys:
        return 0.0
    dot_product = sum(vec1[k] * vec2[k] for k in common_keys)
    mag1 = math.sqrt(sum(v * v for v in vec1.values()))
    mag2 = math.sqrt(sum(v * v for v in vec2.values()))
    if mag1 == 0 or mag2 == 0:
        return 0.0
    return dot_product / (mag1 * mag2)


async def retrieve_relevant(
    db: AsyncSession, query: str, top_k: int = 3
) -> list[tuple[KnowledgeDocument, float]]:
    result = await db.execute(select(KnowledgeDocument))
    documents = result.scalars().all()

    query_tokens = _tokenize(query)
    query_tf = _compute_tf(query_tokens)

    scored_docs: list[tuple[KnowledgeDocument, float]] = []
    for doc in documents:
        doc_text = f"{doc.title} {doc.content}"
        doc_tokens = _tokenize(doc_text)
        doc_tf = _compute_tf(doc_tokens)
        score = _cosine_similarity(query_tf, doc_tf)
        if score > 0:
            scored_docs.append((doc, score))

    scored_docs.sort(key=lambda x: x[1], reverse=True)
    return scored_docs[:top_k]
