# AI-Based Employee Performance Analytics & Recommendation System

Full-stack MERN project for the AI308B ESE case study. The application lets HR/Admin users manage employees, track skills and performance metrics, view rankings, and generate AI-powered promotion/training recommendations using an OpenRouter/OpenAI-compatible API.

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Lucide icons
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Security: JWT authentication, bcrypt password hashing, protected routes
- AI: OpenRouter chat completions API with local fallback

## Folder Structure

```txt
backend/
  server.js
  src/
    app.js
    config/db.js
    controllers/
    middleware/
    models/
    routes/
    utils/
frontend/
  src/
    api.js
    components/
    context/
    pages/
```

## Local Setup

### 1. Backend

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_secret
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=openai/gpt-4o-mini
CLIENT_URL=http://localhost:5173
```

The AI endpoint works with a local fallback if `OPENROUTER_API_KEY` is empty, but for exam AI integration add the real key.

### 2. Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`.

## API Endpoints

### Auth

```txt
POST /api/auth/signup
POST /api/auth/login
```

### Employees

All employee APIs are protected. Add this header in Postman:

```txt
Authorization: Bearer YOUR_JWT_TOKEN
```

```txt
POST /api/employees
GET /api/employees
GET /api/employees/search?department=Development
PUT /api/employees/:id
DELETE /api/employees/:id
```

Sample employee body:

```json
{
  "name": "Aman Verma",
  "email": "aman@gmail.com",
  "department": "Development",
  "skills": ["React", "Node.js", "MongoDB"],
  "performanceScore": 85,
  "experience": 3
}
```

### AI

```txt
POST /api/ai/recommend
```

Body:

```json
{
  "employees": [
    {
      "name": "Aman Verma",
      "email": "aman@gmail.com",
      "department": "Development",
      "skills": ["React", "Node.js", "MongoDB"],
      "performanceScore": 85,
      "experience": 3
    }
  ]
}
```

## Postman Testing Order

1. Signup: `POST http://localhost:5000/api/auth/signup`
2. Login: `POST http://localhost:5000/api/auth/login`
3. Copy token from login response.
4. Add employee: `POST http://localhost:5000/api/employees`
5. Get all employees: `GET http://localhost:5000/api/employees`
6. Search: `GET http://localhost:5000/api/employees/search?department=Development`
7. Update score: `PUT http://localhost:5000/api/employees/:id`
8. Delete employee: `DELETE http://localhost:5000/api/employees/:id`
9. AI recommendation: `POST http://localhost:5000/api/ai/recommend`

Take screenshots of each request and response for the PDF report.

You can also import `postman_collection.json` directly into Postman. After login, paste the returned JWT into the collection variable named `token`.

## GitHub Upload

```bash
git init
git add .
git commit -m "Build employee performance analytics MERN app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/employee-performance-ai.git
git push -u origin main
```

## Render Deployment

### Backend Web Service

- New Web Service
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `OPENROUTER_API_KEY`
  - `OPENROUTER_MODEL`
  - `CLIENT_URL`

After deployment, backend URL will look like:

```txt
https://your-backend.onrender.com
```

### Frontend Static Site

- New Static Site
- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Add environment variable:

```txt
VITE_API_URL=https://your-backend.onrender.com/api
```

After frontend deploys, update backend `CLIENT_URL` to the Render frontend URL.

## PDF Report Checklist

Include:

- Problem statement
- Tech stack
- Folder structure
- Backend code screenshots
- Frontend code screenshots
- MongoDB Atlas collection screenshot
- Postman screenshots for all HTTP requests
- AI recommendation output screenshot
- Render deployment success screenshot
- Live frontend URL
- Backend API URL
- GitHub repository link
