# 4. Where the browser keeps its data

**Status:** accepted

## Context

The console has three kinds of data: the live fleet that the server keeps pushing, the few things the user asks the
server to do (acknowledge an alert), and what the user is looking at (which site, which filter). Mixing them in one
place makes each harder to get right.

## Decision

- **Live fleet data** lives in one zustand store, filled only by the stream. Updates that arrive close together are
  applied together, once per screen frame, so 500 robots moving don't cause 500 re-renders.
- **Requests** like acknowledging an alert go through TanStack Query. The alert is shown as acknowledged straight away
  and put back if the request fails.
- **What the user is looking at** lives in the URL, so a view can be shared or reloaded.
- Components read the store through small hooks (`useRobotRows`, `useRobotView`, `useServerNow`). Times like "last seen
  4 s ago" are worked out against the server's clock, not the browser's.

## Consequences

- The store has one way in, the stream, which makes it easy to reason about.
- Lists and maps redraw at most once per frame, however fast data arrives.
