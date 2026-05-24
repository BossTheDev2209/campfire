# Campfire Team Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split remaining Campfire work across Person A, Person B, and Person C so the team can ship a stable Discord-style chat demo fast.

**Architecture:** Person A owns client UI and user workflows, Person B owns backend correctness and data routes, Person C owns integration, realtime behavior, and end-to-end demo stability. Everyone branches from `dev`, works in their assigned feature branch, and merges back into `dev` only after local verification.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Zustand, Axios, Bun, Express, Mongoose, MongoDB, Socket.io, simple-peer.

---

## Shared Rules

- Base branch: `dev`
- Person A branch: `feat/person-a`
- Person B branch: `feat/person-b`
- Person C branch: `feat/person-c`
- Stable demo branch: `main`
- Commit small, after each working feature.
- Do not edit another person's main files unless coordinating.
- Before push, run the checks listed for your role.

## Setup For Everyone

- [ ] Clone repo.

```bash
git clone https://github.com/BossTheDev2209/campfire
cd campfire
```

- [ ] Install dependencies.

```bash
bun install
cd client && bun install
cd ../server && bun install
cd ..
```

- [ ] Create environment file.

```bash
cp .env.example .env
```

- [ ] Put real MongoDB URI in `.env`.

```env
MONGODB_URI=mongodb://localhost:27017/campfire
JWT_SECRET=campfire_dev_secret_change_later
PORT=3001
CLIENT_URL=http://localhost:5173
```

- [ ] Seed demo data after MongoDB is running.

```bash
cd server
bun run seed
cd ..
```

- [ ] Run app.

```bash
bun run dev
```

Expected:
- Server runs on `http://localhost:3001`
- Client runs on `http://localhost:5173`
- Login works with `admin@campfire.dev / password123`

---

## Person A Plan: Frontend UI And Workflows

**Branch:** `feat/person-a`

**Primary goal:** Make the app look complete and usable for judges: polished Discord-style layout, working members list display, invite modal UI, profile/status UI, and clear empty/loading/error states.

**Files owned by A:**
- `client/src/pages/LandingPage.tsx`
- `client/src/pages/AppPage.tsx`
- `client/src/components/auth/LoginForm.tsx`
- `client/src/components/auth/RegisterForm.tsx`
- `client/src/components/server/ServerList.tsx`
- `client/src/components/channel/ChannelList.tsx`
- `client/src/components/chat/ChatArea.tsx`
- `client/src/components/chat/MessageList.tsx`
- `client/src/components/chat/MessageItem.tsx`
- `client/src/components/chat/MessageInput.tsx`
- `client/src/components/layout/MembersList.tsx`
- Create `client/src/components/server/InviteModal.tsx`
- Create `client/src/components/layout/UserProfileModal.tsx`
- Create `client/src/components/ui/StatusDot.tsx`

### Task A1: Polish Auth Screen

- [ ] Checkout your branch.

```bash
git checkout feat/person-a
git pull origin feat/person-a
```

- [ ] Improve `LandingPage.tsx`, `LoginForm.tsx`, and `RegisterForm.tsx`.

Requirements:
- Show clear form errors.
- Disable submit button while loading.
- Keep Discord dark theme.
- After login/register, route to `/app`.
- Do not change API paths.

- [ ] Test manually.

```bash
cd client
bun run build
```

Expected: build passes.

- [ ] Commit.

```bash
git add client/src/pages/LandingPage.tsx client/src/components/auth/LoginForm.tsx client/src/components/auth/RegisterForm.tsx
git commit -m "feat: polish auth screens"
```

### Task A2: Finish Members List UI

- [ ] Update `client/src/components/layout/MembersList.tsx`.

Requirements:
- Display members from `useAppStore().members`.
- Group users by online/offline using `onlineUsers`.
- Show avatar circle, username, status dot.
- Empty state: `No members loaded`.
- Keep width stable; no layout jumping.

- [ ] Create shared status dot.

File: `client/src/components/ui/StatusDot.tsx`

Behavior:
- `online` = green
- `idle` = yellow
- `dnd` = red
- `offline` = gray

- [ ] Build.

```bash
cd client
bun run build
```

- [ ] Commit.

```bash
git add client/src/components/layout/MembersList.tsx client/src/components/ui/StatusDot.tsx
git commit -m "feat: add members list UI"
```

### Task A3: Add Invite Modal UI

- [ ] Create `client/src/components/server/InviteModal.tsx`.

Requirements:
- Input for invite code.
- Preview server name/member count after `GET /api/invites/:code`.
- Confirm button calls `POST /api/invites/:code/join`.
- Show loading/error states.
- Close after successful join.

- [ ] Add button to `ServerList.tsx`.

Requirement:
- Add plus button at bottom of server rail.
- Click opens `InviteModal`.

- [ ] Build and manually test with invite code `CAMP1234`.

```bash
cd client
bun run build
```

- [ ] Commit.

```bash
git add client/src/components/server/ServerList.tsx client/src/components/server/InviteModal.tsx
git commit -m "feat: add invite modal"
```

### Task A4: Add Profile And Status UI

