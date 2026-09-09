# EcoSphere AI — Internship Project Report

**AI-Powered Sustainable Waste Management & Awareness Assistant**

**1M1B AI for Sustainability** | In Collaboration with **IBM SkillsBuild** & **AICTE**

---

## 1. Project Title

**EcoSphere AI — AI-Powered Sustainable Waste Management & Awareness Assistant**

---

## 2. Student Name

[Student Name]

---

## 3. College Name

[College Name]

---

## 4. Problem Statement

Millions of tons of waste are generated globally each year, and a significant portion ends up in landfills due to improper segregation and a lack of awareness about sustainable waste management practices. Individuals, households, and communities often lack accessible, educational, and practical tools to:

- Correctly classify waste items and determine their recyclability
- Understand proper disposal methods for different waste categories
- Track their waste generation patterns and environmental impact
- Receive personalized guidance for adopting sustainable habits

Existing waste management solutions are either enterprise-level systems designed for municipalities, mobile apps that focus only on one aspect of waste, or educational resources that lack interactivity. There is a need for an integrated, AI-powered platform that makes waste management accessible, educational, and actionable for individuals and communities.

---

## 5. Target Users

| User Group | Needs Addressed |
|---|---|
| **Students** | Interactive tool for learning sustainability; practical project for courses |
| **Households** | Classify daily waste; get personalized tips to reduce household waste |
| **Communities** | Track collective recycling rates; promote awareness campaigns |
| **Sustainability Learners** | Comprehensive knowledge base; AI assistant for questions |
| **Waste-Management Programs** | Demo tool for workshops; analytics for reporting |

---

## 6. Existing Problem

The current landscape of waste management awareness faces several challenges:

1. **Knowledge Gap**: Most individuals do not know how to properly segregate waste. Common mistakes include recycling greasy cardboard, placing plastic bags in curbside bins, and disposing of batteries in regular trash.

2. **Fragmented Solutions**: Available tools tend to focus on one aspect (e.g., barcode scanning for product sustainability scores) rather than providing a comprehensive waste management experience.

3. **Lack of Personalization**: Generic advice does not account for individual household size, waste generation patterns, or existing habits.

4. **No Impact Tracking**: Individuals cannot see the tangible environmental impact of their waste management efforts, reducing motivation.

5. **Educational Barriers**: Sustainability education is often text-heavy and theoretical, lacking interactive tools that engage users.

---

## 7. Proposed Solution

EcoSphere AI is a full-stack web application that provides an integrated, AI-powered waste management and awareness platform. The solution combines:

1. **Waste Image Scanner**: Users upload photos of waste items and receive AI-powered classification including category, material, recyclability, disposal method, and environmental tips.

2. **AI Sustainability Assistant**: A Retrieval-Augmented Generation (RAG) powered chatbot that answers any waste management or sustainability question, citing sources from a curated knowledge base.

3. **Sustainability Advisor**: A personalized recommendation engine that analyzes household profiles and generates tailored action plans for reducing environmental impact.

4. **Analytics Dashboard**: Visual analytics showing waste composition trends, recycling rates, and material breakdowns.

5. **Impact Calculator**: Environmental impact metrics including estimated CO₂ savings, waste diversion rates, and SDG 12 contribution tracking.

6. **Knowledge Base**: A searchable, extensible library of sustainability resources covering waste segregation, recycling, composting, hazardous waste, and SDG 12.

7. **Responsible AI Page**: A dedicated page documenting the project's AI principles, transparency measures, and ethical commitments.

---

## 8. Why AI Is Needed

AI is essential to EcoSphere AI for several reasons:

- **Image Classification**: Manual waste classification requires specialized knowledge. AI can analyze images and provide instant classification with confidence scores, making waste identification accessible to anyone.

- **Conversational Knowledge Access**: Traditional knowledge bases require searching through documents. AI-powered RAG allows users to ask natural language questions and receive contextual answers with source citations.

- **Personalization at Scale**: AI can generate tailored recommendations for thousands of different household profiles without requiring manual content creation for each scenario.

- **Pattern Recognition**: AI analytics can identify trends in waste generation that humans might miss, providing actionable insights for behavior change.

- **Continuous Learning**: The pluggable AI architecture allows upgrading from demo mode to more sophisticated models (IBM Granite, and potentially computer vision models) as the system evolves.

---

## 9. AI Workflow

### 9.1 Waste Image Analysis Workflow

