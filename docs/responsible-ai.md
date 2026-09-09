# EcoSphere AI — Responsible AI Documentation

## Overview

EcoSphere AI is committed to building AI systems that are fair, transparent, ethical, and privacy-respecting. This document outlines the principles, practices, and practical measures implemented throughout the application to ensure responsible AI usage.

---

## 1. Fairness

**Principle**: AI recommendations should be equitable and free from bias.

**Implemented Practices**:

- **Neutral Knowledge Base**: The knowledge base provides general sustainability guidance that is equally applicable to all users regardless of demographics, geography, income level, or community type.
- **No Demographic Assumptions**: The Sustainability Advisor generates recommendations based solely on waste-related inputs (household size, waste volume, habits). It does not make assumptions about socioeconomic status, cultural background, or geographic location.
- **Equal Access**: The application works without mandatory authentication, ensuring all features are accessible to any user without creating barriers.
- **No Discriminatory Language**: System prompts instruct the AI to use inclusive, encouraging language without making value judgments about user behavior.

**Limitations to Acknowledge**:

- The knowledge base is written in English and may not reflect regional waste management specifics for all communities.
- Demo mode responses are pre-written and may not cover all possible waste scenarios equally.
- The Sustainability Advisor's demo mode uses rule-based logic that may not capture the full nuance of diverse household situations.

---

## 2. Transparency

**Principle**: Users should understand how AI is being used and what its limitations are.

**Implemented Practices**:

### Demo Mode Disclosure

- A visible `DemoBadge` component is displayed on every page when the application is running in demo mode (`DEMO_MODE=true`).
- The `/api/demo-status` endpoint exposes the current AI service mode (demo or granite) and whether external AI credentials are configured.
- The Responsible AI page explicitly explains the difference between demo mode and configured AI mode.

### Confidence Scores

- Every waste analysis result includes a `confidence` score (0.0 to 1.0) indicating the AI's certainty in its classification.
- Low-confidence results prompt users to verify classification accuracy.

### Source Attribution

- RAG-powered chat responses include a `sources` array listing which knowledge base documents were used to generate the response.
- Users can trace AI responses back to their source materials.

### Architecture Disclosure

- The Responsible AI page explains the AI service layer architecture: the pluggable abstraction, the factory pattern, and the fallback behavior.
- The distinction between IBM Granite (real LLM) and Demo Service (local responses) is clearly documented.

---

## 3. Ethics

**Principle**: AI should be used to benefit users and the environment without causing harm.

**Implemented Practices**:

- **Safety-First Hazardous Waste Guidance**: When hazardous waste is identified (batteries, chemicals, e-waste), the system provides safety warnings and directs users to proper disposal facilities rather than suggesting home handling.
- **No Harmful Instructions**: The AI system prompts explicitly instruct against generating harmful, discriminatory, misleading, or dangerous disposal instructions.
- **Encouragement Over Shame**: The advisor and assistant use supportive, encouraging language. Users are not shamed for poor recycling habits but are guided toward improvement.
- **Waste Hierarchy Promotion**: The system consistently promotes the environmental waste hierarchy: Reduce, Reuse, Recycle — emphasizing that reducing consumption is the most impactful action.
- **Honest Limitations**: The system does not overstate its capabilities. Demo mode does not claim to perform real image recognition. Impact estimates are labeled as illustrative.

---

## 4. Privacy

**Principle**: User data should be collected minimally, stored securely, and never exposed unnecessarily.

**Implemented Practices**:

### Data Minimization

- Authentication is optional. Users can use all features without creating an account.
- No personal information is collected beyond what is strictly necessary for the features being used.
- Uploaded images are associated with a user ID only if the user is authenticated; otherwise, they are anonymous.

### Input Validation

- Image uploads are restricted by file type (jpg, jpeg, png, gif, webp) and size (maximum 10 MB).
- Invalid and oversized files are rejected with clear error messages, protecting both users and the system from malicious uploads.
- All API inputs are validated through Pydantic schemas, rejecting malformed requests.

### Storage Practices

