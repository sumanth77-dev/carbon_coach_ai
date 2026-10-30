# User Schema Specification

**Collection Name:** `users`

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Yes | Unique user identifier |
| `name` | String | Yes | Full name or company/family representative name |
| `email` | String | Yes | Unique login email |
| `password` | String | Yes | Salted and hashed password (bcrypt) |
| `accountType` | String | Yes | One of: `individual`, `family`, `business` |
| `profileDetails` | Object | No | Profile specifics based on accountType |
| `profileDetails.householdMembers` | Number | No | Member count (for family accounts) |
| `profileDetails.businessIndustry` | String | No | Industry classification (for business accounts) |
| `profileDetails.location` | Object | No | Geographic context for localized emission factors |
| `baselineCarbonTarget` | Number | No | Monthly target in kg CO2e |
| `isActive` | Boolean | Yes | Account active status (default: true) |
| `createdAt` | Date | Auto | Timestamp of record creation |
| `updatedAt` | Date | Auto | Timestamp of last modification |

## Indexes
- `{ email: 1 }` (unique)
