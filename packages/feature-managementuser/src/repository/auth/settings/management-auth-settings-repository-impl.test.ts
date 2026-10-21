import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess, WebSocketServiceMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
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

  const mockManagementAuthSettingsPayload = createTestManagementAuthSettingsPayload()
  const mockManagementAuthSettings = toManagementAuthSettings(mockManagementAuthSettingsPayload)

  beforeEach(() => {
    mockApi = new ManagementAuthSettingsApiMock()
    mockApi.getManagementAuthSettingsResult = appResultSuccess(mockManagementAuthSettingsPayload)
    mockApi.updateManagementAuthSettingsResult = appResultSuccess(undefined)
    mockApi.resetManagementAuthSettingsResult = appResultSuccess(mockManagementAuthSettingsPayload)

    vi.spyOn(mockApi, 'getManagementAuthSettings')
    vi.spyOn(mockApi, 'updateManagementAuthSettings')
    vi.spyOn(mockApi, 'resetManagementAuthSettings')

    mockStorage = new ManagementAuthSettingsStorageMock()
    vi.spyOn(mockStorage, 'getManagementAuthSettings')
    vi.spyOn(mockStorage, 'updateManagementAuthSettings')

    mockWsService = new WebSocketServiceMock()

    repository = new ManagementAuthSettingsRepositoryImpl(mockApi, mockStorage, mockWsService)
  })

  it('fetches settings from network when cache and storage are empty', async () => {
    const authSettingsResult = await repository.getManagementAuthSettings()
    expect(mockStorage.getManagementAuthSettings).toHaveBeenCalled()
    expect(mockApi.getManagementAuthSettings).toHaveBeenCalled()
    expect(isSuccess(authSettingsResult)).toBe(true)
  })

  it('saves remote settings and updates storage', async () => {
    const saveRemoteSettingsResult = await repository.saveRemoteManagementAuthSettings(mockManagementAuthSettings)
    expect(mockApi.updateManagementAuthSettings).toHaveBeenCalled()
    expect(mockStorage.updateManagementAuthSettings).toHaveBeenCalledWith(mockManagementAuthSettings)
    expect(isSuccess(saveRemoteSettingsResult)).toBe(true)
  })

  it('resets remote settings and updates storage', async () => {
    const resetRemoteSettingsResult = await repository.resetRemoteManagementAuthSettings()
    expect(mockApi.resetManagementAuthSettings).toHaveBeenCalled()
    expect(mockStorage.updateManagementAuthSettings).toHaveBeenCalled()
    expect(isSuccess(resetRemoteSettingsResult)).toBe(true)
  })

  it('updates settings on WebSocket MANAGEMENT_AUTH_SETTINGS_UPDATED event', async () => {
    const listener = vi.fn()
    repository.observeManagementAuthSettings(listener)

    mockWsService.emitFrameLocally({
      id: 'evt_1',
      type: UserWebSocketEventTypes.MANAGEMENT_AUTH_SETTINGS_UPDATED,
      payload: mockManagementAuthSettingsPayload,
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
