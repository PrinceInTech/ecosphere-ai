# EcoSphere AI — Architecture Documentation

## High-Level Architecture

EcoSphere AI follows a three-tier architecture: Presentation Layer (Frontend), Application Layer (Backend API), and Data Layer (Database + Knowledge Base). The AI functionality is implemented as a pluggable service layer that abstracts the underlying AI provider.

```mermaid
graph TB
    subgraph "Presentation Layer"
        A[React + Vite Frontend]
        A1[Landing Page]
        A2[Dashboard]
        A3[Waste Scanner]
        A4[AI Assistant]
        A5[Sustainability Advisor]
        A6[Analytics]
        A7[Impact Calculator]
        A8[Knowledge Base]
        A9[Responsible AI]
    end

    subgraph "Application Layer"
        B[FastAPI Backend]
        B1[Auth Router]
        B2[Waste Router]
        B3[Chat Router]
        B4[Knowledge Router]
        B5[Advisor Router]
    end

    subgraph "AI Service Layer"
        C[AIService Abstraction]
        C1[DemoAIService]
        C2[GraniteAIService]
        C3[RAG Retriever]
        C4[RAG Generator]
    end

    subgraph "Data Layer"
        D[SQLAlchemy ORM]
        D1[(SQLite / PostgreSQL)]
        D2[(Knowledge Base)]
    end

    A -->|REST API| B
    A1 & A2 & A3 & A4 & A5 & A6 & A7 & A8 & A9 --> B
    B1 & B2 & B3 & B4 & B5 --> C
    C1 & C2 --> C
    C3 --> D2
    C4 --> C3
    C4 --> C
    D --> D1
    D2 --> D1
```

---

## System Components

### 1. Frontend (React + Vite + TypeScript)

**Location**: `frontend/src/`

The frontend is a single-page application (SPA) built with React 19, Vite 8, and TypeScript 6. It communicates with the backend exclusively through REST API calls defined in `frontend/src/services/api.ts`.

**Routing**: React Router 7 handles client-side routing with the following routes:

| Route | Page Component | Purpose |
|---|---|---|
| `/` | Landing | Marketing page with feature overview |
| `/dashboard` | Dashboard | Summary statistics and quick actions |
| `/scanner` | Scanner | Waste image upload and analysis |
| `/assistant` | Assistant | AI-powered chat interface |
| `/advisor` | Advisor | Household sustainability assessment form |
| `/analytics` | Analytics | Charts and data visualizations |
| `/impact` | Impact | Environmental impact metrics |
| `/knowledge` | Knowledge | Searchable knowledge base documents |
| `/responsible-ai` | ResponsibleAI | AI principles and transparency documentation |

**Component Architecture**:

```
src/
├── components/
│   ├── Layout.tsx          # Main layout with header, nav, footer
│   ├── LoadingSpinner.tsx  # Reusable loading indicator
│   ├── EmptyState.tsx      # Empty state placeholder
│   ├── ResultCard.tsx      # Waste analysis result display
│   └── DemoBadge.tsx       # Demo mode indicator badge
├── pages/                  # 9 page components
├── services/
│   └── api.ts              # All API client functions
└── types/
    └── index.ts            # TypeScript interfaces
```

**Key Design Decisions**:
- All API calls go through a centralized `request<T>()` function in `api.ts` for consistent error handling
- TypeScript interfaces match Pydantic schemas for type safety across the stack
- Toast notifications provide non-intrusive user feedback via `react-hot-toast`
- Charts use Recharts with a consistent green/teal color palette matching the sustainability theme

---

### 2. Backend (FastAPI + Python)

**Location**: `backend/app/`

The backend is an async Python application built with FastAPI. It uses SQLAlchemy 2.0 with async support for database operations and Pydantic 2.5 for request/response validation.

**Request Flow**:

```mermaid
graph LR
    R[HTTP Request] --> MW[Security Middleware]
    MW --> Router[API Router]
    Router --> Service[Service Layer]
    Service --> AI[AI Service]
    Service --> DB[(Database)]
    Service --> Resp[Response]
```

**Module Structure**:

