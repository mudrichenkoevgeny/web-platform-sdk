import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  appResultSuccess,
  isSuccess,
  WebSocketServiceMock,
  toSocketFrameIdOrThrow
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
    mockApi.getAuthSettingsResult = appResultSuccess(mockAuthSettingsPayload)
    vi.spyOn(mockApi, 'getAuthSettings').mockImplementation(mockApi.getAuthSettings.bind(mockApi))

    mockStorage = new OpenAuthSettingsStorageMock()
    vi.spyOn(mockStorage, 'getOpenAuthSettings').mockImplementation(mockStorage.getOpenAuthSettings.bind(mockStorage))
    vi.spyOn(mockStorage, 'updateOpenAuthSettings').mockImplementation(mockStorage.updateOpenAuthSettings.bind(mockStorage))

    mockWsService = new WebSocketServiceMock()

    repository = new OpenAuthSettingsRepositoryImpl(mockApi, mockStorage, mockWsService)
  })

  it('fetches settings from network when cache and storage are empty', async () => {
    const result = await repository.getOpenAuthSettings()
    expect(mockStorage.getOpenAuthSettings).toHaveBeenCalled()
    expect(mockApi.getAuthSettings).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('uses stored settings if available', async () => {
    mockStorage.getOpenAuthSettingsResult = mockAuthSettings

    const repositoryWithPreload = new OpenAuthSettingsRepositoryImpl(mockApi, mockStorage, mockWsService)
    const result = await repositoryWithPreload.getOpenAuthSettings()

    expect(mockApi.getAuthSettings).not.toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('deduplicates concurrent refresh calls via Promise locking', async () => {
    const promise1 = repository.refreshOpenAuthSettings()
    const promise2 = repository.refreshOpenAuthSettings()

    const [res1, res2] = await Promise.all([promise1, promise2])

    expect(mockApi.getAuthSettings).toHaveBeenCalledTimes(1)
    expect(isSuccess(res1)).toBe(true)
    expect(isSuccess(res2)).toBe(true)
  })

  it('updates settings on WebSocket OPEN_AUTH_SETTINGS_UPDATED event', async () => {
    const listener = vi.fn()
    repository.observeOpenAuthSettings(listener)

    mockWsService.emitFrameLocally({
      id: toSocketFrameIdOrThrow('evt_1'),
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