1. User uploads an image through the Scanner page
2. Backend validates file type (jpg, png, gif, webp) and size (max 10MB)
3. Image is saved to the server filesystem with a UUID filename
4. The AI Service analyzes the image:
   - **Demo Mode**: Extracts image properties (dimensions, aspect ratio) via Pillow; matches filename keywords against a curated response dictionary
   - **Granite Mode**: Sends a classification prompt to IBM Granite API; parses the JSON response
5. Results (category, material, recyclability, confidence, disposal method, tip, warning) are stored in the database
6. Results are displayed to the user with confidence scores

### 9.2 RAG-Powered Chat Workflow

1. User sends a message through the Assistant page
2. Backend creates or continues a conversation
3. The RAG Retriever:
   - Tokenizes the user query
   - Computes term frequency vectors
   - Calculates cosine similarity against all knowledge base documents
   - Returns top-3 most relevant documents
4. The RAG Generator:
   - Assembles retrieved documents as context
   - Constructs a prompt with the system prompt, context, and user query
   - Calls the AI Service to generate a response
5. Response and sources are saved to the database and returned to the user

### 9.3 Sustainability Advisor Workflow

1. User fills in household profile (size, waste, habits)
2. Backend constructs a detailed prompt from the profile data
3. The AI Service generates personalized recommendations
4. Response is parsed into suggestions, priority actions, and estimated impact
5. Results are saved and displayed with illustrative impact metrics

---

## 10. SDG Alignment

### Primary: SDG 12 — Responsible Consumption and Production

EcoSphere AI directly contributes to SDG 12 targets:

| Target | How EcoSphere AI Supports It |
|---|---|
| **12.3** — Reduce food waste by 50% by 2030 | Sustainability Advisor provides food waste reduction recommendations |
| **12.4** — Environmentally sound management of wastes | Waste Scanner provides correct disposal methods for each waste category |
| **12.5** — Substantially reduce waste generation | Promotes waste hierarchy: Reduce, Reuse, Recycle |
| **12.8** — Promote sustainability awareness | AI Assistant and Knowledge Base educate users on sustainable practices |
| **12.c** — Discourage wasteful consumption | Encourages mindful purchasing through advisor recommendations |

### Secondary: SDG 11 — Sustainable Cities and Communities

- Promotes household-level waste segregation contributing to cleaner communities
- Encourages participation in local composting and recycling programs
- Supports community-level awareness through shared analytics

### Secondary: SDG 13 — Climate Action

- Highlights methane emissions from organic waste in landfills
- Tracks estimated CO₂ savings from proper recycling and composting
- Promotes energy-saving habits through sustainability recommendations

---

## 11. System Architecture

### Architecture Overview

The application follows a three-tier architecture:

```
┌──────────────────────────────┐
│     Presentation Layer       │
│  React + Vite + TypeScript   │
└──────────────┬───────────────┘
               │ REST API
┌──────────────▼───────────────┐
│     Application Layer        │
│  FastAPI + Python            │
│  ┌─────────┐ ┌────────────┐ │
│  │ AI Svc  │ │ RAG Engine │ │
│  └─────────┘ └────────────┘ │
└──────────────┬───────────────┘
               │
┌──────────────▼──────────────┐
│       Data Layer             │
│  SQLAlchemy + SQLite/PG      │
└─────────────────────────────┘
```

### Key Architectural Decisions

1. **Pluggable AI Service**: Abstract `AIService` class with factory pattern allows switching between demo mode and IBM Granite without code changes.
2. **Async Backend**: FastAPI with async SQLAlchemy enables non-blocking I/O for better performance.
3. **RAG Pipeline**: TF-based retrieval with cosine similarity provides explainable, source-attributed AI responses.
4. **Optional Authentication**: Most features work without login, reducing barriers to adoption.
5. **Demo Mode by Default**: The application works out of the box without external API credentials.

---

## 12. Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Frontend | React | 19.x | UI library |
| Frontend | Vite | 8.x | Build tool and dev server |
| Frontend | TypeScript | 6.x | Type safety |
| Frontend | Tailwind CSS | 4.x | Styling |
| Frontend | React Router | 7.x | Client-side routing |
| Frontend | Recharts | 3.x | Data visualization |
| Frontend | lucide-react | 1.42.x | Icons |
| Frontend | react-hot-toast | 2.6.x | Notifications |
| Backend | Python | 3.14 | Runtime |
| Backend | FastAPI | 0.104.x | Web framework |
| Backend | SQLAlchemy | 2.0.x | ORM (async) |
| Backend | Pydantic | 2.5.x | Data validation |
| Backend | SQLite | — | Development database |
| Backend | python-jose | 3.3.x | JWT authentication |
| Backend | passlib + bcrypt | 1.7.4 / 4.1.2 | Password hashing |
| Backend | Pillow | 10.1.x | Image processing |
| Backend | httpx | 0.25.x | HTTP client |
| AI | IBM Granite | 3-8B-Instruct | LLM (when configured) |
| AI | TF-IDF / Cosine | Custom | RAG retrieval |
| DevOps | Docker | — | Containerization |

