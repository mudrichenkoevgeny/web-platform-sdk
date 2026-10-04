import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess, WebSocketServiceMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserWebSocketEventTypes } from '@mudrichenkoevgeny/shared-foundation'
import { OpenUserRepositoryImpl } from '@/repository/user/OpenUserRepositoryImpl'
import type { OpenUserApi } from '@/network/api/user/OpenUserApi'
import type { AuthStorage, UserStorage } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('OpenUserRepositoryImpl', () => {
  let mockUserStorage: UserStorage
  let mockAuthStorage: AuthStorage
  let mockApi: OpenUserApi
  let mockWsService: WebSocketServiceMock
  let repository: OpenUserRepositoryImpl

  const dummyUserPayload = {
    id: 'usr_1',
    role: 'CLIENT_USER',
    account_status: 'ACTIVE',
    account_status_on_restore: null,
    authority_level: 1,
    permission_codes: [],
    is_totp_enabled: false,
    last_login_at: 1000,
    last_active_at: 1000,
    created_at: 500,
    updated_at: null,
    scheduled_permanent_deletion_at: null,
    account_lockout_type: 'NONE',
    temporary_lockout_until: null
  } as any

  beforeEach(() => {
    mockUserStorage = {
      observeCurrentUser: vi.fn().mockImplementation((listener) => {
        listener(null)
        return () => {}
      }),
      updateCurrentUser: vi.fn().mockResolvedValue(undefined),
      clear: vi.fn().mockResolvedValue(undefined)
    } as unknown as UserStorage

    mockAuthStorage = {
      clearTokens: vi.fn().mockResolvedValue(undefined)
    } as unknown as AuthStorage

    mockApi = {
      getUser: vi.fn().mockResolvedValue(appResultSuccess(dummyUserPayload)),
      scheduleUserDeletion: vi.fn().mockResolvedValue(appResultSuccess(dummyUserPayload)),
      restoreUser: vi.fn().mockResolvedValue(appResultSuccess(dummyUserPayload))
    } as unknown as OpenUserApi

    mockWsService = new WebSocketServiceMock()

    repository = new OpenUserRepositoryImpl(
      mockUserStorage,
      mockAuthStorage,
      mockApi,
      mockWsService
    )
  })

  it('observes current user from storage', () => {
    const listener = vi.fn()
    repository.observeCurrentUser(listener)
    expect(mockUserStorage.observeCurrentUser).toHaveBeenCalledWith(listener)
  })

  it('refreshes current user and updates storage', async () => {
    const result = await repository.refreshCurrentUser()
    expect(mockApi.getUser).toHaveBeenCalled()
    expect(mockUserStorage.updateCurrentUser).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('deduplicates concurrent refresh calls', async () => {
    const p1 = repository.refreshCurrentUser()
    const p2 = repository.refreshCurrentUser()

    const [res1, res2] = await Promise.all([p1, p2])

    expect(mockApi.getUser).toHaveBeenCalledTimes(1)
    expect(isSuccess(res1)).toBe(true)
    expect(isSuccess(res2)).toBe(true)
  })

  it('schedules user deletion and updates storage', async () => {
    const result = await repository.scheduleUserDeletion()
    expect(mockApi.scheduleUserDeletion).toHaveBeenCalled()
    expect(mockUserStorage.updateCurrentUser).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('restores user and updates storage', async () => {
    const result = await repository.restoreUser()
    expect(mockApi.restoreUser).toHaveBeenCalled()
    expect(mockUserStorage.updateCurrentUser).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('clears session in both storages', async () => {
    await repository.clearSession()
    expect(mockUserStorage.clear).toHaveBeenCalled()
    expect(mockAuthStorage.clearTokens).toHaveBeenCalled()
  })

  it('handles USER_UPDATED WebSocket event', async () => {
    mockWsService.emitFrameLocally({
      id: 'evt_1' as any,
      type: UserWebSocketEventTypes.USER_UPDATED,
      payload: dummyUserPayload,
      metadata: {},
      timestamp: Date.now()
    })

    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(mockUserStorage.updateCurrentUser).toHaveBeenCalled()
  })

  it('handles SESSION_DELETED WebSocket event', async () => {
    mockWsService.emitFrameLocally({
      id: 'evt_2' as any,
      type: UserWebSocketEventTypes.SESSION_DELETED,
      payload: null,
      metadata: {},
      timestamp: Date.now()
    })

    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(mockUserStorage.clear).toHaveBeenCalled()
    expect(mockAuthStorage.clearTokens).toHaveBeenCalled()
  })
})
