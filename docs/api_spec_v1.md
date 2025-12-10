# VERTIKAL — API SPEC v1

## Overview
Version 1 of the VERTIKAL API supports:
- User onboarding
- Founding 50 verification
- Creator profiles
- Shows
- Comments (mock → future real API)
- Analytics events

Backend implementation is optional at this stage — mock endpoints are acceptable.

---

# 1. AUTH & ONBOARDING

### POST /auth/request-code
Request onboarding verification code.

Payload:
{
  "email": "string"
}

Response:
{
  "status": "sent"
}

---

### POST /auth/verify
Verify Founding 50 code or general user code.

Payload:
{
  "email": "string",
  "code": "string"
}

Response:
{
  "user_id": "string",
  "is_founding50": boolean,
  "token": "jwt-string"
}

---

# 2. USERS / CREATORS

### GET /creators/:id
Response:
{
  "id": "string",
  "name": "string",
  "handle": "string",
  "avatar": "string",
  "bio": "string",
  "tags": ["string"],
  "shows": ["show_id", ...]
}

---

# 3. SHOWS

### GET /shows
Returns paginated list for feed.

### GET /shows/:id
Response includes:
{
  "id": "string",
  "title": "string",
  "creator": { ... },
  "video_url": "string",
  "thumbnail": "string",
  "duration_seconds": number,
  "tags": ["string"],
  "description": "string",
  "episodes": [ { episode objects } ]
}

---

# 4. COMMENTS (MOCK / FUTURE REAL)

### GET /shows/:id/comments
Returns mock data sorted by timestamp.

### POST /shows/:id/comments
Payload:
{
  "text": "string"
}

Response:
{
  "id": "comment_id",
  "user": { ... },
  "text": "string",
  "timestamp": ISO
}

---

# 5. ANALYTICS

### POST /analytics/event
Payload:
{
  "event": "show_play",
  "user_id": "string",
  "show_id": "string",
  "time": number,
  "meta": {}
}

---

# 6. SCALING NOTES
- All video must be served via CDN
- All API endpoints should respond <150ms
- Pagination is required for all list endpoints
