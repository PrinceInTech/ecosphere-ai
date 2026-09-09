# EcoSphere AI — Testing Documentation

## Overview

EcoSphere AI includes automated backend tests (pytest), frontend build verification, and a comprehensive manual testing checklist. This document describes how to run each type of test and provides a step-by-step guide for manual verification.

---

## Backend Testing

### Running Tests

```bash
cd backend

# Activate virtual environment (if not already active)
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Run all tests with verbose output
python -m pytest tests/ -v
```

### Test Suite Overview

The backend test suite (`backend/tests/test_api.py`) contains **16 async tests** using `pytest-asyncio` and `httpx.AsyncClient` for in-process API testing. Each test runs against a freshly created and destroyed database to ensure isolation.

| # | Test Name | What It Verifies |
|---|---|---|
| 1 | `test_health` | Health endpoint returns `{"status": "healthy"}` |
| 2 | `test_demo_status` | Demo status endpoint returns mode info |
| 3 | `test_image_upload_and_analysis` | Image upload returns valid waste analysis response with all required fields |
| 4 | `test_image_upload_invalid_type` | Non-image file upload is rejected with 400 status |
| 5 | `test_chat` | Sending a chat message returns a reply, sources, and conversation ID |
| 6 | `test_conversations` | After chatting, conversations list is non-empty |
| 7 | `test_conversation_messages` | Retrieving messages for a conversation returns at least 2 messages (user + assistant) |
| 8 | `test_knowledge_crud` | Knowledge base supports listing, creating, and searching documents |
| 9 | `test_knowledge_filter_by_category` | Knowledge documents can be filtered by category |
| 10 | `test_advisor` | Advisor returns suggestions, priority actions, and estimated impact |
| 11 | `test_analytics` | Analytics endpoint returns total analyses and category distribution |
| 12 | `test_impact` | Impact endpoint returns item counts, diversion rate, and CO₂ estimate |
| 13 | `test_history` | History endpoint returns a list |
| 14 | `test_auth_register` | User registration returns JWT token and user data |
| 15 | `test_auth_login` | User login returns JWT token after registration |
| 16 | `test_auth_me` | `/auth/me` returns the authenticated user's profile |

### Test Fixtures

- **`setup_db`** (autouse): Drops and recreates all tables before each test; seeds the knowledge base
- **`client`**: Creates an `httpx.AsyncClient` using FastAPI's `ASGITransport` for in-process testing (no actual HTTP server needed)

### Test Dependencies

Ensure these are installed (included in `requirements.txt`):
- `pytest`
- `pytest-asyncio`
- `httpx`
- `Pillow`

---

## Frontend Testing

### Lint Check

```bash
cd frontend
npm run lint
```

Runs **oxlint** to check for code quality issues, unused imports, and common mistakes.

### Build Verification

```bash
cd frontend
npm run build
```

Performs TypeScript type-checking (`tsc -b`) followed by a production Vite build. A successful build confirms:
- No TypeScript type errors
- All imports resolve correctly
- Production bundle builds without errors

### Expected Build Output

A successful build produces output in `frontend/dist/` with optimized static assets.

---

## Manual Testing Checklist

This checklist provides step-by-step verification for every feature. Follow each section in order.

### Prerequisites

1. Start the backend server: `cd backend && uvicorn app.main:app --reload --port 8000`
2. Start the frontend server: `cd frontend && npm run dev`
3. Open `http://localhost:5173` in a browser

---

### 1. Landing Page

| Step | Action | Expected Result |
|---|---|---|
| 1.1 | Open `http://localhost:5173` | Landing page loads with "EcoSphere AI" branding |
| 1.2 | Verify hero section | Shows title "Manage Waste Sustainably" and subtitle about SDG 12 |
| 1.3 | Check feature cards | 6 feature cards visible: Waste Scanner, AI Assistant, Sustainability Advisor, Analytics, Impact Calculator, Knowledge Base |
| 1.4 | Click "Start Scanning" | Navigates to `/scanner` |
| 1.5 | Go back, click "Chat with AI" | Navigates to `/assistant` |
| 1.6 | Verify footer | Shows "SDG 12 — Responsible Consumption & Production" |