```
backend/app/
├── main.py                  # FastAPI app creation, lifespan, router registration
├── config.py                # Pydantic Settings configuration
├── api/
│   ├── auth.py              # /api/auth/* endpoints
│   ├── waste.py             # /api/analyze-image, /api/history, /api/analytics, /api/impact
│   ├── chat.py              # /api/chat, /api/conversations/*
│   ├── knowledge.py         # /api/knowledge/*
│   └── advisor.py           # /api/advisor
├── models/
│   ├── user.py              # User model
│   ├── waste_analysis.py    # WasteAnalysis model
│   ├── chat.py              # ChatConversation + ChatMessage models
│   ├── knowledge.py         # KnowledgeDocument model
│   └── sustainability_assessment.py  # SustainabilityAssessment model
├── schemas/
│   ├── user.py              # UserCreate, UserLogin, UserResponse, Token
│   ├── waste.py             # WasteAnalysisCreate, WasteAnalysisResponse
│   ├── chat.py              # ChatRequest, ChatResponse, ConversationResponse
│   ├── knowledge.py         # KnowledgeDocumentCreate/Response, SearchRequest/Response
│   ├── advisor.py           # AdvisorRequest, AdvisorResponse
│   └── analytics.py         # AnalyticsResponse, ImpactResponse, TopMaterialItem
├── services/
│   ├── auth.py              # JWT creation, password hashing, user retrieval
│   ├── waste_analysis.py    # Image analysis orchestration
│   ├── chat.py              # Conversation and message management
│   ├── knowledge.py         # Knowledge base CRUD and search
│   ├── advisor.py           # Recommendation generation
│   └── analytics.py         # Analytics aggregation and insights
├── ai/
│   ├── base.py              # AIService abstract class
│   ├── factory.py           # get_ai_service() factory function
│   ├── demo_service.py      # DemoAIService (curated local responses)
│   ├── granite_service.py   # GraniteAIService (IBM Granite API)
│   └── prompts/
│       ├── sustainability_assistant.py
│       ├── advisor.py
│       ├── waste_classification.py
│       └── insights.py
├── rag/
│   ├── retriever.py         # TF-based document retrieval with cosine similarity
│   └── generator.py         # RAG prompt assembly and response generation
├── database/
│   └── connection.py        # Async engine, session factory, Base, init_db()
├── middleware/
│   └── security.py          # CORS, security headers, request logging
└── seed_data.py             # Initial knowledge base documents (9 articles)
```

---

### 3. AI Service Layer

The AI service layer uses the **Abstract Factory + Strategy pattern** to allow switching between AI providers without changing any calling code.

```mermaid
classDiagram
    class AIService {
        <<abstract>>
        +analyze_image(image_path, filename) dict
        +generate_response(prompt, context) str
        +classify_waste(image_path) dict
    }

    class DemoAIService {
        +analyze_image(image_path, filename) dict
        +generate_response(prompt, context) str
        +classify_waste(image_path) dict
    }

    class GraniteAIService {
        -api_key: str
        -api_url: str
        -demo_fallback: DemoAIService
        +analyze_image(image_path, filename) dict
        +generate_response(prompt, context) str
        +classify_waste(image_path) dict
    }

    class get_ai_service {
        <<factory>>
        returns AIService
    }

    AIService <|-- DemoAIService
    AIService <|-- GraniteAIService
    get_ai_service ..> AIService
```

**Decision Logic** (`ai/factory.py`):
1. If `DEMO_MODE=true` → return `DemoAIService`
2. Else if `IBM_GRANITE_API_KEY` and `IBM_GRANITE_URL` are set → return `GraniteAIService`
3. Otherwise → return `DemoAIService` (fallback)

**DemoAIService** uses:
- Filename keyword matching + image property analysis (dimensions, aspect ratio via Pillow) for classification
- A curated dictionary of 15+ waste item responses with factual disposal information
- Keyword-matched chat responses for common sustainability topics (20+ topics)
- MD5 hashing of filenames for deterministic variation in confidence scores

**GraniteAIService** uses:
- HTTP calls to IBM Granite API (`ibm/granite-3-8b-instruct` model) via httpx
- Falls back to DemoAIService on any API error
- Parses JSON responses from the LLM for waste classification

---

### 4. RAG (Retrieval-Augmented Generation)

The RAG system enhances chat responses by retrieving relevant knowledge base documents before generating responses.

```mermaid
graph LR
    U[User Query] --> R[Retriever]
    R --> DB[(Knowledge Base)]
    R --> |"Top 3 docs + scores"| G[Generator]
    G --> AI[AI Service]
    AI --> |"Prompt + Context"| Resp[Response]
    G --> |"Sources"| Resp
```

**Retriever** (`rag/retriever.py`):
- Tokenizes the user query and all knowledge documents
- Computes Term Frequency (TF) vectors for each
- Calculates cosine similarity between query and each document
- Returns top-K documents ranked by similarity score

**Generator** (`rag/generator.py`):
- Assembles retrieved document titles and content as context
- Constructs a prompt combining the system prompt, context, and user query
- Calls the AI service to generate a response
- Returns the response along with source references

**Knowledge Base** (`seed_data.py`):
- 9 pre-seeded articles covering: waste segregation, recycling guidelines, plastic waste, e-waste, composting, hazardous waste, sustainable consumption, SDG 12, and water conservation
- Each article has: title, source, category, and content
- Users can add custom documents through the Knowledge page
- Search uses keyword overlap scoring for filtering

---

## Data Flow Descriptions

### Flow 1: Waste Image Analysis

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as Backend API
    participant WS as WasteAnalysisService
    participant AI as AIService
    participant DB as Database

    U->>FE: Upload image
    FE->>API: POST /api/analyze-image (multipart)
    API->>API: Validate file type and size
    API->>WS: analyze_image(content, filename, user_id)
    WS->>WS: Save image to uploads/ directory
    WS->>AI: analyze_image(image_path, filename)
    AI-->>WS: {category, material, recyclable, confidence, ...}
    WS->>DB: INSERT INTO waste_analyses
    DB-->>WS: Record created
    WS-->>API: WasteAnalysisResponse
    API-->>FE: JSON response
    FE-->>U: Display classification results
