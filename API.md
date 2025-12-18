# Work Light Lite - API Documentation

This document describes the available API endpoints and data structures.

## Base URL

When running locally: `http://localhost:8080`
In production: Your deployed URL

## Endpoints

### GET /

**Description**: Serves the main dashboard HTML page

**Response**: HTML page

**Example**:
```bash
curl http://localhost:8080/
```

---

### GET /api/worklight

**Description**: Returns all active (non-expired) worklight entries

**Response Format**: JSON array

**Response Schema**:
```json
[
  {
    "user": "string",
    "project": "string",
    "timestamp": "ISO 8601 string",
    "status": "string",
    "expiresAt": "ISO 8601 string (optional)"
  }
]
```

**Example Request**:
```bash
curl http://localhost:8080/api/worklight
```

**Example Response**:
```json
[
  {
    "user": "newman5",
    "project": "Building the dashboard layout",
    "timestamp": "2025-01-15T10:30:00.000Z",
    "status": "active",
    "expiresAt": "2025-01-16T10:30:00.000Z"
  },
  {
    "user": "alice",
    "project": "Working on API documentation",
    "timestamp": "2025-01-15T11:00:00.000Z",
    "status": "active"
  }
]
```

**Notes**:
- Only returns entries that haven't expired
- If `expiresAt` is not set, the entry never expires
- Entries are ordered by timestamp (oldest first)

---

### GET /worklight.json

**Description**: Legacy endpoint that returns the raw data file (includes expired entries)

**Response Format**: JSON array

**Response Schema**: Same as `/api/worklight`

**Example Request**:
```bash
curl http://localhost:8080/worklight.json
```

**Differences from `/api/worklight`**:
- Includes expired entries
- Reads directly from file (no filtering)
- Maintained for backward compatibility

---

## Data Structures

### Worklight Entry

A worklight entry represents a user's current work status.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user | string | Yes | Username of the person working |
| project | string | Yes | What they're working on |
| timestamp | string | Yes | ISO 8601 timestamp when entry was created |
| status | string | Yes | Current status (default: "active") |
| expiresAt | string | No | ISO 8601 timestamp when entry expires |

**Example**:
```json
{
  "user": "newman5",
  "project": "Refactoring the bot architecture",
  "timestamp": "2025-01-15T14:30:00.000Z",
  "status": "active",
  "expiresAt": "2025-01-16T14:30:00.000Z"
}
```

### Future Extensions

The data model is designed to support additional fields:

```json
{
  "user": "username",
  "project": "Project name",
  "summary": "Detailed description",
  "timestamp": "2025-01-15T10:30:00Z",
  "status": "active",
  "tags": ["tag1", "tag2"],
  "team": "team-name",
  "expiresAt": "2025-01-16T10:30:00Z"
}
```

---

## Discord Bot Commands

### /worklight

**Description**: Sets your current work status

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| project | string | Yes | What you're working on (max 2000 characters) |

**Example Usage**:
```
/worklight project: Building the authentication system
```

**Response**:
- On success: "💡 Your worklight is ON for: **[project]**" (ephemeral message)
- On error: "❌ Failed to save your worklight: [error message]" (ephemeral message)

**Behavior**:
- Replaces any previous entry from the same user
- Creates timestamp automatically
- Adds expiry if auto-pruning is enabled
- Optionally logs to user-specific file

---

## Error Responses

### Server Errors

**500 Internal Server Error**

Returned when:
- File read/write fails
- Data parsing fails
- Unexpected server error

**Example Response**:
```json
{
  "error": "Failed to fetch worklight data"
}
```

### Client Errors

**404 Not Found**

Returned when:
- Requesting a non-existent endpoint

---

## Rate Limiting

Currently, there is no rate limiting implemented. Consider adding rate limiting for production deployments.

**Recommended limits**:
- API endpoints: 100 requests per minute per IP
- Discord commands: Handled by Discord (5 commands per 5 seconds per user)

---

## CORS

By default, CORS is not configured. All origins are allowed.

For production, consider adding CORS middleware:

```javascript
const cors = require('cors');
app.use(cors({
  origin: 'https://your-dashboard-domain.com'
}));
```

---

## Webhooks (Future)

Not currently implemented, but could be added to notify external services when:
- New entry is created
- Entry expires
- Entry is archived

**Proposed webhook payload**:
```json
{
  "event": "entry.created",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "data": {
    "user": "username",
    "project": "project name",
    "timestamp": "2025-01-15T10:30:00.000Z"
  }
}
```

---

## Integration Examples

### Fetch Current Entries (JavaScript)

```javascript
fetch('http://localhost:8080/api/worklight')
  .then(response => response.json())
  .then(entries => {
    console.log('Active entries:', entries);
  })
  .catch(error => {
    console.error('Error fetching entries:', error);
  });
```

### Fetch Current Entries (Python)

```python
import requests

response = requests.get('http://localhost:8080/api/worklight')
if response.status_code == 200:
    entries = response.json()
    print(f'Active entries: {entries}')
else:
    print(f'Error: {response.status_code}')
```

### Fetch Current Entries (curl)

```bash
curl -X GET http://localhost:8080/api/worklight \
  -H "Content-Type: application/json"
```

---

## Authentication (Future)

Not currently implemented. Future versions may include:

- API keys for programmatic access
- OAuth for user authentication
- JWT tokens for session management

**Proposed authenticated endpoints**:
- `GET /api/user/:username/history` - Get user's work history
- `POST /api/export` - Export user's data
- `GET /api/stats` - Get usage statistics

---

## Versioning

Current API version: **v1.0**

Future versions will maintain backward compatibility or use URL versioning:
- `/api/v1/worklight`
- `/api/v2/worklight`

---

## Best Practices

### For API Consumers

1. **Always check response status codes**
   - 200: Success
   - 500: Server error (retry with exponential backoff)

2. **Cache responses appropriately**
   - Consider caching for 30-60 seconds
   - Implement cache invalidation on updates

3. **Handle errors gracefully**
   - Provide fallback data
   - Show user-friendly error messages

4. **Respect rate limits** (when implemented)
   - Implement exponential backoff
   - Queue requests if needed

### For API Developers

1. **Maintain backward compatibility**
   - Don't remove existing fields
   - Add new fields as optional
   - Deprecate instead of removing

2. **Document all changes**
   - Update this file
   - Include migration guides
   - Announce breaking changes

3. **Monitor API usage**
   - Track response times
   - Log error rates
   - Monitor rate limit hits

---

## Changelog

### v1.0.0 (2025-01-15)
- Initial API release
- Added `/api/worklight` endpoint
- Added legacy `/worklight.json` endpoint
- Implemented active entry filtering

---

## Support

For API support:
- Open an issue on [GitHub](https://github.com/Newman5/worklight-lite-dashboard/issues)
- Tag with `api` label
- Include request/response examples

---

**Last Updated:** 2025-01-15
**API Version:** 1.0.0