- [ ] Create `client/src/components/layout/UserProfileModal.tsx`.

Requirements:
- Show current user username/email.
- Allow status selection: online, idle, dnd, offline.
- Save via `PATCH /api/users/me/status`.
- Optional custom status via `PATCH /api/users/me`.

- [ ] Add profile button to channel sidebar or bottom user bar.

- [ ] Build.

```bash
cd client
bun run build
```

- [ ] Commit.

```bash
git add client/src/components/layout/UserProfileModal.tsx client/src/components/channel/ChannelList.tsx
git commit -m "feat: add profile status UI"
```

### Person A Done Criteria

- [ ] Login/register screens look clean.
- [ ] Server list and channel list are readable.
- [ ] Members panel has real UI.
- [ ] Invite modal works.
- [ ] User status UI exists.
- [ ] `cd client && bun run build` passes.
- [ ] Push branch.

```bash
git push origin feat/person-a
```

---

## Person B Plan: Backend Routes, Validation, Data

**Branch:** `feat/person-b`

**Primary goal:** Make backend reliable: validate inputs, return consistent errors, finish members/search/invite/user routes, and ensure seed data supports demo.

**Files owned by B:**
- `server/src/index.ts`
- `server/src/middleware/auth.ts`
- `server/src/models/User.ts`
- `server/src/models/Server.ts`
- `server/src/models/Channel.ts`
- `server/src/models/Message.ts`
- `server/src/models/Member.ts`
- `server/src/models/VoiceState.ts`
- `server/src/routes/auth.ts`
- `server/src/routes/servers.ts`
- `server/src/routes/channels.ts`
- `server/src/routes/messages.ts`
- `server/src/routes/invites.ts`
- `server/src/routes/users.ts`
- `server/src/seed.ts`

### Task B1: Harden Auth Routes

- [ ] Checkout your branch.

```bash
git checkout feat/person-b
git pull origin feat/person-b
```

- [ ] Update `server/src/routes/auth.ts`.

Requirements:
- Trim/lowercase email.
- Reject password shorter than 6 chars.
- Return consistent `{ error: string }`.
- Never return password hash.

- [ ] Type-check.

```bash
cd server
bunx tsc --noEmit
```

- [ ] Commit.

```bash
git add server/src/routes/auth.ts
git commit -m "fix: harden auth validation"
```

### Task B2: Verify Server, Channel, Member Routes

- [ ] Update `server/src/routes/servers.ts`.

Requirements:
- `GET /api/servers` returns only current user's servers.
- `GET /api/servers/:id/members` returns populated `userId` without password.
- Reject access if user is not member of server.

- [ ] Update `server/src/routes/channels.ts`.

Requirements:
- `GET /api/servers/:serverId/channels` returns sorted channels.
- Reject access if user is not member.

- [ ] Type-check.

```bash
cd server
bunx tsc --noEmit
```

- [ ] Commit.

```bash
git add server/src/routes/servers.ts server/src/routes/channels.ts
git commit -m "fix: protect server channel routes"
```

### Task B3: Harden Message Routes

- [ ] Update `server/src/routes/messages.ts`.

Requirements:
- `GET /api/channels/:channelId/messages` paginates with `before` and `limit`.
- Max limit: 100.
- `POST /api/channels/:channelId/messages` rejects empty/too-long content.
- `PATCH /api/messages/:id` only edits own message.
- `DELETE /api/messages/:id` only deletes own message.
- Search route: `GET /api/channels/:channelId/search?q=...`.

- [ ] Type-check.

```bash
cd server
bunx tsc --noEmit
```

- [ ] Commit.

```bash
git add server/src/routes/messages.ts
git commit -m "fix: harden message routes"
```

### Task B4: Improve Seed Data

- [ ] Update `server/src/seed.ts`.

Requirements:
- 3 users: admin, alice, bob.
- 2 servers.
- At least 6 channels total.
- At least 20 messages in general channel.
- All passwords: `password123`.
- Print exact login credentials and invite codes.

- [ ] Run seed against local MongoDB.

```bash
cd server
bun run seed
```

Expected:
- `Seeded successfully!`
- Login credentials printed.

- [ ] Commit.

```bash
git add server/src/seed.ts
git commit -m "chore: improve demo seed data"
```

### Person B Done Criteria

- [ ] `cd server && bunx tsc --noEmit` passes.
- [ ] `cd server && bun run seed` works with MongoDB running.
- [ ] Auth, server, channel, message, invite, user routes return JSON errors consistently.
- [ ] Push branch.

```bash
git push origin feat/person-b
```

---

## Person C Plan: Integration, Realtime, Demo Stability

**Branch:** `feat/person-c`

**Primary goal:** Wire frontend and backend together: members fetch, socket rooms, realtime messages, presence, search UI integration, and demo flow testing.

**Files owned by C:**
- `client/src/api/index.ts`
- `client/src/hooks/useSocket.ts`
- Create `client/src/hooks/useMembers.ts`
- Create `client/src/hooks/useChannelMessages.ts`
- Create `client/src/hooks/useSearchMessages.ts`
- `client/src/store/appStore.ts`
- `client/src/pages/AppPage.tsx`
- `client/src/components/chat/MessageList.tsx`
- `client/src/components/chat/MessageInput.tsx`
- `server/src/socket/handlers.ts`

