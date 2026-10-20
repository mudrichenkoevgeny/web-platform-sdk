import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTestUserPrivatePayload, createTestSessionToken, TEST_USER_ID, UserWebSocketEventTypes } from '@mudrichenkoevgeny/shared-foundation'
import type { UserPrivatePayload } from '@mudrichenkoevgeny/shared-foundation'
import type { SocketFrame } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserWebSocketMessageHandler } from '@/network/websocket/message-handler/user-web-socket-message-handler'
import { UserStorageMock } from '@/mock/storage/user/user-storage-mock'
import { UserRepositoryMock } from '@/mock/repository/user/user-repository-mock'
import { AuthStorageMock } from '@/mock/storage/auth/auth-storage-mock'
import { RefreshTokenUseCaseMock } from '@/mock/usecase/auth/refresh-token/refresh-token-use-case-mock'

describe('UserWebSocketMessageHandler', () => {
  let userStorage: UserStorageMock
  let userRepository: UserRepositoryMock
  let authStorage: AuthStorageMock
  let refreshTokenUseCase: RefreshTokenUseCaseMock
  let handler: UserWebSocketMessageHandler

  beforeEach(() => {
    userStorage = new UserStorageMock()
    vi.spyOn(userStorage, 'updateCurrentUser')

    userRepository = new UserRepositoryMock()
    vi.spyOn(userRepository, 'clearSession')

    authStorage = new AuthStorageMock()
    void authStorage.updateTokens(createTestSessionToken())

    refreshTokenUseCase = new RefreshTokenUseCaseMock()
    vi.spyOn(refreshTokenUseCase, 'execute')

    handler = new UserWebSocketMessageHandler(
      userStorage,
      userRepository,
      authStorage,
      refreshTokenUseCase
    )
  })

  it('handles UNAUTHORIZED frame by triggering refreshTokenUseCase', async () => {
    const frame: SocketFrame = {
      id: 'err-1',
      type: UserWebSocketEventTypes.UNAUTHORIZED,
      payload: null,
      metadata: {},
      timestamp: Date.now()
    }

    const result = await handler.handle(frame)

    expect(result.kind).toBe('Handled')
    expect(refreshTokenUseCase.execute).toHaveBeenCalled()
  })

  it('handles USER_UPDATED frame by updating user storage', async () => {
    const userPayload: UserPrivatePayload = createTestUserPrivatePayload()

    const frame: SocketFrame = {
      id: 'err-2',
      type: UserWebSocketEventTypes.USER_UPDATED,
      payload: userPayload,
      metadata: {},
      timestamp: Date.now()
    }

    const result = await handler.handle(frame)

    expect(result.kind).toBe('Handled')
    expect(userStorage.updateCurrentUser).toHaveBeenCalledWith(
      expect.objectContaining({ id: TEST_USER_ID })
    )
  })

  it('handles SESSION_DELETED frame by clearing session repository', async () => {
    const frame: SocketFrame = {
      id: 'err-3',
      type: UserWebSocketEventTypes.SESSION_DELETED,
      payload: null,
      metadata: {},
      timestamp: Date.now()
    }

    const result = await handler.handle(frame)

    expect(result.kind).toBe('Handled')
    expect(userRepository.clearSession).toHaveBeenCalled()
  })

  it('returns NotHandled for unknown frame types', async () => {
    const frame: SocketFrame = {
      id: 'err-4',
      type: 'UNKNOWN_TYPE',
      payload: null,
      metadata: {},
      timestamp: Date.now()
    }

    const result = await handler.handle(frame)

    expect(result.kind).toBe('NotHandled')
  })
})
