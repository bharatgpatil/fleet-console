# Fleet Console

A live view of warehouse robots across several sites. You can see where each robot is, how it's doing, what happened
in the last few minutes, and which problems need a person.

## What it does

- **Fleet page.** Counts of critical, offline and warning robots across the fleet, one tab per site (the busiest opens
  first), a floor plan with every robot on it, and a table you can search and filter by status. Everything updates
  live. Clicking a count shows those robots across all sites.
- **Robot page.** Live battery, activity, speed and position, open alerts with Ack, alerts closed in the last 30
  minutes, a battery chart and the robot's path over the last 15 minutes.
- **Needs you.** A drawer with every open alert nobody has acknowledged, critical first. Ack one or all shown.
- **Knowing what to trust.** A robot turns stale after 5 s without a report and offline after 30 s; the map draws it
  dashed or hollow and the table greys its values. If the browser itself stops getting updates for 3 s, a banner says
  so and shows the time of the last data. If the server can't be reached at all, the loading screen says so.

## Running it

You need Node 22.13 or newer.

```
npm install
npm run dev
```

Then open http://localhost:3000. This starts the server, the simulator and the web app with live reload.

Or with Docker, no Node needed:

```
docker compose up --build
```

Then open http://localhost:8080. One container runs the server, which also serves the built web app, and the
simulator.

To change ports, the number of robots or how often things go wrong, copy `.env.example` to `.env` and edit it. Before
committing, run `npm run format` and `npm run check`.

## Deploying

The Docker image runs on any host that runs a container and allows WebSockets, such as Fly.io, Render or Railway. It
listens on port 8080 and answers health checks on `/healthz`. Run exactly one instance: all state lives in that
process.

## How data moves

The simulator plays the robots and sends their reports to the server twice a second. The server checks each report,
updates its picture of the fleet and opens or closes alerts. Each browser keeps a WebSocket open. It gets the full
picture once, then only what changed, four times a second. The Robot page also asks the server for that robot's last
15 minutes every 5 s.

## What's faked, and why

- **The robots.** A simulator with a fixed seed plays 570 robots over three sites. It makes trouble on purpose: robots
  drop out for 8 to 75 s, some reports arrive late or twice, robots reboot and restart their numbering, report errors,
  and one robot per site wanders off its floor plan. Real robots would post the same batch format to the same endpoint.
- **Storage.** Everything is in memory, so setup is one command. A restart loses alerts, acknowledgements and history.
- **History.** Only 15 minutes per robot, one point every 5 s.
- **People.** No login. An Ack isn't tied to a person.
- **Floor plans.** Rectangles with chargers, no walls or aisles.

## Key decisions

- **One source of truth for data shapes.** Every message between apps is a zod schema in `packages/contracts`, checked
  wherever it arrives. ([ADR 1](docs/adr/0001-shared-contracts.md))
- **Snapshot, then changes, over one stream.** Messages are numbered. Any gap, bad message or silence makes the browser
  reconnect and start from a fresh snapshot, so there is one way to recover. ([ADR 2](docs/adr/0002-live-stream-protocol.md))
- **Order and liveness on the server.** Reports are ordered by the robot's own sequence number, liveness uses the time
  the server received them, and alerts are rules over the latest state with a gap between opening and closing so
  they don't flap. ([ADR 3](docs/adr/0003-ordering-and-liveness.md))
- **Three kinds of browser state.** Pushed data in one zustand store applied once per frame, requests (Ack, history)
  through TanStack Query, and the current view in the URL. ([ADR 4](docs/adr/0004-client-state.md))
- **History beside the stream, not on it.** ([ADR 5](docs/adr/0005-recent-history.md))
- **Rules in one place.** Business rules live in `packages/domain` as plain functions and the `FleetEngine`. The
  server runs them and the UI reads their thresholds; neither re-implements them.

## How it's organised

| Folder                | What it does                                                      |
| --------------------- | ----------------------------------------------------------------- |
| `packages/contracts`  | The shapes of all data the apps send each other                   |
| `packages/domain`     | When a robot counts as offline, when an alert opens or closes     |
| `packages/simulation` | Pretend robots that drive around, drain batteries and drop out    |
| `apps/simulator`      | Runs the pretend robots and sends their reports to the server     |
| `apps/server`         | Takes in reports, keeps the current state, streams it to browsers |
| `apps/web`            | The console itself                                                |

The coding rules are in [CLAUDE.md](CLAUDE.md).

