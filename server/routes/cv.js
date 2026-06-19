import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import CV from '../models/CV.js'

const router = Router()

// GET /api/cv
router.get('/', requireAuth, async (req, res) => {
  const record = await CV.findOne({ userId: req.user.id })
  res.json({ cv: record?.data ?? null })
})

// PUT /api/cv
router.put('/', requireAuth, async (req, res) => {
  const { cv } = req.body
  if (!cv) return res.status(400).json({ error: 'cv is required' })

  await CV.findOneAndUpdate(
    { userId: req.user.id },
    { data: cv },
    { upsert: true, new: true },
  )

  res.json({ ok: true })
})

export default router
