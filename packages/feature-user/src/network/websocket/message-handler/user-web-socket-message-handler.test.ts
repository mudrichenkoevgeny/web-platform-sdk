import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  AccountLockoutType,
  UserWebSocketEventTypes,
  toUserIdOrThrow,
  UserAccountStatus,
  UserRole
} from '@mudrichenkoevgeny/shared-foundation'
import type { UserPrivatePayload } from "@mudrichenkoevgeny/shared-foundation";
import type { ErrorId, SocketFrame } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserWebSocketMessageHandler } from '@/network/websocket/message-handler/user-web-socket-message-handler'
import type { UserStorage } from '@/storage/user/user-storage'
import type { AuthStorage } from '@/storage/auth/auth-storage'
import type { UserRepository } from '@/repository/user/user-repository'
import type { RefreshTokenUseCase } from '@/usecase/auth/refresh-token/refresh-token-use-case'

describe('UserWebSocketMessageHandler', () => {
  let userStorage: UserStorage
  let userRepository: UserRepository
  let authStorage: AuthStorage
  let refreshTokenUseCase: RefreshTokenUseCase
  let handler: UserWebSocketMessageHandler

  beforeEach(() => {
    userStorage = {
      updateCurrentUser: vi.fn().mockResolvedValue(undefined)
    } as unknown as UserStorage

    userRepository = {
      clearSession: vi.fn().mockResolvedValue(undefined)
    } as unknown as UserRepository

    authStorage = {
      getRefreshToken: vi.fn().mockResolvedValue({ value: 'ref_123' })
    } as unknown as AuthStorage

    refreshTokenUseCase = {
      execute: vi.fn().mockResolvedValue(undefined)
    } as unknown as RefreshTokenUseCase

    handler = new UserWebSocketMessageHandler(
      userStorage,
      userRepository,
      authStorage,
      refreshTokenUseCase
    )
  })

  it('handles UNAUTHORIZED frame by triggering refreshTokenUseCase', async () => {
    const frame: SocketFrame = {
      id: 'err-1' as ErrorId,
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
    const userPayload: UserPrivatePayload = {
      id: toUserIdOrThrow('usr_1'),
      role: UserRole.CLIENT_USER,
      account_status: UserAccountStatus.ACTIVE,
      account_status_on_restore: null,
      authority_level: 1,
      permission_codes: [],
      is_totp_enabled: false,
      last_login_at: Date.now(),
      last_active_at: Date.now(),
      created_at: Date.now(),
      updated_at: null,
      scheduled_permanent_deletion_at: null,
      account_lockout_type: AccountLockoutType.NONE,
      temporary_lockout_until: null
    }

    const frame: SocketFrame = {
      id: 'err-2' as ErrorId,
      type: UserWebSocketEventTypes.USER_UPDATED,
      payload: userPayload,
      metadata: {},
      timestamp: Date.now()
    }

    const result = await handler.handle(frame)

    expect(result.kind).toBe('Handled')
    expect(userStorage.updateCurrentUser).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'usr_1' })
    )
  })

  it('handles SESSION_DELETED frame by clearing session repository', async () => {
    const frame: SocketFrame = {
      id: 'err-3' as ErrorId,
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
      id: 'err-4' as ErrorId,
      type: 'UNKNOWN_TYPE',
      payload: null,
      metadata: {},
      timestamp: Date.now()
    }

    const result = await handler.handle(frame)

    expect(result.kind).toBe('NotHandled')
  })
})
