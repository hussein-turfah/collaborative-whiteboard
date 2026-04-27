# Collaborative Whiteboard Frontend

Production-ready Next.js frontend for real-time collaborative drawing.

## Quick Start

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:3001`

## Features

- User authentication (login/register)
- Create and manage drawing canvases
- Real-time collaborative drawing (WebSocket-ready)
- Drawing tools: color picker, brush size control, clear canvas
- Responsive design with Tailwind CSS
- Automatic token refresh on 401

## Pages

- `/` - Redirects to login
- `/login` - User login
- `/register` - User registration
- `/canvases` - List user's canvases
- `/canvas/[id]` - Drawing canvas with tools

## Backend Integration

Frontend expects backend on `http://localhost:3000`:
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `GET /api/canvases` - List canvases
- `POST /api/canvases` - Create canvas
- `GET /api/canvases/:id` - Get canvas details
- `DELETE /api/canvases/:id` - Delete canvas
- `GET /api/canvases/:id/strokes` - Get strokes
- `POST /api/canvases/:id/strokes` - Create stroke
- `DELETE /api/strokes/:id` - Delete stroke
- `POST /api/strokes/:id/restore` - Restore stroke

## Drawing Canvas

- **Click & drag** to draw strokes
- **Color picker** - Choose any color
- **Brush size** - Adjust with buttons or slider (1-20px)
- **Clear button** - Erase entire canvas
- Real-time sync with other users (WebSocket)

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- lucide-react icons
- Native Fetch API
- WebSocket API

## Authentication

- Access tokens stored in localStorage
- Refresh tokens used for token renewal
- Automatic logout on 401
- Protected dashboard routes
