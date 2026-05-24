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

Use the installed Claude/Anthropic-inspired DESIGN.md as the main visual source. Translate it into a product UI: warm cream canvas, coral primary actions, dark product-surface contrast where useful, editorial serif display moments for auth and empty states, compact sans UI labels, and predictable task-focused chat layout.

## Anti-References

- Do not keep the Notion purple visual system after this migration.
- Do not copy Discord's exact dark theme.
- Do not make the authenticated app a Claude marketing page.
- Do not use glassmorphism, gradient text, side-stripe accents, or generic SaaS card grids.
- Do not use coral on every element; reserve it for primary/current states and a few high-signal moments.
- Do not hide core chat actions behind unclear icons.

## Success Criteria

- Users can log in and understand the app immediately.
- Server, channel, message, and member regions are visually distinct.
- Chat remains dense enough for repeated use.
- Buttons, inputs, panels, and empty states follow the Notion-inspired tokens.
- Demo flow has no visual layout breaks on desktop or mobile.
