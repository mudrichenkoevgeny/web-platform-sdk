import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess, WebSocketServiceMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SettingsWebSocketEventTypes, createTestManagementGlobalSettingsPayload, toManagementGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementGlobalSettingsRepositoryImpl } from '@/repository/global-settings/management-global-settings-repository-impl'
import { ManagementGlobalSettingsApiMock } from '@/mock/network/api/global-settings/management-global-settings-api-mock'
import { ManagementGlobalSettingsStorageMock } from '@/mock/storage/global-settings/management-global-settings-storage-mock'

describe('ManagementGlobalSettingsRepositoryImpl', () => {
  let mockApi: ManagementGlobalSettingsApiMock
  let mockStorage: ManagementGlobalSettingsStorageMock
  let mockWsService: WebSocketServiceMock
  let repository: ManagementGlobalSettingsRepositoryImpl

  const mockSettingsPayload = createTestManagementGlobalSettingsPayload()
  const mockSettings = toManagementGlobalSettings(mockSettingsPayload)

  beforeEach(() => {
    mockApi = new ManagementGlobalSettingsApiMock()
    mockApi.getManagementGlobalSettingsResult = appResultSuccess(mockSettingsPayload)
    mockApi.updateManagementGlobalSettingsResult = appResultSuccess(undefined)
    mockApi.resetManagementGlobalSettingsResult = appResultSuccess(mockSettingsPayload)

    vi.spyOn(mockApi, 'getManagementGlobalSettings')
    vi.spyOn(mockApi, 'updateManagementGlobalSettings')
    vi.spyOn(mockApi, 'resetManagementGlobalSettings')

    mockStorage = new ManagementGlobalSettingsStorageMock()
    vi.spyOn(mockStorage, 'getManagementGlobalSettings')
    vi.spyOn(mockStorage, 'updateManagementGlobalSettings')

    mockWsService = new WebSocketServiceMock()

    repository = new ManagementGlobalSettingsRepositoryImpl(mockApi, mockStorage, mockWsService)
  })

  it('fetches settings from network when cache and storage are empty', async () => {
    const globalSettingsResult = await repository.getManagementGlobalSettings()
    expect(mockStorage.getManagementGlobalSettings).toHaveBeenCalled()
    expect(mockApi.getManagementGlobalSettings).toHaveBeenCalled()
    expect(isSuccess(globalSettingsResult)).toBe(true)
  })

  it('saves remote settings and updates storage', async () => {
    const saveRemoteSettingsResult = await repository.saveRemoteManagementGlobalSettings(mockSettings)
    expect(mockApi.updateManagementGlobalSettings).toHaveBeenCalled()
    expect(mockStorage.updateManagementGlobalSettings).toHaveBeenCalledWith(mockSettings)
    expect(isSuccess(saveRemoteSettingsResult)).toBe(true)
  })

  it('resets remote settings and updates storage', async () => {
    const resetRemoteSettingsResult = await repository.resetRemoteManagementGlobalSettings()
    expect(mockApi.resetManagementGlobalSettings).toHaveBeenCalled()
    expect(mockStorage.updateManagementGlobalSettings).toHaveBeenCalled()
    expect(isSuccess(resetRemoteSettingsResult)).toBe(true)
  })

  it('updates settings on WebSocket MANAGEMENT_GLOBAL_SETTINGS_UPDATED event', async () => {
    const listener = vi.fn()
    repository.observeManagementGlobalSettings(listener)

    mockWsService.emitFrameLocally({
      id: 'evt_1',
      type: SettingsWebSocketEventTypes.MANAGEMENT_GLOBAL_SETTINGS_UPDATED,
      payload: mockSettingsPayload,
      metadata: {},
      timestamp: Date.now()
    })

    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(mockStorage.updateManagementGlobalSettings).toHaveBeenCalled()
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      isTracingEnabled: expect.any(Boolean)
    }))
  })
})
