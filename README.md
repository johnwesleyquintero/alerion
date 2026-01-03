<div align="center">
  <img src="public/logo.svg" width="100" alt="Alerion Logo" />

# Alerion Analytics

### AI-Driven Amazon Advertising Intelligence

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0+-61DAFB.svg)](https://react.dev/)
[![Gemini API](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-8E75B2.svg)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)

**Scale your Amazon FBA brands with precision. Alerion combines data visualization with Generative AI to create a safe, "operator-in-the-loop" optimization workflow.**

[🚀 Live Demo](#) • [📚 Documentation](#) • [🐞 Report Issue](#)

</div>

---

## 🌟 Core Features

### 🧪 The PPC Lab Workflow
A disciplined, 4-step process designed for safety and strategy:
1.  **Ingestion:** Manual upload of Bulk Operations files (`.xlsx`) with automated data health checks.
2.  **AI Analysis:** Gemini 2.5 scans campaigns against your custom ACOS targets and strategic intent.
3.  **Operator Review:** Suggestions are queued, not applied. You review the reasoning before approving.
4.  **Execution & Logging:** Apply changes in bulk and maintain a permanent audit trail of all AI actions.

### 🧠 Gemini AI Optimizer
Leveraging **Google's Gemini 2.5 Flash**, Alerion acts as an expert analyst:
- **Visual Risk Assessment:** Instantly see how far a campaign drifts from your Target ACOS with visual progress bars.
- **Strategic Context:** Choose between `Profitability`, `Balanced`, or `Growth` modes to tailor the AI's advice.
- **Action History:** A dedicated log drawer tracks every bid adjustment and pause action for accountability.

### 📊 Executive Dashboard
A centralized command center for your e-commerce operations.
- **Real-time KPIs:** Monitor Sales, Ad Spend, ACOS (Advertising Cost of Sales), and ROAS.
- **Trend Analysis:** Interactive visualizations using Recharts to track performance over time.
- **Market Insights:** Automated, AI-generated executive briefings and sentiment analysis.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS (Utility-first architecture)
- **AI/LLM:** Google GenAI SDK (`@google/genai`) - Model: `gemini-2.5-flash`
- **Visualization:** Recharts
- **Icons:** Lucide React
- **Build/Bundling:** Native ES Modules (via `esm.sh` for lightweight implementation)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Google Cloud Project with the **Gemini API** enabled.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/johnwesleyquintero/alerion.git
   cd alerion
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory:
   ```env
   # Required for AI features
   API_KEY=your_google_gemini_api_key
   ```

4. **Run Locally**
   ```bash
   npm run dev
   ```

---

## 🏗️ Architecture Overview

The application follows a clean, service-oriented architecture:

```
src/
├── components/       # Reusable UI blocks (KPICards, CampaignTable, AIOptimizer)
├── services/         # API Integration layers
│   └── geminiService.ts  # Direct interface with Google GenAI with JSON Schema
├── types/            # TypeScript definitions (Campaigns, Suggestions, Logs)
└── constants.ts      # Mock data and simulation logic
```

### AI Implementation Details
The `geminiService` utilizes structured JSON schema generation to ensure deterministic outputs from the LLM, guaranteeing that every suggestion returned is type-safe and immediately actionable by the frontend.

---

## 🔮 Future Roadmap

- [ ] **SP-API Integration:** Replace manual file uploads with direct Amazon Advertising API connection.
- [ ] **Google Sheets Two-Way Sync:** Export optimization queues directly to sheets for bulk upload.
- [ ] **Multi-Tenant Support:** Manage multiple Seller Central accounts.

---

## 🤝 Contributing

Contributions are welcome. Please follow the standard fork-and-pull request workflow.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  Built with ❤️ by <strong>John Wesley Quintero</strong>
</div>