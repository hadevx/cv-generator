import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'
import { connectDB } from './db.js'
import authRoutes from './routes/auth.js'
import cvRoutes from './routes/cv.js'

const app = express()
const PORT = process.env.PORT ?? 4000
const isProd = process.env.NODE_ENV === 'production'

// In dev allow the Vite ports; in production the same origin serves everything
if (!isProd) {
  app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'], credentials: true }))
}

app.use(express.json({ limit: '1mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/cv', cvRoutes)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Global async error handler (Express 5 propagates async errors automatically)
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: err.message ?? 'Internal server error' })
})

// Serve the built React app in production
if (isProd) {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const distPath = join(__dirname, '../dist')
  if (existsSync(distPath)) {
    app.use(express.static(distPath))
    app.get('/{*path}', (_req, res) => res.sendFile(join(distPath, 'index.html')))
  }
}

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
})
