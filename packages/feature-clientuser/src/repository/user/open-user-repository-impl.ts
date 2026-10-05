import { isSuccess, mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AppError,
  AppResult,
  SocketFrame,
  WebSocketService
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserDetails } from '@mudrichenkoevgeny/shared-foundation'
import {
  toUserDetails,
  userDetailsPayloadSchema,
  UserWebSocketEventTypes
} from '@mudrichenkoevgeny/shared-foundation'
import { AuthStorage, UserRepository, UserStorage } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { OpenUserApi } from '@/network/api/user/open-user-api'

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
 * Implements {@link UserRepository} by observing {@link UserStorage}, coordinating network updates via {@link OpenUserApi},
 * and listening for live WebSocket events via {@link WebSocketService}.
 */
export class OpenUserRepositoryImpl implements UserRepository {
  private readonly mutex = new AsyncMutex()

  /**
   * Constructs a new {@link OpenUserRepositoryImpl}.
   *
   * @param userStorage - Local source for user profile stream and persistence
   * @param authStorage - Source for auth token clearance
   * @param openUserApi - User HTTP API for profile and account management
   * @param webSocketService - Optional source of push updates for user changes
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

  public observeCurrentUser(listener: (user: UserDetails | null) => void): () => void {
    return this.userStorage.observeCurrentUser(listener)
  }

  public async refreshCurrentUser(): Promise<AppResult<UserDetails, AppError>> {
    return this.mutex.runExclusive(() => this.refreshCurrentUserInternal())
  }

  public async scheduleUserDeletion(): Promise<AppResult<UserDetails, AppError>> {
    return this.mutex.runExclusive(async () => {
      const result = await this.openUserApi.scheduleUserDeletion()
      const mapped = mapSuccess(result, (userDetailsPayload) => toUserDetails(userDetailsPayload))
      if (isSuccess(mapped)) {
        await this.userStorage.updateCurrentUser(mapped.data)
      }
      return mapped
    })
  }

  public async restoreUser(): Promise<AppResult<UserDetails, AppError>> {
    return this.mutex.runExclusive(async () => {
      const result = await this.openUserApi.restoreUser()
      const mapped = mapSuccess(result, (userDetailsPayload) => toUserDetails(userDetailsPayload))
      if (isSuccess(mapped)) {
        await this.userStorage.updateCurrentUser(mapped.data)
      }
      return mapped
    })
  }

  public async clearSession(): Promise<void> {
    await this.userStorage.clear()
    await this.authStorage.clearTokens()
  }

  private async refreshCurrentUserInternal(): Promise<AppResult<UserDetails, AppError>> {
    const result = await this.openUserApi.getUser()
    const mapped = mapSuccess(result, (userDetailsPayload) => toUserDetails(userDetailsPayload))
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
      const validationResult = userDetailsPayloadSchema.safeParse(payload)
      if (validationResult.success) {
        void this.userStorage.updateCurrentUser(toUserDetails(validationResult.data))
      } else {
        this.logger?.('OpenUserRepositoryImpl: Invalid user updated WS payload schema')
      }
    } catch (e) {
      this.logger?.(`OpenUserRepositoryImpl: Failed to process USER_UPDATED WS event - ${String(e)}`)
    }
  }
}
