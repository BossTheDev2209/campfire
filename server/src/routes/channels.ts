import { Router } from 'express'
import Channel from '../models/Channel'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(requireAuth)

router.get('/servers/:serverId', async (req, res) => {
  const channels = await Channel.find({ serverId: req.params.serverId }).sort('position')
  res.json(channels)
})

export default router
