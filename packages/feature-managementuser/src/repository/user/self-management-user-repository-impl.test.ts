import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { SocketFrame, WebSocketService } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserDetailsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { toWebSocketEventIdOrThrow, UserWebSocketEventTypes } from '@mudrichenkoevgeny/shared-foundation'
import { SelfManagementUserRepositoryImpl } from '@/repository/user/self-management-user-repository-impl'
import type { SelfManagementUserApi } from '@/network/api/user/self-management-user-api'
import type { AuthStorage, UserStorage } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('SelfManagementUserRepositoryImpl', () => {
  let mockUserStorage: UserStorage
  let mockAuthStorage: AuthStorage
  let mockApi: SelfManagementUserApi
  let mockWs: WebSocketService
  let wsCallback: ((frame: SocketFrame) => void) | undefined
  let repository: SelfManagementUserRepositoryImpl

  const dummyUserPayload: UserDetailsPayload = {
    id: 'usr_1',
    email: 'user@example.com',
    role: 'staff',
    account_status: 'active',
    authority_level: 0,
    permission_codes: [],
    created_at: 1000,
    updated_at: 1000
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wsCallback = undefined

    mockUserStorage = {
      observeCurrentUser: vi.fn().mockReturnValue(() => {}),
      updateCurrentUser: vi.fn().mockResolvedValue(undefined),
      clear: vi.fn().mockResolvedValue(undefined)
    } as unknown as UserStorage

    mockAuthStorage = {
      clearTokens: vi.fn().mockResolvedValue(undefined)
    } as unknown as AuthStorage

    mockApi = {
      getUser: vi.fn().mockResolvedValue(appResultSuccess(dummyUserPayload))
    } as unknown as SelfManagementUserApi

    mockWs = {
      observeEvents: vi.fn().mockImplementation((cb: (frame: SocketFrame) => void) => {
        wsCallback = cb
      })
    } as unknown as WebSocketService

    repository = new SelfManagementUserRepositoryImpl(
      mockUserStorage,
      mockAuthStorage,
      mockApi,
      mockWs
    )
  })

  it('delegates observeCurrentUser to UserStorage', () => {
    const listener = vi.fn()
    repository.observeCurrentUser(listener)
    expect(mockUserStorage.observeCurrentUser).toHaveBeenCalledWith(listener)
  })

  it('refreshCurrentUser fetches user from API and updates storage on success', async () => {
    const result = await repository.refreshCurrentUser()
    expect(mockApi.getUser).toHaveBeenCalled()
    expect(mockUserStorage.updateCurrentUser).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('clearSession clears UserStorage and AuthStorage', async () => {
    await repository.clearSession()
    expect(mockUserStorage.clear).toHaveBeenCalled()
    expect(mockAuthStorage.clearTokens).toHaveBeenCalled()
  })

  it('handles USER_UPDATED WebSocket frame', () => {
    expect(wsCallback).toBeDefined()
    wsCallback?.({
      id: toWebSocketEventIdOrThrow('frame_1'),
      type: UserWebSocketEventTypes.USER_UPDATED,
      payload: dummyUserPayload,
      timestamp: 1000
    })
    expect(mockUserStorage.updateCurrentUser).toHaveBeenCalled()
  })

  it('handles SESSION_DELETED WebSocket frame', () => {
    expect(wsCallback).toBeDefined()
    wsCallback?.({
      id: toWebSocketEventIdOrThrow('frame_2'),
      type: UserWebSocketEventTypes.SESSION_DELETED,
      payload: null,
      timestamp: 1000
    })
    expect(mockUserStorage.clear).toHaveBeenCalled()
    expect(mockAuthStorage.clearTokens).toHaveBeenCalled()
  })
})
