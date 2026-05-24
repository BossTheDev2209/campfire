import mongoose from 'mongoose'
import 'dotenv/config'
import User from './models/User'
import Server from './models/Server'
import Channel from './models/Channel'
import Member from './models/Member'
import Message from './models/Message'

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/campfire')
  await Promise.all([
    User.deleteMany({}),
    Server.deleteMany({}),
    Channel.deleteMany({}),
    Member.deleteMany({}),
    Message.deleteMany({}),
  ])

  const [u1, u2, u3] = await User.create([
    { username: 'admin', email: 'admin@campfire.dev', password: 'password123' },
    { username: 'alice', email: 'alice@campfire.dev', password: 'password123' },
    { username: 'bob',   email: 'bob@campfire.dev',   password: 'password123' },
  ])

  const [s1, s2] = await Server.create([
    { name: 'Campfire HQ', description: 'Main server', ownerId: u1._id, inviteCode: 'CAMP1234', memberCount: 3 },
    { name: 'Dev Zone',    description: 'Dev stuff',   ownerId: u2._id, inviteCode: 'DEV56789', memberCount: 2 },
  ])

  const [general, random, vc1, vc2] = await Channel.create([
    { serverId: s1._id, name: 'general', type: 'text',  position: 0 },
    { serverId: s1._id, name: 'random',  type: 'text',  position: 1 },
    { serverId: s1._id, name: 'voice-1', type: 'voice', position: 2 },
    { serverId: s1._id, name: 'music',   type: 'voice', position: 3 },
    { serverId: s2._id, name: 'coding',  type: 'text',  position: 0 },
    { serverId: s2._id, name: 'lounge',  type: 'voice', position: 1 },
  ])

  await Member.create([
    { serverId: s1._id, userId: u1._id },
    { serverId: s1._id, userId: u2._id },
    { serverId: s1._id, userId: u3._id },
    { serverId: s2._id, userId: u2._id },
  ])

  const msgs = [
    'Welcome to Campfire! 🔥',
    'This is the real-time chat system.',
    'Try sending a message below!',
    'You can edit or delete your own messages.',
    'Voice channels are on the left too.',
    'This is seeded data from the seed script.',
    'Good luck in the competition! 🚀',
  ]
  const authors = [u1, u2, u3]
  await Message.create(
    msgs.map((content, i) => ({
      channelId: general._id,
      authorId: authors[i % 3]._id,
      content,
    }))
  )

  console.log('Seeded successfully!')
  console.log('Test accounts: admin/alice/bob — password: password123')
  console.log('Invite codes: CAMP1234, DEV56789')
  await mongoose.disconnect()
}

seed().catch(console.error)
