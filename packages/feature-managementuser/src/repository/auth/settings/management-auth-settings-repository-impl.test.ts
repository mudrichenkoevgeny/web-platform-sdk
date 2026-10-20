import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess, WebSocketServiceMock, toSocketFrameIdOrThrow } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  toManagementAuthSettings,
  UserWebSocketEventTypes,
  createTestManagementAuthSettingsPayload
} from '@mudrichenkoevgeny/shared-foundation'
import { ManagementAuthSettingsRepositoryImpl } from '@/repository/auth/settings/management-auth-settings-repository-impl'
import { ManagementAuthSettingsApiMock } from '@/mock/network/api/auth/settings/management-auth-settings-api-mock'
import { ManagementAuthSettingsStorageMock } from '@/mock/storage/auth/settings/management-auth-settings-storage-mock'

describe('ManagementAuthSettingsRepositoryImpl', () => {
  let mockApi: ManagementAuthSettingsApiMock
  let mockStorage: ManagementAuthSettingsStorageMock
  let mockWsService: WebSocketServiceMock
  let repository: ManagementAuthSettingsRepositoryImpl

  const mockAuthSettingsPayload = createTestManagementAuthSettingsPayload()
  const mockAuthSettings = toManagementAuthSettings(mockAuthSettingsPayload)

  beforeEach(() => {
    mockApi = new ManagementAuthSettingsApiMock()
    mockApi.getManagementAuthSettingsResult = appResultSuccess(mockAuthSettingsPayload)
    mockApi.updateManagementAuthSettingsResult = appResultSuccess(undefined)
    mockApi.resetManagementAuthSettingsResult = appResultSuccess(mockAuthSettingsPayload)

    vi.spyOn(mockApi, 'getManagementAuthSettings').mockImplementation(mockApi.getManagementAuthSettings.bind(mockApi))
    vi.spyOn(mockApi, 'updateManagementAuthSettings').mockImplementation(mockApi.updateManagementAuthSettings.bind(mockApi))
    vi.spyOn(mockApi, 'resetManagementAuthSettings').mockImplementation(mockApi.resetManagementAuthSettings.bind(mockApi))

    mockStorage = new ManagementAuthSettingsStorageMock()
    vi.spyOn(mockStorage, 'getManagementAuthSettings').mockImplementation(mockStorage.getManagementAuthSettings.bind(mockStorage))
    vi.spyOn(mockStorage, 'updateManagementAuthSettings').mockImplementation(mockStorage.updateManagementAuthSettings.bind(mockStorage))

    mockWsService = new WebSocketServiceMock()

    repository = new ManagementAuthSettingsRepositoryImpl(mockApi, mockStorage, mockWsService)
  })

  it('fetches settings from network when cache and storage are empty', async () => {
    const result = await repository.getManagementAuthSettings()
    expect(mockStorage.getManagementAuthSettings).toHaveBeenCalled()
    expect(mockApi.getManagementAuthSettings).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('saves remote settings and updates storage', async () => {
    const result = await repository.saveRemoteManagementAuthSettings(mockAuthSettings)
    expect(mockApi.updateManagementAuthSettings).toHaveBeenCalled()
    expect(mockStorage.updateManagementAuthSettings).toHaveBeenCalledWith(mockAuthSettings)
    expect(isSuccess(result)).toBe(true)
  })

  it('resets remote settings and updates storage', async () => {
    const result = await repository.resetRemoteManagementAuthSettings()
    expect(mockApi.resetManagementAuthSettings).toHaveBeenCalled()
    expect(mockStorage.updateManagementAuthSettings).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('updates settings on WebSocket MANAGEMENT_AUTH_SETTINGS_UPDATED event', async () => {
    const listener = vi.fn()
    repository.observeManagementAuthSettings(listener)

    mockWsService.emitFrameLocally({
      id: toSocketFrameIdOrThrow('evt_1'),
      type: UserWebSocketEventTypes.MANAGEMENT_AUTH_SETTINGS_UPDATED,
      payload: mockAuthSettingsPayload,
      metadata: {},
      timestamp: Date.now()
    })

    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(mockStorage.updateManagementAuthSettings).toHaveBeenCalled()
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      availableAuthProviders: expect.any(Object)
    }))
  })
})
