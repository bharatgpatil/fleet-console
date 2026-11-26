# Conventions (for humans and coding agents)

Read [README.md](README.md) for the why, and [docs/adr](docs/adr) for decisions. These are the rules that keep the
codebase coherent as it grows.

## Boundaries (lint-enforced via `.oxlintrc.json`)

- `packages/*` are runtime-agnostic: no React, MUI, Fastify or `node:*` imports.
- `apps/web/src/features/<name>` import other features **only** via their `index.ts`.
- Features never import `api/` internals (HTTP client, WebSocket stream); use `useApi()` (the `FleetApi` port).

## Contracts

- Any data crossing a process boundary is defined once in `packages/contracts` as a zod schema. Types are
  `z.infer`'d, never hand-written twice.
- Parse at every boundary: server inputs, client REST responses, stream messages.
- Paths come from `ApiPaths`; never hard-code `/api/...` strings.

## Domain

- Business rules live in `packages/domain`, as pure functions or the `FleetEngine`. The server and UI do not
  re-implement them (the UI reads thresholds like `ALERT_RULES` from the domain package).
- Time is a parameter (`now`), ids are injected. No `Date.now()` or `crypto` inside domain code.

## Web state

- Live pushed data → the zustand store (`live/`). Request/response → TanStack Query. View state → URL search
  params (schemas in `app/search.ts`).
- Selectors return stable references (records, primitives); derive arrays with `useMemo`.
- Health is derived only by `robotHealth()`; never compute "is this robot OK?" ad hoc in a component.
- Anything showing a time uses the server clock (`useServerNow`, `RelativeTime`).

## UI

- MUI v9: no system props on layout components (`<Stack alignItems>` is invalid); put them in `sx`.
- `sx` is for one-off tweaks of one or two properties. Anything larger (3+ properties, responsive values,
  nested selectors) is a named styled component in a sibling `<File>.styles.ts`, written as plain CSS with
  `theme.spacing()` and `theme.breakpoints`.
- Colour encodes status only. Use `theme.palette.health[...]`; don't introduce decorative colours.
- The theme lives in `app/theme/`: colours in `light.ts`, shape and type in `tokens.ts` (`SHARED_TOKENS`) and
  `build-theme.ts`. Use tokens (`theme.tokens.radius.data`, `theme.tokens.color.linkAccent`, …) rather than
  hard-coding radii or fonts in components.
- Router links on MUI components go through `shared/components/ButtonLink.tsx` or `TextLink.tsx`, so
  routes are type-checked.
- One component per file, named after it. Never mix kinds in a file: a component file holds only that component,
  a hook file only hooks, a utils file only plain functions, types and constants. Helpers, hooks, context objects
  and grid column definitions each go in their own kebab-case `.ts`/`.tsx` module (e.g. `useCountdown` in
  `shared/hooks/use-countdown.ts`, `useFleet` in `live/use-fleet.ts`, the context in `live/fleet-context.ts`).
- Folders by kind. A feature holds its page and `index.ts` at the root, then `components/`, `hooks/` (non-API),
  `queries/` (one hook per API read), `mutations/` (one hook per API write) and `utils/` (pure helpers, mappers,
  constants). `shared/` uses `components/`, `hooks/`, `utils/`; `app/` has `layout/` and `theme/`.
  Components never call `useApi()` directly.

## Code

- Comments: none by default. Keep one only for what the code can't say (hidden constraint, invariant, a
  workaround's reason), as a single terse line. Every non-trivial regex gets one saying what it matches.
- Names in English; spell out abbreviations a new reader would have to look up.
- Let errors bubble when you can't handle them; never catch just to log and rethrow.
- No `@ts-ignore` / `@ts-expect-error` / `@ts-nocheck` or lint-disable comments.
- Same non-trivial logic in a second place → extract a named shared function.
- 3+ parameters → one destructured object.
- Empty lines separate statements, the standard way (ESLint's padding-line-between-statements): after a run of
  `const`/`let` declarations; before and after every block statement (`if`, `for`, `while`, `switch`, `try`); before
  every `return`; around every standalone hook call; between functions and components. Not needed when the statement
  is the first in its block. Written by hand (no tool adds them).
- Every `if`/`else`/loop body is a braced block on its own lines (`curly` in `.oxlintrc.json`). Prettier formats on
  save (`.vscode/settings.json`); `npm run format` does the whole repo.
- Narrow instead of asserting: no `any`, no `foo!`, no `as` (except `as const`, a generic that needs inference
  help, and `obj[key as keyof typeof obj]`). Bind a narrowed value to a local `const` before a closure.
- `type`, never `interface`, except inside `declare module` augmentation (only interfaces merge).
- Alternatives are discriminated unions, not one type with optional properties.
- Null checks are explicit (`x === null`, `x === undefined`, or both); never `== null`.
- Conditional JSX: `cond ? <X /> : null`, not `cond && <X />`.
- Named exports only, except where a framework needs a default export (config files).

## Workflow

- Run `npm run format` and `npm run check` (types, lint) when a unit of work is done; both must pass before a
  commit.
- No automated tests yet; the test plan is in the README. Keep logic in pure functions so it stays easy to test.
- Before proposing a commit, self-review the diff against these rules, then edge cases: loading and empty
  states, a deleted or unknown entity (robot, site), the link dropping, empty arrays, zero, async races.
- UI changes are checked in a browser, not only type-checked.
- Commit message: an imperative one-line summary, then at most 2–3 short sentences of why. No `Co-Authored-By`
  or other AI attribution.
- Commit only on explicit approval of that commit (show the drafted message first). Push only when asked to push.
- One source of truth per rule: other docs link here instead of restating it. Docs say what a thing is and why,
  never what it used to be.
