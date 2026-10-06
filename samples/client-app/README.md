# Sample Client App (`@web-platform-sdk/sample-client-app`)

Reference host application demonstrating how to wire **`web-platform-sdk`** modules for end-user web applications using a manual DI pattern (`ClientAppComponent`).

## Port & Execution

* **Dev Server Port:** `3002` (`http://localhost:3002`)
* **Run Command:** `pnpm --filter @web-platform-sdk/sample-client-app dev`

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
