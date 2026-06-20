# URL Shortener

A full-stack URL shortener built with Node.js, Express, MongoDB, and React. Supports custom aliases, click tracking, and URL expiration.

---

## Tech Stack

**Backend**
- Node.js + Express
- MongoDB Atlas + Mongoose
- Helmet, CORS, express-rate-limit
- Jest + Supertest (23 tests)

**Frontend**
- React 19 + Vite
- Axios
- Tailwind CSS

**DevOps**
- Docker + Docker Compose
- GitHub Actions CI/CD

---

## Features

- Shorten any URL instantly
- Custom alias support (e.g. `/my-link`)
- Click counter on every redirect
- URL expiration date (optional)
- Delete links
- Rate limiting and input validation
- REST API with proper error handling

---

## Project Structure
url-shortener/

├── backend/

│   ├── src/

│   │   ├── config/        # MongoDB connection

│   │   ├── controllers/   # Route handlers

│   │   ├── middleware/    # Validation, rate limiter, error handler

│   │   ├── models/        # Mongoose schema

│   │   ├── routes/        # Express routes

│   │   └── utils/         # Short code generator

│   ├── tests/             # Jest + Supertest tests

│   └── Dockerfile

├── frontend/

│   ├── src/

│   │   ├── components/    # ShortenForm, UrlList, UrlCard

│   │   ├── services/      # Axios API calls

│   │   └── App.jsx

│   └── Dockerfile

├── .github/

│   └── workflows/

│       └── ci.yml         # GitHub Actions pipeline

└── docker-compose.yml

---

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB Atlas account
- Docker (optional)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/url-shortener.git
cd url-shortener
```

### 2. Set up the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/url-shortener?retryWrites=true&w=majority
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

```bash
npm install
npm run dev
```

Backend runs on **http://localhost:5000**

### 3. Set up the frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

---

## API Reference

### POST `/api/urls` — Create short URL

**Request**
```json
{
  "originalUrl": "https://example.com/long/path",
  "customAlias": "my-link"
}
```

**Response `201`**
```json
{
  "success": true,
  "data": {
    "_id": "64f...",
    "originalUrl": "https://example.com/long/path",
    "shortCode": "aB3kR9",
    "shortUrl": "http://localhost:5000/aB3kR9",
    "clicks": 0,
    "createdAt": "2025-06-01T10:00:00Z"
  }
}
```

---

### GET `/api/urls` — Get all URLs

**Response `200`**
```json
{
  "success": true,
  "count": 3,
  "data": [ { ...url }, { ...url } ]
}
```

---

### DELETE `/api/urls/:id` — Delete a URL

**Response `200`**
```json
{
  "success": true,
  "message": "URL deleted successfully"
}
```

---

### GET `/:shortCode` — Redirect

Redirects to the original URL and increments the click counter.
302 → original URL        (found)

404 → URL not found       (invalid code)

410 → URL has expired     (past expiry date)

---

## Running Tests

```bash
cd backend
npm test
```
Test Suites: 2 passed, 2 total

Tests:       23 passed, 23 total

Tests use mocked Mongoose — no real database connection needed.

---

## Docker

Run the full stack with one command:

```bash
# Create a .env file in the root folder first
cp backend/.env.example .env

docker-compose up --build
```

- Backend → http://localhost:5000
- Frontend → http://localhost:80

---

## CI/CD

GitHub Actions runs on every push to `main`:

1. Install dependencies
2. Run all 23 tests
3. Build Docker image

See `.github/workflows/ci.yml` for the full pipeline.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGO_URI` | MongoDB Atlas URI | `mongodb+srv://...` |
| `BASE_URL` | Backend base URL | `http://localhost:5000` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend URL | `http://localhost:5000` |

---

## Deployment

- **Backend** → [Render](https://render.com) or [Railway](https://railway.app)
- **Frontend** → [Vercel](https://vercel.com)

Set all environment variables in your deployment platform's dashboard. Update `VITE_API_URL` to point to your deployed backend URL before building the frontend.

---