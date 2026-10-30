# Footprint Schema Specification

**Collection Name:** `footprints`

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Yes | Unique activity log identifier |
| `userId` | ObjectId (Ref: User) | Yes | Reference to User |
| `category` | String | Yes | `transportation`, `energy`, `diet`, `consumption`, `waste`, `operations` |
| `activityName` | String | Yes | Name of activity (e.g., "Commute by Car", "Electricity Bill") |
| `emissionValue` | Number | Yes | Calculated carbon emission value in kg CO2e |
| `unit` | String | Yes | Standard unit: `kg_co2e` |
| `activityData` | Object | No | Raw input telemetry (distance, kWh, etc.) |
| `loggedAt` | Date | Yes | Timestamp of the event |
| `createdAt` | Date | Auto | Timestamp of record creation |
| `updatedAt` | Date | Auto | Timestamp of last modification |

## Indexes
- `{ userId: 1, loggedAt: -1 }` (compound index for fast telemetry queries)
- `{ category: 1 }`
