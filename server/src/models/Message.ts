import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  authorId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:   { type: String, required: true },
  edited:    { type: Boolean, default: false },
  editedAt:  { type: Date, default: null },
}, { timestamps: true })

schema.index({ channelId: 1, createdAt: -1 })

export default mongoose.model('Message', schema)
