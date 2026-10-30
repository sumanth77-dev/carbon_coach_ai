# Carbon Coach

**Carbon Coach** is an AI-powered carbon footprint tracking and recommendation platform tailored for individuals, families, and businesses. The platform simplifies tracking daily and operational emissions while utilizing Google ADK and Gemini AI models to generate tailored, actionable sustainability strategies.

---

## 1. Project Architecture

The repository is organized into cleanly decoupled, scalable modules:

```
carbon-coach/
│
├── frontend/                     # React.js + Vite client application
│   ├── public/                   # Static assets & icons
│   ├── src/
│   │   ├── assets/               # Local images and graphic assets
│   │   ├── components/           # Reusable UI component library
│   │   │   ├── common/           # Shared atomic elements (Button, Card, Badge)
│   │   │   ├── navigation/       # Top Navbar and collapsible Sidebar
│   │   │   ├── dashboard/        # Summary StatCards and telemetry widgets
│   │   │   ├── chat/             # AI Coach interactive chat interface
│   │   │   ├── charts/           # Recharts visual emission breakdowns
│   │   │   └── forms/            # Activity logging and input forms
│   │   │
│   │   ├── pages/                # Route-level views (Dashboard, Activities, etc.)
│   │   ├── layouts/              # Main responsive layout container
│   │   ├── routes/               # AppRoutes with React Router DOM
│   │   ├── services/             # Axios API client with auth interceptors
│   │   ├── hooks/                # Custom React hooks (useFootprint, etc.)
│   │   ├── context/              # Context providers (AuthContext)
│   │   ├── utils/                # Number, currency, and unit formatters
│   │   ├── constants/            # Design system tokens and brand palettes
│   │   ├── styles/               # Tailwind CSS directives and custom styling
│   │   │
│   │   ├── App.jsx               # Root application component
│   │   └── main.jsx              # React DOM mounting entry point
│   │
│   ├── .env.example              # Frontend environment variables template
│   ├── .gitignore                # Frontend git exclusions
│   ├── package.json              # Frontend npm dependencies and scripts
│   ├── tailwind.config.js        # Design system Tailwind configuration
│   └── vite.config.js            # Vite build configuration
│
├── backend/                      # Node.js + Express.js API microservice
│   ├── src/
│   │   ├── config/               # Database and environmental configuration
│   │   ├── controllers/          # Business logic and request handlers
│   │   ├── routes/               # Express routing endpoints
│   │   ├── models/               # Mongoose database schemas
│   │   ├── middleware/           # Auth (JWT) and error handling middleware
│   │   ├── services/             # External integration (Google ADK AI client)
│   │   ├── utils/                # Standardized response formatters
│   │   ├── validators/           # Payload validation helpers
│   │   └── app.js                # Express app initialization and middleware
│   │
│   ├── server.js                 # HTTP server entry point & graceful shutdown
│   ├── .env.example              # Backend environment variables template
│   ├── .gitignore                # Backend git exclusions
│   └── package.json              # Backend npm dependencies and scripts
│
├── database/                     # Database design, schemas & seeding
│   ├── schemas/                  # Collection schema documentation
│   ├── indexes/                  # MongoDB index optimization definitions
│   ├── seeds/                    # Standard emission factors & benchmarks
│   └── README.md                 # Database overview and setup instructions
│
├── .gitignore                    # Global git ignore rules
└── README.md                     # Project documentation
```

---

## 2. Technology Stack

### Frontend
- **Framework:** React.js (v19) with Vite
- **Language:** JavaScript (ES modules)
- **Styling:** Tailwind CSS (v3) configured with custom brand tokens
- **Routing:** React Router DOM (v7)
- **HTTP Client:** Axios with JWT request/response interceptors
- **Visualizations:** Recharts for emission analytics
- **Iconography:** Lucide React

### Backend
- **Runtime:** Node.js (v20+)
- **Framework:** Express.js (v4)
- **Database:** MongoDB with Mongoose ODM (v8)
- **Authentication:** JWT (`jsonwebtoken`) and `bcryptjs` password hashing
- **Middleware:** CORS, JSON body parser, centralized error handler

### AI Integration
- **Agent Framework:** Google ADK & Gemini
- **Architecture:** Runs as an independent Python microservice communicating with the Node.js backend over HTTP APIs (`/api/v1/agent/*`).

---

## 3. Design System & Aesthetics

| Token | Hex Value | Usage |
|---|---|---|
| **Primary** | `#245C45` | Main brand color, active nav items, primary buttons |
| **Secondary** | `#8BAF99` | Accents, soft badges, secondary highlights |
| **Background** | `#F7F8F5` | Base background color across pages |
| **Surface** | `#FFFFFF` | Cards, sidebars, modal surfaces |
| **Main Text** | `#202923` | High-contrast body text and headings |
| **Secondary Text** | `#778078` | Subtitles, labels, timestamps |
| **Border** | `#E5E9E5` | Clean, subtle card and table divider borders |

**Typography:** Clean, modern Inter font family loaded with weights 400, 500, 600, and 700.

---

## 4. Getting Started

### 1. Backend Setup
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
The server will start on `http://localhost:5000` (health check: `http://localhost:5000/api/v1/health`).

### 2. Frontend Setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
The client will start on `http://localhost:5173`.