### 2. Navigation

| Step | Action | Expected Result |
|---|---|---|
| 2.1 | Click each nav link | All 9 routes load correctly |
| 2.2 | Check active state | Current page's nav item is highlighted in green |
| 2.3 | Resize to mobile | Hamburger menu appears; clicking it opens mobile nav |
| 2.4 | Click a mobile nav item | Menu closes and navigates to the page |

### 3. Dashboard

| Step | Action | Expected Result |
|---|---|---|
| 3.1 | Navigate to `/dashboard` | Dashboard loads with stat cards |
| 3.2 | Check stat cards | Shows "Total Analyses", "Recyclable Rate", "Items Analyzed", "CO₂ Saved (est.)" |
| 3.3 | Click "Scan Waste" card | Navigates to `/scanner` |
| 3.4 | Go back, click "AI Assistant" card | Navigates to `/assistant` |
| 3.5 | Verify DemoBadge | Green demo mode badge is visible (if in demo mode) |

### 4. Waste Scanner

| Step | Action | Expected Result |
|---|---|---|
| 4.1 | Navigate to `/scanner` | Upload area with drag-and-drop zone is displayed |
| 4.2 | Click the upload area | File picker opens (image types only) |
| 4.3 | Select a JPG/PNG image | Image preview is displayed; "Analyze Image" button appears |
| 4.4 | Click "Analyze Image" | Loading spinner appears, then results are displayed |
| 4.5 | Verify result card | Shows: category, material, recyclable status, confidence, disposal method, environmental tip |
| 4.6 | Check if confidence is numeric | Confidence score is displayed as a decimal between 0 and 1 |
| 4.7 | Click X to reset | Image and results are cleared |
| 4.8 | Drag and drop an image | Image is accepted and previewed |
| 4.9 | Try uploading a non-image file | Should be rejected (or not selectable in file picker) |

### 5. AI Sustainability Assistant

| Step | Action | Expected Result |
|---|---|---|
| 5.1 | Navigate to `/assistant` | Empty chat interface with "Start a Conversation" prompt |
| 5.2 | Type "How do I recycle plastic bottles?" and press Enter | User message appears; AI responds with recycling information |
| 5.3 | Verify sources | Response includes source references from the knowledge base |
| 5.4 | Type another question | New messages are appended to the conversation |
| 5.5 | Check conversation history | Sidebar shows the current conversation in the history list |
| 5.6 | Click a previous conversation in history | Loads messages from that conversation |
| 5.7 | Verify auto-scroll | Chat scrolls to the latest message automatically |

### 6. Sustainability Advisor

| Step | Action | Expected Result |
|---|---|---|
| 6.1 | Navigate to `/advisor` | Form with household profile inputs is displayed |
| 6.2 | Set "Household Size" to 4 | Input shows 4 |
| 6.3 | Set "Weekly Waste" to 25 | Input shows 25 |
| 6.4 | Select "High" for Plastic Usage | Button is highlighted |
| 6.5 | Select "Moderate" for Food Waste | Button is highlighted |
| 6.6 | Select "Poor" for Recycling Habits | Button is highlighted |
| 6.7 | Click "Get Recommendations" | Loading spinner appears, then recommendations are displayed |
| 6.8 | Verify Priority Actions section | Shows prioritized list of actionable recommendations |
| 6.9 | Verify Suggestions section | Shows numbered list of sustainability suggestions |
| 6.10 | Verify Estimated Impact | Shows waste reduction %, CO₂ savings kg/year, energy savings % |
| 6.11 | Check disclaimer | "Illustrative estimates only" disclaimer is visible |

### 7. Analytics

| Step | Action | Expected Result |
|---|---|---|
| 7.1 | Navigate to `/analytics` | If no data: shows "No Data Yet" empty state |
| 7.2 | Scan 3+ waste items first | Then return to analytics |
| 7.3 | Verify summary cards | Total Analyses, Recyclable Rate, Top Material displayed |
| 7.4 | Verify pie chart | Category distribution shown as donut chart with legend |
| 7.5 | Verify bar chart | Top materials shown as bar chart with material names on x-axis |

