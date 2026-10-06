# Sample Client App (`@web-platform-sdk/sample-client-app`)

Reference host application demonstrating how to wire **`web-platform-sdk`** modules for end-user web applications using a manual DI pattern (`ClientAppComponent`).

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
  pnpm dev:client
  ```
- **From inside `samples/client-app`:**
  ```bash
  cd samples/client-app
  pnpm dev
  ```

* **URL:** `http://localhost:3002`

### 3. Production Build
Compiles, minifies, and optimizes the app into a static production bundle in the `dist/` folder:

- **From repository root:**
  ```bash
  pnpm --filter @web-platform-sdk/sample-client-app build
  ```
- **From inside `samples/client-app`:**
  ```bash
  pnpm build
  ```

### 4. Local Preview
Launches a local static server to test and inspect the built production bundle (`dist/`):

- **From repository root:**
  ```bash
  pnpm --filter @web-platform-sdk/sample-client-app preview
  ```
- **From inside `samples/client-app`:**
  ```bash
  pnpm preview
  ```

### 5. Type Checking
Runs TypeScript compiler checks (`tsc --noEmit`) across the application code:

- **From repository root:**
  ```bash
  pnpm --filter @web-platform-sdk/sample-client-app typecheck
  ```
- **From inside `samples/client-app`:**
  ```bash
  pnpm typecheck
  ```

## Architecture & What It Provides

- **Root Wiring (`ClientAppComponent`):** Central DI container aggregating:
  - **Core:** `CommonComponent`, `CoreSecurityComponent`, `CoreSettingsComponent`.
  - **Feature Domain:** `ClientUserComponent` (authentication, session storage, user profile).
- **Initialization (`SyncDataUseCase`):**
  - Attaches `authHttpClientConfigPlugin` to the HTTP client.
  - Registers error parsers (`UserErrorParser`, `SecurityErrorParser`, `CommonErrorParser`).
  - Installs WebSocket event handlers.
  - Refreshes user configuration upon startup.
- **UI Architecture (`RootContent`):**
  - Displays `InitialLoader` during initialization.
  - Hosts `ClientLoginRootScreen` when unauthenticated or `MainProfileScreen` when authenticated.
  - Wraps UI in `SdkProvider` and `ThemeProvider`.
