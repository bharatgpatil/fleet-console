# Fleet Console

Real-time console for warehouse robot fleets: live floor plans, robot status, and the alerts that need a person.

## Run it

| What                         | Command                            | Open                  |
| ---------------------------- | ---------------------------------- | --------------------- |
| Dev: server + simulator + UI | `npm install` then `npm run dev`   | http://localhost:3000 |
| Typecheck, lint, format      | `npm run check` · `npm run format` |                       |

- Node ≥ 22.

## Layout

```
packages/contracts   zod schemas shared by every app
packages/domain      pure rules + FleetEngine
packages/simulation  robot model + fault injection
apps/server          Fastify, WebSocket fan-out, state in memory
apps/simulator       runs the simulation, posts batches
apps/web             api/ · live/ · app/ (layout, theme) · features/<name>/{components,hooks,queries,mutations,utils} · shared/
```

Conventions: [CLAUDE.md](CLAUDE.md).

## Status

Scaffold only: configs, theme and empty entry points. The UI target is the clickable prototype.
