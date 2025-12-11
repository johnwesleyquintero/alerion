<div align="center">
  <img src="public/logo.svg" width="100" alt="Alerion Logo" />

# Alerion Analytics

### AI-Driven Amazon Advertising Intelligence

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0+-61DAFB.svg)](https://react.dev/)
[![Gemini API](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-8E75B2.svg)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)

**Scale your Amazon FBA brands with precision. Alerion combines real-time performance tracking with Generative AI to automate strategic decision-making.**

[🚀 Live Demo](#) • [📚 Documentation](#) • [🐞 Report Issue](#)

</div>

---

## 🌟 Core Features

### 📊 Executive Dashboard
A centralized command center for your e-commerce operations.
- **Real-time KPIs:** Monitor Sales, Ad Spend, ACOS (Advertising Cost of Sales), and ROAS.
- **Trend Analysis:** Interactive visualizations using Recharts to track performance over time.
- **Market Insights:** Automated alerts for competitor movements and inventory health.

### 🧠 Gemini AI Optimizer
Leveraging **Google's Gemini 2.5 Flash**, Alerion acts as an expert analyst:
- **Automated Audits:** Analyzes campaign data against target ACOS thresholds.
- **Strategic Reasoning:** Doesn't just give a number—provides the *reasoning* (e.g., "High ACOS detected, reduce bid").
- **Actionable Suggestions:** Generates specific actions: `INCREASE_BID`, `DECREASE_BID`, `PAUSE_KEYWORD`.

### 📋 Campaign Management
- **Status Visibility:** Instant view of Active, Paused, and Out-of-Budget campaigns.
- **Performance Grading:** Color-coded metrics to instantly identify underperforming assets.

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
├── components/       # Reusable UI blocks (KPICards, CampaignTable)
├── services/         # API Integration layers
│   └── geminiService.ts  # Direct interface with Google GenAI
├── types/            # TypeScript definitions (Campaigns, Suggestions)
└── constants.ts      # Mock data and configuration
```

### AI Implementation Details
The `geminiService` utilizes structured JSON schema generation to ensure deterministic outputs from the LLM, guaranteeing that every suggestion returned is type-safe and immediately actionable by the frontend.

---

## 🔮 Future Roadmap

- [ ] **Google Sheets Integration:** Two-way sync for bulk upload operations.
- [ ] **Multi-Tenant Support:** Manage multiple Seller Central accounts.
- [ ] **Advanced Prompt Engineering:** Custom system instructions for aggressive vs. conservative scaling strategies.

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
