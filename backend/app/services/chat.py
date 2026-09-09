import json

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.chat import ChatConversation, ChatMessage
from app.rag.generator import rag_generator
from app.schemas.chat import ConversationResponse


class ChatService:
    async def create_conversation(self, db: AsyncSession, user_id: int | None = None) -> ChatConversation:
        conversation = ChatConversation(user_id=user_id, title="New Conversation")
        db.add(conversation)
        await db.commit()
        await db.refresh(conversation)
        return conversation

    async def send_message(
        self, db: AsyncSession, conversation_id: int, message: str, user_id: int | None = None
    ) -> dict:
        result = await db.execute(
            select(ChatConversation).where(ChatConversation.id == conversation_id)
        )
        conversation = result.scalar_one_or_none()

        if conversation is None:
            conversation = await self.create_conversation(db, user_id)
            conversation_id = conversation.id

        user_msg = ChatMessage(
            conversation_id=conversation_id,
            role="user",
            content=message,
        )
        db.add(user_msg)

        rag_response = await rag_generator.generate(db, message)

        assistant_msg = ChatMessage(
            conversation_id=conversation_id,
            role="assistant",
            content=rag_response["response"],
            sources=json.dumps(rag_response["sources"]) if rag_response["sources"] else None,
        )
        db.add(assistant_msg)

        if conversation.title == "New Conversation":
            conversation.title = message[:80] + ("..." if len(message) > 80 else "")

        await db.commit()

        return {
            "reply": rag_response["response"],
            "sources": rag_response["sources"],
            "conversation_id": conversation_id,
        }

    async def get_conversations(self, db: AsyncSession) -> list[ConversationResponse]:
        result = await db.execute(
            select(ChatConversation).order_by(ChatConversation.created_at.desc())
        )
        conversations = result.scalars().all()
        return [ConversationResponse.model_validate(c) for c in conversations]

    async def get_conversation_messages(
        self, db: AsyncSession, conversation_id: int
    ) -> list[dict]:
        result = await db.execute(
            select(ChatMessage)
            .where(ChatMessage.conversation_id == conversation_id)
            .order_by(ChatMessage.created_at)
        )
        messages = result.scalars().all()
        return [
            {
                "id": m.id,
                "role": m.role,
                "content": m.content,
                "sources": json.loads(m.sources) if m.sources else None,
                "created_at": m.created_at.isoformat(),
            }
            for m in messages
        ]


chat_service = ChatService()