- Uploaded images are stored on the server filesystem in an `uploads/` directory with UUID-based filenames to prevent path traversal and filename conflicts.
- Images are not publicly accessible through any static file serving route.
- Database credentials and secrets are stored in environment variables, not in code.

### Security Headers

The following security headers are applied to all responses:
- `X-Content-Type-Options: nosniff` — Prevents MIME type sniffing
- `X-Frame-Options: DENY` — Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` — Enables XSS filtering
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` — Enforces HTTPS
- `Referrer-Policy: strict-origin-when-cross-origin` — Controls referrer information

### Authentication Security

- Passwords are hashed using bcrypt with salt (via passlib).
- JWT tokens have configurable expiration (default: 60 minutes).
- Tokens are signed with a server-side secret key.
- The `SECRET_KEY` environment variable must be changed in production.

---

## 5. Practical Measures Implemented

### Per-Feature AI Transparency

| Feature | Transparency Measure |
|---|---|
| Waste Scanner | Confidence score displayed; demo badge shown; results labeled as AI-generated |
| AI Assistant | Sources listed for each response; demo badge shown; responses attributed to knowledge base |
| Sustainability Advisor | Impact estimates labeled as "est."; disclaimer shown below results |
| Analytics | Data labeled as user-specific; no fabricated population-level claims |
| Impact Calculator | Clear disclaimer: "Illustrative estimate — actual environmental impact varies" |

### UI-Level Measures

- **DemoBadge Component**: Persistent visual indicator on every page when in demo mode
- **Disclaimer Texts**: Impact and advisor pages include explicit disclaimers about estimate accuracy
- **Responsible AI Page**: Dedicated page explaining all AI principles, architecture, and limitations in plain language
- **Error Handling**: Failed AI requests fall back gracefully to demo responses rather than showing cryptic errors

### System-Level Measures

- **Graceful Fallback**: If the IBM Granite API fails, the system falls back to demo mode rather than crashing
- **Request Validation**: All inputs are type-checked and size-limited before processing
- **Security Middleware**: HTTP security headers protect against common web vulnerabilities
- **CORS Policy**: Only configured frontend origins can access the API

---

## 6. AI Honesty — No Fabricated Claims

**Principle**: The AI system must never fabricate facts, claim capabilities it doesn't have, or misrepresent its outputs.

### What the System Does NOT Do

- Does NOT claim that demo mode performs real computer vision or image recognition
- Does NOT fabricate official waste management policies or regulations as facts
- Does NOT present illustrative environmental estimates as scientifically validated measurements
- Does NOT claim that an external AI model (IBM Granite) is being used when it is not
- Does NOT generate fabricated sources or citations
- Does NOT make medical, legal, or safety claims beyond general waste management guidance

### What the System DOES Do

- Labels demo mode clearly throughout the UI
- Presents waste management content as general guidance, noting that local rules may differ
- Shows confidence scores for AI classifications
- Lists actual source documents for RAG responses
- Includes disclaimers on all estimated metrics
- Falls back honestly to demo mode when real AI is unavailable

### Content Standards

- All knowledge base content is factual, general-purpose sustainability guidance
- Environmental statistics referenced in chat responses (e.g., "aluminum recycling saves 95% of energy") are based on well-established industry data
- The system does not make specific claims about a user's environmental impact beyond what can be reasonably calculated from the data provided

---

## Limitations and Areas for Improvement

1. **Bias in Demo Responses**: The curated demo responses may not cover all cultural or regional waste management practices. Expanding the response library would improve inclusivity.
2. **Language**: The application is English-only. Extending to other languages would improve accessibility for diverse communities.
3. **No User Feedback Mechanism**: There is currently no way for users to flag incorrect AI responses. Adding a feedback mechanism would help improve accuracy over time.
4. **Knowledge Base Curation**: The knowledge base content is authored by the development team. Periodic review by domain experts would ensure continued accuracy.
5. **Image Storage**: Uploaded images are stored without encryption at rest. Implementing encryption would strengthen privacy protections.
6. **No Audit Logging**: While request logging exists, there is no dedicated audit trail for AI decisions. Implementing structured AI decision logging would improve accountability.
