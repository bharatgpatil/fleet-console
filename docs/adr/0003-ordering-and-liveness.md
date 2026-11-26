# 3. Ordering reports and deciding when a robot is gone

**Status:** accepted

## Context

Reports from robots can arrive late, twice, or out of order, and robot clocks drift. If a late report were applied,
the robot would jump backwards on the map. The console also has to tell a robot that missed one report apart from
one that has stopped reporting.

## Decision

- Reports are put in order by `sequence`. A report with the same number is a duplicate, a lower number is late, and
  both are dropped. If the number is much lower but the robot clock is newer, the robot has restarted, so the report
  is applied.
- A robot is `online` while it reports, `stale` after 5 s of silence and `offline` after 30 s. The server works this
  out from when it last heard from the robot, not from the robot's clock.
- Alerts are rules over the latest state:
  - A low battery alert clears only once the battery is back above 25 %, so a battery hovering around 20 % doesn't
    open and close an alert every second.
  - Charging hides "battery low" but not "battery critical".
  - While a robot is offline its last reading is old, so its alerts stay as they were and only "offline" is added.
- All of this lives in `packages/domain` as plain functions and `FleetEngine`. Time is passed in, so the rules can be
  tested without a server or a clock.

## Consequences

- The map never shows a robot moving backwards.
- A robot that is switched off for good stays "offline" until someone deals with it.
