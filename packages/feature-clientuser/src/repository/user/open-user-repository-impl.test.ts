import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess, WebSocketServiceMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestUserPrivatePayload, UserWebSocketEventTypes } from '@mudrichenkoevgeny/shared-foundation'
import { OpenUserRepositoryImpl } from '@/repository/user/open-user-repository-impl'
import { OpenUserApiMock } from '@/mock/network/api/user/open-user-api-mock'
import { AuthStorageMock, UserStorageMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('OpenUserRepositoryImpl', () => {
  let mockUserStorage: UserStorageMock
  let mockAuthStorage: AuthStorageMock
  let mockApi: OpenUserApiMock
  let mockWsService: WebSocketServiceMock
  let repository: OpenUserRepositoryImpl

  const mockUserPayload = createTestUserPrivatePayload()

  beforeEach(() => {
    mockUserStorage = new UserStorageMock()
    vi.spyOn(mockUserStorage, 'observeCurrentUser').mockImplementation(mockUserStorage.observeCurrentUser.bind(mockUserStorage))
    vi.spyOn(mockUserStorage, 'updateCurrentUser').mockImplementation(mockUserStorage.updateCurrentUser.bind(mockUserStorage))
    vi.spyOn(mockUserStorage, 'clear').mockImplementation(mockUserStorage.clear.bind(mockUserStorage))

    mockAuthStorage = new AuthStorageMock()
    vi.spyOn(mockAuthStorage, 'clearTokens').mockImplementation(mockAuthStorage.clearTokens.bind(mockAuthStorage))

    mockApi = new OpenUserApiMock()
    mockApi.getUserResult = appResultSuccess(mockUserPayload)
    mockApi.scheduleUserDeletionResult = appResultSuccess(mockUserPayload)
    mockApi.restoreUserResult = appResultSuccess(mockUserPayload)

    vi.spyOn(mockApi, 'getUser').mockImplementation(mockApi.getUser.bind(mockApi))
    vi.spyOn(mockApi, 'scheduleUserDeletion').mockImplementation(mockApi.scheduleUserDeletion.bind(mockApi))
    vi.spyOn(mockApi, 'restoreUser').mockImplementation(mockApi.restoreUser.bind(mockApi))

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
    const userRefreshResult = await repository.refreshCurrentUser()
    expect(mockApi.getUser).toHaveBeenCalled()
    expect(mockUserStorage.updateCurrentUser).toHaveBeenCalled()
    expect(isSuccess(userRefreshResult)).toBe(true)
  })

  it('deduplicates concurrent refresh calls', async () => {
    const promise1 = repository.refreshCurrentUser()
    const promise2 = repository.refreshCurrentUser()

    const [userRefreshResult1, userRefreshResult2] = await Promise.all([promise1, promise2])

    expect(mockApi.getUser).toHaveBeenCalledTimes(1)
    expect(isSuccess(userRefreshResult1)).toBe(true)
    expect(isSuccess(userRefreshResult2)).toBe(true)
  })

  it('schedules user deletion and updates storage', async () => {
    const scheduledDeletionResult = await repository.scheduleUserDeletion()
    expect(mockApi.scheduleUserDeletion).toHaveBeenCalled()
    expect(mockUserStorage.updateCurrentUser).toHaveBeenCalled()
    expect(isSuccess(scheduledDeletionResult)).toBe(true)
  })

  it('restores user and updates storage', async () => {
    const restoredUserResult = await repository.restoreUser()
    expect(mockApi.restoreUser).toHaveBeenCalled()
    expect(mockUserStorage.updateCurrentUser).toHaveBeenCalled()
    expect(isSuccess(restoredUserResult)).toBe(true)
  })

  it('clears session in both storages', async () => {
    await repository.clearSession()
    expect(mockUserStorage.clear).toHaveBeenCalled()
    expect(mockAuthStorage.clearTokens).toHaveBeenCalled()
  })

  it('handles USER_UPDATED WebSocket event', async () => {
    mockWsService.emitFrameLocally({
      id: 'evt_1',
      type: UserWebSocketEventTypes.USER_UPDATED,
      payload: mockUserPayload,
      metadata: {},
      timestamp: Date.now()
    })

    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(mockUserStorage.updateCurrentUser).toHaveBeenCalled()
  })

  it('handles SESSION_DELETED WebSocket event', async () => {
    mockWsService.emitFrameLocally({
      id: 'evt_2',
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
