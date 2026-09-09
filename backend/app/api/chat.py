from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.models.user import User
from app.schemas.chat import ChatRequest, ChatResponse, ConversationListResponse
from app.services.auth import get_current_user
from app.services.chat import chat_service

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def send_message(
    data: ChatRequest,
    current_user: User | None = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    user_id = current_user.id if current_user else None
    conversation_id = data.conversation_id

    if conversation_id is None:
        conversation = await chat_service.create_conversation(db, user_id)
        conversation_id = conversation.id

    result = await chat_service.send_message(db, conversation_id, data.message, user_id)
    return ChatResponse(**result)


@router.get("/conversations", response_model=ConversationListResponse)
async def get_conversations(db: AsyncSession = Depends(get_db)):
    conversations = await chat_service.get_conversations(db)
    return ConversationListResponse(conversations=conversations)


@router.get("/conversations/{conversation_id}/messages")
async def get_conversation_messages(
    conversation_id: int,
    db: AsyncSession = Depends(get_db),
):
    return await chat_service.get_conversation_messages(db, conversation_id)
