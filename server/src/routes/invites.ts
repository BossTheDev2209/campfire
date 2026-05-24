import { Router } from 'express'
import Server from '../models/Server'
import Member from '../models/Member'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

router.get('/:code', async (req, res) => {
  const server = await Server.findOne({ inviteCode: req.params.code })
  if (!server) return res.status(404).json({ error: 'Invalid invite code' })
  res.json({
    serverName: server.name,
    serverIcon: server.icon,
    memberCount: server.memberCount,
    inviteCode: server.inviteCode,
  })
})

router.post('/:code/join', requireAuth, async (req: AuthRequest, res) => {
  const server = await Server.findOne({ inviteCode: req.params.code })
  if (!server) return res.status(404).json({ error: 'Invalid invite code' })
  try {
    await Member.create({ serverId: server._id, userId: req.userId })
    await Server.findByIdAndUpdate(server._id, { $inc: { memberCount: 1 } })
    res.json({ serverId: server._id })
  } catch (e: any) {
    if (e.code === 11000) return res.status(400).json({ error: 'Already a member' })
    res.status(500).json({ error: 'Join failed' })
  }
})

export default router
