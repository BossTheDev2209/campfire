import { Router } from 'express'
import Channel from '../models/Channel'
import Member from '../models/Member'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(requireAuth)

router.get('/:serverId/channels', async (req: AuthRequest, res) => {
  const membership = await Member.findOne({ serverId: req.params.serverId, userId: req.userId })
  if (!membership) return res.status(403).json({ error: 'Not a member of this server' })
  const channels = await Channel.find({ serverId: req.params.serverId }).sort('position')
  res.json(channels)
})

export default router
