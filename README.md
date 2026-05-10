# DevCollab

A collaborative Kanban-style board app with real-time updates, authentication, and activity tracking. The project includes a React client and an Express + MongoDB API server, plus Socket.IO for live collaboration.

## Features
- User authentication with JWT cookies
- Boards, columns, cards, and comments
- Real-time updates with Socket.IO
- Activity tracking and timelines
- Avatar upload with Cloudinary
- AI feedback endpoint (Gemini)

## Tech Stack
- Client: React, Vite, Tailwind CSS, Redux Toolkit, React Router
- Server: Express, MongoDB/Mongoose, Socket.IO, JWT

## Project Structure
- Client: React front-end
- Server: Express API and Socket.IO server

## Prerequisites
- Node.js 18+ (recommended)
- MongoDB instance
- Cloudinary account (for avatar uploads)
- Gemini API key (optional, for AI feedback)

## Environment Variables

### Client (.env)
Create Client/.env with:

VITE_API_URL=http://localhost:8000/api/v1
VITE_SOCKET_URL=http://localhost:8000

### Server (.env)
Create Server/.env with:

PORT=8000
MONGODB_URI=mongodb://localhost:27017
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_api_key

Notes:
- CORS_ORIGIN should match the client dev server URL.
- Gemini API key is required only for AI feedback features.

## Install & Run

### 1) Server
cd Server
npm install
npm run dev

### 2) Client
cd Client
npm install
npm run dev

The client typically runs on http://localhost:5173 and the server on http://localhost:8000.

## Scripts

### Client
- npm run dev: start Vite dev server
- npm run build: build for production
- npm run lint: run ESLint
- npm run preview: preview production build

### Server
- npm run dev: start the API server with nodemon

## API Base URL
- http://localhost:8000/api/v1

## License
ISC
