import { Router } from 'express'
import User from '../models/User'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(requireAuth)

router.get('/me', async (req: AuthRequest, res) => {
  const user = await User.findById(req.userId).select('-password')
  res.json(user)
})

router.patch('/me', async (req: AuthRequest, res) => {
  const { username, avatar, customStatus } = req.body
  const user = await User.findByIdAndUpdate(req.userId, { username, avatar, customStatus }, { new: true }).select('-password')
  res.json(user)
})

router.patch('/me/status', async (req: AuthRequest, res) => {
  const { status } = req.body
  const user = await User.findByIdAndUpdate(req.userId, { status }, { new: true }).select('-password')
  res.json(user)
})

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if (!user) return res.status(404).json({ error: 'Not found' })
  res.json(user)
})

export default router
