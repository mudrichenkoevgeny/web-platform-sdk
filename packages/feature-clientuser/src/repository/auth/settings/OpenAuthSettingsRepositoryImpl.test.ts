import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess, WebSocketServiceMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserWebSocketEventTypes } from '@mudrichenkoevgeny/shared-foundation'
import { OpenAuthSettingsRepositoryImpl } from '@/repository/auth/settings/OpenAuthSettingsRepositoryImpl'
import type { OpenAuthSettingsApi } from '@/network/api/auth/settings/OpenAuthSettingsApi'
import type { OpenAuthSettingsStorage } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('OpenAuthSettingsRepositoryImpl', () => {
  let mockApi: OpenAuthSettingsApi
  let mockStorage: OpenAuthSettingsStorage
  let mockWsService: WebSocketServiceMock
  let repository: OpenAuthSettingsRepositoryImpl

  const dummyPayload = {
    available_auth_providers: { primary: [], secondary: [] }
  } as any

  const dummySettings = {
    availableAuthProviders: { primary: [], secondary: [] }
  } as any

  beforeEach(() => {
    mockApi = {
      getAuthSettings: vi.fn().mockResolvedValue(appResultSuccess(dummyPayload))
    } as unknown as OpenAuthSettingsApi

    mockStorage = {
      getOpenAuthSettings: vi.fn().mockResolvedValue(null),
      updateOpenAuthSettings: vi.fn().mockResolvedValue(undefined),
      clearOpenAuthSettings: vi.fn().mockResolvedValue(undefined)
    } as unknown as OpenAuthSettingsStorage

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
    vi.mocked(mockStorage.getOpenAuthSettings).mockResolvedValue(dummySettings)

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
      id: 'evt_1' as any,
      type: UserWebSocketEventTypes.OPEN_AUTH_SETTINGS_UPDATED,
      payload: dummyPayload,
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
