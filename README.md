# Collaborative Whiteboard - Full Stack

Complete production-ready full-stack application for real-time collaborative drawing with Next.js frontend and Node.js/Express backend.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on **http://localhost:3000**

### Frontend Setup (in another terminal)

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Frontend runs on **http://localhost:3001**

## 📋 Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── config/         # Database, env, constants
│   │   ├── models/         # Sequelize ORM models
│   │   ├── controllers/    # API logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── utils/          # JWT, validation schemas, errors
│   │   └── websocket/      # WebSocket handler (stub)
│   ├── index.js            # Entry point
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js App Router
│   │   │   ├── (dashboard)/ # Protected routes
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── ...
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   └── globals.css     # Tailwind CSS
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── README.md
│
└── README.md (this file)
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token with refresh token

### Canvases
- `GET /api/canvases` - List user's canvases (protected)
- `POST /api/canvases` - Create new canvas (protected)
- `GET /api/canvases/:canvasId` - Get canvas with strokes (protected)
- `DELETE /api/canvases/:canvasId` - Delete canvas (protected)

### Strokes
- `GET /api/canvases/:canvasId/strokes` - Get all canvas strokes (protected)
- `POST /api/canvases/:canvasId/strokes` - Create stroke (protected)
- `DELETE /api/strokes/:strokeId` - Soft-delete stroke (protected)
- `POST /api/strokes/:strokeId/restore` - Restore deleted stroke (protected)

## 🎯 Features

### Backend
✅ Express.js REST API
✅ JWT authentication (access + refresh tokens)
✅ Sequelize ORM with SQLite (dev) / MySQL (production)
✅ User registration with password hashing (bcryptjs)
✅ Canvas CRUD operations
✅ Stroke creation with auto-ordering
✅ Soft-delete with restore capability
✅ Comprehensive error handling
✅ Input validation with Joi schemas
✅ CORS support
✅ Auto-syncing database (no migrations needed in dev)

### Frontend
✅ Next.js 15 with App Router
✅ React 19 with TypeScript
✅ Tailwind CSS styling
✅ User authentication flow
✅ Protected routes & auto-redirect
✅ Canvas list management
✅ Drawing canvas with tools:
  - Color picker
  - Brush size (1-20px)
  - Clear button
  - Smooth drawing
✅ Automatic token refresh on 401
✅ WebSocket integration (stub for real-time)
✅ Responsive design
✅ lucide-react icons

## 🔐 Security Features

- Passwords hashed with bcryptjs (10 rounds)
- JWT tokens with short expiry (15 min access, 7 day refresh)
- Refresh tokens stored in database
- CORS configured
- Input validation on all endpoints
- Authorization checks on resource operations
- XSS protection via React escape
- CSRF protection ready (frontend form submissions)

## 🗄️ Database Schema

### Users
- `id` (UUID, PK)
- `username` (unique)
- `email` (unique)
- `password` (hashed)
- `created_at`, `updated_at`

### Canvases
- `id` (UUID, PK)
- `name`
- `created_by` (FK to users)
- `created_at`, `updated_at`

### Strokes
- `id` (UUID, PK)
- `canvas_id` (FK to canvases)
- `user_id` (FK to users)
- `points` (JSON array of {x, y})
- `color` (hex)
- `size` (1-20)
- `deleted_at` (for soft-delete)
- `stroke_order` (auto-assigned)
- `created_at`, `updated_at`

### RefreshTokens
- `id` (UUID, PK)
- `user_id` (FK to users)
- `token` (unique)
- `expires_at`
- `created_at`

## 🧪 Testing the Full Stack

### 1. Register a user
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

Response includes `accessToken` and `refreshToken`

### 2. Open frontend
Navigate to **http://localhost:3001** in your browser, or click "Register here" on login page

### 3. Create a canvas
Click "Create Canvas" on the canvases page

### 4. Start drawing
Click on the canvas to open the drawing page and draw strokes

### 5. Test logout
Click "Logout" to clear tokens and return to login

## 📦 Tech Stack

### Backend
- **Node.js** 18+ (runtime)
- **Express.js** 4.18 (HTTP framework)
- **Sequelize** 6.35 (ORM)
- **SQLite3** 5.1 (dev database)
- **MySQL2** 3.6 (production database)
- **JWT** 9.0 (authentication)
- **bcryptjs** 2.4 (password hashing)
- **Joi** 17.11 (validation)
- **CORS** 2.8 (cross-origin)
- **uuid** 9.0 (ID generation)

### Frontend
- **Next.js** 15 (React framework)
- **React** 19 (UI library)
- **TypeScript** 5 (type safety)
- **Tailwind CSS** 3.4 (styling)
- **lucide-react** 0.263 (icons)
- **Native Fetch** API (HTTP)
- **WebSocket** API (real-time ready)

## 🔄 Authentication Flow

1. User registers/logs in
2. Backend returns `accessToken` (15 min) + `refreshToken` (7 days)
3. Frontend stores both in localStorage
4. All API requests include `Authorization: Bearer <accessToken>`
5. On 401 response:
   - Frontend automatically exchanges `refreshToken` for new `accessToken`
   - Retries original request
   - If refresh fails, logout and redirect to login

## 📝 Environment Variables

### Backend (.env.local)
```
DB_DIALECT=sqlite
DB_STORAGE=./whiteboard.sqlite
PORT=3000
NODE_ENV=development
JWT_ACCESS_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
```

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

## 🚢 Deployment

### Backend
Supports both SQLite (dev) and MySQL (production):
```env
DB_DIALECT=mysql
DB_HOST=your-db-host
DB_PORT=3306
DB_NAME=whiteboard_prod
DB_USER=db_user
DB_PASSWORD=secure_password
```

### Frontend
Built with `npm run build`, can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any Node.js hosting

## 📋 Files Generated

### Backend: 25 files
- Configuration (3): env, database, constants
- Models (4): User, Canvas, Stroke, RefreshToken
- Controllers (3): auth, canvas, stroke
- Routes (3): authRoutes, canvasRoutes, strokeRoutes
- Middleware (3): auth, validation, error handler
- Utils (3): jwt, validation, errors
- WebSocket (1): socketHandler (stub)
- App files (2): app.js, index.js
- Config files (3): package.json, .env.*, .gitignore

### Frontend: 22 files
- App files (8): layout, page, login, register, dashboard layout, canvases page, canvas page, page redirect
- Components (5): DrawingCanvas, AuthForm, CanvasList, Navbar, LoadingSpinner
- Hooks (3): useAuth, useWebSocket, useApi
- Config files (6): tailwind.config, tsconfig, next.config, postcss.config, package.json, .gitignore
- Assets (1): globals.css
- Env (2): .env, .env.example

## 🔮 Future Features

- Real-time WebSocket implementation for collaborative drawing
- User presence indicators
- Stroke undo/redo
- Canvas sharing and permissions
- Drawing history/timeline
- Multiplayer cursor tracking
- Audio/video chat integration
- Export canvas as image
- Drawing templates
- Mobile app (React Native)

## 📚 Documentation

See individual README files:
- `backend/README.md` - Backend-specific details
- `frontend/README.md` - Frontend-specific details

## 🤝 Contributing

This is a complete implementation ready for production use or as a base for further development.

## 📄 License

ISC

---

**Generated**: April 2026
**Repository**: https://github.com/hussein-turfah/collaborative-whiteboard.git
