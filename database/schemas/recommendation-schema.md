# Recommendation Schema Specification

**Collection Name:** `recommendations`

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Yes | Unique recommendation identifier |
| `userId` | ObjectId (Ref: User) | Yes | Reference to User |
| `title` | String | Yes | Short action title |
| `description` | String | Yes | In-depth recommendation text from AI agent |
| `category` | String | Yes | `transportation`, `energy`, `diet`, `consumption`, `waste`, `operations` |
| `potentialReduction` | Number | Yes | Estimated reduction in kg CO2e / month |
| `estimatedSavings` | Object | No | Financial savings estimate (amount, currency) |
| `difficulty` | String | Yes | `easy`, `moderate`, `challenging` |
| `status` | String | Yes | `suggested`, `in_progress`, `completed`, `dismissed` |
| `aiGenerated` | Boolean | Yes | Flag indicating Google ADK generation (default: true) |
| `sourceAgent` | String | Yes | Agent identifier (e.g., `google-adk-gemini`) |
| `createdAt` | Date | Auto | Timestamp of suggestion generation |
| `updatedAt` | Date | Auto | Timestamp of last status update |

## Indexes
- `{ userId: 1, status: 1 }`
