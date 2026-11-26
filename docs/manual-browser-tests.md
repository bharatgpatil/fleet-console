# Manual browser tests

A script for checking the console end to end in a real browser, written so a browser agent (such as Claude in Chrome)
can run it and report back. A person can follow it too. It complements the automated Playwright tests in `e2e/`, which
cover only the key flows.

## How to run it

1. Start the app: `npm run dev` and use `http://localhost:3000`, or use the live demo,
   https://fleet-console-2ef6.onrender.com. A sleeping free Render service can take up to a minute to load the first
   time.
2. Paste everything in the prompt below into the browser agent, with `<APP_URL>` replaced.
3. If `CONSOLE_PASSWORD` is set, the browser asks for a password. Type it yourself; the agent must not.

Two states need the server stopped, so they aren't in the script: the "Updates paused" banner (stop the server while a
page is open) and the "can't reach the server" message (load the page with the server stopped). Check those by hand on
the local stack.

## Prompt

```
Manually test the Fleet Console web app at <APP_URL>. It shows live, simulated warehouse robots, so numbers change
every second; that's expected.

Rules:
- If the browser asks for a password, stop and let me type it. Don't enter any password yourself.
- Only use the app's own pages. Don't change anything outside it.
- For each test, note PASS or FAIL. On a FAIL, take a screenshot and write what you saw versus what was expected.

Tests:
1. Load: open <APP_URL>. It should redirect to /fleet on the busiest site and show, within about 10 s, KPI cards
   (Reporting, Critical, Offline, Warnings), site tabs (All sites, Munich, Berlin, Frankfurt), a floor-plan map and a
   robot table. No "Something went wrong" screen.
2. Live updates: watch the table for 10 s. Battery and "Last report" values should change without reloading.
3. Site tabs: click each site tab. The map and table switch to that site and the URL gets ?site=<id>. "All sites"
   shows no map; each row shows its site under the robot name and adds Status and Open alerts columns.
4. KPI click: click the Critical card (or Warnings if Critical is 0). It switches to All sites with that status filter
   selected, and the table only shows robots with that status.
5. Status filter: on a site, click each filter button (All, Critical, Offline, Warning, Healthy). The count on each
   button should match the rows shown. The table refreshes at most once a second, so allow a moment.
6. Search: type part of a robot name (for example "MUN-00") into "Search robots…". Only matching names remain and the
   URL gets ?q=. Clear it and all rows return.
7. Reload keeps the view: with a site, filter and search set, reload the page. The same view comes back.
8. Map: hover a robot dot on a site's map. Its table row highlights and its name shows. Click the dot: it opens that
   robot's page.
9. Table to robot: go back and click a robot's name in the table. It opens /robots/<id> with the robot name as the
   title.
10. Robot page: check for a health badge, a "Last report" time, a "Now" card (battery %, bar, activity, speed,
    position), "Open alerts", "Closed alerts" (last 30 minutes), a "Position" map with the robot highlighted and its
    recent path, and a "Battery" chart for the last 15 minutes. Hover the chart: a tooltip shows a time and a
    percentage. Axis labels must not overlap. The path should not draw long straight lines across the map; it breaks
    where the robot went quiet or was towed.
11. Back link: click the back link at the top of the robot page. It returns to the Fleet page on that robot's site.
12. Unknown robot: open <APP_URL>/robots/does-not-exist. It says "Robot does-not-exist not found" with a working
    "Back to fleet" link.
13. Action needed: click "Action needed" in the top bar. A drawer lists alerts, critical first, each with robot name,
    site, how long it has been open, a message and an Ack button. The count on the button matches the list.
14. Ack one: click Ack on one alert. It disappears at once, keyboard focus moves to the next Ack button, and the count
    drops by one.
15. Open from the drawer: click an alert's text (not Ack). It opens that robot's page and closes the drawer.
16. Ack all: with 2 or more alerts, reopen the drawer and click "Ack all N shown". The shown alerts disappear.
17. Keyboard: on the Fleet page, press Tab repeatedly. Focus is visible and reaches the tabs, search, filters, robot
    name links and the Action needed button without getting stuck. Map dots are not tab stops; the table offers the
    same action.
18. Narrow window: resize to about 800 px wide. Nothing overflows sideways; the map and table stack.
19. Wide window: on a wide screen, the content stops at about 1600 px and stays centred.

At the end, give me a table with the test number, name, PASS or FAIL, and a one-line note. List any console errors.
```

## What "expected" looks like

- Robots overlap at chargers because several share one spot.
- Acknowledging alerts on the live demo changes them for every visitor until the next restart.
- The numbers differ between runs on the live demo, but the local stack starts from the same seed every time.
