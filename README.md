# Flow — Task Management

A sleek, modern, minimal task management web app designed for students and young professionals. Built with React, Tailwind CSS, and Firebase.

## Features

- **Authentication** — Sign up, log in, Google login (when Firebase configured)
- **Dashboard** — Today's tasks, upcoming, overdue, progress bar, motivational messages
- **Task creation** — Title, description, due date, priority (Low/Medium/High), tags
- **Views** — List, Kanban board, Calendar
- **Smart features** — Search, filter by priority/tag, inline edit, delete confirmation
- **Design** — Soft neutrals, lavender accents, glassmorphism, dark mode, responsive

## Quick start (Demo mode)

Works out of the box with localStorage — no setup required:

```bash
npm install
npm run dev
```

Open http://localhost:5173. Sign up with any email/password (demo mode).

## Firebase setup (optional)

For cloud sync and Google login:

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password + Google)
3. Create a Firestore database
4. Create `.env` in this folder:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

5. Restart the dev server

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run preview` — Preview production build

## Author

Shaheda Tawakalyar
