# Work Light Lite - Architecture Documentation

## Overview

Work Light Lite is a lightweight presence broadcasting system that helps decentralized communities stay connected. It consists of three main components:

1. **Discord Bot** - Accepts `/worklight` commands and saves status updates
2. **Data Layer** - JSON-based storage with validation and utilities
3. **Web Dashboard** - Public interface to visualize current activity

## System Architecture

```
┌─────────────────┐
│  Discord Users  │
└────────┬────────┘
         │ /worklight command
         ▼
┌─────────────────────────────┐
│     Discord Bot (index.js)  │
│  - Command Registration     │
│  - Event Handling           │
│  - Auto-pruning (optional)  │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│   Command Handlers          │
│   (src/commandHandlers.js)  │
│  - Process user input       │
│  - Create entry objects     │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│   Data Manager              │
│   (src/dataManager.js)      │
│  - Validation               │
│  - File I/O                 │
│  - Pruning & Archiving      │
│  - User Logs (optional)     │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│   worklight.json            │
│   [{ user, project, ... }]  │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│   Express Server            │
│   (server.js)               │
│  - Serve Dashboard          │
│  - API Endpoints            │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│   Web Dashboard             │
│   (docs/index.html)         │
│  - Fetch & Display Data     │
│  - Real-time Updates        │
└─────────────────────────────┘
```

## Core Modules

### 1. Configuration (src/config.js)

Centralizes all environment variables and application settings:

- **Discord Configuration**: Bot token, guild ID
- **Server Configuration**: Port settings
- **Data Configuration**: File paths, user logs settings
- **Feature Flags**: Auto-pruning, expiry settings

**Key Functions:**
- `validateConfig()` - Ensures required values are present on startup

### 2. Data Manager (src/dataManager.js)

Handles all data operations with error handling and validation:

**Key Functions:**
- `readWorklightData()` - Safely reads and parses data file
- `writeWorklightData(data)` - Writes data with error handling
- `validateEntry(entry)` - Validates entry structure and required fields
- `addEntry(entry)` - Adds entry with automatic user deduplication
- `pruneExpiredEntries()` - Removes expired entries
- `getActiveEntries()` - Returns only non-expired entries
- `archiveOldEntries(daysOld)` - Archives entries to separate file
- `logToUserFile(entry)` - Optional per-user logging

### 3. Command Handlers (src/commandHandlers.js)

Processes Discord slash commands:

**Key Functions:**
- `handleWorklightCommand(interaction)` - Processes `/worklight` command
  - Extracts user and project info
  - Creates entry with timestamp and status
  - Adds expiry if auto-pruning is enabled
  - Sends confirmation to user

### 4. Discord Bot (index.js)

Main entry point for the bot:

- Initializes Discord client
- Registers slash commands
- Sets up event listeners
- Handles errors gracefully
- Starts auto-pruning if enabled
- Launches web server

### 5. Web Server (server.js)

Express server providing:

