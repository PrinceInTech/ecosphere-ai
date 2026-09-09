import io
import json

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from PIL import Image

from app.database.connection import Base, async_session, engine
from app.main import app
from app.services.knowledge import knowledge_service


@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    async with async_session() as db:
        await knowledge_service.seed_knowledge_base(db)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


def _create_test_image() -> bytes:
    img = Image.new("RGB", (100, 100), color=(255, 0, 0))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.mark.asyncio
async def test_health(client: AsyncClient):
    response = await client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


@pytest.mark.asyncio
async def test_demo_status(client: AsyncClient):
    response = await client.get("/api/demo-status")
    assert response.status_code == 200
    data = response.json()
    assert "demo_mode" in data
    assert "ai_service" in data


@pytest.mark.asyncio
async def test_image_upload_and_analysis(client: AsyncClient):
    image_data = _create_test_image()
    response = await client.post(
        "/api/analyze-image",
        files={"file": ("test_image.png", image_data, "image/png")},
    )
    assert response.status_code == 200
    data = response.json()
    assert "category" in data
    assert "material" in data
    assert "recyclable" in data
    assert "status" in data
    assert "confidence" in data
    assert "disposal_method" in data
    assert "environmental_tip" in data


@pytest.mark.asyncio
async def test_result_status_matches_category(client: AsyncClient):
    cases = [
        ("organic_food.png", "organic", "Compostable"),
        ("plastic_bottle.png", "plastic", "Recyclable"),
        ("aluminum_can.png", "metal", "Recyclable"),
        ("glass_jar.png", "glass", "Recyclable"),
        ("paper_sheet.png", "paper", "Recyclable"),
        ("battery.png", "hazardous", "Hazardous Waste"),
        ("old_phone.png", "electronic", "Recyclable (E-Waste)"),
        ("old_shirt.png", "textile", "Recyclable (Textile)"),
        ("pizza_box.png", "paper", "Not Recyclable"),
        ("styrofoam_cup.png", "plastic", "Not Recyclable"),
    ]
    image_data = _create_test_image()
    for filename, expected_category, expected_status in cases:
        response = await client.post(
            "/api/analyze-image",
            files={"file": (filename, image_data, "image/png")},
        )
        assert response.status_code == 200, filename
        data = response.json()
        assert data["category"] == expected_category, filename
        assert data["status"] == expected_status, filename


@pytest.mark.asyncio
async def test_history_includes_status(client: AsyncClient):
    image_data = _create_test_image()
    await client.post(
        "/api/analyze-image",
        files={"file": ("organic_food.png", image_data, "image/png")},
    )
    response = await client.get("/api/history")
    assert response.status_code == 200
    items = response.json()
    assert isinstance(items, list)
    assert len(items) > 0
    assert items[0]["status"] == "Compostable"


@pytest.mark.asyncio
async def test_image_upload_invalid_type(client: AsyncClient):
    response = await client.post(
        "/api/analyze-image",
        files={"file": ("test.exe", b"fake content", "application/octet-stream")},
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_chat(client: AsyncClient):
    response = await client.post(
        "/api/chat",
        json={"message": "How do I recycle plastic bottles?"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert "conversation_id" in data
    assert "sources" in data


@pytest.mark.asyncio
async def test_conversations(client: AsyncClient):
    await client.post(
        "/api/chat",
        json={"message": "Hello, what is composting?"},
    )
    response = await client.get("/api/conversations")
    assert response.status_code == 200
    data = response.json()
    assert "conversations" in data
    assert len(data["conversations"]) > 0


@pytest.mark.asyncio
async def test_conversation_messages(client: AsyncClient):
    chat_resp = await client.post(
        "/api/chat",
        json={"message": "Tell me about recycling"},
    )
    conv_id = chat_resp.json()["conversation_id"]
    response = await client.get(f"/api/conversations/{conv_id}/messages")
    assert response.status_code == 200
    messages = response.json()
    assert len(messages) >= 2


@pytest.mark.asyncio
async def test_knowledge_crud(client: AsyncClient):
    response = await client.get("/api/knowledge")
    assert response.status_code == 200
    docs = response.json()
    assert len(docs) > 0

    new_doc = {
        "title": "Test Document",
        "source": "Test Source",
        "category": "test",
        "content": "This is a test document about sustainability.",
    }
    response = await client.post("/api/knowledge", json=new_doc)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Document"
    assert "id" in data

    search_resp = await client.post(
        "/api/knowledge/search",
        json={"query": "sustainability test"},
    )
    assert search_resp.status_code == 200
    results = search_resp.json()
    assert "results" in results


@pytest.mark.asyncio
async def test_knowledge_filter_by_category(client: AsyncClient):
    response = await client.get("/api/knowledge?category=waste-management")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_advisor(client: AsyncClient):
    response = await client.post(
        "/api/advisor",
        json={
            "household_size": 4,
            "weekly_waste": 25.0,
            "plastic_usage": "high",
            "food_waste": "medium",
            "recycling_habits": "moderate",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "suggestions" in data
    assert "priority_actions" in data
    assert "estimated_impact" in data
    assert len(data["suggestions"]) > 0


@pytest.mark.asyncio
async def test_analytics(client: AsyncClient):
    response = await client.get("/api/analytics")
    assert response.status_code == 200
    data = response.json()
    assert "total_analyses" in data
    assert "category_distribution" in data
    assert "recyclable_percentage" in data


@pytest.mark.asyncio
async def test_impact(client: AsyncClient):
    response = await client.get("/api/impact")
    assert response.status_code == 200
    data = response.json()
    assert "total_items_analyzed" in data
    assert "recyclable_items" in data
    assert "diversion_rate" in data
    assert "estimated_co2_saved_kg" in data


@pytest.mark.asyncio
async def test_history(client: AsyncClient):
    response = await client.get("/api/history")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_auth_register(client: AsyncClient):
    response = await client.post(
        "/api/auth/register",
        json={"username": "testuser", "email": "test@example.com", "password": "testpass123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["username"] == "testuser"


@pytest.mark.asyncio
async def test_auth_login(client: AsyncClient):
    await client.post(
        "/api/auth/register",
        json={"username": "loginuser", "email": "login@example.com", "password": "testpass123"},
    )
    response = await client.post(
        "/api/auth/login",
        json={"username": "loginuser", "password": "testpass123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data


@pytest.mark.asyncio
async def test_auth_me(client: AsyncClient):
    reg_resp = await client.post(
        "/api/auth/register",
        json={"username": "meuser", "email": "me@example.com", "password": "testpass123"},
    )
    token = reg_resp.json()["access_token"]
    response = await client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "meuser"
