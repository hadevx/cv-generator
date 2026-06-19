# CV Generator

A free, full-stack online CV and resume builder with live preview, 6 professional themes, custom accent colors, and one-click PDF download.

## Features

- **6 CV themes** — Modern, Classic, Minimal, Executive, Creative, Tech
- **Live split-screen preview** — edits appear in real time alongside the form
- **One-click PDF download** — pixel-perfect A4 output via the browser print engine
- **Drag-and-drop ordering** — reorder experience, education, and project entries
- **Custom accent colors** — preset palette + full color picker
- **Skill level indicators** — toggle progress bars / dots per skill
- **Arabic RTL support** — switch the entire CV to Arabic layout
- **Cloud save** — sign in to save and restore your CV from any device
- **Resizable panels** — drag the divider to resize the editor and preview panes
- **Zoom controls** — fit-to-width, 1:1, and a free-range slider

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS 4 |
| UI components | Lucide React, @dnd-kit (drag-and-drop) |
| PDF export | react-to-print |
| Backend | Node.js, Express 5 |
| Database | MongoDB via Mongoose |
| Auth | JWT (7-day tokens) + bcrypt |
| Dev tooling | concurrently, nodemon |

## Prerequisites

- **Node.js** 18+
- **MongoDB** running locally on port `27017`  
  Install from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) or run via Docker:
  ```bash
  docker run -d -p 27017:27017 --name mongo mongo:7
  ```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/cv-generator.git
cd cv-generator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root (one is already provided as a template):

```env
MONGODB_URI=mongodb://localhost:27017/cv_generator
JWT_SECRET=replace_with_a_long_random_secret
PORT=4000
```

> **Important:** Change `JWT_SECRET` to a long random string before deploying to production.

### 4. Start the development servers

```bash
npm run dev
```

This starts both the Vite frontend (port `5173`) and the Express backend (port `4000`) simultaneously using `concurrently`.

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start frontend + backend together (recommended) |
| `npm run client` | Start Vite frontend only |
| `npm run server` | Start Express backend only (with nodemon) |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run db:shell` | Open a MongoDB shell on the `cv_generator` database |

## Project Structure

```
cv-generator/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   └── site.webmanifest
├── server/
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── models/
│   │   ├── User.js          # Mongoose user schema
│   │   └── CV.js            # Mongoose CV schema
│   ├── routes/
│   │   ├── auth.js          # POST /api/auth/register & /login
│   │   └── cv.js            # GET/PUT /api/cv
│   ├── db.js                # MongoDB connection
│   └── index.js             # Express app entry point
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AuthModal.tsx    # Login / register modal
│   │   ├── CVPreview.tsx    # A4 CV renderer (all 6 themes)
│   │   ├── DateInput.tsx    # Month/year picker
│   │   ├── EducationForm.tsx
│   │   ├── ExperienceForm.tsx
│   │   ├── PersonalForm.tsx
│   │   ├── ProjectsForm.tsx
│   │   ├── SkillsForm.tsx
│   │   └── Sortable.tsx     # dnd-kit wrapper
│   ├── contexts/
│   │   └── AuthContext.tsx  # Auth state + JWT persistence
│   ├── api.ts               # Typed fetch wrapper
│   ├── defaultData.ts       # Sample CV data
│   ├── types.ts             # TypeScript interfaces
│   ├── App.tsx              # Root layout and state
│   ├── main.tsx
│   └── index.css
├── .env
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## API Reference

### Authentication

| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/api/auth/register` | `{ email, password, name }` | Create account |
| POST | `/api/auth/login` | `{ email, password }` | Sign in, returns JWT |

### CV

All CV routes require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cv` | Load saved CV |
| PUT | `/api/cv` | Save CV (upsert) |

## Production Build

```bash
npm run build
```

The static frontend is output to `dist/`. Serve it with any static host (Vercel, Netlify, S3) and point the `/api` proxy at your deployed Express server.

## SEO

The app is optimized for search engines with:

- Descriptive `<title>` and `<meta name="description">`
- Open Graph tags for rich social sharing previews
- Twitter Card metadata
- JSON-LD structured data (`WebApplication` schema)
- `robots.txt` allowing all crawlers
- `sitemap.xml` with the canonical URL
- Web App Manifest for installability signals

> Update `https://cv-generator.app/` throughout `index.html`, `robots.txt`, and `sitemap.xml` to match your actual production domain.

## License

MIT
