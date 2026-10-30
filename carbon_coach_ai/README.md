# Carbon Coach – AI-Powered Carbon Footprint Management Agent

An intelligent, conversational AI agent built with **Google ADK** and **Gemini 2.5 Flash** to help users measure, understand, and reduce their carbon footprint through tool-verified calculations and personalized recommendations.

---

## 🎯 Problem Statement

> *"Build an AI agent that helps people measure, understand and reduce their carbon footprint."*

### Key Requirements
1. **Conversational Input:** Natural-language interaction for logging daily activities across transportation, electricity, food, and waste.
2. **Tool-Based Calculation:** Strict numerical accuracy—every kg CO₂e emission calculation must be executed by Python tools with recognized emission factors. The LLM does not hallucinate numerical figures.
3. **Memory & Tracking:** Activity persistence with daily, weekly, and monthly footprint summaries.
4. **Actionable Recommendations:** Tailored, quantified reduction tips with estimated carbon savings calculated by tools.
5. **Transparency & Precision:** Reliable results backed by deterministic Python calculation logic.

---

## 🛠️ Technology Stack

- **Runtime:** Python 3.10+
- **Agent Framework:** [Google ADK](https://pypi.org/project/google-adk/) (`google-adk` v2.11+)
- **LLM Engine:** Gemini API (`gemini-2.5-flash` via `google-genai`)
- **Environment Management:** `python-dotenv`
- **Data Persistence:** SQLite (Phase 3)
- **Frontend / UI:** Streamlit (handled collaboratively)

---

## 📁 Initial Project Structure (Phase 1)

```text
Carbon_Coach_AI/
│
├── .venv/               # Isolated Python virtual environment
├── .env                 # Environment variables and API credentials (gitignored)
├── .gitignore           # Git ignore rules for venv, secrets, and caches
├── requirements.txt     # Python dependency specifications
├── README.md            # Project documentation and setup guide
└── setup_test.py        # Environment & Gemini connection verification script
```

---

## 🚀 Environment Setup & Verification

### 1. Prerequisites
- Python 3.10 or higher
- PowerShell on Windows (or bash on Linux/macOS)
- VS Code (recommended)

### 2. Activate Virtual Environment

**Windows PowerShell:**
```powershell
.\.venv\Scripts\Activate.ps1
```

*(If execution policy blocks activation, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` first).*

### 3. Configure API Credentials

Edit the `.env` file in the project root:
```env
GOOGLE_API_KEY=your_actual_gemini_api_key_here
ECOMATE_MODEL=gemini-2.5-flash
```

> **Security Note:** Never commit your `.env` file or API keys to version control. The `.env` file is included in `.gitignore`.

### 4. Verify the Setup

Run the verification script inside the virtual environment:
```powershell
python setup_test.py
```

The script will verify:
- Virtual environment activation
- Library availability (`google.adk`, `google.genai`, `python-dotenv`)
- ADK CLI availability (`adk --version`)
- Gemini API connectivity and model responsiveness

---

## 🗺️ Project Roadmap

- **Phase 1: Environment Setup (Current)** — Isolated virtual environment, dependencies, `.env` config, verification test.
- **Phase 2: Core Agent Architecture** — Google ADK agent definition, conversational prompts, state handling.
- **Phase 3: Carbon Calculation Tools** — Python emission factors, transportation, diet, and energy calculators.
- **Phase 4: Memory & Persistence** — SQLite activity logging, session history, summary queries.
- **Phase 5: Recommendations Engine** — Reduction tips and verifiable carbon savings calculators.
- **Phase 6: UI Integration** — Streamlit integration and end-to-end testing.
