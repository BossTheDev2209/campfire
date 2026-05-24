# Campfire Design Guidelines

Use `DESIGN.md` as the main visual instruction before writing any UI.

## Current Design Source

`DESIGN.md` is now the Claude/Anthropic-inspired source of truth. The app should adapt the brand into product UI, not recreate a marketing page.

Implementation rules:
- Cream canvas is the default app floor.
- Coral is reserved for primary actions, focus, and selected/current state.
- Dark warm surfaces are used sparingly for contrast, not as a Discord-style dark theme.
- Serif display type is allowed for auth headings and empty-state headings only.
- Dense chat/sidebar UI uses sans-serif labels and compact spacing.
- Do not add invite, search, voice, or profile flows as part of visual migration.

## Product Translation

Campfire uses Claude/Anthropic-inspired product UI, not marketing pages.

## Rules

- Use warm cream workspace surfaces.
- Use `#cc785c` only for primary actions, active selections, focus states, and important badges.
- Use 8px radius for buttons and inputs.
- Use 12px radius for panels and cards.
- Use Inter/claudeSans typography for dense UI; Cormorant Garamond serif for auth/empty-state headings only.
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
