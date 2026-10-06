# Sample Management App (`@web-platform-sdk/sample-management-app`)

Administrative host application demonstrating how to wire **`web-platform-sdk`** modules for internal management staff (`ManagementAppComponent`).

## Port & Execution

* **Dev Server Port:** `3001` (`http://localhost:3001`)
* **Run Command:** `pnpm --filter @web-platform-sdk/sample-management-app dev`

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
  - Displays `SplashScreen` during initialization.
  - Hosts `ManagementLoginRootScreen` when unauthenticated or `ManagementRootScreen` (Admin Panel) when authenticated.
  - Wraps UI in `SdkProvider` and `ThemeProvider`.