### Task C1: Fetch Members When Server Changes

- [ ] Checkout your branch.

```bash
git checkout feat/person-c
git pull origin feat/person-c
```

- [ ] Create `client/src/hooks/useMembers.ts`.

Behavior:
- Accept `serverId`.
- Call `GET /api/servers/:serverId/members`.
- Save result to `useAppStore().setMembers`.
- Handle missing serverId safely.

- [ ] Use it in `client/src/pages/AppPage.tsx`.

- [ ] Build.

```bash
cd client
bun run build
```

- [ ] Commit.

```bash
git add client/src/hooks/useMembers.ts client/src/pages/AppPage.tsx
git commit -m "feat: fetch server members"
```

### Task C2: Fix Socket Room Joining

- [ ] Update `client/src/hooks/useSocket.ts`.

Requirements:
- Keep one socket connection per logged-in user.
- Export helper functions:
  - `joinServer(serverId: string)`
  - `joinChannel(channelId: string)`
  - `leaveChannel(channelId: string)`
- Listen for:
  - `message:new`
  - `message:updated`
  - `message:deleted`
  - `presence:update`

- [ ] Update `AppPage.tsx`.

Behavior:
- Join server room when `serverId` changes.
- Join channel room when `channelId` changes.
- Leave old channel on channel change.

- [ ] Build.

```bash
cd client
bun run build
```

- [ ] Commit.

```bash
git add client/src/hooks/useSocket.ts client/src/pages/AppPage.tsx
git commit -m "feat: join socket rooms"
```

### Task C3: Fix Realtime Message Payloads

- [ ] Update `server/src/socket/handlers.ts`.

Problem:
- Current `message:send` emits only `{ messageId }`, but client expects full `Message`.

Requirement:
- Either emit full message from REST response through socket, or have clients refetch.
- Best fast path: client emits full `message`; server broadcasts that message.

Expected client emit:

```ts
getSocket()?.emit('message:send', { channelId, message: data })
```

Expected server broadcast:

```ts
socket.to(`channel_${channelId}`).emit('message:new', message)
```

- [ ] Update `client/src/components/chat/MessageInput.tsx`.

- [ ] Type-check and build.

```bash
cd server
bunx tsc --noEmit
cd ../client
bun run build
```

- [ ] Commit.

```bash
git add server/src/socket/handlers.ts client/src/components/chat/MessageInput.tsx
git commit -m "fix: broadcast full realtime messages"
```

### Task C4: Add Search Integration

- [ ] Create `client/src/hooks/useSearchMessages.ts`.

Behavior:
- Accept `channelId` and search text.
- Call `GET /api/channels/:channelId/search?q=<query>`.
- Return results, loading, error.

- [ ] Add search input in `ChatArea.tsx` header.

Behavior:
- Search text filters by backend search result.
- Empty search shows normal message list.
- Keep UI simple.

- [ ] Build.

```bash
cd client
bun run build
```

- [ ] Commit.

```bash
git add client/src/hooks/useSearchMessages.ts client/src/components/chat/ChatArea.tsx
git commit -m "feat: wire message search"
```

### Task C5: Demo Flow Test

- [ ] Start full app.

```bash
bun run dev
```

- [ ] Open two browser windows.

Window 1:
- Login `admin@campfire.dev / password123`

Window 2:
- Login `alice@campfire.dev / password123`

- [ ] Verify:
- Both users see servers.
- Both users see channels.
- Both users see seeded messages.
- Sending message in Window 1 appears in Window 2 without refresh.
- Editing/deleting own message updates local UI.
- Members list appears.
- Invite code `CAMP1234` can be previewed/joined.

- [ ] Commit any small integration fixes.

```bash
git add client server
git commit -m "fix: stabilize demo flow"
```

### Person C Done Criteria

- [ ] `cd client && bun run build` passes.
- [ ] `cd server && bunx tsc --noEmit` passes.
- [ ] Two-browser realtime chat works.
- [ ] Members list receives data.
- [ ] Search works.
- [ ] Push branch.

```bash
git push origin feat/person-c
```

---

## Merge Order Into Dev

1. Person B merges first because backend routes define contracts.
2. Person C merges second because integration depends on B routes.
3. Person A merges third because UI polish can adapt after contracts settle.

Commands from each finished branch:

```bash
git checkout dev
git pull origin dev
git merge --no-ff feat/person-b
git push origin dev

git merge --no-ff feat/person-c
git push origin dev

git merge --no-ff feat/person-a
git push origin dev
```

After all merges:

```bash
cd client && bun run build
cd ../server && bunx tsc --noEmit
cd ..
bun run dev
```

Final demo checklist:
- [ ] Fresh login works.
- [ ] Seeded server list loads.
- [ ] Channel list loads.
- [ ] Message history loads.
- [ ] New chat messages appear realtime.
- [ ] Edit/delete own message works.
- [ ] Members list displays.
- [ ] Invite modal works.
- [ ] Search works.
- [ ] No console errors during normal demo.