### 8. Impact Calculator

| Step | Action | Expected Result |
|---|---|---|
| 8.1 | Navigate to `/impact` | If no data: shows "No Impact Data" empty state |
| 8.2 | Scan waste items first, then return | Impact metrics are displayed |
| 8.3 | Verify stat cards | Total Items, Recyclable Identified, CO₂ Saved (est.), Waste Tips Given |
| 8.4 | Verify diversion rate ring | Circular progress indicator shows diversion percentage |
| 8.5 | Verify SDG 12 section | Contribution statement references SDG 12 |
| 8.6 | Check disclaimer | "Illustrative estimate" disclaimer is visible |

### 9. Knowledge Base

| Step | Action | Expected Result |
|---|---|---|
| 9.1 | Navigate to `/knowledge` | List of seeded knowledge documents is displayed |
| 9.2 | Click a category filter | Documents are filtered by category |
| 9.3 | Search for "composting" | Relevant documents appear in results |
| 9.4 | Click a document card | Card expands to show full content |
| 9.5 | Click "Add Document" | Form for adding a new document appears |
| 9.6 | Fill in title, category, content, source | Fields accept input |
| 9.7 | Click "Add Document" button | Success toast appears; new document appears in the list |
| 9.8 | Search for the new document's title | New document appears in search results |

### 10. Responsible AI Page

| Step | Action | Expected Result |
|---|---|---|
| 10.1 | Navigate to `/responsible-ai` | Page loads with "Our AI Principles" heading |
| 10.2 | Verify principle cards | 6 principle cards: Transparency, Data Privacy, Fairness, Ethics & Safety, Honesty About AI, No Fabricated Facts |
| 10.3 | Verify practical measures | 3 measures: Input Validation, Accessible & Inclusive, Uncertainty Disclosure |
| 10.4 | Verify AI Architecture section | Shows AI Service Layer, RAG, Knowledge Base, Impact Estimates |
| 10.5 | Verify SDG 12 section | References SDG 12 alignment |

### 11. Authentication (Optional Flow)

| Step | Action | Expected Result |
|---|---|---|
| 11.1 | (Via API) POST to `/api/auth/register` with valid data | Returns JWT token and user object |
| 11.2 | (Via API) POST to `/api/auth/login` with registered credentials | Returns JWT token |
| 11.3 | (Via API) GET `/api/auth/me` with Bearer token | Returns authenticated user's profile |
| 11.4 | (Via API) GET `/api/auth/me` without token | Returns `null` |

### 12. API Health & Status

| Step | Action | Expected Result |
|---|---|---|
| 12.1 | GET `http://localhost:8000/api/health` | Returns `{"status": "healthy", "service": "EcoSphere AI"}` |
| 12.2 | GET `http://localhost:8000/api/demo-status` | Returns demo mode status and AI service type |
| 12.3 | Open `http://localhost:8000/docs` | Swagger UI opens with all endpoints documented |

---

## Test Coverage Summary

| Area | Automated Tests | Manual Tests | Total |
|---|---|---|---|
| Health/Status | 2 | 2 | 4 |
| Authentication | 3 | 4 | 7 |
| Waste Analysis | 2 | 10 | 12 |
| Chat | 3 | 7 | 10 |
| Knowledge Base | 2 | 8 | 10 |
| Advisor | 1 | 11 | 12 |
| Analytics | 1 | 5 | 6 |
| Impact | 1 | 6 | 7 |
| UI/Navigation | 0 | 10 | 10 |
| **Total** | **16** | **63** | **79** |

---

## Known Issues and Considerations

1. **Demo Mode Determinism**: Demo mode responses are deterministic based on filename hash. The same filename will always produce the same classification, which aids reproducible testing.
2. **No UI Tests**: The project currently does not include frontend unit tests or end-to-end tests. Adding React Testing Library tests and Playwright/Cypress E2E tests is recommended for future development.
3. **Database Cleanup**: Each pytest test creates and destroys a fresh database. No cleanup is needed between test runs.
4. **Upload Directory**: Uploaded test images persist in `backend/uploads/`. This directory is not cleaned up automatically.
