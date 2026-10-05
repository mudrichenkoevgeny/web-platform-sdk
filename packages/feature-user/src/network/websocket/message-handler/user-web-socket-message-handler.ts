import {
  CommonError,
  webSocketMessageHandlerResultError,
  webSocketMessageHandlerResultHandled,
  webSocketMessageHandlerResultNotHandled
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { SocketFrame, WebSocketMessageHandler, WebSocketMessageHandlerResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { userDetailsPayloadSchema } from '@mudrichenkoevgeny/shared-foundation'
import type { UserStorage } from '@/storage/user/user-storage'
import type { AuthStorage } from '@/storage/auth/auth-storage'
import type { UserRepository } from '@/repository/user/user-repository'
import type { RefreshTokenUseCase } from '@/usecase/auth/refresh-token/refresh-token-use-case'
import { UserWebSocketEventTypes, toUserDetails } from '@mudrichenkoevgeny/shared-foundation'
/**
 * Interprets user-related WebSocket frames (`UserWebSocketEventTypes`) for unauthorized sessions,
 * account status, and session termination.
 */
export class UserWebSocketMessageHandler implements WebSocketMessageHandler {
  /**
   * Constructs a new {@link UserWebSocketMessageHandler}.
   *
   * @param userStorage - Storage for updating current user snapshot
   * @param userRepository - User repository for clearing local session state on deletion
   * @param authStorage - Storage for checking stored token credentials
   * @param refreshTokenUseCase - Use case to trigger session refresh on unauthorized frames
   */
  public constructor(
    private readonly userStorage: UserStorage,
    private readonly userRepository: UserRepository,
    private readonly authStorage: AuthStorage,
    private readonly refreshTokenUseCase: RefreshTokenUseCase
  ) {}

  /**
   * Processes incoming user domain WebSocket frames.
   *
   * @param frame - Incoming WebSocket frame
   * @returns WebSocket message handler result
   */
  public async handle(frame: SocketFrame): Promise<WebSocketMessageHandlerResult> {
    switch (frame.type) {
      case UserWebSocketEventTypes.UNAUTHORIZED:
        return this.handleUnauthorized()

      case UserWebSocketEventTypes.USER_UPDATED:
        return this.handleUserUpdated(frame.payload)

      case UserWebSocketEventTypes.SESSION_DELETED:
        return this.handleSessionDeleted()

      default:
        return webSocketMessageHandlerResultNotHandled()
    }
  }

  private async handleUnauthorized(): Promise<WebSocketMessageHandlerResult> {
    const refreshToken = await this.authStorage.getRefreshToken()
    if (refreshToken !== null) {
      await this.refreshTokenUseCase.execute()
    }
    return webSocketMessageHandlerResultHandled()
  }

  private async handleUserUpdated(payload: unknown): Promise<WebSocketMessageHandlerResult> {
    if (!payload) {
      return webSocketMessageHandlerResultError(CommonError.contractViolation(new Error('Missing frame payload')))
    }

    const validationResult = userDetailsPayloadSchema.safeParse(payload)
    if (!validationResult.success) {
      return webSocketMessageHandlerResultError(CommonError.contractViolation(validationResult.error))
    }

    await this.userStorage.updateCurrentUser(toUserDetails(validationResult.data))
    return webSocketMessageHandlerResultHandled()
  }

  private async handleSessionDeleted(): Promise<WebSocketMessageHandlerResult> {
    await this.userRepository.clearSession()
    return webSocketMessageHandlerResultHandled()
  }
}
