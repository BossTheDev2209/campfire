import { Router } from 'express'
import Message from '../models/Message'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(requireAuth)

router.get('/channels/:channelId/messages', async (req: AuthRequest, res) => {
  const { before, limit = '50' } = req.query as any
  const clampedLimit = Math.min(Math.max(Number(limit), 1), 100)
  const query: any = { channelId: req.params.channelId }
  if (before) query.createdAt = { $lt: new Date(before) }
  const messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(clampedLimit)
    .populate('authorId', 'username avatar status')
    .lean()
  const shaped = messages.reverse().map((m: any) => ({ ...m, author: m.authorId }))
  res.json(shaped)
})

const MAX_MESSAGE_LENGTH = 2000

router.post('/channels/:channelId/messages', async (req: AuthRequest, res) => {
  const { content } = req.body
  if (!content?.trim()) return res.status(400).json({ error: 'Content required' })
  if (content.trim().length > MAX_MESSAGE_LENGTH)
    return res.status(400).json({ error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)` })
  const msg = await Message.create({ channelId: req.params.channelId, authorId: req.userId, content })
  const populated = await msg.populate('authorId', 'username avatar status')
  const shaped: any = populated.toObject()
  shaped.author = shaped.authorId
  res.status(201).json(shaped)
})

router.patch('/:id', async (req: AuthRequest, res) => {
  const { content } = req.body
  const msg = await Message.findOne({ _id: req.params.id, authorId: req.userId })
  if (!msg) return res.status(404).json({ error: 'Not found or unauthorized' })
  msg.content = content
  msg.edited = true
  msg.editedAt = new Date()
  await msg.save()
  res.json({ content: msg.content, editedAt: msg.editedAt })
})

router.delete('/:id', async (req: AuthRequest, res) => {
  const msg = await Message.findOneAndDelete({ _id: req.params.id, authorId: req.userId })
  if (!msg) return res.status(404).json({ error: 'Not found or unauthorized' })
  res.json({ ok: true })
})

router.get('/channels/:channelId/search', async (req: AuthRequest, res) => {
  const { q } = req.query as any
  if (!q) return res.json([])
  const messages = await Message.find({
    channelId: req.params.channelId,
    content: { $regex: q, $options: 'i' }
  }).limit(20).populate('authorId', 'username avatar').lean()
  const shaped = messages.map((m: any) => ({ ...m, author: m.authorId }))
  res.json(shaped)
})

export default router
