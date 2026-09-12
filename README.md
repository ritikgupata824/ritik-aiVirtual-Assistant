# AI Virtual Assistant

A MERN-stack virtual assistant that talks with Google Gemini, supports Hindi and English, and can search the web, open common websites, and answer time and weather-style requests. Users sign in, name their assistant, pick an avatar, then speak or type commands in the browser.

The frontend and backend are **separate npm packages** (`frontend/` and `backend/`). There is no root `npm start` script.

This project is being improved as part of a Frontend AI Engineering learning journey.

**Author:** Ritik Gupta

## Contents

- [Features](#features)
- [Technology stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Project structure](#project-structure)
- [Environment variables](#environment-variables)
- [How to run](#how-to-run)
- [API overview](#api-overview)
- [Example commands](#example-commands)
- [Local development notes](#local-development-notes)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Features

- **Accounts:** Sign up, sign in, and log out with an httpOnly JWT cookie (`token`)
- **Custom assistant:** Choose a name and avatar (preset image or Cloudinary upload)
- **Conversations:** Gemini classifies the request and returns a short spoken reply
- **Voice I/O:** Browser speech recognition and speech synthesis (Hindi `hi-IN` and English `en-US`)
- **Actions:** Google search, YouTube search/play, calculator, Instagram, Facebook, weather, date, day, time, and month (these open web URLs in a new tab; they do not launch native desktop apps)
- **History:** Recent commands are stored on the user record and shown on the home page
- **Responsive UI:** React, Tailwind CSS v4, and Framer Motion

### Typical first-run flow

1. Create an account (`name`, `email`, password of at least 6 characters)
2. Pick an avatar on `/customize`
3. Set the assistant name on `/customize2`
4. Speak or type commands on `/` (or `/home`)

## Technology stack

| Layer | Tools |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS v4 (`@tailwindcss/vite`), React Router, Axios, Framer Motion, Lucide React, React Icons |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (`cookie-parser`, `bcryptjs`) |
| AI | Gemini API |
| Media | Cloudinary, Multer |
| Language | JavaScript (ES modules) |

## Prerequisites

- Node.js 18 or later
- npm
- A MongoDB database (local or [Atlas](https://www.mongodb.com/atlas); if you use Atlas, allow your current IP)
- A [Gemini API](https://ai.google.dev/) key
- A [Cloudinary](https://cloudinary.com/) account (needed if users upload custom assistant images)

## Project structure

```text
.
├── backend/
│   ├── config/           # MongoDB, JWT, Cloudinary
│   ├── controllers/      # Auth and user/assistant logic
│   ├── middlewares/      # Auth check and Multer upload
│   ├── models/           # User schema (profile, assistant, history)
│   ├── routes/           # /api/auth and /api/user
│   ├── gemini.js         # Gemini prompt and API call
│   └── index.js          # Express app entry
├── frontend/
│   ├── index.html
│   └── src/
│       ├── assets/       # Preset assistant images and icons
│       ├── components/   # Shared UI (avatar cards)
│       ├── context/      # Session, Axios base URL, Gemini helper
│       ├── pages/        # Sign in, sign up, customize, home
│       ├── App.jsx       # Routes and auth redirects
│       └── main.jsx
├── CLAUDE.md             # Project coding guidelines
└── LICENSE
```

There is no `.env.example` in the repo. Copy the examples below into `backend/.env` and `frontend/.env` (both patterns are gitignored).

## Environment variables

Do not commit real secrets.

### Backend (`backend/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URL` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign auth cookies |
| `PORT` | No | Server port (defaults to `8000`) |
| `GEMINI_API_URL` | Yes | Full Gemini `generateContent` URL, including `?key=YOUR_API_KEY` (the key lives in this URL; never commit it) |
| `CLOUDINARY_ClOUD_NAME` | For uploads | Cloudinary cloud name (**spelling matches the code**: `ClOUD`, not `CLOUD`) |
| `CLOUDINARY_API_KEY` | For uploads | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | For uploads | Cloudinary API secret |

Example:

```env
PORT=8000
MONGODB_URL=mongodb://127.0.0.1:27017/virtual-assistant
JWT_SECRET=replace-with-a-long-random-string
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=YOUR_GEMINI_API_KEY
CLOUDINARY_ClOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Build `GEMINI_API_URL` from Google AI Studio: pick a `generateContent` model, then append `?key=` and your API key. Example shape:

`https://generativelanguage.googleapis.com/v1beta/models/MODEL_NAME:generateContent?key=YOUR_GEMINI_API_KEY`

If `GEMINI_API_URL` is omitted, the backend falls back to a placeholder Gemini URL that will not work until you add a real key.

### Frontend (`frontend/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_SERVER_URL` | Recommended | Backend origin, with no trailing slash |

Example for local development:

```env
VITE_SERVER_URL=http://localhost:8000
```

If this variable is omitted, the frontend falls back to `https://ritik-aivirtual-assistant-backend.onrender.com`. Restart the Vite dev server after changing any `VITE_*` variable.

## How to run

Install and start the API and the Vite app in two terminals. The same commands work in bash and PowerShell.

**Local login will fail until CORS and cookies match HTTP localhost.** The backend currently allows the deployed frontend origin and sets `sameSite: "None"` with `secure: true`. See [Local HTTP setup](#local-http-setup) before you try to sign in.

### 0. Open the project

Clone or unzip the repository, then work from the project root (the folder that contains `frontend/` and `backend/`). Create `backend/.env` and `frontend/.env` from the examples above.

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

The API listens on `http://localhost:8000` by default. A successful health check at `/` returns a short status message. The backend has no `start` script; local development uses `nodemon` via `npm run dev`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite serves the UI (typically `http://localhost:5173`). Open that URL, create an account, customize the assistant, then use the mic or typed commands on the home page.

### Local HTTP setup

Do these two code edits **only on your machine** so cookies work on `http://localhost`. Do not commit production CORS or cookie settings that would break the deployed app.

1. **CORS origin** in `backend/index.js`: allow `http://localhost:5173` (the file already has a commented localhost example).
2. **Auth cookies** in `backend/controllers/auth.controllers.js`: for local HTTP, use `sameSite: "lax"` and `secure: false` (there is already a comment in that file). Restart the backend after changing either file.

Then set `VITE_SERVER_URL=http://localhost:8000` and restart Vite.

### App routes

| Path | Who can open it |
| --- | --- |
| `/signup`, `/signin` | Signed-out users (others are redirected home) |
| `/`, `/home` | Signed-in users |
| `/customize` | Signed-in users (avatar) |
| `/customize2` | Signed-in users (assistant name) |

### Useful scripts

| Location | Command | Purpose |
| --- | --- | --- |
| `backend` | `npm run dev` | Start Express with nodemon |
| `frontend` | `npm run dev` | Start Vite |
| `frontend` | `npm run build` | Production build |
| `frontend` | `npm run preview` | Preview the production build |
| `frontend` | `npm run lint` | Run ESLint |

## API overview

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/signup` | No | Create account (`name`, `email`, `password`) |
| `POST` | `/api/auth/signin` | No | Log in (`email`, `password`) |
| `GET` | `/api/auth/logout` | Cookie | Log out |
| `GET` | `/api/user/current` | Cookie | Current user (password excluded) |
| `POST` | `/api/user/update` | Cookie | Update assistant name/image (`assistantName`, `imageUrl`, or multipart file field `assistantImage`) |
| `POST` | `/api/user/asktoassistant` | Cookie | Send a `command` to Gemini |

Auth uses cookie `token` (httpOnly). Axios calls from the frontend send credentials (`withCredentials: true`). The JWT is signed with a 10-day expiry; the cookie `maxAge` is 7 days.

## Example commands

Speak or type requests such as:

- “What time is it?” / “आज कौन सा दिन है?”
- “Search Google for React hooks”
- “Play lo-fi on YouTube”
- “Open Instagram”
- “What’s the weather?”

Gemini should reply with a short sentence. Search and “open” intents also open a matching website.

Gemini classifies each request as one of these types:

| Type | What the app does |
| --- | --- |
| `general` | Speak a short answer |
| `google_search` | Open a Google search |
| `youtube_search` / `youtube_play` | Open YouTube search or playback |
| `calculator_open` | Open a web calculator |
| `instagram_open` / `facebook_open` | Open that site |
| `weather_show` | Open a weather page |
| `get_time` / `get_date` / `get_day` / `get_month` | Speak the local time or calendar value |

## Local development notes

- Voice features need a browser that supports the Web Speech API (Chrome is the most reliable).
- Gemini must return JSON the backend can parse; keep `GEMINI_API_URL` on a working model and key.
- The assistant does not control the operating system or open native apps.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Sign in succeeds but you stay logged out | CORS origin and cookie `secure` / `sameSite` (see [Local HTTP setup](#local-http-setup)). Confirm `VITE_SERVER_URL` is `http://localhost:8000` with no trailing slash. |
| Image upload fails | Cloudinary vars, including the `CLOUDINARY_ClOUD_NAME` spelling. |
| Assistant replies with a generic error | `GEMINI_API_URL` model name and API key; backend logs for Gemini/JSON parse errors. |
| Mic does nothing | Use Chrome (or another Web Speech API browser) and allow microphone access. |
| MongoDB connection error | Local MongoDB is running, or Atlas URI and IP allowlist are correct. |

## License

MIT. See [LICENSE](LICENSE).
