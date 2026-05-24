import { Router } from 'express'
import Server from '../models/Server'
import Member from '../models/Member'
import User from '../models/User'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(requireAuth)

router.get('/', async (req: AuthRequest, res) => {
  const memberships = await Member.find({ userId: req.userId })
  const serverIds = memberships.map((m) => m.serverId)
  const servers = await Server.find({ _id: { $in: serverIds } })
  res.json(servers)
})

router.get('/:id', async (req: AuthRequest, res) => {
  const server = await Server.findById(req.params.id)
  if (!server) return res.status(404).json({ error: 'Not found' })
  res.json(server)
})

router.get('/:id/members', async (req: AuthRequest, res) => {
  const members = await Member.find({ serverId: req.params.id }).populate('userId', '-password')
  res.json(members)
})

export default router
