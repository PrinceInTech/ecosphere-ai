# EcoSphere AI — API Documentation

**Base URL**: `http://localhost:8000/api`

**Content-Type**: `application/json` (except file uploads)

**Authentication**: Optional JWT Bearer token via `Authorization: Bearer <token>` header

---

## Authentication Flow

EcoSphere AI supports optional authentication. Most features work without logging in, but authenticated users have their data associated with their account.

### Register

```
POST /api/auth/register
```

**Request Body**:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response** `200 OK`:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "is_active": true,
    "created_at": "2026-01-15T10:30:00"
  }
}
```

**Error** `400 Bad Request`:
```json
{
  "detail": "Username or email already registered"
}
```

### Login

```
POST /api/auth/login
```

**Request Body**:
```json
{
  "username": "johndoe",
  "password": "securepass123"
}
```

**Response** `200 OK`:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "is_active": true,
    "created_at": "2026-01-15T10:30:00"
  }
}
```

**Error** `401 Unauthorized`:
```json
{
  "detail": "Invalid username or password"
}
```

### Get Current User

```
GET /api/auth/me
```

**Headers**: `Authorization: Bearer <token>`

**Response** `200 OK`:
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "is_active": true,
  "created_at": "2026-01-15T10:30:00"
}
```

**Response** (unauthenticated): `null`

---

## System Endpoints

### Health Check

```
GET /api/health
```

**Response** `200 OK`:
```json
{
  "status": "healthy",
  "service": "EcoSphere AI"
}
```

### Demo Status

```
GET /api/demo-status
```

**Response** `200 OK`:
```json
{
  "demo_mode": true,
  "ai_service": "demo",
  "ibm_granite_configured": false
}
```

---

## Waste Analysis Endpoints

### Analyze Image

```
POST /api/analyze-image
```

**Content-Type**: `multipart/form-data`

**Request Body** (form field):
| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File | Yes | Image file (jpg, jpeg, png, gif, webp; max 10MB) |

**Example** (using curl):
```bash
curl -X POST http://localhost:8000/api/analyze-image \
  -F "file=@plastic_bottle.jpg"
