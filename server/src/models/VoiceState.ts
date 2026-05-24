import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  muted:     { type: Boolean, default: false },
  deafened:  { type: Boolean, default: false },
}, { timestamps: true })

schema.index({ channelId: 1, userId: 1 }, { unique: true })

export default mongoose.model('VoiceState', schema)
