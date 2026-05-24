import mongoose from 'mongoose'
import crypto from 'crypto'

const schema = new mongoose.Schema({
  name:        { type: String, required: true },
  icon:        { type: String, default: null },
  description: { type: String, default: '' },
  ownerId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inviteCode:  { type: String, unique: true, default: () => crypto.randomBytes(4).toString('hex').toUpperCase() },
  memberCount: { type: Number, default: 1 },
}, { timestamps: true })

export default mongoose.model('Server', schema)