```

### Flow 2: Chat with RAG

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as Backend API
    participant CS as ChatService
    participant RG as RAGGenerator
    participant RET as Retriever
    participant DB as Database
    participant AI as AIService

    U->>FE: Type message
    FE->>API: POST /api/chat {message}
    API->>CS: send_message(db, conv_id, message)
    CS->>CS: Save user message to DB
    CS->>RG: generate(db, query)
    RG->>RET: retrieve_relevant(db, query, top_k=3)
    RET->>DB: SELECT knowledge_documents
    DB-->>RET: All documents
    RET-->>RG: Top 3 documents + similarity scores
    RG->>RG: Assemble context from documents
    RG->>AI: generate_response(prompt, context)
    AI-->>RG: Response text
    RG-->>CS: {response, sources}
    CS->>CS: Save assistant message to DB
    CS-->>API: {reply, sources, conversation_id}
    API-->>FE: JSON response
    FE-->>U: Display response with sources
```

### Flow 3: Sustainability Advisor

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as Backend API
    participant ADV as AdvisorService
    participant AI as AIService
    participant DB as Database

    U->>FE: Fill household form
    FE->>API: POST /api/advisor {household_size, weekly_waste, ...}
    API->>ADV: generate_recommendations(data, db)
    ADV->>ADV: Build prompt from user profile
    ADV->>AI: generate_response(full_prompt)
    alt AI responds successfully
        AI-->>ADV: Response text
        ADV->>ADV: Parse response into suggestions/priority/impact
    else AI fails (demo/error)
        ADV->>ADV: _generate_demo_response(data)
    end
    ADV->>DB: INSERT INTO sustainability_assessments
    ADV-->>API: AdvisorResponse
    API-->>FE: JSON response
    FE-->>U: Display recommendations + impact estimates
```

---

## Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    users {
        int id PK
        string username UK
        string email UK
        string hashed_password
        boolean is_active
        datetime created_at
    }

    waste_analyses {
        int id PK
        int user_id FK "nullable"
        string image_filename
        string category
        string material
        boolean recyclable
        float confidence
        string disposal_method
        string environmental_tip
        string safety_warning "nullable"
        datetime created_at
    }

    chat_conversations {
        int id PK
        int user_id FK "nullable"
        string title
        datetime created_at
    }

    chat_messages {
        int id PK
        int conversation_id FK
        string role "user or assistant"
        text content
        text sources "nullable, JSON array"
        datetime created_at
    }

    knowledge_documents {
        int id PK
        string title
        string source
        string category
        text content
        datetime created_at
    }

    sustainability_assessments {
        int id PK
        int user_id "nullable"
        int household_size
        float weekly_waste
        string plastic_usage
        string food_waste
        string recycling_habits
        text recommendations "nullable, JSON"
        datetime created_at
    }

    users ||--o{ waste_analyses : "produces"
    users ||--o{ chat_conversations : "starts"
    users ||--o{ sustainability_assessments : "completes"
    chat_conversations ||--o{ chat_messages : "contains"
```

### Table Descriptions

**`users`**: Stores registered user accounts. Authentication uses bcrypt password hashing and JWT tokens. Users are optional for most features (the app works without authentication).

**`waste_analyses`**: Records each waste image analysis including the AI's classification result. Stores the uploaded image filename, category, material, recyclability status, confidence score, disposal method, environmental tip, and optional safety warning.

**`chat_conversations`**: Groups chat messages into conversations. Auto-titles are generated from the first user message.

**`chat_messages`**: Individual messages within a conversation. Stores the role (user/assistant), content, and optional JSON-serialized source references for RAG responses.

**`knowledge_documents`**: The knowledge base that powers RAG retrieval. Seeded with 9 sustainability articles on startup. Extensible through the API and Knowledge page.

**`sustainability_assessments`**: Records household sustainability assessments submitted through the Advisor. Stores input parameters and generated recommendations for analytics.

---

## Middleware

Three middleware layers are applied to every request:

1. **CORS Middleware**: Allows configured origins (`localhost:5173`, `localhost:5174`, `localhost:3000`) to make cross-origin requests with credentials
2. **Security Headers Middleware**: Adds HTTP security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Strict-Transport-Security`, `Referrer-Policy`)
3. **Request Logging Middleware**: Logs method, path, status code, and response time for every request

---

## Deployment Architecture

### Docker Compose

```mermaid
graph TB
    subgraph "Docker Network: ecosphere-net"
        B[Backend Container<br/>Port 8000]
        F[Frontend Container<br/>Port 3000 → 80]
        V[(db-data Volume)]
    end

    B --> V
```

- **Backend Container**: Built from `backend/Dockerfile`; runs FastAPI with uvicorn; data persisted in `db-data` volume
- **Frontend Container**: Built from `frontend/Dockerfile`; serves static build via nginx on port 80
- **Network**: Bridge network `ecosphere-net` connects both services
- **Database Persistence**: Named volume `db-data` ensures SQLite data survives container restarts
