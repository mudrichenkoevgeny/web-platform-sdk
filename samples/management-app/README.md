# Sample Management App (`@web-platform-sdk/sample-management-app`)

Administrative host application demonstrating how to wire **`web-platform-sdk`** modules for internal management staff (`ManagementAppComponent`).

## How to Build & Run

### 1. Prerequisites (Build Core SDK Packages)
Before starting the sample application for the first time or after modifying SDK packages (`packages/*`), build all workspace packages from the project root:

```bash
pnpm build
```

### 2. Development Server
To run the local development server with Hot Module Replacement (HMR):

- **From repository root:**
  ```bash
  pnpm dev:management
  ```
- **From inside `samples/management-app`:**
  ```bash
  cd samples/management-app
  pnpm dev
  ```

* **URL:** `http://localhost:3003`

### 3. Production Build
Compiles, minifies, and optimizes the app into a static production bundle in the `dist/` folder:

- **From repository root:**
  ```bash
  pnpm --filter @web-platform-sdk/sample-management-app build
  ```
- **From inside `samples/management-app`:**
  ```bash
  pnpm build
  ```

### 4. Local Preview
Launches a local static server to test and inspect the built production bundle (`dist/`):

- **From repository root:**
  ```bash
  pnpm --filter @web-platform-sdk/sample-management-app preview
  ```
- **From inside `samples/management-app`:**
  ```bash
  pnpm preview
  ```

### 5. Type Checking
Runs TypeScript compiler checks (`tsc --noEmit`) across the application code:

- **From repository root:**
  ```bash
  pnpm --filter @web-platform-sdk/sample-management-app typecheck
  ```
- **From inside `samples/management-app`:**
  ```bash
  pnpm typecheck
  ```

## Architecture & What It Provides

- **Root Wiring (`ManagementAppComponent`):** Central DI container aggregating:
  - **Core:** `CommonComponent`, `CoreSecurityComponent`, `CoreSettingsComponent`.
  - **Feature Domain:** `ManagementUserComponent` (administrative user management, session oversight, audit logging).
- **Initialization (`SyncManagementDataUseCase`):**
  - Attaches `authHttpClientConfigPlugin` to the HTTP client.
  - Registers administrative error parsers (`UserErrorParser`, `SecurityErrorParser`, `CommonErrorParser`).
  - Installs management WebSocket event handlers.
  - Refreshes management user configuration upon startup.
- **UI Architecture (`RootContent`):**
  - Displays `InitialLoader` during initialization.
  - Hosts `ManagementLoginRootScreen` when unauthenticated or `ManagementRootScreen` (Admin Panel) when authenticated.
  - Wraps UI in `SdkProvider` and `ThemeProvider`.
