import { appResultFailure, CommonError, isSuccess, mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
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
import type { AuthStorage, UserStorage, UpdateUserParams } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { SelfManagementUserApi } from '@/network/api/user/self-management-user-api'
import type { SelfManagementUserRepository } from '@/repository/user/self-management-user-repository'

class AsyncMutex {
  private queue: Promise<unknown> = Promise.resolve()

  public async runExclusive<T>(task: () => Promise<T>): Promise<T> {
    const res = this.queue.then(
      () => task(),
      () => task()
    )
    this.queue = res.catch(() => {})
    return res
  }
}

/**
 * Implements {@link SelfManagementUserRepository} by observing {@link UserStorage}, coordinating network updates via {@link SelfManagementUserApi},
 * and listening for live WebSocket events via {@link WebSocketService}.
 */
export class SelfManagementUserRepositoryImpl implements SelfManagementUserRepository {
  private readonly mutex = new AsyncMutex()

  /**
   * Constructs a new {@link SelfManagementUserRepositoryImpl}.
   *
   * @param userStorage - Local source for user data stream and persistence
   * @param authStorage - Source for auth token clearance
   * @param selfManagementUserApi - HTTP API for current user details
   * @param webSocketService - Optional source of push updates for user changes
   * @param logger - Optional diagnostic logger
   */
  public constructor(
    private readonly userStorage: UserStorage,
    private readonly authStorage: AuthStorage,
    private readonly selfManagementUserApi: SelfManagementUserApi,
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
    return this.mutex.runExclusive(async () => {
      const result = await this.selfManagementUserApi.getUser()
      const mapped = mapSuccess(result, (userDetailsPayload) => toUserPrivate(userDetailsPayload))
      if (isSuccess(mapped)) {
        await this.userStorage.updateCurrentUser(mapped.data)
      }
      return mapped
    })
  }

  /**
   * Partially updates account details and profile fields of the currently authenticated staff member.
   *
   * @param params - Patch domain parameters containing fields to update
   * @returns Mapped result with updated user domain model or an error
   */
  public async selfUpdateUser(params: UpdateUserParams): Promise<AppResult<UserPrivate, AppError>> {
    return this.mutex.runExclusive(async () => {
      const result = await this.selfManagementUserApi.selfUpdateUser(params)
      const mapped = mapSuccess(result, (userDetailsPayload) => toUserPrivate(userDetailsPayload))
      if (isSuccess(mapped)) {
        await this.userStorage.updateCurrentUser(mapped.data)
      }
      return mapped
    })
  }

  /**
   * Schedules current account for permanent deletion (not supported in management context).
   *
   * @returns Failure AppResult
   */
  public async scheduleUserDeletion(): Promise<AppResult<UserPrivate, AppError>> {
    return appResultFailure(CommonError.unknown())
  }

  /**
   * Cancels a pending account deletion request (not supported in management context).
   *
   * @returns Failure AppResult
   */
  public async restoreUser(): Promise<AppResult<UserPrivate, AppError>> {
    return appResultFailure(CommonError.unknown())
  }

  /**
   * Clears local user storage and authentication tokens.
   */
  public async clearSession(): Promise<void> {
    await this.userStorage.clear()
    await this.authStorage.clearTokens()
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
        this.logger?.('SelfManagementUserRepositoryImpl: Invalid user updated WS payload schema')
      }
    } catch (e) {
      this.logger?.(`SelfManagementUserRepositoryImpl: Failed to process USER_UPDATED WS event - ${String(e)}`)
    }
  }
}