- **GET /** - Serves dashboard HTML
- **GET /worklight.json** - Returns current data (legacy endpoint)
- **GET /api/worklight** - Returns active entries (filtered)

### 6. Dashboard (docs/index.html)

Single-page application that:
- Fetches data from server
- Displays current activity
- Uses relative URLs for deployment flexibility

## Data Model

### Current Entry Structure

```json
{
  "user": "username",
  "project": "What they're working on",
  "timestamp": "2025-01-15T10:30:00Z",
  "status": "active",
  "expiresAt": "2025-01-16T10:30:00Z"  // optional
}
```

### Future Extensions

The data model is designed to support:

```json
{
  "user": "username",
  "project": "Project name",
  "summary": "Detailed description",
  "timestamp": "2025-01-15T10:30:00Z",
  "status": "active",
  "tags": ["design", "frontend"],
  "expiresAt": "2025-01-16T10:30:00Z",
  "team": "team-name"  // for team filtering
}
```

## Feature Flags

Configured via environment variables (`.env`):

### AUTO_PRUNING
When enabled:
- Automatically removes expired entries
- Runs every minute in background
- Uses `DEFAULT_EXPIRY_MINUTES` to set expiry on new entries

### USER_LOGS
When enabled:
- Logs each entry to `logs/@username.json`
- Maintains per-user history
- Useful for personal archives and weekly digests

## Deployment Considerations

### File-Based Storage

**Pros:**
- Simple setup, no database required
- Easy to backup and version control
- Low overhead for MVP

**Cons:**
- Not suitable for high-concurrency writes
- Limited query capabilities
- May need migration to DB for scale

**When to migrate to database:**
- More than 50 concurrent users
- Complex filtering/querying needs
- Real-time collaboration features
- Distributed hosting requirements

### Hosting Platforms

#### SparkedHost
- Node.js hosting with persistent storage
- Environment variables via control panel
- Easy GitHub integration for deployments

#### Replit
- Built-in environment variables
- Auto-deploys from GitHub
- Includes always-on option for 24/7 uptime

#### General Requirements
- Node.js 14+
- Persistent file system for `worklight.json`
- Environment variable support
- Outbound HTTPS for Discord API

## Security Considerations

### Current Implementation
✅ Environment variables for secrets
✅ Input validation on entries
✅ Error handling prevents data corruption
✅ Ephemeral Discord responses (private)
✅ SFTP config excluded from git

### Future Security Enhancements
- Rate limiting on API endpoints
- Authentication for user-specific data exports
- Input sanitization for XSS prevention
- CORS configuration for production
- HTTPS enforcement

## Scalability Path

### Phase 1 (Current - MVP)
- File-based JSON storage
- Single-server deployment
- Synchronous operations

### Phase 2 (0-100 users)
- Add caching layer (in-memory)
- Optimize read operations
- Add API rate limiting

### Phase 3 (100-1000 users)
- Migrate to SQLite or PostgreSQL
- Add search/filter API endpoints
- Implement pagination
- Add user authentication

### Phase 4 (1000+ users)
- Distributed database (PostgreSQL + replication)
- Redis for caching and sessions
- Load balancer for multiple server instances
- Real-time updates via WebSockets
- CDN for static assets

## Future Features Preparation

### Weekly Digests
Implementation approach:
1. Use `archiveOldEntries()` to get week's data
2. Aggregate by user/project
3. Format as Discord embed message
4. Send via DM using Discord API

### Tag-Based Filtering
Data model already supports tags:
- Add tags field to entry structure
- Update dashboard to filter by tag
- Add `/worklight` tag option

### Team/Project Grouping
- Add team field to entries
- Create team-specific views in dashboard
- Add team filter API endpoint

### Data Export
- Use `logs/@user.json` for personal exports
- Create export API endpoint
- Add authentication layer
- Support CSV/JSON formats

## Testing Strategy

### Current State
- No automated tests yet (appropriate for MVP)

### Recommended Test Coverage
1. **Unit Tests** (Jest or Mocha)
   - Data validation logic
   - Pruning and archiving functions
   - Configuration validation

2. **Integration Tests**
   - Discord command handling
   - API endpoint responses
   - File I/O operations

3. **End-to-End Tests**
   - Full workflow from command to dashboard
   - Error scenarios and recovery

## Monitoring & Debugging

### Current Logging
- Console logs for key events
- Error messages for failures
- Startup validation logs

### Enhanced Monitoring (Future)
- Log aggregation service (e.g., Papertrail)
- Uptime monitoring (e.g., UptimeRobot)
- Error tracking (e.g., Sentry)
- Analytics for usage patterns

## Development Workflow

### Local Development
1. Clone repository
2. Copy `.env.example` to `.env`
3. Fill in Discord credentials
4. Run `npm install`
5. Run `npm start`

### Deployment
1. Push changes to GitHub
2. Platform auto-deploys from main branch
3. Set environment variables in hosting panel
4. Restart service

### Making Changes
1. Edit code locally in VS Code
2. Test locally with dev Discord bot/server
3. Commit and push to GitHub
4. Production deploys automatically

## API Documentation

### GET /api/worklight
Returns active (non-expired) worklight entries.

**Response:**
```json
[
  {
    "user": "username",
    "project": "Project name",
    "timestamp": "2025-01-15T10:30:00Z",
    "status": "active"
  }
]
```

### GET /worklight.json
Legacy endpoint - returns raw data file.

**Response:** Same as `/api/worklight` but includes expired entries.

## Maintenance Tasks

### Regular Tasks
- Monitor disk space (JSON files grow over time)
- Review error logs
- Archive old data periodically

### Optional Automated Tasks
- Weekly digest generation
- Monthly data archival
- Cleanup of old user logs

## Contributing Guidelines

When adding features:
1. Update data model in `dataManager.js`
2. Add configuration to `src/config.js` and `.env.example`
3. Update this documentation
4. Test locally before deploying
5. Keep changes minimal and focused

---

**Last Updated:** 2025-01-15
**Version:** 1.0.0
