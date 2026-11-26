# 1. Shared contracts

**Status:** accepted

## Context

The simulator, the server and the browser all pass the same data around. If each one writes its own types, they
slowly drift apart, and the bug shows up far from where it started.

## Decision

- All shared data shapes live in `packages/contracts` as zod schemas. Types come from the schemas, so there is only
  one definition.
- Data is checked against the schema wherever it enters an app: the server checks what the simulator sends, and the
  browser checks what the server sends.
- Each telemetry report has two numbers that look alike but do different jobs:
  - `sequence` goes up by one with every report. We use it to put reports in order and to skip duplicates.
  - `recordedAt` is the time on the robot's clock. Robot clocks drift, so we only display it and never sort by it.

## Consequences

- Changing a contract breaks the build everywhere it's used, which is what we want.
