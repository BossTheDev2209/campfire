import { Router } from 'express'
import Channel from '../models/Channel'
import Member from '../models/Member'
import VoiceState from '../models/VoiceState'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(requireAuth)

router.get('/:serverId/channels', async (req: AuthRequest, res) => {
  const membership = await Member.findOne({ serverId: req.params.serverId, userId: req.userId })
  if (!membership) return res.status(403).json({ error: 'Not a member of this server' })
  const channels = await Channel.find({ serverId: req.params.serverId }).sort('position')
  res.json(channels)
})

router.get('/:serverId/voice-states', async (req: AuthRequest, res) => {
  const membership = await Member.findOne({ serverId: req.params.serverId, userId: req.userId })
  if (!membership) return res.status(403).json({ error: 'Not a member of this server' })

  const states = await VoiceState.find({ serverId: req.params.serverId })
    .populate('userId', 'username avatar status')
    .lean()

  res.json(states.map((state: any) => ({
    _id: state._id,
    serverId: state.serverId,
    channelId: state.channelId,
    userId: state.userId?._id ?? state.userId,
    user: state.userId,
    muted: state.muted,
    deafened: state.deafened,
    updatedAt: state.updatedAt,
  })))
})

export default router
