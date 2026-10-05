# todo delete later and fix readme if need
# Core Common — Implementation Plan

This document outlines the step-by-step implementation plan for the `core-common` module in the Web Platform SDK. It maps the architectural concepts from the Kotlin Multiplatform (KMP) project to the modern Web ecosystem (TypeScript, React, WebCrypto, native Fetch).

## 🧠 Context & Notes for AI (Read Before Coding)

**Tech Stack Mapping (KMP -> Web):**
*   **Ktor HTTP Client** -> Native browser `fetch` wrapped in a custom `HttpClient` class.
*   **DataStore + Tink** -> Browser `localStorage` / `sessionStorage` encrypted using the native `WebCrypto API` (AES-GCM).
*   **Kotlinx.serialization** -> `Zod` (from `@mudrichenkoevgeny/shared-foundation`).
*   **Coroutines / Flow** -> `Promise`, `async/await`, and standard Event Listeners / Callbacks.
*   **Compose UI** -> React (`.tsx`) + Tailwind CSS + `shadcn/ui`.
*   **Kermit Logging** -> Custom `AppErrorLogger` wrapping `console.error` / `console.warn`.
*   **DI (Manual)** -> Pure TypeScript classes for instances (`CommonComponent`), injected into UI via React Context (`SdkProvider`).

**Strict Standards Compliance:**
*   **Always request and review the original Kotlin Multiplatform (KMP) analogue files before implementing any phase.**
*   No FQN (Fully Qualified Names) in inline code.
*   No comments in source code (self-documenting only).
*   Use `AppResult<T, E>` for all business logic returns.
*   Branded types (`UserId`, `ErrorId`) must use `toXxxIdOrThrow()` conversions.
*   Every `.tsx` component must have a `.test.tsx` and `.stories.tsx`.

---

## 🏗️ Implementation Phases

### Phase 1: Theme & Design Tokens (✅ Completed)
- [x] Configure Tailwind CSS preset (`tailwind-preset.ts`).
- [x] Integrate generated `tokens.css` and `tokens.ts`.
- [x] Set up local `.woff2` font assets (`PT Sans`).
- [x] Create `ThemeContext.tsx` (`ThemeProvider`, `useTheme`) for Light/Dark/System switching.
- [x] Write Unit/UI tests for Theme context.

### Phase 2: Result Pattern & Error Modeling (CoR) (✅ Completed)
- [x] Implement `AppResult<T, E>` (Success/Failure discriminated union).
- [x] Implement `AppError` interface and `CommonError` class.
- [x] Implement `AppErrorLogger` (structured console logging).
- [x] Implement `AppErrorParser` (Chain of Responsibility base).
- [x] Implement `CommonErrorParser` (fallback parser resolving strings).
- [x] Create testing mocks (`AppErrorParserMock`).

### Phase 3: WebCrypto Storage (✅ Completed)
- [x] Implement `EncryptedSettings` interface.
- [x] Implement `WebCryptoSettings` (AES-GCM encryption wrapper over `localStorage`/`sessionStorage`).
- [x] Implement `CommonStorage` / `EncryptedCommonStorage` (typed keys for device ID, language, etc.).
- [x] Create testing mocks (`createInMemoryEncryptedSettings`).

### Phase 4: Platform & Device Context (✅ Completed)
- [x] Implement `DeviceInfoProvider` (parsing `navigator.userAgent`, screen size, language).
- [x] Implement `ExternalLauncher` (`window.open(url, '_blank')`, `mailto:`).
- [x] Implement `PlatformRepository` (immutable access to device info).

### Phase 5: Networking (Fetch & WebSockets) (✅ Completed)
- [x] Implement `HttpClient` (wrapper around `fetch`).
- [x] Implement `HttpClientConfigPlugin` interface (interceptors for Auth/Headers).
- [x] Implement `AccessTokenProvider` interface.
- [x] Implement `WebSocketService` (connection lifecycle, reconnects, ping/pong).
- [x] Implement `WebSocketMessageHandler` & `CommonWebSocketMessageHandler`.
- [x] Create testing mocks (`WebSocketServiceMock`, `AccessTokenProviderMock`).

