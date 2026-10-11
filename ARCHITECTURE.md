# Web Platform SDK Architecture

This document describes the high-level architecture, module dependency graph, and foundational design principles of the `web-platform-sdk` (TypeScript/React).

For detailed domain models, component relationships, and sequence diagrams of specific runtime processes, please refer to the specialized documentation in the `docs/architecture` directory:

- **[Identity & Access Domain Models](docs/architecture/identity_and_access.md)** — Core models: User Application Types (`AppType`), User Roles (`UserRole`), Account Statuses (`UserAccountStatus`), User Identifiers (`UserIdentifier`), Sessions (`UserSession`), and Step-up MFA Challenge handling.
- **[SDK Bootstrap & Component Initialization](docs/architecture/flows/sdk_bootstrap.md)** — Manual DI startup sequence, component wiring (`CommonComponent`, `ClientUserComponent`), network interceptor plugins, error parser registration, and initial synchronization.
- **[Authentication & Token Refresh](docs/architecture/flows/authentication.md)** — Multi-provider authentication (Email, Phone, Google Sign-In for Web), WebCrypto token persistence, and synchronized `401 Unauthorized` token refresh interceptors.
- **[Error Handling & Parsing Pipeline](docs/architecture/flows/error_handling.md)** — `AppResult` pattern, `AppError` taxonomy (`CommonError`, `SecurityError`, `UserError`), Chain of Responsibility parsing (`AppErrorParser`), and React string dictionary resolution.
- **[WebSocket Synchronization](docs/architecture/flows/websockets.md)** — `WebWebSocketService` lifecycle, connection management, ping/pong heartbeats, message handler routing (`WebSocketMessageHandler`), and reactive Zustand store updates.
- **[Security & Password Policy / TOTP / Unlock](docs/architecture/flows/security.md)** — Dynamic password policy validation (`PasswordPolicyValidator`), TOTP MFA lifecycle (setup, QR code, recovery codes), and account recovery (`UnlockRootContainer` for `SECURITY_HOLD`).
- **[Account & Profile Management Flows](docs/architecture/flows/account_management_flows.md)** — Active sessions listing & remote revocation, identifier linking & OTP code throttling, password changes, and account deletion scheduling & restoration.
- **[Encrypted Storage & Platform Infrastructure](docs/architecture/flows/storage_and_platform.md)** — `EncryptedSettings` abstraction (WebCrypto AES-GCM via browser `localStorage`), browser metadata (`DeviceInfoProvider`), external launchers, and pagination infrastructure (`PaginationState`).

---

## 1. High-Level Architecture

The platform is designed as a modular **TypeScript** client SDK targeting web browsers. It provides a unified foundation for `fetch`-based networking, AES-GCM encrypted storage, security policies, and identity management. By combining **React** UI components (styled with Tailwind CSS and tokens) with **Zustand** state machines for business logic, host applications can integrate complete authentication and management dashboards with TanStack Router file-based navigation and minimal boilerplate.

