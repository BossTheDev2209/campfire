# Notion Design Adoption Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the installed Notion-inspired `DESIGN.md` the main design instruction for Campfire UI work, then apply it safely to the React app without breaking the chat demo.

**Architecture:** Treat `DESIGN.md` as the visual source of truth, but adapt it to Campfire as a product UI rather than copying Notion marketing pages literally. Create missing product context, map Notion tokens into Tailwind, then update shared UI surfaces before feature-specific screens.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Zustand, Axios, Bun, Express, Socket.io, `getdesign` Notion `DESIGN.md`.

---

## Current State

- `npx.cmd getdesign@latest add notion` has been run.
- It created `DESIGN.md` at the repo root.
- `DESIGN.md` is Notion-inspired and includes colors, typography, spacing, radius, and component tokens.
- `PRODUCT.md` is missing.
- Campfire currently uses Discord-style dark Tailwind tokens in `client/tailwind.config.ts`.

## Key Decision

Use `DESIGN.md` as the main design instruction, but translate it into a Campfire product interface:

- Keep: Notion-like typography, sober geometry, 8px buttons, 12px panels, restrained controls, clean workspace feel.
- Adapt: Campfire still needs a chat-first layout, server rail, channel list, message stream, members panel.
- Avoid: copying Notion homepage marketing sections, large hero bands, pricing cards, decorative sticky-note visuals.

---

## Task 1: Create Campfire Product Context

**Files:**
- Create: `PRODUCT.md`
- Read: `DESIGN.md`

- [ ] Create `PRODUCT.md` at the repo root.

Use this content:

```markdown
# Campfire Product Context

## Product Purpose

Campfire is a Discord-style team chat app for a web development competition. The product must show a working login, server list, channel list, realtime chat, members list, invite flow, search, and basic voice presence.

## Register

product

## Primary Users

Judges and student teammates using the app during a short demo. They need to understand the interface quickly and see real functionality without setup confusion.

## User State Of Mind

Focused, time-constrained, and evaluating whether the app works. The interface should feel stable, organized, and easy to scan.

## Design Direction

Use the installed Notion-inspired DESIGN.md as the main visual source. Translate it into a product UI: restrained surfaces, sober geometry, clear hierarchy, compact controls, and predictable states.

## Anti-References

- Do not make a marketing landing page.
- Do not copy Discord's exact dark theme after the Notion design migration.
- Do not use decorative hero sections inside the app.
- Do not use glassmorphism, gradient text, side-stripe card accents, or generic SaaS card grids.
- Do not hide core chat actions behind unclear icons.

## Success Criteria

- Users can log in and understand the app immediately.
- Server, channel, message, and member regions are visually distinct.
- Chat remains dense enough for repeated use.
- Buttons, inputs, panels, and empty states follow the Notion-inspired tokens.
- Demo flow has no visual layout breaks on desktop or mobile.
```

- [ ] Verify impeccable context loads both files.

Run:

```bash
node C:\Users\nipon.khan\.codex\skills\impeccable\scripts\load-context.mjs
```

Expected:

```text
"hasProduct": true
"hasDesign": true
```

- [ ] Commit.

```bash
git add PRODUCT.md DESIGN.md
git commit -m "docs: add notion design context"
```

---

## Task 2: Map Notion Tokens Into Tailwind

**Files:**
- Modify: `client/tailwind.config.ts`
- Read: `DESIGN.md`

- [ ] Replace the old Discord-only `dc` color scale with a Notion/Campfire token set.

Target token groups:

```ts
colors: {
  notion: {
    primary: '#5645d4',
    primaryPressed: '#4534b3',
    navy: '#0a1530',
    canvas: '#ffffff',
    surface: '#f6f5f4',
    surfaceSoft: '#fafaf9',
    hairline: '#e5e3df',
    hairlineStrong: '#c8c4be',
    ink: '#1a1a1a',
    charcoal: '#37352f',
    slate: '#5d5b54',
    steel: '#787671',
    muted: '#bbb8b1',
    success: '#1aae39',
    warning: '#dd5b00',
    error: '#e03131',
    tintPeach: '#ffe8d4',
    tintRose: '#fde0ec',
    tintMint: '#d9f3e1',
    tintLavender: '#e6e0f5',
    tintSky: '#dcecfa',
    tintYellow: '#fef7d6',
  },
}
```

- [ ] Add shared radius values.

```ts
borderRadius: {
  notionXs: '4px',
  notionSm: '6px',
  notionMd: '8px',
  notionLg: '12px',
  notionXl: '16px',
}
```

- [ ] Add font family.

```ts
fontFamily: {
  notion: ['Inter', 'Notion Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
}
```

- [ ] Build client.

```bash
cd client
bun run build
```

Expected: build passes.

- [ ] Commit.

```bash
git add client/tailwind.config.ts
git commit -m "style: add notion design tokens"
```

---

## Task 3: Convert Global App Shell

