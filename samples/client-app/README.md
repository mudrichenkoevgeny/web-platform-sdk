# Sample Client App (`@web-platform-sdk/sample-client-app`)

Reference host application demonstrating how to wire **`web-platform-sdk`** modules for end-user web applications using a manual DI pattern (`ClientAppComponent`).

## Port & Execution

* **Dev Server Port:** `3000` (`http://localhost:3000`)
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
  - Displays `SplashScreen` during initialization.
  - Hosts `ClientLoginRootContainer` when unauthenticated or `MainProfileScreen` when authenticated.
  - Wraps UI in `SdkProvider` and `ThemeProvider`.
