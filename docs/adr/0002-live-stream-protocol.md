# 2. Live updates over one stream

**Status:** accepted

## Context

The console shows what every robot is doing right now. Asking the server again and again (polling) is either slow
or wasteful, because most robots haven't changed since the last ask.

## Decision

- The browser opens one WebSocket. The server first sends a full picture of the fleet, then four times a second sends
  only what changed. When nothing changed it still sends an empty update, so the browser knows the link is alive.
- Every message has a `sequence` number that goes up by one. If the browser sees a number skipped, it knows it missed
  something.
- When anything goes wrong (a skipped number, a dropped connection, a few seconds of silence), the browser does one
  thing: reconnect and start again from a fresh full picture.
- If a browser falls too far behind (more than 2 MB waiting to be sent), the server closes its connection instead of
  holding on to ever more data. The browser then recovers the same way.
- The server keeps everything in memory. A restart starts from an empty fleet, and the robots fill it in again within a
  second.

## Consequences

- There is only one way to recover, so it gets used and tested all the time.
- The browser only ever sees the latest state, not every report in between. That's right for a live view; a history
  view would need its own endpoint.