```

**Response** `200 OK`:
```json
{
  "id": 1,
  "image_filename": "a1b2c3d4e5f6.png",
  "category": "plastic",
  "material": "PET (Polyethylene Terephthalate) - #1 plastic",
  "recyclable": true,
  "confidence": 0.97,
  "disposal_method": "Rinse and place in recycling bin. Remove cap if required by local guidelines.",
  "environmental_tip": "PET bottles can be recycled into new bottles, clothing fibers, or carpet. One recycled bottle saves enough energy to power a lightbulb for 3 hours.",
  "safety_warning": null,
  "created_at": "2026-01-15T10:35:00"
}
```

**Error** `400 Bad Request` (invalid file type):
```json
{
  "detail": "File type 'exe' not allowed. Supported: jpg, jpeg, png, gif, webp"
}
```

**Error** `413 Payload Too Large`:
```json
{
  "detail": "File too large. Maximum size: 10MB"
}
```

**Error** `400 Bad Request` (no file):
```json
{
  "detail": "No file provided"
}
```

### Get Analysis History

```
GET /api/history?limit=50
```

**Query Parameters**:
| Parameter | Type | Default | Description |
|---|---|---|---|
| `limit` | int | 50 | Maximum number of results |

**Response** `200 OK`:
```json
[
  {
    "id": 2,
    "image_filename": "f6g7h8i9j0k1.jpg",
    "category": "metal",
    "material": "Aluminum",
    "recyclable": true,
    "confidence": 0.99,
    "disposal_method": "Rinse and place in metal/aluminum recycling bin.",
    "environmental_tip": "Aluminum is infinitely recyclable...",
    "safety_warning": null,
    "created_at": "2026-01-15T11:00:00"
  }
]
```

### Get Analytics

```
GET /api/analytics
```

**Response** `200 OK`:
```json
{
  "total_analyses": 15,
  "category_distribution": {
    "plastic": 5,
    "paper": 4,
    "metal": 3,
    "organic": 2,
    "glass": 1
  },
  "recyclable_percentage": 73.3,
  "top_materials": [
    {"material": "PET (Polyethylene Terephthalate) - #1 plastic", "count": 3},
    {"material": "Aluminum", "count": 2},
    {"material": "Mixed paper / newspaper", "count": 2}
  ]
}
```

### Get Impact

```
GET /api/impact
```

**Response** `200 OK`:
```json
{
  "total_items_analyzed": 15,
  "recyclable_items": 11,
  "diversion_rate": 73.3,
  "estimated_co2_saved_kg": 5.5,
  "waste_tips_given": 15
}
```

> **Note**: `estimated_co2_saved_kg` is an illustrative estimate based on simplified assumptions (0.5 kg CO₂ per recyclable item). It is not a scientifically validated measurement.

---

## Chat Endpoints

### Send Message

```
POST /api/chat
```

**Request Body**:
```json
{
  "message": "How do I recycle plastic bottles?",
  "conversation_id": null
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `message` | string | Yes | The user's message text |
| `conversation_id` | int \| null | No | Existing conversation ID, or null to start a new one |

**Response** `200 OK`:
```json
{
  "reply": "Plastic recycling depends on the resin type (look for the number inside the recycling symbol). #1 PET (water bottles) and #2 HDPE (milk jugs) are most widely accepted...",
  "sources": [
    "Recycling Guidelines (EcoSphere Knowledge Base)",
    "Plastic Waste Management (EcoSphere Knowledge Base)"
  ],
  "conversation_id": 3
}
```

### Get Conversations

```
GET /api/conversations
```

**Response** `200 OK`:
```json
{
  "conversations": [
    {
      "id": 3,
      "title": "How do I recycle plastic bottles?",
      "created_at": "2026-01-15T10:45:00"
    },
    {
      "id": 2,
      "title": "What is composting?",
      "created_at": "2026-01-15T09:20:00"
    }
  ]
}
```

### Get Conversation Messages

```
GET /api/conversations/{conversation_id}/messages
```

**Path Parameters**:
| Parameter | Type | Description |
|---|---|---|
| `conversation_id` | int | The conversation ID |

**Response** `200 OK`:
```json
[
  {
    "id": 5,
    "role": "user",
    "content": "How do I recycle plastic bottles?",
    "sources": null,
    "created_at": "2026-01-15T10:45:00"
  },
  {
    "id": 6,
    "role": "assistant",
    "content": "Plastic recycling depends on the resin type...",
    "sources": ["Recycling Guidelines (EcoSphere Knowledge Base)"],
    "created_at": "2026-01-15T10:45:02"
  }
]
```

---

## Knowledge Base Endpoints

### List Documents

```
GET /api/knowledge
GET /api/knowledge?category=recycling
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|---|---|---|---|
| `category` | string | No | Filter by category |

**Response** `200 OK`:
```json
[
  {
    "id": 1,
    "title": "Waste Segregation Basics",
    "source": "EcoSphere Knowledge Base",
    "category": "waste-management",
    "content": "Waste segregation is the process of dividing waste into different categories...",
    "created_at": "2026-01-15T08:00:00"
  }
]
```

### Add Document

```
POST /api/knowledge
```

**Request Body**:
```json
{
  "title": "Local Composting Guide",
  "source": "Municipal Website",
  "category": "composting",
  "content": "Composting is a natural process of recycling organic matter..."
}
```

**Response** `200 OK`:
```json
{
  "id": 10,
  "title": "Local Composting Guide",
  "source": "Municipal Website",
  "category": "composting",
  "content": "Composting is a natural process of recycling organic matter...",
  "created_at": "2026-01-15T12:00:00"
}
```

### Search Documents

```
POST /api/knowledge/search
```

**Request Body**:
```json
{
  "query": "plastic recycling guidelines",
  "category": null
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `query` | string | Yes | Search query |
| `category` | string \| null | No | Optional category filter |

**Response** `200 OK`:
```json
{
  "results": [
    {
      "id": 2,
      "title": "Recycling Guidelines",
      "source": "EcoSphere Knowledge Base",
      "category": "recycling",
      "content": "Recycling transforms waste materials into new products...",
      "created_at": "2026-01-15T08:00:00"
    },
    {
      "id": 3,
      "title": "Plastic Waste Management",
      "source": "EcoSphere Knowledge Base",
      "category": "plastic-waste",
      "content": "Plastic pollution is one of the most pressing environmental challenges...",
      "created_at": "2026-01-15T08:00:00"
    }
  ],
  "query": "plastic recycling guidelines"
}
```

---

## Advisor Endpoint

### Get Recommendations

```
POST /api/advisor
```

**Request Body**:
```json
{
  "household_size": 4,
  "weekly_waste": 25.0,
  "plastic_usage": "high",
  "food_waste": "medium",
  "recycling_habits": "moderate"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `household_size` | int | Yes | Number of people in household (1-20) |
| `weekly_waste` | float | Yes | Estimated weekly waste in kg (1-100) |
| `plastic_usage` | string | Yes | "low", "moderate", or "high" |
| `food_waste` | string | Yes | "low", "moderate", or "high" |
| `recycling_habits` | string | Yes | "excellent", "good", "average", "poor", or "none" |

**Response** `200 OK`:
```json
{
  "suggestions": [
    "Switch to reusable water bottles and coffee cups to eliminate single-use plastics",
    "Use beeswax wraps or silicone lids instead of plastic wrap",
    "Buy products in bulk using your own containers to reduce plastic packaging",
    "Replace plastic bags with reusable shopping bags",
    "Plan weekly meals to buy only what you need",
    "Start composting food waste to divert it from landfills",
    "Choose products with minimal packaging when shopping",
    "Support local producers to reduce transportation emissions"
  ],
  "priority_actions": [
    "Switch to reusable water bottles and coffee cups to eliminate single-use plastics",
    "Use beeswax wraps or silicone lids instead of plastic wrap",
    "Buy products in bulk using your own containers to reduce plastic packaging",
    "Replace plastic bags with reusable shopping bags",
    "Plan weekly meals to buy only what you need"
  ],
  "estimated_impact": {
    "waste_reduction_percent": "34",
    "co2_savings_kg_per_year": "6.5",
    "energy_savings_percent": "21"
  }
}
```

> **Note**: `estimated_impact` values are illustrative estimates. They are calculated using simplified formulas and are not scientifically validated projections.

---

## Error Response Format

All error responses follow this format:

```json
{
  "detail": "Human-readable error message"
}
```

### Common HTTP Status Codes

| Code | Meaning |
|---|---|
| `200` | Success |
| `400` | Bad Request — invalid input or parameters |
| `401` | Unauthorized — missing or invalid authentication |
| `404` | Not Found — resource does not exist |
| `413` | Payload Too Large — file exceeds maximum size |
| `422` | Unprocessable Entity — validation error (FastAPI default) |
| `500` | Internal Server Error — unexpected server failure |

---

## CORS Policy

The backend accepts requests from the following origins:
- `http://localhost:5173` or `http://localhost:5174` (Vite dev server)
- `http://localhost:3000` (Docker frontend)

All HTTP methods and headers are allowed for these origins. Credentials (cookies, auth headers) are supported.

---

## Rate Limiting

The current prototype does not implement rate limiting. This should be added before production deployment.

---

## Interactive Documentation

When the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

These provide interactive API documentation generated from the FastAPI OpenAPI schema.
