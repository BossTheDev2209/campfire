import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  serverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true },
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  joinedAt: { type: Date, default: Date.now },
})

schema.index({ serverId: 1, userId: 1 }, { unique: true })

export default mongoose.model('Member', schema)