---

## 13. Prototype Features

### Feature 1: Waste Image Scanner
- Drag-and-drop or click-to-upload image interface
- Supports JPG, PNG, GIF, WEBP (max 10 MB)
- AI classification with category, material, recyclability, confidence score
- Disposal instructions and environmental tips for each item
- Safety warnings for hazardous waste

### Feature 2: AI Sustainability Assistant
- Chat interface with conversation history
- RAG-powered responses with source citations
- Knowledge base with 9+ articles on sustainability topics
- Supports questions on recycling, composting, hazardous waste, SDG 12, and more

### Feature 3: Sustainability Advisor
- Interactive form for household profile input
- Personalized recommendations based on waste habits
- Priority actions ranked by impact
- Estimated environmental impact (illustrative)

### Feature 4: Analytics Dashboard
- Category distribution pie chart
- Top materials bar chart
- Summary statistics (total analyses, recyclable rate, top material)

### Feature 5: Impact Calculator
- Total items analyzed and recyclable count
- Waste diversion rate with visual ring indicator
- Estimated CO₂ savings (illustrative)
- SDG 12 contribution statement

### Feature 6: Knowledge Base
- Searchable document library with categories
- Add custom documents
- 9 pre-seeded sustainability articles

### Feature 7: Responsible AI Page
- 6 AI principles documented
- Practical privacy and safety measures
- Architecture explanation with transparency

---

## 14. Responsible AI Considerations

EcoSphere AI implements responsible AI across six dimensions:

1. **Fairness**: Recommendations are general and avoid demographic or socioeconomic assumptions. The knowledge base provides equal guidance to all users.

2. **Transparency**: Demo mode is clearly labeled throughout the UI. Confidence scores are shown for all AI outputs. RAG responses list their sources.

3. **Ethics**: Hazardous waste guidance is safety-first. No harmful or misleading instructions are generated. The waste hierarchy (Reduce > Reuse > Recycle) is consistently promoted.

4. **Privacy**: Authentication is optional. Uploaded images use UUID filenames. Security headers protect against web vulnerabilities. No unnecessary personal data is collected.

5. **Honesty**: The system does not fabricate claims about its AI capabilities. Demo mode is transparently labeled. Impact estimates are clearly marked as illustrative.

6. **No Fabricated Facts**: Knowledge base content is factual and sourced. The system does not invent official policies or regulations. Local rule variations are acknowledged.

---

## 15. Privacy Considerations

- **Data Minimization**: Only essential data is collected. Authentication is optional.
- **Image Storage**: Uploaded images are stored temporarily on the server with UUID filenames, not publicly accessible.
- **Password Security**: Passwords are hashed with bcrypt; plain-text passwords are never stored or logged.
- **JWT Security**: Tokens have configurable expiration; signed with server-side secrets.
- **CORS Policy**: Only configured frontend origins can access the API.
- **No Third-Party Tracking**: No analytics trackers, advertising scripts, or third-party data sharing.
- **Environment Variables**: All secrets (API keys, database credentials) are stored in environment variables, not in code.

---

## 16. Expected Impact

When deployed and used by individuals and communities, EcoSphere AI is expected to:

- **Increase waste management awareness**: Users gain understanding of proper waste segregation and disposal methods through interactive AI assistance.
- **Encourage sustainable behavior change**: Personalized recommendations from the Sustainability Advisor motivate adoption of sustainable habits.
- **Improve recycling accuracy**: Image classification helps users correctly identify recyclable materials, reducing contamination in recycling streams.
- **Educate communities**: The knowledge base and AI assistant serve as accessible educational resources for sustainability programs.
- **Track progress**: Analytics and impact metrics allow users to see the tangible results of their waste management efforts.
- **Support SDG 12**: Every scan, chat, and recommendation contributes to the global effort toward Responsible Consumption and Production.

**Illustrative Estimate**: If 1,000 users each analyze 10 waste items per month, the platform would help correctly classify 10,000 items monthly. Assuming even a 10% improvement in correct recycling due to better classification knowledge, this could divert approximately 1,000 items per month from landfill. *(These figures are illustrative projections, not measured outcomes.)*