## What I'd change for production

**Scale**

- Move live state and alerts to a shared store and split the engine by site, so several server instances can run.
  Fan out stream updates through pub/sub (Redis or NATS).
- Take reports through a queue instead of HTTP batches, so a burst or a slow server doesn't drop data.
- Send each browser only the sites it's looking at. Today every browser gets every robot.
- Keep history in a time-series database (TimescaleDB or similar) for days, not minutes, and downsample older data.
- Past a few thousand robots per site, draw the map on a canvas instead of SVG.

**Failures**

- Persist alerts and acknowledgements so a restart doesn't reopen what someone already handled.
- Give each robot a token for posting reports, and put the console behind single sign-on, with each Ack recorded
  against a person.
- Alert on the whole feed going quiet, not only on single robots.

**Monitoring**

- Metrics for reports per second, late and duplicate counts (the server already counts them per batch), connected
  browsers, slow browsers dropped, time to send each update and event-loop lag.
- Send browser errors caught by the error screen to an error tracker such as Sentry.
- Dashboards and paging on those, plus the structured logs the server already writes.

## Test plan

`npm test` runs the Vitest tests for the core logic: connectivity, report ordering, alert rules, the fleet engine,
history, the browser store's message handling, robot health and the battery chart's gaps. They sit next to the code as
`*.test.ts` and run in CI.

The rest of this plan isn't automated yet. It lists what to cover and at which level, most valuable first.

### Rules and helpers (unit tests, no server or browser)

- **Connectivity:** a robot is online, turns stale after 5 s of silence and offline after 30 s. A robot that never
  reported is offline.
- **Report order:** a newer sequence is applied, the same one is a duplicate, an older one is late. A big drop in
  sequence with a newer timestamp counts as a reboot and is applied.
- **Alert rules:** battery low below 20%, critical below 10% even while charging, no low alert while charging. A low
  alert stays open until the battery passes 25%. An error report opens an error alert. Offline opens an alert only
  for a robot that reported before, and battery and error alerts stay open while it's offline.
- **Fleet engine:** one alert per cause, closed when the cause clears. Ack sets the time once. Closed alerts are dropped
  after 30 minutes. Late, duplicate and unknown reports are counted, not applied. A delta holds only what changed.
- **History:** a robot keeps one point every 5 s, and points older than 15 minutes are dropped. A gap of more than
  30 s breaks the battery line.
- **Simulation:** the same seed gives the same fleet and the same moves. Robots stay inside their site.
- **Web helpers:** `reduceMessages` (a snapshot loads everything, deltas before it are ignored, an empty heartbeat
  changes nothing, the clock offset is set), `robotHealth`, `filterRows`, `rankNeedsYou`, `backoffDelay` and
  `toMapRobot`.

### Server (in process, no network)

- **REST:** ingest rejects a bad batch with 400 and reports late and duplicate counts. Ack returns the alert, and an
  unknown id gives 404. `/healthz` answers.
- **Stream:** the first message is a snapshot with sequence 0. Deltas follow every 250 ms, one number higher each time,
  with an empty delta when nothing changed. A client with more than 2 MB waiting is dropped.

### Browser client

- **Stream:** with a fake socket, it reconnects with backoff after a skipped number, a bad message, 5 s of silence or a
  close, and resets the backoff after a snapshot.
- **Ack:** the alert updates at once, rolls back with a message if the server refuses, and an alert that closed in the
  meantime isn't brought back.

### End to end (Playwright against the real stack with a fixed seed)

- Fleet opens on the busiest site. A KPI click shows all sites, filtered. Search matches names. A row click opens the
  robot, and an unknown robot id shows "not found".
- Needs you lists critical alerts first. Ack removes the item and focus moves to the next one.
- With the server stopped, the loading screen says it can't reach the server after 5 s. When the server comes back,
  data returns without a reload.
- A robot that stops reporting shows the stale banner, then the offline one.
- The Robot page shows a battery chart and a path on the map after a minute of reports. Ack all clears the shown
  alerts in Needs you.
- With the stream blocked, the "Updates paused" banner appears within 3 s and goes away once data flows again.

### By hand

- Keyboard only through the Fleet page, the Robot page and the drawer. A screen reader reads the headings and the table.
- Widths of 375, 768, 1280 and 2560 px (21:9).
- An axe scan shows no violations.
- With a large fleet (`FLEET_ROBOTS_PER_SITE=1000`), the map and table stay smooth.
