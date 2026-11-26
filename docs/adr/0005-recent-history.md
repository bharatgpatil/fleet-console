# 5. Recent history next to the live view

**Status:** accepted

## Context

A fleet manager needs to see the present and the recent past: is this battery draining fast, where has this robot
been, what went wrong in the last half hour. The live stream only ever carries the latest state (see ADR 2), so it
can't answer that.

## Decision

- The server keeps a short window per robot in memory: one point every 5 s (battery, position, activity) for the last
  15 minutes. Points use the time the server received the report, like the rest of the liveness logic.
- The browser asks for one robot's window over REST (`GET /api/robots/:robotId/history`) when its page is open, and
  asks again every 5 s through TanStack Query. History is never pushed over the stream.
- Closed alerts stay in the engine for 30 minutes and already arrive with the snapshot and deltas, so the Robot page
  lists them without another request.

## Consequences

- The stream stays small: every browser gets the present for the whole fleet, and only the robot it looks at costs
  extra.
- A restart loses history. In production the window would move to a time-series store and grow from minutes to days.
- The chart can be up to 5 s behind the live numbers next to it. That's fine for a trend line.
