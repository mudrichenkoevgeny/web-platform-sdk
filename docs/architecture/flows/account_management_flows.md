# Account & Profile Management Flows

This document describes profile updates, active session management, identifier (email/phone) linking, and account deletion and restoration workflows in `web-platform-sdk`.

---

## 1. Profile Management Architecture

Profile management is centralized in `ProfileRootContainer` (`feature-user`). The component uses React state/Zustand navigation machines to host:
- `MainProfileScreen`: Overview of profile details, account status, security settings, and navigation hub.
- `SelfSessionListScreen`: Active sessions list with remote revocation controls.
- `SelfIdentifierListScreen`: Identifiers list (emails, phone numbers, Google accounts) with add/remove capabilities.
- `TotpMainScreen`: TOTP 2FA setup and recovery code management.

---

## 2. Active Session Management & Revocation Flow

Users can inspect all devices/browsers where their account is currently authenticated:

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Component as SelfSessionListScreen
    participant UC as GetSessionsUseCase / DeleteSessionUseCase
    participant Repo as SessionRepository
    participant API as SessionApi
    participant WS as WebWebSocketService

    User->>Component: Open Sessions Screen
    Component->>UC: GetSessionsUseCase()
    UC->>Repo: getSessions()
    Repo->>API: GET /user/sessions (Paged)
    API-->>Repo: PagedResult<UserSession> (Includes ClientDeviceInfo, IP, LastAccessedAt)
    Repo-->>Component: Display session list

    User->>Component: Click "Revoke Session" on Remote Device
    Component->>UC: DeleteSessionUseCase(sessionId)
    UC->>Repo: deleteSession(sessionId)
    Repo->>API: DELETE /user/sessions/{sessionId}
    API-->>Repo: HTTP 200 OK
    Repo-->>Component: Remove session item from list

    Note over WS: Remote device receives USER_SESSION_DELETED via WebSocket and logs out
```

---

## 3. User Identifiers Linking & Confirmation Throttling

Adding a new identifier (email address or phone number) requires OTP code confirmation. Cooldown throttling is managed by the `ConfirmationRepository`.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as SelfIdentifierListScreen
    participant UC as SendAddEmailIdentifierConfirmationUseCase / AddUserIdentifierEmailUseCase
    participant ConfRepo as ConfirmationRepository
    participant IdentRepo as IdentifierRepository
    participant API as OpenIdentifiersApi

    User->>UI: Input new email ("new@example.com")
    UI->>UC: SendAddEmailIdentifierConfirmationUseCase("new@example.com")
    UC->>ConfRepo: requestConfirmation(email, ADD_IDENTIFIER)

    alt Cooldown Active
        ConfRepo-->>UC: Return TooManyConfirmationRequests error (with retryAfterSeconds)
        UC-->>UI: Display cooldown timer (ResendCountdown)
    else Cooldown Expired
        ConfRepo->>API: POST /confirmation/send
        API-->>ConfRepo: Success
        ConfRepo-->>UC: Confirmation sent
        UC-->>UI: Prompt for 6-digit verification code
    end

    User->>UI: Submit code ("123456")
    UI->>UC: AddUserIdentifierEmailUseCase("new@example.com", "123456")
    UC->>IdentRepo: addEmailIdentifier("new@example.com", "123456")
    IdentRepo->>API: POST /user/identifiers/email
    API-->>IdentRepo: UserIdentifierPayload
    IdentRepo-->>UI: Identifier linked successfully
```

---

## 4. Account Deletion & Restoration Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as ProfileScreen / PendingDeletionScreen
    participant UC as ScheduleUserDeletionUseCase / RestoreUserUseCase
    participant Repo as UserRepository
    participant API as OpenUserApi

    alt User Requests Account Deletion
        User->>UI: Click "Delete Account"
        UI->>UC: ScheduleUserDeletionUseCase()
        UC->>Repo: scheduleUserDeletion()
        Repo->>API: POST /user/schedule-deletion
        API-->>Repo: UserDetails (status = PENDING_DELETION)
        Repo-->>UI: User details updated (status = PENDING_DELETION)
        UI-->>User: Show grace period banner / Navigate to PendingDeletionScreen
    else User Restores Account During Grace Period (Login Attempt)
        User->>UI: Logs in & Clicks "Restore Account"
        UI->>UC: RestoreUserUseCase()
        UC->>Repo: restoreUser()
        Repo->>API: POST /user/restore
        API-->>Repo: UserDetails (status = ACTIVE)
        Repo-->>UI: Account restored to ACTIVE status, redirect to Main App
    end
```
