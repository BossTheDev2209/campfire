import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  serverId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true },
  name:      { type: String, required: true },
  type:      { type: String, enum: ['text', 'voice'], default: 'text' },
  topic:     { type: String, default: '' },
  position:  { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('Channel', schema)
