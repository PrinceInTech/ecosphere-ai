# EcoSphere AI — Demo Script

**Duration**: 5–7 minutes

**Preparation**:
- Backend running at `http://localhost:8000`
- Frontend running at `http://localhost:5173`
- Browser open to `http://localhost:5173`
- Have 2-3 sample waste images ready (e.g., plastic bottle.jpg, battery.jpg, apple_core.jpg)

---

## Step 1: Open Landing Page (30 seconds)

**What to do**:
1. Navigate to `http://localhost:5173`
2. Let the landing page load fully

**What to say**:
> "This is EcoSphere AI, an AI-powered sustainable waste management and awareness assistant. It's built as part of the 1M1B AI for Sustainability internship in collaboration with IBM SkillsBuild and AICTE. The application supports SDG 12 — Responsible Consumption and Production."

**What to show**:
- Hero section with the tagline "Manage Waste Sustainably"
- The SDG 12 badge
- The 6 feature cards: Waste Scanner, AI Assistant, Sustainability Advisor, Analytics, Impact Calculator, Knowledge Base
- The footer showing SDG 12 alignment

---

## Step 2: Explain the Problem (30 seconds)

**What to do**:
1. Stay on the landing page or scroll to the features section

**What to say**:
> "Globally, over 2 billion tonnes of waste are generated annually, and most of it ends up in landfills due to improper segregation. Individuals don't have easy tools to classify waste, understand disposal methods, or track their environmental impact. Only about 9% of all plastic ever produced has been recycled. EcoSphere AI addresses this gap by making waste management accessible, educational, and actionable through AI."

---

## Step 3: Open Dashboard (30 seconds)

**What to do**:
1. Click "Dashboard" in the navigation bar (or go to `/dashboard`)
2. Point out the stat cards

**What to say**:
> "The dashboard provides an overview of your waste management activity. It shows total analyses, recyclable rate, items analyzed, and estimated CO₂ savings. You can see quick-access cards to the Scanner and AI Assistant. As you use the app more, these metrics update in real-time."

**What to show**:
- Four stat cards: Total Analyses, Recyclable Rate, Items Analyzed, CO₂ Saved
- Quick-action cards for Scanner and Assistant
- The DemoBadge indicating the app is in demo mode

---

## Step 4: Upload Waste Image (1 minute)

**What to do**:
1. Navigate to `/scanner` (click "Scan Waste" or the Scanner nav link)
2. Click the upload area or drag-and-drop an image
3. Select a sample image (e.g., "plastic_bottle.jpg" or any image)
4. Click "Analyze Image"
5. Wait for results

**What to say**:
> "Let's scan a waste item. I'll upload an image here. The system validates the file type and size — it only accepts images under 10 megabytes. Once uploaded, the AI analyzes it and returns a classification. You can see the category, material, recyclability status, a confidence score, the recommended disposal method, and an environmental tip."

**What to show**:
- Image upload with drag-and-drop
- Loading spinner during analysis
- Result card showing: category (e.g., "plastic"), material (e.g., "PET #1 plastic"), recyclable (true/false), confidence (e.g., 0.97), disposal method, and environmental tip

---

## Step 5: Show AI Classification Results (30 seconds)

**What to do**:
1. Point to each field in the result card
2. Optionally scan a second image (e.g., "battery.jpg") to show a different result

**What to say**:
> "The result shows the waste is classified as plastic — specifically PET number 1, which is widely recyclable. The confidence score of 0.97 indicates high certainty. The disposal method says to rinse and place in the recycling bin. And there's an environmental tip: one recycled bottle saves enough energy to power a lightbulb for 3 hours. Let me also try a battery — this should show a safety warning since batteries are hazardous waste."

**What to show**:
- Comparison between a recyclable item and a hazardous item
- Safety warning on the battery result

---

## Step 6: Ask Sustainability Assistant a Question (1 minute)

**What to do**:
1. Navigate to `/assistant`
2. Type: "How do I recycle plastic bottles?"
3. Press Enter or click the send button
4. Wait for the AI response

**What to say**:
> "Now let's try the AI Sustainability Assistant. I'll ask a common question about recycling plastic bottles. The system uses Retrieval-Augmented Generation — it first searches the knowledge base for relevant documents, then generates a response using those documents as context. Notice that the response includes source references at the bottom."

**What to show**:
- Chat interface with user message and AI response
- Source references listed below the AI's response (e.g., "Recycling Guidelines (EcoSphere Knowledge Base)")
- Conversation appearing in the sidebar history

