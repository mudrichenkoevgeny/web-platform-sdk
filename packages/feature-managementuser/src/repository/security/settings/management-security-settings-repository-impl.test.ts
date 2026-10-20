import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess, WebSocketServiceMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  SecurityWebSocketEventTypes,
  toManagementSecuritySettings,
  createTestManagementSecuritySettingsPayload
} from '@mudrichenkoevgeny/shared-foundation'
import { ManagementSecuritySettingsRepositoryImpl } from '@/repository/security/settings/management-security-settings-repository-impl'
import { ManagementSecuritySettingsApiMock } from '@/mock/network/api/security/settings/management-security-settings-api-mock'
import { ManagementSecuritySettingsStorageMock } from '@/mock/storage/security-settings/management-security-settings-storage-mock'

describe('ManagementSecuritySettingsRepositoryImpl', () => {
  let mockApi: ManagementSecuritySettingsApiMock
  let mockStorage: ManagementSecuritySettingsStorageMock
  let mockWsService: WebSocketServiceMock
  let repository: ManagementSecuritySettingsRepositoryImpl

  const mockSettingsPayload = createTestManagementSecuritySettingsPayload()
  const mockSettings = toManagementSecuritySettings(mockSettingsPayload)

  beforeEach(() => {
    mockApi = new ManagementSecuritySettingsApiMock()
    mockApi.getManagementSecuritySettingsResult = appResultSuccess(mockSettingsPayload)
    mockApi.updateManagementSecuritySettingsResult = appResultSuccess(undefined)
    mockApi.resetManagementSecuritySettingsResult = appResultSuccess(mockSettingsPayload)

    vi.spyOn(mockApi, 'getManagementSecuritySettings').mockImplementation(mockApi.getManagementSecuritySettings.bind(mockApi))
    vi.spyOn(mockApi, 'updateManagementSecuritySettings').mockImplementation(mockApi.updateManagementSecuritySettings.bind(mockApi))
    vi.spyOn(mockApi, 'resetManagementSecuritySettings').mockImplementation(mockApi.resetManagementSecuritySettings.bind(mockApi))

    mockStorage = new ManagementSecuritySettingsStorageMock()
    vi.spyOn(mockStorage, 'getManagementSecuritySettings').mockImplementation(mockStorage.getManagementSecuritySettings.bind(mockStorage))
    vi.spyOn(mockStorage, 'updateManagementSecuritySettings').mockImplementation(mockStorage.updateManagementSecuritySettings.bind(mockStorage))

    mockWsService = new WebSocketServiceMock()

    repository = new ManagementSecuritySettingsRepositoryImpl(mockApi, mockStorage, mockWsService)
  })

  it('fetches settings from network when cache and storage are empty', async () => {
    const securitySettingsResult = await repository.getManagementSecuritySettings()
    expect(mockStorage.getManagementSecuritySettings).toHaveBeenCalled()
    expect(mockApi.getManagementSecuritySettings).toHaveBeenCalled()
    expect(isSuccess(securitySettingsResult)).toBe(true)
  })

  it('saves remote settings and updates storage', async () => {
    const saveRemoteSettingsResult = await repository.saveRemoteManagementSecuritySettings(mockSettings)
    expect(mockApi.updateManagementSecuritySettings).toHaveBeenCalled()
    expect(mockStorage.updateManagementSecuritySettings).toHaveBeenCalledWith(mockSettings)
    expect(isSuccess(saveRemoteSettingsResult)).toBe(true)
  })

  it('resets remote settings and updates storage', async () => {
    const resetRemoteSettingsResult = await repository.resetRemoteManagementSecuritySettings()
    expect(mockApi.resetManagementSecuritySettings).toHaveBeenCalled()
    expect(mockStorage.updateManagementSecuritySettings).toHaveBeenCalled()
    expect(isSuccess(resetRemoteSettingsResult)).toBe(true)
  })

  it('updates settings on WebSocket MANAGEMENT_SECURITY_SETTINGS_UPDATED event', async () => {
    const listener = vi.fn()
    repository.observeManagementSecuritySettings(listener)

    mockWsService.emitFrameLocally({
      id: 'evt_1',
      type: SecurityWebSocketEventTypes.MANAGEMENT_SECURITY_SETTINGS_UPDATED,
      payload: mockSettingsPayload,
      metadata: {},
      timestamp: Date.now()
    })

    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(mockStorage.updateManagementSecuritySettings).toHaveBeenCalled()
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      mfaTokenExpirationSeconds: 300
    }))
  })
})
