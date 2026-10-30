# Carbon Coach - Database Architecture

This directory houses the MongoDB database schemas documentation, index definitions, and database seeding scripts for the **Carbon Coach** platform.

> [!NOTE]
> Active application Mongoose models reside in `backend/src/models/`. This directory serves as documentation, indexing strategies, and database maintenance/migration scripts.

## Directory Structure

```
database/
├── schemas/
│   ├── user-schema.md           # Documentation for User collection
│   ├── footprint-schema.md      # Documentation for Footprint collection
│   └── recommendation-schema.md # Documentation for AI Recommendation collection
├── indexes/
│   └── indexes.js               # MongoDB compound and single index definitions
├── seeds/
│   └── seedData.js              # Initial database seed script for development
└── README.md
```

## Collections Overview

1. **users**: Stores account credentials, profile details (individual, family, or business), and baseline carbon targets.
2. **footprints**: Stores time-series carbon emission logs categorized by transportation, energy, diet, consumption, waste, and operations.
3. **recommendations**: Stores actionable reduction strategies, potential CO2e savings, and status tracking (generated via Google ADK AI Agent).

## Seeding Instructions

To populate the development database with baseline activity categories and sample benchmarks:
```bash
node database/seeds/seedData.js
```
