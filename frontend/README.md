# Carbon Coach - Frontend

This is the client application for **Carbon Coach**, built with React, Vite, Tailwind CSS, React Router DOM, Axios, Recharts, and Lucide React.

## Directory Structure
- `src/components/common`: Shared reusable UI primitives (Button, Card, Badge).
- `src/components/navigation`: Responsive Navbar and collapsible Sidebar.
- `src/components/dashboard`: Metric widgets (StatCard).
- `src/components/chat`: Mobile-friendly AI Coach chat window.
- `src/components/charts`: Emission data charts (EmissionBarChart).
- `src/components/forms`: Emission telemetry entry forms.
- `src/pages`: Application views (Dashboard, Activities, Recommendations, Chat, Settings).
- `src/layouts`: Responsive MainLayout.
- `src/routes`: Route definitions.
- `src/services`: Axios API configuration with JWT interceptors.
- `src/context`: Authentication context (`AuthContext`).
- `src/hooks`: Custom React hooks (`useFootprint`).
- `src/constants`: Brand design system color tokens (`THEME_COLORS`).
- `src/styles`: Tailwind CSS directives and custom utility classes.

## Development Scripts
- `npm run dev` - Start Vite development server
- `npm run build` - Build production bundle
- `npm run preview` - Preview production bundle locally
