import { isSuccess, mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AppError,
  AppResult,
  SocketFrame,
  WebSocketService
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import {
  toUserPrivate,
  userPrivatePayloadSchema,
  UserWebSocketEventTypes
} from '@mudrichenkoevgeny/shared-foundation'
import type { AuthStorage, UserRepository, UserStorage, UpdateUserParams } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { OpenUserApi } from '@/network/api/user/open-user-api'

/**
 * Implements {@link UserRepository} by observing {@link UserStorage}, coordinating network updates via {@link OpenUserApi},
 * and listening for live WebSocket events via {@link WebSocketService}.
 */
export class OpenUserRepositoryImpl implements UserRepository {
  private inFlightRefreshPromise: Promise<AppResult<UserPrivate, AppError>> | null = null

  /**
   * Constructs a new {@link OpenUserRepositoryImpl}.
   *
   * @param userStorage - Local storage for user snapshot
   * @param authStorage - Persistent storage for token clearance
   * @param openUserApi - HTTP API client for current user operations
   * @param webSocketService - Optional real-time WebSocket connection
   * @param logger - Optional diagnostic logger
   */
  public constructor(
    private readonly userStorage: UserStorage,
    private readonly authStorage: AuthStorage,
    private readonly openUserApi: OpenUserApi,
    private readonly webSocketService?: WebSocketService,
    private readonly logger?: (msg: string) => void
  ) {
    this.startWebSocketObservation()
  }

  /**
   * Observes changes to current cached user snapshot.
   *
   * @param listener - Callback function triggered on user change
   * @returns Unsubscribe cleanup function
   */
  public observeCurrentUser(listener: (user: UserPrivate | null) => void): () => void {
    return this.userStorage.observeCurrentUser(listener)
  }

  /**
   * Forces a network reload of current user details and updates local storage on success.
   *
   * @returns Mapped result with refreshed user domain model or an error
   */
  public async refreshCurrentUser(): Promise<AppResult<UserPrivate, AppError>> {
    if (this.inFlightRefreshPromise) {
      return this.inFlightRefreshPromise
    }

    this.inFlightRefreshPromise = this.refreshCurrentUserInternal().finally(() => {
      this.inFlightRefreshPromise = null
    })

    return this.inFlightRefreshPromise
  }

  /**
   * Partially updates account details and profile fields of the currently authenticated user.
   *
   * @param params - Patch domain parameters containing fields to update
   * @returns Mapped result with updated user domain model or an error
   */
  public async selfUpdateUser(params: UpdateUserParams): Promise<AppResult<UserPrivate, AppError>> {
    const result = await this.openUserApi.selfUpdateUser(params)
    const mapped = mapSuccess(result, (userPrivatePayload) => toUserPrivate(userPrivatePayload))
    if (isSuccess(mapped)) {
      await this.userStorage.updateCurrentUser(mapped.data)
    }
    return mapped
  }

  /**
   * Schedules current account for permanent deletion and updates local state.
   *
   * @returns Mapped result with updated user domain model reflecting deletion schedule or an error
   */
  public async scheduleUserDeletion(): Promise<AppResult<UserPrivate, AppError>> {
    const result = await this.openUserApi.scheduleUserDeletion()
    const mapped = mapSuccess(result, (userPrivatePayload) => toUserPrivate(userPrivatePayload))
    if (isSuccess(mapped)) {
      await this.userStorage.updateCurrentUser(mapped.data)
    }
    return mapped
  }

  /**
   * Cancels a pending account deletion request and updates local state.
   *
   * @returns Mapped result with restored user domain model or an error
   */
  public async restoreUser(): Promise<AppResult<UserPrivate, AppError>> {
    const result = await this.openUserApi.restoreUser()
    const mapped = mapSuccess(result, (userPrivatePayload) => toUserPrivate(userPrivatePayload))
    if (isSuccess(mapped)) {
      await this.userStorage.updateCurrentUser(mapped.data)
    }
    return mapped
  }

  /**
   * Clears local user storage and authentication tokens.
   */
  public async clearSession(): Promise<void> {
    await this.userStorage.clear()
    await this.authStorage.clearTokens()
  }

  private async refreshCurrentUserInternal(): Promise<AppResult<UserPrivate, AppError>> {
    const result = await this.openUserApi.getUser()
    const mapped = mapSuccess(result, (userPrivatePayload) => toUserPrivate(userPrivatePayload))
    if (isSuccess(mapped)) {
      await this.userStorage.updateCurrentUser(mapped.data)
    }
    return mapped
  }

  private startWebSocketObservation(): void {
    if (!this.webSocketService) {
      return
    }

    this.webSocketService.observeEvents((frame: SocketFrame) => {
      if (frame.type === UserWebSocketEventTypes.USER_UPDATED) {
        this.handleUserUpdated(frame.payload)
      } else if (frame.type === UserWebSocketEventTypes.SESSION_DELETED) {
        void this.clearSession()
      }
    })
  }

  private handleUserUpdated(payload: unknown): void {
    if (!payload) {
      return
    }

    try {
      const validationResult = userPrivatePayloadSchema.safeParse(payload)
      if (validationResult.success) {
        void this.userStorage.updateCurrentUser(toUserPrivate(validationResult.data))
      } else {
        this.logger?.('OpenUserRepositoryImpl: Invalid user updated WS payload schema')
      }
    } catch (e) {
      this.logger?.(`OpenUserRepositoryImpl: Failed to process USER_UPDATED WS event - ${String(e)}`)
    }
  }
}
