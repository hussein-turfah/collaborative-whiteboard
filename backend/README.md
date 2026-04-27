# Collaborative Whiteboard Backend

Production-ready Node.js/Express backend for real-time collaborative drawing.

## Quick Start

```bash
npm install
npm run dev
```

Server runs on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token

### Canvases
- `GET /api/canvases` - List user's canvases
- `POST /api/canvases` - Create new canvas
- `GET /api/canvases/:canvasId` - Get canvas with strokes
- `DELETE /api/canvases/:canvasId` - Delete canvas

### Strokes
- `GET /api/canvases/:canvasId/strokes` - Get canvas strokes
- `POST /api/canvases/:canvasId/strokes` - Create stroke
- `DELETE /api/strokes/:strokeId` - Delete stroke (soft-delete)
- `POST /api/strokes/:strokeId/restore` - Restore deleted stroke

## Example Usage

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'

# Response includes accessToken and refreshToken

# Create canvas (use accessToken from register)
curl -X POST http://localhost:3000/api/canvases \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"name": "My Canvas"}'

# Create stroke
curl -X POST http://localhost:3000/api/canvases/CANVAS_ID/strokes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "points": [{"x": 10, "y": 20}, {"x": 15, "y": 25}],
    "color": "#FF0000",
    "size": 3
  }'
```

## Environment Variables

See `.env.example` for all available options.

### Required
- `DB_DIALECT` - `sqlite` or `mysql`
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `JWT_ACCESS_SECRET` - Secret for access tokens (min 32 chars)
- `JWT_REFRESH_SECRET` - Secret for refresh tokens (min 32 chars)

### SQLite (Development)
- `DB_STORAGE` - Path to SQLite file

### MySQL (Production)
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

## Database

- **Development**: SQLite (auto-created on first run)
- **Production**: MySQL with connection pooling

Models auto-sync on startup in development mode.

## Architecture

- **Models**: User, Canvas, Stroke, RefreshToken
- **Controllers**: Auth, Canvas, Stroke
- **Middleware**: Authentication, Validation, Error handling
- **Routes**: RESTful API endpoints

## Security

- Passwords hashed with bcryptjs (10 rounds)
- JWT access tokens (15 min expiry) + refresh tokens (7d expiry)
- Refresh tokens stored in DB and verified on use
- CORS configured via env var
- Input validation with Joi schemas
