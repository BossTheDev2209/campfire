import { MongoMemoryServer } from 'mongodb-memory-server'
import path from 'path'
import { mkdir } from 'fs/promises'

const dbPath = path.resolve(import.meta.dir, '..', '.mongo-data')
await mkdir(dbPath, { recursive: true })

console.log('Starting local MongoDB...')
const mongod = await MongoMemoryServer.create({
  instance: { port: 27017, dbPath, storageEngine: 'wiredTiger' },
})

process.env.MONGODB_URI = mongod.getUri('campfire')
console.log(`MongoDB ready at ${process.env.MONGODB_URI}`)

process.on('SIGINT', async () => {
  await mongod.stop({ doCleanup: false })
  process.exit(0)
})

await import('./index.ts')
