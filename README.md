# HD Help Desk — Frontend

A multi-role help desk SPA (User / Agent / Control Panel) built with React 18,
React Router v6, and Material UI. See [DOCUMENTATION.md](./DOCUMENTATION.md)
for full architecture notes (auth flow, server-driven routing, component
library, etc).

This app normally talks to a real backend at `http://localhost:8080` for
everything — login, navigation, tickets, accounts. **This repo also includes
a self-contained demo mode** so it can run as a static GitHub Pages site with
no backend at all.

## Demo mode — how it works

Run `npm run build:demo` instead of `npm run build`. That sets
`REACT_APP_DEMO_MODE=true`, which activates `src/mocks/mockAdapter.js` — an
[axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter)
instance that intercepts every request the app makes and returns static demo
data instead of hitting a real server. A normal `npm run build` / `npm start`
is completely unaffected — demo mode only turns on when that env var is set.

**What's mocked:** `auth/read`, `auth/destroy`, `session/read`,
`signup/create`, `navigation/agent`, `navigation/user`, `clienttype/read`,
`department/read`, `group/client`, `user/read`, `user/create` — every
endpoint actually called anywhere in this codebase (confirmed by grepping
all `axios(...)` call sites). Navigation is generated straight from
`src/hoc/router/RouteList.js`, so every route defined there is automatically
enabled in the demo — no second list to keep in sync.

**What isn't mocked:** most ticket/settings screens in this codebase are
still empty placeholder components (`<Card><ComponentHeader /></Card>`, no
fetch call) — that's the state of the real app, not a demo limitation.
Anything not explicitly listed above gets a harmless empty success response
rather than a network error.

**Data persistence:** none. Everything mocked lives in memory for the
current page load only. Adding a client (CPanel → Clients → Add) will show
up in that session but resets on refresh. This is a demo, not a database.

### Demo accounts

Shown directly on the login page when demo mode is on. Access Type and
Department can be anything — login is matched by username/password only:

| Username     | Password   | Role                        |
| ------------ | ---------- | --------------------------- |
| `demo.user`  | `demo1234` | User panel                  |
| `demo.agent` | `demo1234` | Agent (Main panel)          |
| `demo.admin` | `demo1234` | Agent + Control Panel access|

## Fixes made for static hosting

A few things needed changing to make this work as a static, backend-less
deploy — these are genuine fixes, not demo-only hacks:

- **Router:** switched `RouterComponent.js` from `createBrowserRouter` to
  `createHashRouter`. This app's routes are assembled dynamically at
  runtime (see DOCUMENTATION.md §5), so a static host can't handle
  arbitrary deep-link paths without a server-side rewrite. Hash routing
  sidesteps that entirely — same route tree, same API, just matched
  against `#/path` instead of `/path`.
- **Reload bug:** `LoginForm.js`, `Logout.js`, and `AppTopnav.js` all
  hardcoded `window.location.replace('http://' + window.location.host)`
  after login/logout/panel-switch. That silently breaks under HTTPS (e.g.
  GitHub Pages). Replaced with `src/helper/reload.helper.js`, which reloads
  via `window.location.hash` instead of rebuilding the URL.
- **Asset paths:** `"homepage": "."` in `package.json` so the build emits
  relative asset paths, which work at any GitHub Pages project subpath
  without per-repo configuration.

## Scripts

```bash
npm install
npm start          # dev server against a real backend at localhost:8080
npm run build      # production build, real backend, unchanged behavior
npm run build:demo # production build with the mock backend baked in
```

## Deploying the demo to GitHub Pages

1. Push this repo to GitHub.
2. Repo → **Settings → Pages** → set Source to **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the Actions tab). The
   included `.github/workflows/deploy.yml` runs `npm run build:demo` and
   publishes `build/` automatically.
4. Your demo will be live at `https://<username>.github.io/<repo-name>/`.

## Pointing this at a real backend instead

Set the real API's base URL in `src/Axios.js` (currently hardcoded to
`http://localhost:8080` — consider moving it to an environment variable if
you deploy against different backends per environment), make sure CORS is
enabled for whatever origin you deploy the frontend to, and just run
`npm run build` (not `build:demo`) so the mock adapter never loads.

---

<details>
<summary>Original Create React App docs</summary>

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
See `npm start`, `npm test`, `npm run eject` in the CRA docs for details on
the base tooling.

</details>
