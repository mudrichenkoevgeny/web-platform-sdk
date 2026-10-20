import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess, WebSocketServiceMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestUserPrivatePayload, UserWebSocketEventTypes } from '@mudrichenkoevgeny/shared-foundation'
import { SelfManagementUserRepositoryImpl } from '@/repository/user/self-management-user-repository-impl'
import { SelfManagementUserApiMock } from '@/mock/network/api/user/self-management-user-api-mock'
import { AuthStorageMock, UserStorageMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('SelfManagementUserRepositoryImpl', () => {
  let mockUserStorage: UserStorageMock
  let mockAuthStorage: AuthStorageMock
  let mockApi: SelfManagementUserApiMock
  let mockWs: WebSocketServiceMock
  let repository: SelfManagementUserRepositoryImpl

  const mockUserPayload = createTestUserPrivatePayload()

  beforeEach(() => {
    mockUserStorage = new UserStorageMock()
    vi.spyOn(mockUserStorage, 'observeCurrentUser').mockImplementation(mockUserStorage.observeCurrentUser.bind(mockUserStorage))
    vi.spyOn(mockUserStorage, 'updateCurrentUser').mockImplementation(mockUserStorage.updateCurrentUser.bind(mockUserStorage))
    vi.spyOn(mockUserStorage, 'clear').mockImplementation(mockUserStorage.clear.bind(mockUserStorage))

    mockAuthStorage = new AuthStorageMock()
    vi.spyOn(mockAuthStorage, 'clearTokens').mockImplementation(mockAuthStorage.clearTokens.bind(mockAuthStorage))

    mockApi = new SelfManagementUserApiMock()
    mockApi.getUserResult = appResultSuccess(mockUserPayload)
    vi.spyOn(mockApi, 'getUser').mockImplementation(mockApi.getUser.bind(mockApi))

    mockWs = new WebSocketServiceMock()

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
    const refreshUserResult = await repository.refreshCurrentUser()
    expect(mockApi.getUser).toHaveBeenCalled()
    expect(mockUserStorage.updateCurrentUser).toHaveBeenCalled()
    expect(isSuccess(refreshUserResult)).toBe(true)
  })

  it('clearSession clears UserStorage and AuthStorage', async () => {
    await repository.clearSession()
    expect(mockUserStorage.clear).toHaveBeenCalled()
    expect(mockAuthStorage.clearTokens).toHaveBeenCalled()
  })

  it('handles USER_UPDATED WebSocket frame', async () => {
    mockWs.emitFrameLocally({
      id: 'frame_1',
      type: UserWebSocketEventTypes.USER_UPDATED,
      payload: mockUserPayload,
      timestamp: 1000
    })
    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(mockUserStorage.updateCurrentUser).toHaveBeenCalled()
  })

  it('handles SESSION_DELETED WebSocket frame', async () => {
    mockWs.emitFrameLocally({
      id: 'frame_2',
      type: UserWebSocketEventTypes.SESSION_DELETED,
      payload: null,
      timestamp: 1000
    })
    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(mockUserStorage.clear).toHaveBeenCalled()
    expect(mockAuthStorage.clearTokens).toHaveBeenCalled()
  })
})
