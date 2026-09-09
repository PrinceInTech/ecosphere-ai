from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.api.advisor import router as advisor_router
from app.api.auth import router as auth_router
from app.api.chat import router as chat_router
from app.api.knowledge import router as knowledge_router
from app.api.waste import router as waste_router
from app.config import settings
from app.database.connection import init_db
from app.middleware.security import setup_middleware
from app.services.knowledge import knowledge_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    from app.database.connection import async_session
    async with async_session() as db:
        await knowledge_service.seed_knowledge_base(db)
    yield


app = FastAPI(
    title="EcoSphere AI",
    description="AI-Powered Sustainable Waste Management & Awareness Assistant",
    version="1.0.0",
    lifespan=lifespan,
)

setup_middleware(app)

app.include_router(auth_router)
app.include_router(waste_router)
app.include_router(chat_router)
app.include_router(knowledge_router)
app.include_router(advisor_router)


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "EcoSphere AI"}


@app.get("/api/demo-status")
async def demo_status():
    return {
        "demo_mode": settings.DEMO_MODE,
        "ai_service": "demo" if settings.DEMO_MODE or not settings.IBM_GRANITE_API_KEY else "granite",
        "ibm_granite_configured": bool(settings.IBM_GRANITE_API_KEY),
    }
