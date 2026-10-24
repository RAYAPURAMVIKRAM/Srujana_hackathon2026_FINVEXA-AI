# FINVEXA 🛡️
### Universal Financial Digital Twin & Multi-Risk Decision Engine

FINVEXA is a next-generation predictive financial simulator and cashflow defense platform engineered for individuals, creators, and MSMEs. Powered by real-time stress testing, Gemini AI document intelligence, and a 60 FPS interactive 3D WebGL core, FINVEXA turns complex balance sheets into 8th-grade simple, actionable insights.

---

## 🌟 5 Core Pillars

### 1. 8th-Grade Crystal-Clear Financial English (Zero Jargon)
All financial jargon has been translated into everyday English:
- **Money Safe in Bank Right Now** *(Current Liquidity Position)*
- **How Much Money You Will Be Short Next Month** *(30-Day Stress Shortage / Deficit)*
- **Untouchable Money (Rent, Salaries & Fees)** *(Locked Survival Reserves)*
- **Sneaky Hidden Fees & Forgotten Bills** *(Hidden Expense Discovery / Tariff Creep)*
- **Loan Trust Score & How to Get Approved Fast** *(Counterfactual Creditworthiness Assessment)*
- **3 Easy Ways to Fix This Without Going Broke** *(Pareto-Optimal Rescue Strategies)*
- **What You Think Will Happen (Green) vs Real Life After Delays & Hidden Costs (Red)** *(Naive Expected Balance vs Stress-Tested Reality)*

### 2. 3 100% Unique Personas & Custom Scenarios
- **👤 Student & Job Holder**: Buying a ₹55,000 Laptop/Bike while keeping ₹18,000 Hostel Rent & College Fees safe. Tracks ₹3,200 1 AM food deliveries, ₹199 forgotten auto-debits, and friend bill splits.
- **💻 Freelancer & Creator**: Purchasing ₹45,000 Camera/Studio gear while a client delays a ₹65,000 project invoice by 22 days. Identifies unverified WhatsApp UPI screenshots, 10% TDS deductions, and ±60% gig swings.
- **🏪 Small Business Owner (T-Shirt Shop)**: Fulfilling a ₹1,00,000 T-Shirt order with ₹60,000 production costs, ₹20,000 worker salaries/rent due first, and ₹5,000 hidden freight charges.

### 3. Radiant Gradient Aurora Themes (Per Persona)
- **Student**: Electric Violet, Cyber Fuchsia & Neon Cyan
- **Freelancer**: Sunset Amber, Coral Rose & Magma Gold
- **Small Business**: Emerald Neon, Ocean Teal & Royal Blue

### 4. Interactive 3D WebGL Core & 3D Tilt Cards (60 FPS)
- **`<Interactive3DFinancialCore />`**: A rotating 3D holographic Financial Shield with dynamic dual gyroscopic rings that rotate smoothly and shift color based on cash safety:
  - 🟢 **Glowing Emerald**: Safe buffer
  - 🟡 **Pulsing Gold**: Near danger threshold
  - 🔴 **High-Speed Crimson**: Cash shortage detected
- **`<Tilt3DCard />`**: Reusable 3D perspective wrapper with mouse-tracking radial spotlight glare across all cards.

### 5. Cloud Integration & Document Intelligence
- **Supabase Cloud**: Dedicated buckets `finvexa-assets` and `finvexa-documents` for receipts, bills, and purchase orders.
- **Gemini AI Engine**: High-speed OCR and clause analysis for invoices, rental agreements, credit cards, and UPI screenshots.

---

## 🚀 Quickstart

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```
