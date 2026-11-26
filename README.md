# Fleet Console

A live view of warehouse robots across several sites. You can see where each robot is, how it's doing, and which
problems need a person.

## Running it

You need Node 22.13 or newer.

```
npm install
npm run dev
```

Then open http://localhost:3000.

To change ports or how the pretend robots behave, copy `.env.example` to `.env` and edit it.

Before committing, run `npm run format` and `npm run check`.

## How it's organised

| Folder                | What it does                                                      | Status     |
| --------------------- | ----------------------------------------------------------------- | ---------- |
| `packages/contracts`  | The shapes of all data the apps send each other                   | Done       |
| `packages/domain`     | The rules: when a robot counts as offline, when an alert opens    | Done       |
| `packages/simulation` | Pretend robots that drive around, drain batteries and drop out    | Done       |
| `apps/simulator`      | Runs the pretend robots and sends their reports to the server     | Done       |
| `apps/server`         | Takes in reports, keeps the current state, streams it to browsers | Stub       |
| `apps/web`            | The console itself                                                | Theme only |

The reasons behind the main choices are written up in [docs/adr](docs/adr). The coding rules are in
[CLAUDE.md](CLAUDE.md).
