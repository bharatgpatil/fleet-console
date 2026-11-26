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

To change ports, the number of robots or how they behave, copy `.env.example` to `.env` and edit it. Before
committing, run `npm run format` and `npm run check`.

## How data moves

The simulator plays the robots and sends their reports to the server twice a second. The server checks each report,
updates its picture of the fleet and opens or closes alerts. Each browser keeps a WebSocket open. It gets the full
picture once, then only what changed, four times a second. Everything lives in memory, so there is no database to set
up.

## How it's organised

| Folder                | What it does                                                      | Status |
| --------------------- | ----------------------------------------------------------------- | ------ |
| `packages/contracts`  | The shapes of all data the apps send each other                   | Done   |
| `packages/domain`     | When a robot counts as offline, when an alert opens or closes     | Done   |
| `packages/simulation` | Pretend robots that drive around, drain batteries and drop out    | Done   |
| `apps/simulator`      | Runs the pretend robots and sends their reports to the server     | Done   |
| `apps/server`         | Takes in reports, keeps the current state, streams it to browsers | Done   |
| `apps/web`            | The console itself                                                | Done   |

The reasons behind the main choices are in [docs/adr](docs/adr). The coding rules are in [CLAUDE.md](CLAUDE.md).

## Test plan

There are no automated tests yet. This is what to cover and at which level, most valuable first.

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

### By hand

- Keyboard only through the Fleet page, the Robot page and the drawer. A screen reader reads the headings and the table.
- Widths of 375, 768, 1280 and 2560 px (21:9).
- An axe scan shows no violations.
- With a large fleet (`FLEET_ROBOTS_PER_SITE=1000`), the map and table stay smooth.