### Phase 6: Core DI Component & React Context (✅ Completed)
- [x] Implement `EncryptedSettingsComponent`.
- [x] Implement `CommonComponent` (wiring HttpClient, Storage, WebSockets, PlatformRepository).
- [x] Implement `SdkProvider.tsx` and `useSdkStore()` / `useCommonComponent()` (React Context for injecting `CommonComponent` and `AppErrorParser`).

### Phase 7: UI Infrastructure & Listing (✅ Completed)
- [x] Implement `PaginationState` and `ListingConstants`.
- [x] Implement base UI components (using Tailwind/shadcn):
  - [x] `FullscreenLoading`
  - [x] `FullscreenError`
  - [x] `CoreButton` / `CoreTextButton`
  - [x] `CoreOutlinedTextField` / `CorePasswordTextField`
  - [x] `PagingFooter`
- [x] Write `.test.tsx` (React Testing Library) and `.stories.tsx` (Storybook) for ALL components.

### Phase 8: File Naming Normalization Refactoring
- [x] Rename directory `src/network/httpclient/` to `src/network/http-client/` and update imports.
- [x] Rename directory `src/network/websocket/messagehandler/` to `src/network/websocket/message-handler/` and update imports.
- [x] Rename directory `src/platform/deviceinfo/` to `src/platform/device-info/` and update imports.
- [x] Rename directory `src/platform/externallauncher/` to `src/platform/external-launcher/` and update imports.
- [x] `src/assets/fonts/pt-sans-bold-italic.woff2` is correct.
- [x] `src/assets/fonts/pt-sans-bold.woff2` is correct.
- [x] `src/assets/fonts/pt-sans-italic.woff2` is correct.
- [x] `src/assets/fonts/pt-sans-regular.woff2` is correct.
- [x] `src/assets/icons/ic_add.svg` is correct.
- [x] `src/assets/icons/ic_back.svg` is correct.
- [x] `src/assets/icons/ic_copy.svg` is correct.
- [x] `src/assets/icons/ic_delete.svg` is correct.
- [x] `src/assets/icons/ic_filter.svg` is correct.
- [x] `src/assets/icons/ic_hide.svg` is correct.
- [x] `src/assets/icons/ic_home.svg` is correct.
- [x] `src/assets/icons/ic_password_reset.svg` is correct.
- [x] `src/assets/icons/ic_profile.svg` is correct.
- [x] `src/assets/icons/ic_refresh.svg` is correct.
- [x] `src/assets/icons/ic_settings.svg` is correct.
- [x] `src/assets/icons/ic_show.svg` is correct.
- [x] `src/assets/icons/ic_warning.svg` is correct.
- [x] `src/assets/icons/index.ts` is correct.
- [x] `src/context/SdkProvider.test.tsx` is correct.
- [x] `src/context/SdkProvider.tsx` is correct.
- [x] `src/di/CommonComponent.test.ts` is correct (renamed to `common-component.test.ts`).
- [x] `src/di/CommonComponent.ts` is correct (renamed to `common-component.ts`).
- [x] `src/di/EncryptedSettingsComponent.ts` is correct (renamed to `encrypted-settings-component.ts`).
- [x] `src/error/logger/AppErrorLogger.test.ts` is correct (renamed to `app-error-logger.test.ts`).
- [x] `src/error/logger/AppErrorLogger.ts` is correct (renamed to `app-error-logger.ts`).
- [x] `src/error/mapper/toServerError.test.ts` is correct (renamed to `to-server-error.test.ts`).
- [x] `src/error/mapper/toServerError.ts` is correct (renamed to `to-server-error.ts`).
- [x] `src/error/model/ApiException.test.ts` is correct (renamed to `api-exception.test.ts`).
- [x] `src/error/model/ApiException.ts` is correct (renamed to `api-exception.ts`).
- [x] `src/error/model/AppError.ts` is correct (renamed to `app-error.ts`).
- [x] `src/error/model/CommonError.test.ts` is correct (renamed to `common-error.test.ts`).
- [x] `src/error/model/CommonError.ts` is correct (renamed to `common-error.ts`).
- [x] `src/error/model/ErrorId.test.ts` is correct (renamed to `error-id.test.ts`).
- [x] `src/error/model/ErrorId.ts` is correct (renamed to `error-id.ts`).
- [x] `src/error/model/ServerError.test.ts` is correct (renamed to `server-error.test.ts`).
- [x] `src/error/model/ServerError.ts` is correct (renamed to `server-error.ts`).
- [x] `src/error/naming/ClientCommonErrorCodes.ts` is correct (renamed to `client-common-error-codes.ts`).
- [x] `src/error/parser/AppErrorParser.ts` is correct (renamed to `app-error-parser.ts`).
- [x] `src/error/parser/AppErrorParserBuilder.test.ts` is correct (renamed to `app-error-parser-builder.test.ts`).
- [x] `src/error/parser/AppErrorParserBuilder.ts` is correct (renamed to `app-error-parser-builder.ts`).
- [x] `src/error/parser/CommonErrorParser.test.ts` is correct (renamed to `common-error-parser.test.ts`).
- [x] `src/error/parser/CommonErrorParser.ts` is correct (renamed to `common-error-parser.ts`).
- [x] `src/index.ts` is correct.
- [x] `src/listing/ListingModels.ts` is correct (renamed to `listing-models.ts`).
- [x] `src/locales/en/strings.ts` is correct.
- [x] `src/locales/index.ts` is correct.
- [x] `src/locales/ru/strings.ts` is correct.
- [x] `src/mock/di/CommonComponentMock.ts` is correct (renamed to `common-component-mock.ts`).
- [x] `src/mock/error/AppErrorParserMock.ts` is correct (renamed to `app-error-parser-mock.ts`).
- [x] `src/mock/mocks.test.ts` is correct.
- [x] `src/mock/network/AccessTokenProviderMock.ts` is correct (renamed to `access-token-provider-mock.ts`).
- [x] `src/mock/network/HttpClientConfigPluginMock.ts` is correct (renamed to `http-client-config-plugin-mock.ts`).
- [x] `src/mock/network/WebSocketServiceMock.ts` is correct (renamed to `web-socket-service-mock.ts`).
- [x] `src/mock/platform/DeviceInfoProviderMock.ts` is correct (renamed to `device-info-provider-mock.ts`).
- [x] `src/mock/platform/ExternalLauncherMock.ts` is correct (renamed to `external-launcher-mock.ts`).
- [x] `src/mock/platform/PlatformRepositoryMock.ts` is correct (renamed to `platform-repository-mock.ts`).
- [x] `src/mock/storage/CommonStorageMock.ts` is correct (renamed to `common-storage-mock.ts`).
- [x] `src/mock/storage/EncryptedSettingsMock.ts` is correct (renamed to `encrypted-settings-mock.ts`).
- [x] `src/network/contract/CommonHttpHeaders.ts` is correct (renamed to `common-http-headers.ts`).
- [x] `src/network/contract/CommonWebSocketEventTypes.ts` is correct (renamed to `common-web-socket-event-types.ts`).
- [x] `src/network/contract/Contracts.test.ts` is correct (renamed to `contracts.test.ts`).
- [x] `src/network/httpclient/HttpClient.test.ts` is correct (renamed to `http-client.test.ts`).
- [x] `src/network/httpclient/HttpClient.ts` is correct (renamed to `http-client.ts`).
- [x] `src/network/httpclient/HttpClientConfigPlugin.ts` is correct (renamed to `http-client-config-plugin.ts`).
- [x] `src/network/model/websocket/SocketFrame.ts` is correct (renamed to `socket-frame.ts`).
- [x] `src/network/provider/AccessTokenProvider.ts` is correct (renamed to `access-token-provider.ts`).
- [x] `src/network/utils/callResult.test.ts` is correct (renamed to `call-result.test.ts`).
- [x] `src/network/utils/callResult.ts` is correct (renamed to `call-result.ts`).
- [x] `src/network/utils/isNoInternetException.test.ts` is correct (renamed to `is-no-internet-exception.test.ts`).
- [x] `src/network/utils/isNoInternetException.ts` is correct (renamed to `is-no-internet-exception.ts`).
- [x] `src/network/websocket/messagehandler/CommonWebSocketMessageHandler.test.ts` is correct (renamed to `common-web-socket-message-handler.test.ts`).
- [x] `src/network/websocket/messagehandler/CommonWebSocketMessageHandler.ts` is correct (renamed to `common-web-socket-message-handler.ts`).
- [x] `src/network/websocket/messagehandler/WebSocketMessageHandler.ts` is correct (renamed to `web-socket-message-handler.ts`).
- [x] `src/network/websocket/messagehandler/WebSocketMessageHandlerResult.ts` is correct (renamed to `web-socket-message-handler-result.ts`).
- [x] `src/network/websocket/service/WebSocketService.ts` is correct (renamed to `web-socket-service.ts`).
- [x] `src/network/websocket/service/WebWebSocketService.test.ts` is correct (renamed to `web-web-socket-service.test.ts`).
- [x] `src/network/websocket/service/WebWebSocketService.ts` is correct (renamed to `web-web-socket-service.ts`).
- [x] `src/platform/PlatformRepository.test.ts` is correct (renamed to `platform-repository.test.ts`).
- [x] `src/platform/PlatformRepository.ts` is correct (renamed to `platform-repository.ts`).
- [x] `src/platform/deviceinfo/DeviceInfoProvider.ts` is correct (renamed to `device-info-provider.ts`).
- [x] `src/platform/deviceinfo/WebDeviceInfoProvider.test.ts` is correct (renamed to `web-device-info-provider.test.ts`).
- [x] `src/platform/externallauncher/ExternalLauncher.ts` is correct (renamed to `external-launcher.ts`).
- [x] `src/platform/externallauncher/WebExternalLauncher.test.ts` is correct (renamed to `web-external-launcher.test.ts`).
- [x] `src/platform/parser/UserAgentParser.test.ts` is correct (renamed to `user-agent-parser.test.ts`).
- [x] `src/platform/parser/UserAgentParser.ts` is correct (renamed to `user-agent-parser.ts`).
- [x] `src/result/AppResult.test.ts` is correct (renamed to `app-result.test.ts`).
- [x] `src/result/AppResult.ts` is correct (renamed to `app-result.ts`).
- [x] `src/storage/EncryptedSettings.ts` is correct (renamed to `encrypted-settings.ts`).
- [x] `src/storage/SettingsFactory.test.ts` is correct (renamed to `settings-factory.test.ts`).
- [x] `src/storage/SettingsFactory.ts` is correct (renamed to `settings-factory.ts`).
- [x] `src/storage/WebCryptoSettings.test.ts` is correct (renamed to `web-crypto-settings.test.ts`).
- [x] `src/storage/WebCryptoSettings.ts` is correct (renamed to `web-crypto-settings.ts`).
- [x] `src/storage/common/CommonStorage.ts` is correct (renamed to `common-storage.ts`).
- [x] `src/storage/common/EncryptedCommonStorage.test.ts` is correct (renamed to `encrypted-common-storage.test.ts`).
- [x] `src/storage/common/EncryptedCommonStorage.ts` is correct (renamed to `encrypted-common-storage.ts`).
- [x] `src/testing/ComponentTestHarness.test.tsx` is correct.
- [x] `src/testing/ComponentTestHarness.tsx` is correct.
- [x] `src/testing/previewSpecs.ts` is correct (renamed to `preview-specs.ts`).
- [x] `src/testing/storybookDecorators.tsx` is correct (renamed to `storybook-decorators.tsx`).
- [x] `src/theme/ThemeContext.test.tsx` is correct.
- [x] `src/theme/ThemeContext.tsx` is correct.
- [x] `src/theme/index.css` is correct.
- [x] `src/theme/index.ts` is correct.
- [x] `src/theme/tailwind-preset.ts` is correct.
- [x] `src/theme/tokens/index.ts` is correct.
- [x] `src/theme/tokens/tokens.css` is correct.
- [x] `src/theme/tokens/tokens.ts` is correct.
- [x] `src/time/dateTimeFormatter.test.ts` is correct (renamed to `date-time-formatter.test.ts`).
- [x] `src/time/dateTimeFormatter.ts` is correct (renamed to `date-time-formatter.ts`).
- [x] `src/time/resendCountdown.test.ts` is correct (renamed to `resend-countdown.test.ts`).
- [x] `src/time/resendCountdown.ts` is correct (renamed to `resend-countdown.ts`).
- [x] `src/types/svg.d.ts` is correct.
- [x] `src/ui/components/button/back/CoreBackButton.stories.tsx` is correct.
- [x] `src/ui/components/button/back/CoreBackButton.test.tsx` is correct.
- [x] `src/ui/components/button/back/CoreBackButton.tsx` is correct.
- [x] `src/ui/components/button/button/CoreButton.stories.tsx` is correct.
- [x] `src/ui/components/button/button/CoreButton.test.tsx` is correct.
- [x] `src/ui/components/button/button/CoreButton.tsx` is correct.
- [x] `src/ui/components/button/text/CoreTextButton.stories.tsx` is correct.
- [x] `src/ui/components/button/text/CoreTextButton.test.tsx` is correct.
- [x] `src/ui/components/button/text/CoreTextButton.tsx` is correct.
- [x] `src/ui/components/container/scrollable-screen-content/CoreScrollableScreenContent.stories.tsx` is correct.
- [x] `src/ui/components/container/scrollable-screen-content/CoreScrollableScreenContent.test.tsx` is correct.
- [x] `src/ui/components/container/scrollable-screen-content/CoreScrollableScreenContent.tsx` is correct.
- [x] `src/ui/components/error/fullscreen/FullscreenError.stories.tsx` is correct.
- [x] `src/ui/components/error/fullscreen/FullscreenError.test.tsx` is correct.
- [x] `src/ui/components/error/fullscreen/FullscreenError.tsx` is correct.
- [x] `src/ui/components/icon/icon/CoreIcon.stories.tsx` is correct.
- [x] `src/ui/components/icon/icon/CoreIcon.test.tsx` is correct.
- [x] `src/ui/components/icon/icon/CoreIcon.tsx` is correct.
- [x] `src/ui/components/input/code/CoreCodeTextField.stories.tsx` is correct.
- [x] `src/ui/components/input/code/CoreCodeTextField.test.tsx` is correct.
- [x] `src/ui/components/input/code/CoreCodeTextField.tsx` is correct.
- [x] `src/ui/components/input/email/CoreEmailTextField.stories.tsx` is correct.
- [x] `src/ui/components/input/email/CoreEmailTextField.test.tsx` is correct.
- [x] `src/ui/components/input/email/CoreEmailTextField.tsx` is correct.
- [x] `src/ui/components/input/outlined/CoreOutlinedTextField.stories.tsx` is correct.
- [x] `src/ui/components/input/outlined/CoreOutlinedTextField.test.tsx` is correct.
- [x] `src/ui/components/input/outlined/CoreOutlinedTextField.tsx` is correct.
- [x] `src/ui/components/input/password/CorePasswordTextField.stories.tsx` is correct.
- [x] `src/ui/components/input/password/CorePasswordTextField.test.tsx` is correct.
- [x] `src/ui/components/input/password/CorePasswordTextField.tsx` is correct.
- [x] `src/ui/components/listing/empty-state/ListingEmptyState.stories.tsx` is correct.
- [x] `src/ui/components/listing/empty-state/ListingEmptyState.test.tsx` is correct.
- [x] `src/ui/components/listing/empty-state/ListingEmptyState.tsx` is correct.
- [x] `src/ui/components/listing/header-bar/ListingHeaderBar.stories.tsx` is correct.
- [x] `src/ui/components/listing/header-bar/ListingHeaderBar.test.tsx` is correct.
- [x] `src/ui/components/listing/header-bar/ListingHeaderBar.tsx` is correct.
- [x] `src/ui/components/listing/infinite-scroll/useInfiniteScroll.test.tsx` is correct (renamed to `use-infinite-scroll.test.tsx`).
- [x] `src/ui/components/listing/infinite-scroll/useInfiniteScroll.ts` is correct (renamed to `use-infinite-scroll.ts`).
- [x] `src/ui/components/listing/option/dropdown/ListingChoiceDropdown.stories.tsx` is correct.
- [x] `src/ui/components/listing/option/dropdown/ListingChoiceDropdown.test.tsx` is correct.
- [x] `src/ui/components/listing/option/dropdown/ListingChoiceDropdown.tsx` is correct.
- [x] `src/ui/components/listing/option/panel/ListingOptionsPanel.stories.tsx` is correct.
- [x] `src/ui/components/listing/option/panel/ListingOptionsPanel.test.tsx` is correct.
- [x] `src/ui/components/listing/option/panel/ListingOptionsPanel.tsx` is correct.
- [x] `src/ui/components/listing/paging-footer/PagingFooter.stories.tsx` is correct.
- [x] `src/ui/components/listing/paging-footer/PagingFooter.test.tsx` is correct.
- [x] `src/ui/components/listing/paging-footer/PagingFooter.tsx` is correct.
- [x] `src/ui/components/loading/fullscreen/FullscreenLoading.stories.tsx` is correct.
- [x] `src/ui/components/loading/fullscreen/FullscreenLoading.test.tsx` is correct.
- [x] `src/ui/components/loading/fullscreen/FullscreenLoading.tsx` is correct.
- [x] `src/ui/components/loading/overlay/FullscreenOverlayLoading.stories.tsx` is correct.
- [x] `src/ui/components/loading/overlay/FullscreenOverlayLoading.test.tsx` is correct.
- [x] `src/ui/components/loading/overlay/FullscreenOverlayLoading.tsx` is correct.
- [x] `src/ui/components/scrollbar/scrollbar/CoreScrollbar.stories.tsx` is correct.
- [x] `src/ui/components/scrollbar/scrollbar/CoreScrollbar.test.tsx` is correct.
- [x] `src/ui/components/scrollbar/scrollbar/CoreScrollbar.tsx` is correct.
- [x] `src/ui/components/text/body/CoreText.stories.tsx` is correct.
- [x] `src/ui/components/text/body/CoreText.test.tsx` is correct.
- [x] `src/ui/components/text/body/CoreText.tsx` is correct.
- [x] `src/ui/components/text/error/CoreErrorText.stories.tsx` is correct.
- [x] `src/ui/components/text/error/CoreErrorText.test.tsx` is correct.
- [x] `src/ui/components/text/error/CoreErrorText.tsx` is correct.
- [x] `src/ui/components/text/screen-title/CoreScreenTitleText.stories.tsx` is correct.
- [x] `src/ui/components/text/screen-title/CoreScreenTitleText.test.tsx` is correct.
- [x] `src/ui/components/text/screen-title/CoreScreenTitleText.tsx` is correct.
- [x] `src/utils/cn.test.ts` is correct.
- [x] `src/utils/cn.ts` is correct.

### Phase 9: Final Review & Export (✅ Completed)
- [x] Ensure all public APIs are exported via `src/index.ts`.
- [x] Validate `tsc --noEmit` and `vite build` complete successfully.