---

## 17. Limitations

1. **Demo Mode Accuracy**: In demo mode, classification is based on filename matching and image properties, not actual visual recognition. Results are illustrative.
2. **Knowledge Base Scope**: The knowledge base covers general sustainability guidance but does not address all local regulations or regional specifics.
3. **Simplified Impact Estimates**: Environmental metrics use simplified calculations (e.g., 0.5 kg CO₂ per recyclable item) and are not scientifically validated.
4. **No Computer Vision**: The prototype does not use real image classification models. Integration with TensorFlow or PyTorch models would be needed for production use.
5. **English Only**: The application is English-only and does not yet support multi-language accessibility.
6. **No User Feedback Loop**: There is no mechanism for users to correct AI classifications or provide feedback on response quality.
7. **Single-User Design**: The current architecture is designed for individual use and does not support multi-tenant or enterprise features.
8. **No Real-Time Image Processing**: Image analysis is synchronous and does not leverage GPU-accelerated inference.

---

## 18. Future Scope

1. **Computer Vision Integration**: Integrate actual image classification models (e.g., TensorFlow, PyTorch) for real waste recognition from photos.
2. **IBM Granite Full Integration**: Complete the production-grade integration with IBM Granite for high-quality AI responses.
3. **Multi-Language Support**: Add Hindi, Tamil, and other regional languages to broaden accessibility across India.
4. **Mobile Application**: Develop a React Native or Flutter mobile app for on-the-go waste scanning.
5. **Community Features**: Enable community dashboards, leaderboards, and collaborative waste tracking.
6. **IoT Integration**: Connect with smart bins and waste sensors for automated tracking.
7. **Municipal Partnerships**: Partner with local waste management authorities for region-specific disposal guides.
8. **Gamification**: Add points, badges, and sustainability challenges to encourage long-term behavior change.
9. **Advanced Analytics**: Implement predictive analytics for waste generation patterns and trend forecasting.
10. **API for Third Parties**: Expose APIs for schools, NGOs, and municipal programs to build upon.
11. **User Feedback System**: Allow users to correct AI classifications and improve the system over time.
12. **Offline Mode**: Enable basic functionality without internet through service workers and local storage.

---

## 19. Testing

### Automated Testing

- **Backend**: 16 pytest tests covering all API endpoints, authentication, image upload, chat, knowledge base, advisor, analytics, and impact
- **Frontend**: TypeScript build verification and oxlint code quality checks
- **Test Isolation**: Each test runs with a fresh database to ensure independence

### Manual Testing

A comprehensive manual testing checklist with 63 test cases across 12 sections verifies every user-facing feature:

- Landing page and navigation
- Dashboard stat cards and quick actions
- Waste image upload, analysis, and result display
- Chat interface, conversation history, and source attribution
- Advisor form input and recommendation output
- Analytics charts and summary statistics
- Impact metrics and diversion rate visualization
- Knowledge base search, filter, add, and expand
- Responsible AI principles and documentation
- Authentication flow (register, login, profile)
- API health and demo status endpoints

### Testing Commands

```bash
# Backend tests
cd backend && python -m pytest tests/ -v

# Frontend lint
cd frontend && npm run lint

# Frontend build (includes type-checking)
cd frontend && npm run build
```

---

## 20. Conclusion

EcoSphere AI demonstrates the practical application of artificial intelligence for sustainable waste management. By combining image analysis, RAG-powered conversational AI, personalized recommendations, and interactive analytics, the platform makes waste management knowledge accessible, engaging, and actionable.

The project successfully addresses the gap between complex waste management systems and individual awareness by providing an intuitive, educational, and AI-driven tool. The pluggable AI architecture ensures the system can evolve from demo mode to production-grade AI as resources become available.

Key achievements of the project include:

- A fully functional full-stack application with 8 interactive features
- Integration of AI across multiple touchpoints (image analysis, chat, advisor, analytics)
- A transparent and responsible AI framework with documented principles
- Direct alignment with SDG 12 (Responsible Consumption and Production)
- Comprehensive testing with 16 automated and 63 manual test cases
- A clean, extensible architecture ready for future enhancement

The project demonstrates that AI can be a powerful tool for environmental sustainability when built with responsibility, transparency, and user-centricity at its core. As the platform evolves with computer vision integration, multi-language support, and community features, it has the potential to contribute meaningfully to waste reduction efforts and SDG 12 targets.

---

**Report prepared as part of the 1M1B AI for Sustainability Internship Program**

**In collaboration with IBM SkillsBuild & AICTE**
