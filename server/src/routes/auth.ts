import { Router } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) return res.status(400).json({ error: 'All fields required' })
    const user = await User.create({ username, email, password })
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET ?? 'secret', { expiresIn: '7d' })
    res.json({ token, user: { _id: user._id, username: user.username, email: user.email, status: user.status } })
  } catch (e: any) {
    res.status(400).json({ error: e.code === 11000 ? 'Username or email already taken' : 'Registration failed' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await (user as any).comparePassword(password)))
      return res.status(401).json({ error: 'Invalid credentials' })
    await User.findByIdAndUpdate(user._id, { status: 'online' })
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET ?? 'secret', { expiresIn: '7d' })
    res.json({ token, user: { _id: user._id, username: user.username, email: user.email, status: 'online' } })
  } catch {
    res.status(500).json({ error: 'Login failed' })
  }
})

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = await User.findById(req.userId).select('-password')
  if (!user) return res.status(404).json({ error: 'Not found' })
  res.json(user)
})

export default router