**Files:**
- Modify: `client/src/index.css`
- Modify: `client/src/pages/AppPage.tsx`
- Modify: `client/src/components/server/ServerList.tsx`
- Modify: `client/src/components/channel/ChannelList.tsx`
- Modify: `client/src/components/chat/ChatArea.tsx`
- Modify: `client/src/components/layout/MembersList.tsx`

- [ ] Update global typography in `client/src/index.css`.

Rules:

- Body uses `font-family: Inter, Notion Sans, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif`.
- Body background uses Notion canvas or surface, not Discord dark gray.
- Scrollbar remains subtle and functional.

- [ ] Update app shell layout.

Rules:

- Server rail: compact, muted surface.
- Channel list: slightly warmer panel.
- Chat area: white/canvas message surface.
- Members list: soft surface panel.
- Borders: `1px solid notion.hairline`.
- No nested cards.
- No decorative gradients.

- [ ] Keep the current functional layout.

Do not change routing, Zustand store usage, API calls, or socket hooks in this task.

- [ ] Build client.

```bash
cd client
bun run build
```

- [ ] Commit.

```bash
git add client/src/index.css client/src/pages/AppPage.tsx client/src/components/server/ServerList.tsx client/src/components/channel/ChannelList.tsx client/src/components/chat/ChatArea.tsx client/src/components/layout/MembersList.tsx
git commit -m "style: apply notion app shell"
```

---

## Task 4: Convert Core Components

**Files:**
- Modify: `client/src/components/auth/LoginForm.tsx`
- Modify: `client/src/components/auth/RegisterForm.tsx`
- Modify: `client/src/components/chat/MessageInput.tsx`
- Modify: `client/src/components/chat/MessageItem.tsx`
- Modify: `client/src/components/chat/MessageList.tsx`

- [ ] Convert buttons to Notion-style rectangles.

Rules:

- Primary button background: `notion.primary`.
- Radius: 8px.
- Height: 40 to 44px.
- Font size: 14px.
- Weight: 500.
- No pill buttons except tags/status badges.

- [ ] Convert inputs.

Rules:

- Background: white/canvas.
- Border: hairline strong.
- Focus border: primary purple.
- Height: 44px.
- Radius: 8px.

- [ ] Convert message items.

Rules:

- Keep dense chat readability.
- Use subtle hover background.
- Edit/delete actions remain discoverable.
- Timestamp is muted.
- Author name uses medium weight.

- [ ] Build client.

```bash
cd client
bun run build
```

- [ ] Commit.

```bash
git add client/src/components/auth/LoginForm.tsx client/src/components/auth/RegisterForm.tsx client/src/components/chat/MessageInput.tsx client/src/components/chat/MessageItem.tsx client/src/components/chat/MessageList.tsx
git commit -m "style: convert core components to notion system"
```

---

## Task 5: Add Design Enforcement Notes For Teammates

**Files:**
- Create: `docs/design-guidelines.md`

- [ ] Create `docs/design-guidelines.md`.

Use this content:

```markdown
# Campfire Design Guidelines

Use `DESIGN.md` as the main visual instruction before writing any UI.

## Product Translation

Campfire uses Notion-inspired product UI, not Notion marketing pages.

## Rules

- Use restrained workspace surfaces.
- Use `#5645d4` only for primary actions, active selections, focus states, and important badges.
- Use 8px radius for buttons and inputs.
- Use 12px radius for panels and cards.
- Use Inter/Notion Sans style typography.
- Keep chat dense and scannable.
- Use skeletons or quiet empty states, not centered spinners everywhere.
- Avoid nested cards.
- Avoid gradient text.
- Avoid glassmorphism.
- Avoid side-stripe accent borders.
- Avoid decorative hero sections inside the app.

## Review Checklist

- Does the UI still help users complete chat tasks quickly?
- Are primary actions visually consistent?
- Are empty, loading, error, hover, focus, and disabled states covered?
- Does text fit on mobile?
- Does the page work at desktop width and mobile width?
```

- [ ] Commit.

```bash
git add docs/design-guidelines.md
git commit -m "docs: add design implementation guidelines"
```

---

## Task 6: Final Verification

**Files:**
- Verify only.

- [ ] Run client build.

```bash
cd client
bun run build
```

Expected: build passes.

- [ ] Run server type-check.

```bash
cd ../server
bunx tsc --noEmit
```

Expected: no TypeScript errors.

- [ ] Run full app.

```bash
cd ..
bun run dev
```

Expected:

- Login page loads.
- App page loads.
- Server rail, channel list, chat, and members list render.
- No obvious overflow or unreadable text.
- No console errors from UI-only changes.

- [ ] Push branch.

```bash
git push origin feat/person-a
```

---

## Team Usage Rule

Every teammate must read these before touching UI:

1. `PRODUCT.md`
2. `DESIGN.md`
3. `docs/design-guidelines.md`

Person A owns the visual conversion. Person B should not redesign backend-related UI. Person C may adjust integration UI states, but must follow `DESIGN.md` and `docs/design-guidelines.md`.

