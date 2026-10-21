import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  appResultSuccess,
  isSuccess,
  WebSocketServiceMock
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  UserWebSocketEventTypes,
  createTestOpenAuthSettingsPayload,
  createTestOpenAuthSettings
} from '@mudrichenkoevgeny/shared-foundation'
import { OpenAuthSettingsRepositoryImpl } from '@/repository/auth/settings/open-auth-settings-repository-impl'
import { OpenAuthSettingsApiMock } from '@/mock/network/api/auth/settings/open-auth-settings-api-mock'
import { OpenAuthSettingsStorageMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('OpenAuthSettingsRepositoryImpl', () => {
  let mockApi: OpenAuthSettingsApiMock
  let mockStorage: OpenAuthSettingsStorageMock
  let mockWsService: WebSocketServiceMock
  let repository: OpenAuthSettingsRepositoryImpl

  const mockAuthSettingsPayload = createTestOpenAuthSettingsPayload()
  const mockAuthSettings = createTestOpenAuthSettings()

  beforeEach(() => {
    mockApi = new OpenAuthSettingsApiMock()
    mockApi.result = appResultSuccess(mockAuthSettingsPayload)
    vi.spyOn(mockApi, 'getAuthSettings')

    mockStorage = new OpenAuthSettingsStorageMock()
    vi.spyOn(mockStorage, 'getOpenAuthSettings')
    vi.spyOn(mockStorage, 'updateOpenAuthSettings')

    mockWsService = new WebSocketServiceMock()

    repository = new OpenAuthSettingsRepositoryImpl(mockApi, mockStorage, mockWsService)
  })

  it('fetches settings from network when cache and storage are empty', async () => {
    const authSettingsResult = await repository.getOpenAuthSettings()
    expect(mockStorage.getOpenAuthSettings).toHaveBeenCalled()
    expect(mockApi.getAuthSettings).toHaveBeenCalled()
    expect(isSuccess(authSettingsResult)).toBe(true)
  })

  it('uses stored settings if available', async () => {
    mockStorage.stored = mockAuthSettings

    const repositoryWithPreload = new OpenAuthSettingsRepositoryImpl(mockApi, mockStorage, mockWsService)
    const preloadSettingsResult = await repositoryWithPreload.getOpenAuthSettings()

    expect(mockApi.getAuthSettings).not.toHaveBeenCalled()
    expect(isSuccess(preloadSettingsResult)).toBe(true)
  })

  it('deduplicates concurrent refresh calls via Promise locking', async () => {
    const promise1 = repository.refreshOpenAuthSettings()
    const promise2 = repository.refreshOpenAuthSettings()

    const [settingsRefreshResult1, settingsRefreshResult2] = await Promise.all([promise1, promise2])

    expect(mockApi.getAuthSettings).toHaveBeenCalledTimes(1)
    expect(isSuccess(settingsRefreshResult1)).toBe(true)
    expect(isSuccess(settingsRefreshResult2)).toBe(true)
  })

  it('updates settings on WebSocket OPEN_AUTH_SETTINGS_UPDATED event', async () => {
    const listener = vi.fn()
    repository.observeOpenAuthSettings(listener)

    mockWsService.emitFrameLocally({
      id: 'evt_1',
      type: UserWebSocketEventTypes.OPEN_AUTH_SETTINGS_UPDATED,
      payload: mockAuthSettingsPayload,
      metadata: {},
      timestamp: Date.now()
    })

    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(mockStorage.updateOpenAuthSettings).toHaveBeenCalled()
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      availableAuthProviders: expect.any(Object)
    }))
  })
})