---

## Step 7: Demonstrate RAG Source/Reference (30 seconds)

**What to do**:
1. Point to the sources section of the AI response
2. Ask a second question to show a different source (e.g., "What about composting?")

**What to say**:
> "The sources at the bottom show exactly which knowledge base documents were used to generate this answer. This is what makes it Retrieval-Augmented Generation — the AI doesn't just make up answers; it retrieves real documents and uses them as context. If I ask about composting, you'll see different sources appear. The knowledge base is seeded with 9 articles on topics like waste segregation, recycling guidelines, e-waste, hazardous waste, and SDG 12."

**What to show**:
- Different sources appearing for different queries
- The Knowledge Base page briefly to show the seeded documents

---

## Step 8: Show Analytics (30 seconds)

**What to do**:
1. Navigate to `/analytics`
2. Show the charts if data exists, or explain the empty state

**What to say**:
> "The Analytics page visualizes your waste analysis history. After scanning several items, you'd see a category distribution pie chart and a top materials bar chart. It shows total analyses, recyclable rate, and your most common material. This helps you understand your waste patterns and identify areas for improvement."

**What to show**:
- Pie chart for category distribution (if data exists)
- Bar chart for top materials
- Summary stat cards

---

## Step 9: Show Impact Estimation (20 seconds)

**What to do**:
1. Navigate to `/impact`

**What to say**:
> "The Impact Calculator shows the environmental impact of your waste management efforts. It displays total items analyzed, recyclable items identified, estimated CO₂ savings, and a waste diversion rate. The diversion rate ring shows what percentage of your waste was identified as recyclable. Note that these are illustrative estimates — the actual impact varies by material and disposal method."

**What to show**:
- Impact stat cards
- Diversion rate circular progress indicator
- SDG 12 contribution statement
- Disclaimer about illustrative estimates

---

## Step 10: Explain Responsible AI (30 seconds)

**What to do**:
1. Navigate to `/responsible-ai`

**What to say**:
> "EcoSphere AI is built with responsible AI principles from day one. The page documents six core principles: Transparency — demo mode is clearly labeled and confidence scores are shown. Privacy — authentication is optional, uploads are validated. Fairness — no demographic assumptions. Ethics — safety-first guidance for hazardous waste. Honesty — we don't fabricate claims about AI capabilities. And No Fabricated Facts — all knowledge base content is factual and sources are cited. This page demonstrates our commitment to building AI that users can trust."

**What to show**:
- The 6 principle cards
- Practical measures section
- AI architecture explanation
- SDG 12 alignment statement

---

## Step 11: Conclude with SDG 12 Impact (20 seconds)

**What to do**:
1. Navigate back to the landing page or stay on Responsible AI

**What to say**:
> "EcoSphere AI directly contributes to SDG 12 — Responsible Consumption and Production. By making waste classification accessible through AI, educating users through the RAG-powered assistant, providing personalized sustainability recommendations, and tracking environmental impact, the platform empowers individuals and communities to take meaningful action. Thank you — I'm happy to take any questions."

---

## Timing Summary

| Step | Duration | Cumulative |
|---|---|---|
| 1. Landing Page | 0:30 | 0:30 |
| 2. Problem Statement | 0:30 | 1:00 |
| 3. Dashboard | 0:30 | 1:30 |
| 4. Image Upload | 1:00 | 2:30 |
| 5. Classification Results | 0:30 | 3:00 |
| 6. AI Assistant Question | 1:00 | 4:00 |
| 7. RAG Sources | 0:30 | 4:30 |
| 8. Analytics | 0:30 | 5:00 |
| 9. Impact Estimation | 0:20 | 5:20 |
| 10. Responsible AI | 0:30 | 5:50 |
| 11. Conclusion | 0:20 | 6:10 |

**Total**: ~6 minutes 10 seconds

---

## Tips for Delivery

1. **Keep the browser full-screen** so the audience can see the UI clearly
2. **Narrate as you navigate** — explain what you're doing before you do it
3. **If a feature loads slowly**, use the loading time to explain the backend process
4. **If demo mode responses seem repetitive**, acknowledge it: "In production with IBM Granite configured, responses would be more varied and context-specific"
5. **Have backup images ready** in case one doesn't produce interesting results
6. **Practice the flow at least twice** before presenting to ensure smooth navigation
7. **Be prepared for questions** about: How does RAG work? Why demo mode? How would this scale? What about data privacy?
