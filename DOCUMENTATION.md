# HD Help Desk — Frontend Application

**Type:** Single-Page Application (SPA)  
**Framework:** React 18 with React Router v6  
**UI Library:** Material UI (MUI) v5  
**State Management:** React Context API + useReducer  
**HTTP Client:** Axios  
**Build Tool:** Create React App (react-scripts v5)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Tech Stack](#2-tech-stack)
3. [Application Architecture](#3-application-architecture)
4. [Authentication & Session Management](#4-authentication--session-management)
5. [Dynamic Routing System](#5-dynamic-routing-system)
6. [Role-Based Panels](#6-role-based-panels)
7. [Screen Inventory](#7-screen-inventory)
8. [Shared Component Library](#8-shared-component-library)
9. [State Management](#9-state-management)
10. [API Communication](#10-api-communication)
11. [Request Signing (HMAC-SHA256)](#11-request-signing-hmac-sha256)
12. [Global Error Handling](#12-global-error-handling)
13. [Project Structure](#13-project-structure)

---

## 1. Overview

**HD** is the frontend for a multi-role help desk platform. It serves three distinct user panels from a single React application:

| Panel | Who uses it | What they can do |
|---|---|---|
| **User Panel** | End users / clients | Submit and track support tickets, browse FAQs |
| **Agent Panel** | Support staff | Manage tickets, view dashboards, handle people |
| **Control Panel (CPanel)** | Administrators | Configure the system, manage accounts, view system logs |

The application uses a **server-driven navigation** model — routes and sidebar menus are not hardcoded. They are fetched from the backend API on login and dynamically assembled into the React Router tree at runtime.

---

## 2. Tech Stack

| Category | Technology | Version |
|---|---|---|
| Core framework | React | 18.2 |
| Routing | React Router DOM | 6.23 |
| UI components | MUI Material + Icons | 5.15 |
| HTTP client | Axios | 1.6 |
| Data tables | react-data-table-component | 7.6 |
| Request signing | crypto-js (HMAC-SHA256) | 4.2 |
| Styling | Emotion (via MUI) + styled-components | 11 / 6 |
| Testing | React Testing Library + Jest | 13 |
| Font | Roboto (`@fontsource/roboto`) | 5 |

---

## 3. Application Architecture

```
index.js
└── AuthContextStore          (global auth state)
    └── NavContextStore       (global navigation/route state)
        └── RouterComponent   (builds & provides React Router instance)
            └── App           (MUI ThemeProvider + WithErrorHandler HOC)
                └── DefaultLayout   (session validation on mount)
                    └── AppTopnav   (fixed top navigation bar)
                        └── AppDrawer   (collapsible sidebar)
                            └── AppContainer   (main content area)
                                └── [Dynamic Page Components]
```

### Rendering Pipeline

```
Browser loads app
       │
       ▼
RouterComponent.useEffect()
  - Check localStorage for 'HD-Sess'
       │
       ├── No session → build public routes (Landing / Login / Signup)
       │
       └── Session found
             │
             ▼
         POST /navigation/agent  OR  POST /navigation/user
         (signed with HMAC-SHA256)
             │
             ▼
         Response: { mainPanelNavigation, cPanelNavigation }
             │
             ▼
         Map server nav levels (first/second/third)
         to RouteList entries by level coordinates
             │
             ▼
         createBrowserRouter(assembled routes)
             │
             ▼
         RouterProvider renders the app tree
```

---

## 4. Authentication & Session Management

### Login Flow

```
User fills LoginForm
  → POST /auth/read  { clientType, department, username, password }
  → Headers: X-HD-Key (static API key) + X-HD-Sign (HMAC-SHA256 of body)
       │
       ├── status: false → show warning modal with server message
       │
       └── status: true
             │
             ▼
         authDispatch(AUTH_SET, data)
           - Stores session to localStorage as 'HD-Sess':
             { sessionKey, clientType, clientTypeName, department, group }
           - Stores interface preference as 'HD-Sess-Nav':
             { interface: 'MAIN' }
             │
             ▼
         window.location.replace('/') — full page reload to trigger
         RouterComponent to rebuild routes with session context
```

### Session Validation (DefaultLayout)

On every page load, `DefaultLayout` fires a session check:

```
POST /session/read  { sessionKey, clientType, department }
  → status: true  → authDispatch(AUTH_SET) with fresh user data
  → status: false → authDispatch(AUTH_DESTROY), clear localStorage
```

### Logout Flow

```
User clicks Logout → confirmation modal appears
  → POST /auth/destroy  { sessionKey, clientType, department }
  → authDispatch(AUTH_DESTROY)
    - Removes 'HD-Sess' and 'HD-Sess-Nav' from localStorage
  → window.location.replace('/') — redirects to Landing
```

### Auth State Shape

```js
{
  sessionKey: string | null,
  firstName: string | null,
  lastName: string | null,
  username: string | null,
  email: string | null,
  department: number,
  departmentName: string | null,
  team: number,
  teamName: string | null,
  group: number,
  groupName: string | null,
  clientType: number | null,   // 0 = agent, 1 = user, 2 = admin-type agent
  clientTypeName: string | null
}
```

---

## 5. Dynamic Routing System

This is one of the most technically distinctive parts of the app. Routes are **not statically defined** — they are assembled at runtime from a combination of:

1. **`RouteList.js`** — The frontend component registry. Each entry has a `firstLevel`, `secondLevel`, `thirdLevel` coordinate that acts as an address.
2. **Backend navigation API** — Returns `{ mainPanelNavigation, cPanelNavigation }` each containing `firstLevel.rows`, `secondLevel.rows`, `thirdLevel.rows` arrays.
3. **`RouterComponent.js`** — Joins these two sources by matching level coordinates, then builds the React Router route tree.

### Route Coordinate System

Every route in `RouteList` has three numeric level coordinates:

| Coordinate | Meaning |
|---|---|
| `firstLevel` | Top-level nav group (e.g., "Tickets" = 2) |
| `secondLevel` | Sub-item within the group (e.g., "Open" = 1) |
| `thirdLevel` | Third-level nesting (currently unused, reserved) |

The backend controls **which routes are enabled** for a user/group. The frontend only renders routes that appear in the server's navigation response.

### Route Assembly Example

```
Server returns:
  firstLevel: [ { firstLevel: 2, hasSub: 'Y', ... } ]
  secondLevel: [ { firstLevel: 2, secondLevel: 1, ... } ]   ← Open tickets

Frontend matches:
  RouteList entry where firstLevel=2, secondLevel=1
  → { url: '/ticket/open', component: <UserOpen /> }

Resulting React Router object:
  { path: '/ticket/open', element: <UserOpen /> }
```

### Panel Switching (Agent ↔ CPanel)

Agents have access to both the **Main Panel** and the **Control Panel**. Switching is handled via `AppTopnav`:

```
Click "Control Panel" in top nav menu
  → sessionNav.interface toggled: 'MAIN' ↔ 'CPANEL'
  → Saved to localStorage 'HD-Sess-Nav'
  → window.location.replace('/systemlogs') for CPanel
    OR window.location.replace('/') for Main Panel
  → Full reload causes RouterComponent to rebuild routes
    using the cPanelRouteList + cPanelNavigation
```

---

## 6. Role-Based Panels

### User Panel (`clientType: 1`)

End users can only access the User Panel (no panel switcher in topnav).

```
Navigation endpoint: POST /navigation/user
RouteList panel:     'USER'
```

### Agent Panel (`clientType: 0` or `2`)

Agents access the Main Panel by default. They have a "Control Panel" option in the top nav menu.

```
Main nav endpoint:   POST /navigation/agent
CPanel nav endpoint: POST /navigation/agent (same, includes cPanelNavigation)
RouteList panels:    'AGENT' (main)  +  'CPANEL' (admin)
```

---

## 7. Screen Inventory

### Public Routes (unauthenticated)

| URL | Component | Description |
|---|---|---|
| `/` | `Landing` | Landing / welcome page |
| `/login` | `Login` + `LoginForm` | Sign in form — client type, department, username, password |
| `/signup` | `Signup` + `SignupForm` | Registration — department, full name, email, username, password |

---

### User Panel Screens

| URL | Component | Description |
|---|---|---|
| `/` | `user/Home` | User home page |
| `/ticket/open` | `user/ticket/Open` | List of open tickets |
| `/ticket/inprogress` | `user/ticket/InProgress` | Tickets currently being worked on |
| `/ticket/resolved` | `user/ticket/Resolved` | Resolved tickets |
| `/ticket/closed` | `user/ticket/Closed` | Closed tickets |
| `/ticket/opennew` | `user/ticket/OpenANewTicket` | Ticket submission form |
| `/knowledgebase/faq` | `user/knowledgebase/FrequentlyAskedQuestions` | FAQ / knowledge articles |
| `/viewticket` | `user/ViewTicket` | Ticket detail view (hidden from nav) |

---

### Agent Panel Screens

| URL | Component | Description |
|---|---|---|
| `/` | `agent/Home` | Agent home |
| `/dashboard/dashboard` | `agent/dashboard/DashboardInterface` | Overview dashboard |
| `/dashboard/ticketactivity` | `agent/dashboard/TicketActivity` | Ticket activity metrics |
| `/people` | `agent/People` | People / user directory |
| `/ticket/open` | `agent/ticket/Open` | Open tickets queue |
| `/ticket/inprogress` | `agent/ticket/InProgress` | In-progress tickets |
| `/ticket/overdue` | `agent/ticket/Overdue` | Overdue tickets (agent-only) |
| `/ticket/resolved` | `agent/ticket/Resolved` | Resolved tickets |
| `/ticket/closed` | `agent/ticket/Closed` | Closed tickets |
| `/ticket/openanewticket` | `agent/ticket/OpenANewTicket` | Open ticket on behalf of user |
| `/knowledgebase/faq` | `agent/knowledgebase/FrequentlyAskedQuestions` | FAQ management |
| `/viewticket` | `agent/ViewTicket` | Full ticket detail (hidden from nav) |

---

### Control Panel (CPanel) Screens

#### System Logs

| URL | Component | Description |
|---|---|---|
| `/systemlogs` | `cpanel/SystemLog` | Application audit logs |

#### Settings

| URL | Component | Description |
|---|---|---|
| `/setting/landing` | `cpanel/setting/Landing` | Landing page configuration |
| `/setting/system` | `cpanel/setting/System` | System-wide settings |
| `/setting/time` | `cpanel/setting/Time` | Timezone / business hour config |
| `/setting/ticketforms` | `cpanel/setting/TicketForm` | Ticket form field configuration |
| `/setting/knowledgebase` | `cpanel/setting/Knowledgebase` | Knowledgebase settings |
| `/setting/alertsandnotices` | `cpanel/setting/AlertAndNotice` | Alert and notice management |
| `/setting/navigation` | `cpanel/setting/Navigation` | Navigation menu configuration |
| `/setting/subdepartment` | `cpanel/setting/SubDepartment` | Sub-department management |

#### Manage

| URL | Component | Description |
|---|---|---|
| `/manage/requestcategory` | `cpanel/manage/RequestCategory` | Ticket request categories |
| `/manage/cannedresponse` | `cpanel/manage/CannedResponse` | Pre-written response templates |
| `/manage/autoassignment` | `cpanel/manage/AutoAssignment` | Auto ticket assignment rules |
| `/emailcontext` | `cpanel/EmailContext` | Email template context settings |

#### People / Accounts

| URL | Component | Description |
|---|---|---|
| `/account/client` | `cpanel/account/Client` | Client account management (full CRUD data table) |
| `/account/agent` | `cpanel/account/Agent` | Agent account management |
| `/account/group` | `cpanel/account/Group` | Group management |

---

## 8. Shared Component Library

### Layout Components

#### `AppTopnav`
Fixed top navigation bar. Renders:
- App logo (left)
- "Welcome [Name]" button (right) → dropdown menu
- Menu adapts based on auth state:
  - **Guest:** Sign In, Sign Up links
  - **User:** Logout
  - **Agent:** Toggle Main/Control Panel + Logout

#### `AppDrawer`
Collapsible left sidebar (240px wide). Only renders when a session exists. Contains `AppDrawerMenu` which builds the full multi-level nav tree from `NavContext`.

#### `AppDrawerMenu`
Renders the sidebar navigation. Supports up to 3 levels of nesting:
- **Level 1:** Top-level groups (expand/collapse)
- **Level 2:** Sub-items (4px left indent)
- **Level 3:** Grand-children (6px left indent, reserved)

Active route is highlighted via `location.pathname` comparison.

#### `AppContainer`
The main scrollable content area. Handles the CSS margin shift when the sidebar opens/closes.

#### `DefaultLayout`
Invisible layout wrapper that fires the session validation API call on mount before rendering any page content.

---

### UI Components (`src/component/UI/`)

#### `DataTableUI` — `component/UI/DataTable.js`

The primary data display and management component. Used across all list views.

**Features:**
- Server-side pagination (configurable rows-per-page: 2, 5, 10, 15, 20)
- Server-side sorting (column + direction)
- Debounced search field (800ms delay)
- Row selection with checkboxes (multi-select)
- Add / Update / Delete action buttons (conditionally shown)
- HMAC-signed API requests on every data fetch
- Striped rows, highlight on hover, responsive

**Props:**

| Prop | Type | Description |
|---|---|---|
| `url` | string | API endpoint to fetch data from |
| `method` | string | HTTP method (`'POST'`) |
| `requestData` | object | Request payload merged with pagination params |
| `columns` | array | Column definitions (react-data-table-component format) |
| `addButton` | bool | Show Add button |
| `editButton` | bool | Show Update button |
| `deleteButton` | bool | Show Delete button |
| `addButtonActionHandler` | function | Add button click handler |
| `editButtonActionHandler` | function | Update button click handler |
| `deleteButtonActionHandler` | function | Delete button click handler |
| `setSelectedRows` | function | Callback when row selection changes |

**Request shape sent to API:**
```js
{
  ...requestData,         // caller-provided payload
  search: string,         // debounced search term
  page: number,           // zero-based page index
  rowsPerPage: number,
  sort: { column, direction } | null
}
```

---

#### `ModalUI` — `component/UI/Modal.js`

Accessible, animated modal dialog used throughout the app for confirmations, alerts, and forms.

**Props:**

| Prop | Description |
|---|---|
| `open` | boolean — controls visibility |
| `closeHandler` | function — called on close or backdrop click |
| `title` | ReactNode — modal title (can include icons) |
| `body` | ReactNode — modal body content |
| `button` | ReactNode — custom action buttons (optional, defaults to Close button) |
| `width` | CSS width override |
| `bgcolor` | Background color override (e.g., `'warning.main'`, `'success.main'`) |
| `textColor` | Text color override |

**Usage patterns:**
- Warning modals (login failure) — `bgcolor: 'warning.main'`
- Success modals (signup complete) — `bgcolor: 'success.main'`
- Error modals (HTTP errors via `WithErrorHandler`)
- Confirmation modals (logout confirmation)
- Form modals (add/edit records)

---

#### `SnackbarUI` — `component/UI/Snackbar.js`

Top-center notification bar. Wraps MUI `Snackbar` + `Alert`.

**Props:**

| Prop | Description |
|---|---|
| `openSnackbar` | boolean — triggers display |
| `message` | Notification text |
| `severity` | MUI alert severity: `'success'`, `'error'`, `'warning'`, `'info'` |

---

#### `ComponentHeader` — `component/UI/ComponentHeader.js`

Standardized card header used by all page-level views. Automatically reads the current route's `state.label` (passed via React Router `state`) to display the page title. Styled with a dark indigo background (`#1a237e`) and light text.

---

### Form Input Components (`src/component/appInput/`)

| Component | Description |
|---|---|
| `AppClientType` | Autocomplete dropdown for client type (User / Agent) |
| `AppDepartment` | Autocomplete dropdown for department — fetches list from API |
| `AppGroup` | Autocomplete dropdown for group |
| `AppStatus` | Autocomplete dropdown for status values |

All inputs fetch their options from the backend and follow the MUI Autocomplete `{ label, value }` option pattern.

---

## 9. State Management

The app uses **React Context + useReducer** — no Redux. Two global stores:

### AuthContext

**File:** `src/context/AuthContext.js`  
**Reducer:** `src/reducer/Auth.js`

Holds the authenticated user's identity data. Persists session to `localStorage` on login and clears it on logout.

| Action | Effect |
|---|---|
| `AUTH_SET` | Sets all user fields + writes `HD-Sess` to localStorage |
| `AUTH_DESTROY` | Clears all fields + removes `HD-Sess` and `HD-Sess-Nav` from localStorage |

---

### NavContext

**File:** `src/context/NavigationContext.js`  
**Reducer:** `src/reducer/Navigation.js`

Holds the server-fetched navigation structure and component route lists.

| Field | Description |
|---|---|
| `mainComponentRouteList` | Filtered `RouteList` entries for current panel (AGENT or USER) |
| `cPanelComponentRouteList` | Filtered `RouteList` entries for CPANEL |
| `mainPanelNavigation` | Backend nav data for main panel (firstLevel/secondLevel/thirdLevel) |
| `cPanelNavigation` | Backend nav data for cpanel |

| Action | Effect |
|---|---|
| `NAVIGATION_SET` | Stores navigation data from API response |
| `NAVIGATION_DESTROY` | Resets to empty navigation state |

---

### localStorage Keys

| Key | Content |
|---|---|
| `HD-Sess` | `{ sessionKey, clientType, clientTypeName, department, group }` |
| `HD-Sess-Nav` | `{ interface: 'MAIN' \| 'CPANEL' }` |

---

## 10. API Communication

### Axios Instance — `src/Axios.js`

All API calls go through a shared Axios instance with:

```js
{
  baseURL: 'http://localhost:8080',
  timeout: 1000,                           // 1 second timeout
  headers: {
    'X-HD-Key': 'bd8c3f81-...'            // static API key on every request
  }
}
```

The `X-HD-Key` header authenticates the client application itself. Individual requests additionally carry `X-HD-Sign` for payload integrity.

### API Endpoints Used by the Frontend

| Method | URL | Used by | Description |
|---|---|---|---|
| POST | `/auth/read` | LoginForm | Authenticate user |
| POST | `/auth/destroy` | Logout | Terminate session |
| POST | `/session/read` | DefaultLayout | Validate existing session |
| POST | `/signup/create` | SignupForm | Register new user |
| POST | `/navigation/agent` | RouterComponent | Fetch agent nav + routes |
| POST | `/navigation/user` | RouterComponent | Fetch user nav + routes |
| POST | `/user/read` | DataTableUI (Client) | Fetch paginated client list |

---

## 11. Request Signing (HMAC-SHA256)

**File:** `src/helper/crypto.helper.js`

Every non-trivial API request includes an `X-HD-Sign` header to prevent tampering.

```
Process:
1. Serialize request body to JSON string
2. Sign with HMAC-SHA256 using a shared secret
3. Encode result as hex string
4. Attach as header: X-HD-Sign: <hex>

Code:
  const hashDigest = HmacSHA256(JSON.stringify(data), "9x2rTsyBqcAC8GDH0KypEXYsbBEyKQR7");
  return Hex.stringify(hashDigest);
```

**Note for production:** The HMAC secret is currently embedded in the client-side bundle. For a production deployment this should be replaced with a server-side token exchange (the client-visible secret only proves message integrity, not authentication of the caller).

---

## 12. Global Error Handling

**HOC:** `src/hoc/withErrorHandler/WithErrorHandler.js`  
**Hook:** `src/hooks/http-error-handler.js`

`App.js` is wrapped in `WithErrorHandler(App, axios)`. This sets up Axios interceptors that:

1. **On every request start** — close any existing error modal
2. **On any response error (4xx/5xx)** — open an error modal displaying `error.response.data.message`

```
Axios response error
  → interceptor catches it
  → setErrorModal({ title: <ErrorIcon />, body: message, open: true })
  → ModalUI renders over the page
  → User clicks Close → errorConfirmHandler() → modal dismissed
```

Interceptors are cleaned up with `useEffect` return cleanup to prevent memory leaks on unmount.

---

## 13. Project Structure

```
src/
├── App.js                          MUI theme + WithErrorHandler wrapper
├── Axios.js                        Global Axios instance (baseURL, headers)
├── index.js                        App entry — wraps with context providers
│
├── context/
│   ├── AuthContext.js              Auth state provider
│   └── NavigationContext.js        Navigation state provider
│
├── reducer/
│   ├── ActionTypes.js              All dispatch action type constants
│   ├── Auth.js                     Auth reducer + initial state
│   └── Navigation.js               Navigation reducer + initial state
│
├── helper/
│   └── crypto.helper.js            HMAC-SHA256 request signing utility
│
├── hoc/
│   ├── defaultLayout/
│   │   └── DefaultLayout.js        Session validation gate on page load
│   ├── router/
│   │   ├── RouteList.js            Frontend component registry (44 routes)
│   │   └── RouterComponent.js      Dynamic route assembly from server nav data
│   └── withErrorHandler/
│       └── WithErrorHandler.js     Global HTTP error modal HOC
│
├── hooks/
│   └── http-error-handler.js       Custom hook: Axios interceptor → error modal
│
├── component/
│   ├── AppTopnav.js                Fixed header bar (logo, user menu, panel switch)
│   ├── AppDrawer.js                Collapsible sidebar shell
│   ├── AppContainer.js             Main content area with sidebar offset
│   ├── appDrawer/
│   │   └── AppDrawerMenu.js        Multi-level sidebar nav renderer
│   ├── appInput/
│   │   ├── AppClientType.js        Client type autocomplete input
│   │   ├── AppDepartment.js        Department autocomplete input
│   │   ├── AppGroup.js             Group autocomplete input
│   │   └── AppStatus.js            Status autocomplete input
│   └── UI/
│       ├── Buttons/                LoadingButton, CloseButton
│       ├── ComponentHeader.js      Page title card header
│       ├── Copyright.js            Footer copyright
│       ├── DataTable.js            Full-featured server-side data table
│       ├── Logo.js                 App logo component
│       ├── Modal.js                Reusable modal dialog
│       └── Snackbar.js             Top-center notification bar
│
└── view/
    ├── landing/Landing.js
    ├── login/
    │   ├── Login.js
    │   └── loginForm/LoginForm.js
    ├── signup/
    │   ├── Signup.js
    │   └── signupForm/SignupForm.js
    ├── logout/Logout.js
    ├── user/                       User panel views (Home, Tickets, FAQ, ViewTicket)
    ├── agent/                      Agent panel views (Home, Dashboard, People, Tickets, FAQ, ViewTicket)
    └── cpanel/                     Admin panel views (SystemLog, Settings, Manage, Accounts)
```

---

## Design Patterns & Notable Decisions

| Pattern | Where used | Why |
|---|---|---|
| **Context + useReducer** | Auth, Navigation | Avoids Redux overhead for two focused slices of state |
| **Server-driven routing** | RouterComponent | Enables per-group feature flags without frontend deploys |
| **HOC for error handling** | WithErrorHandler | Centralizes all HTTP error UI in one place |
| **HMAC request signing** | All API calls | Adds payload integrity verification |
| **Debounced search** | DataTableUI | Prevents excessive API calls while typing (800ms delay) |
| **Outlet context passing** | TopNav → Drawer → Container | Avoids prop-drilling the drawer open/close state |
| **Level-coordinate routing** | RouteList + RouterComponent | Allows 3-level nested nav to be described as flat data |
| **Form state as object map** | LoginForm, SignupForm, DataTableUI | Enables generic validation and disable-all-fields-on-submit patterns |