```mermaid
flowchart TD
    %% Host Applications
    subgraph HostLayer [Host Applications / Samples]
        direction LR
        ClientApp["sample-client-app\nClient Web Application + TanStack Router"]
        MgmtApp["sample-management-app\nManagement Admin Panel + TanStack Router"]
    end

    %% SDK Feature Modules
    subgraph FeatureLayer [Feature Modules]
        direction LR
        ClientUser["feature-clientuser\nConsumer Auth UIs, Web Social Login"]
        MgmtUser["feature-managementuser\nManagement Auth UIs, Admin Dashboard"]
        BaseUser["feature-user\nBase Identity, Use Cases, AuthStorage, Zustand Screens"]
    end

    %% SDK Core Modules
    subgraph CoreLayer [Core Infrastructure Modules]
        direction TB
        CoreSecurity["core-security\nPassword Policies, Security Storage"]
        CoreSettings["core-settings\nGlobal App Settings, Settings Repository"]
        CoreCommon["core-common\nFetch Client, WebWebSocketService, WebCryptoSettings,\nAppErrorParser, Pagination, React Components"]
    end

    %% External Systems
    Backend["Remote Backend Services\n(REST HTTP API & WebSockets)"]

    %% Wiring Relationships
    ClientApp --> ClientUser
    ClientApp --> CoreSettings
    ClientApp --> CoreSecurity
    ClientApp --> CoreCommon

    MgmtApp --> MgmtUser
    MgmtApp --> CoreSettings
    MgmtApp --> CoreSecurity
    MgmtApp --> CoreCommon

    ClientUser --> BaseUser
    ClientUser --> CoreSecurity
    ClientUser --> CoreSettings
    ClientUser --> CoreCommon

    MgmtUser --> BaseUser
    MgmtUser --> CoreSecurity
    MgmtUser --> CoreSettings
    MgmtUser --> CoreCommon

    BaseUser --> CoreSecurity
    BaseUser --> CoreSettings
    BaseUser --> CoreCommon

    CoreSecurity --> CoreCommon
    CoreSettings --> CoreCommon

    CoreCommon -->|HTTP Fetch / WebSockets| Backend
```

---

## 2. Workspace Package Graph

The project is structured as a `pnpm` monorepo workspace. It enforces strict layer boundaries: `core-common` is the foundational leaf package and must never depend on any `feature-*` packages. Feature modules depend on core primitives and `core-common`. Host applications aggregate the entire graph at their composition root.

```mermaid
graph TD
    %% Host Apps
    SampleClient["samples/client-app"]
    SampleMgmt["samples/management-app"]

    %% Features
    FeatureClientUser["packages/feature-clientuser"]
    FeatureMgmtUser["packages/feature-managementuser"]
    FeatureUser["packages/feature-user"]

    %% Core Modules
    CoreSecurity["packages/core-security"]
    CoreSettings["packages/core-settings"]
    CoreCommon["packages/core-common"]

    %% Dependencies
    SampleClient --> FeatureClientUser
    SampleClient --> CoreSettings
    SampleClient --> CoreSecurity
    SampleClient --> CoreCommon

    SampleMgmt --> FeatureMgmtUser
    SampleMgmt --> CoreSettings
    SampleMgmt --> CoreSecurity
    SampleMgmt --> CoreCommon

    FeatureClientUser --> FeatureUser
    FeatureClientUser --> CoreSecurity
    FeatureClientUser --> CoreSettings
    FeatureClientUser --> CoreCommon

    FeatureMgmtUser --> FeatureUser
    FeatureMgmtUser --> CoreSecurity
    FeatureMgmtUser --> CoreSettings
    FeatureMgmtUser --> CoreCommon

    FeatureUser --> CoreSecurity
    FeatureUser --> CoreSettings
    FeatureUser --> CoreCommon

    CoreSecurity --> CoreCommon
    CoreSettings --> CoreCommon
```

---

## 3. Routing & Web URL Architecture (TanStack Router)

Navigation across SDK screens is driven by **TanStack Router** in host applications (`samples/management-app` and `samples/client-app`) using File-based routing (`src/routes/`).

### Architectural Principles:
1. **Host-Owned Routing:** Host applications own the `createRouter` instance and route definitions. The SDK provides pure React screens, flat Zod search parameter schemas (`*SearchSchema.ts`), and DI interfaces.
2. **Router DI Context:** Applications inject UseCases and Repositories into the route tree via TanStack `createRootRouteWithContext<RouterDIContext>()`. Route components extract context using `Route.useRouteContext()` and pass dependencies to SDK components.
3. **URL as Single Source of Truth:** Query parameters, search filters, and sorting parameters belong in the URL. Zustand stores handle only async network calls and local UI draft state, ensuring F5 page refreshes, deep linking, and browser back/forward buttons work out of the box.
4. **Flat Search Params & Array Coercion:** Exported Zod schemas (`auditEventListSearchSchema`, etc.) are flat and use array coercion (`z.union([z.string().transform(v => [v]), z.array(z.string())])`) to prevent URL validation errors.
