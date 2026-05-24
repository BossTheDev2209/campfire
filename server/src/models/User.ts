import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const schema = new mongoose.Schema({
  username:     { type: String, required: true, unique: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String, required: true },
  avatar:       { type: String, default: null },
  status:       { type: String, enum: ['online','idle','dnd','offline'], default: 'offline' },
  customStatus: { type: String, default: '' },
}, { timestamps: true })

schema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

schema.methods.comparePassword = function(plain: string) {
  return bcrypt.compare(plain, this.password)
}

export default mongoose.model('User', schema)
