# @mudrichenkoevgeny/web-platform-sdk-core-storage

File storage management module for the Web Platform SDK: **file operations**, **direct S3 XMLHttpRequest uploader**, **presigned upload URL handling**, **storage settings management**, **WebSocket real-time synchronization**, domain **use cases**, and **Zustand React UI components and screens**.

This module depends strictly on `@mudrichenkoevgeny/web-platform-sdk-core-common` and `@mudrichenkoevgeny/shared-foundation`.

---

## What It Provides

### 1. Wiring & DI
- **`StorageComponent`:** Root entry point assembling storage settings, API clients, repositories, and use cases. Exposes `storageSettingsRepository`, `getOpenStorageSettingsUseCase`, `refreshOpenStorageSettingsUseCase`, and `storageWebSocketMessageHandler`.

### 2. Direct S3 Upload & Storage API
- **`uploadFileDirectly` / `DirectFileUploaderImpl`:** Pure XMLHttpRequest uploader conducting direct binary S3 uploads with real-time percentage progress callbacks.
- **`StorageApi`:** Generic REST API client contract returning mapped domain models (`StorageFilePrivate`, `StorageFileSummary`, `PresignedUrl`).

### 3. Storage Settings & Persistence
- **`OpenStorageSettingsStorage` / `EncryptedOpenStorageSettingsStorage`:** WebCrypto AES-GCM encrypted caching layer for storage limits, allowed MIME types, and presigned TTL properties.
- **`OpenStorageSettingsRepository` / `OpenStorageSettingsRepositoryImpl`:** Central repository coordinating storage settings REST requests, local cache fallback, and WebSocket updates.

### 4. Domain Use Cases
- **`GetFilesUseCase`:** Retrieves paginated file list domain summaries.
- **`GetFileDetailUseCase`:** Retrieves detailed private file domain models.
- **`UploadFileUseCase`:** Executes the complete direct S3 presigned upload flow.
- **`DeleteFileUseCase`:** Deletes a specific storage file.
- **`DeleteFilesBatchUseCase`:** Deletes multiple storage files in a single batch operation.
- **`GetOpenStorageSettingsUseCase` / `RefreshOpenStorageSettingsUseCase`:** Manages open storage configuration settings.

### 5. React UI Components & Screens
- **`StorageFileListScreen`:** Unified file list view with infinite pagination, sorting, filters, batch selection, and deletion dialogs.
- **`StorageFileDetailScreen`:** Detailed file view displaying preview media, metadata, copy link action, and deletion dialogs.
- **`StorageFileUploadScreen` / `StorageFileUploadArea`:** Drag-and-drop upload queue with category/visibility selectors and progress bars.
- **`StorageFileItem`:** Reusable file summary card component.
- **`getStorageCategoryIcon` / `getStorageStatusIcon`:** Utility icon mappers.

---

## Package Map

| Directory | Role |
| :--- | :--- |
| `src/di/` | `StorageComponent` manual dependency injection assembly point. |
| `src/error/` | Storage-specific `AppError` subclasses and `StorageErrorParser`. |
| `src/network/` | `StorageApi`, `FetchOpenStorageSettingsApi`, and `StorageWebSocketMessageHandler`. |
| `src/uploader/` | `uploadFileDirectly` XMLHttpRequest S3 uploader. |
| `src/storage/` | `OpenStorageSettingsStorage` interface and `EncryptedOpenStorageSettingsStorage` (AES-GCM). |
| `src/repository/` | `StorageRepository` and `OpenStorageSettingsRepository` contracts. |
| `src/usecase/` | `GetFilesUseCase`, `GetFileDetailUseCase`, `UploadFileUseCase`, `DeleteFileUseCase`, `DeleteFilesBatchUseCase`, and settings use cases. |
| `src/ui/` | React screens (`StorageFileListScreen`, `StorageFileDetailScreen`, `StorageFileUploadScreen`), components, Zustand stores, and icon utilities. |
| `src/mock/` | Test doubles and mock dependency factories (`StorageComponentMock`, `storageFileDetailDependenciesMock`, etc.). |

---

## Usage

### 1. Installation
```bash
pnpm add @mudrichenkoevgeny/web-platform-sdk-core-storage
```

### 2. Initializing StorageComponent & Registration

```typescript
import { StorageComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import { CommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

const storageComponent = new StorageComponent({
  webSocketService: commonComponent.webSocketService,
  httpClient: commonComponent.httpClient,
  encryptedSettings: commonComponent.encryptedSettings
})

// Register WebSocket message handler
commonComponent.webSocketService.updateWebSocketMessageHandlers([
  storageComponent.storageWebSocketMessageHandler
])
```

---

## Source Code & Repository

The source code for this library is maintained in the main GitHub repository:
**[GitHub Repository: mudrichenkoevgeny/web-platform-sdk](https://github.com/mudrichenkoevgeny/web-platform-sdk)**

## License

Licensed under the Apache License 2.0. See [LICENSE](https://github.com/mudrichenkoevgeny/web-platform-sdk/blob/main/LICENSE) for details.
