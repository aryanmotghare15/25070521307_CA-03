# FLEXI – Full-Stack Task Board (React + Node.js + MongoDB)

## Prerequisites
Node.js 18+, MongoDB running locally (use MongoDB Compass to connect to `mongodb://127.0.0.1:27017`).

## Run
```bash
# Terminal 1 – backend
cd server && cp .env.example .env && npm install && npm run dev

# Terminal 2 – frontend
cd client && npm install && npm run dev
```
Open http://localhost:5173. In Compass, open database `flexi` → collection `tasks` to see saved data.

## REST API
| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/tasks?q=&status= | List / search tasks |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task (edit or move status) |
| DELETE | /api/tasks/:id | Delete task |
