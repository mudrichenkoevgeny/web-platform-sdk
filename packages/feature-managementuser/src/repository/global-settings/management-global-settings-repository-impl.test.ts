import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess, WebSocketServiceMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SettingsWebSocketEventTypes } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementGlobalSettingsRepositoryImpl } from '@/repository/globalsettings/ManagementGlobalSettingsRepositoryImpl'
import type { ManagementGlobalSettingsApi } from '@/network/api/globalsettings/ManagementGlobalSettingsApi'
import type { ManagementGlobalSettingsStorage } from '@/storage/globalsettings/ManagementGlobalSettingsStorage'

describe('ManagementGlobalSettingsRepositoryImpl', () => {
  let mockApi: ManagementGlobalSettingsApi
  let mockStorage: ManagementGlobalSettingsStorage
  let mockWsService: WebSocketServiceMock
  let repository: ManagementGlobalSettingsRepositoryImpl

  const dummyPayload = {
    privacy_policy_url: 'https://example.com/privacy',
    terms_of_service_url: 'https://example.com/terms',
    contact_support_email: 'support@example.com',
    min_supported_app_versions: {},
    is_tracing_enabled: true,
    is_metrics_enabled: true,
    is_verbose_logging_enabled: false
  } as any

  const dummySettings = {
    privacyPolicyUrl: 'https://example.com/privacy',
    termsOfServiceUrl: 'https://example.com/terms',
    contactSupportEmail: 'support@example.com',
    minSupportedAppVersions: {},
    isTracingEnabled: true,
    isMetricsEnabled: true,
    isVerboseLoggingEnabled: false
  } as any

  beforeEach(() => {
    mockApi = {
      getManagementGlobalSettings: vi.fn().mockResolvedValue(appResultSuccess(dummyPayload)),
      updateManagementGlobalSettings: vi.fn().mockResolvedValue(appResultSuccess(undefined)),
      resetManagementGlobalSettings: vi.fn().mockResolvedValue(appResultSuccess(dummyPayload))
    } as unknown as ManagementGlobalSettingsApi

    mockStorage = {
      getManagementGlobalSettings: vi.fn().mockResolvedValue(null),
      updateManagementGlobalSettings: vi.fn().mockResolvedValue(undefined),
      clearManagementGlobalSettings: vi.fn().mockResolvedValue(undefined)
    } as unknown as ManagementGlobalSettingsStorage

    mockWsService = new WebSocketServiceMock()

    repository = new ManagementGlobalSettingsRepositoryImpl(mockApi, mockStorage, mockWsService)
  })

  it('fetches settings from network when cache and storage are empty', async () => {
    const result = await repository.getManagementGlobalSettings()
    expect(mockStorage.getManagementGlobalSettings).toHaveBeenCalled()
    expect(mockApi.getManagementGlobalSettings).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('saves remote settings and updates storage', async () => {
    const result = await repository.saveRemoteManagementGlobalSettings(dummySettings)
    expect(mockApi.updateManagementGlobalSettings).toHaveBeenCalled()
    expect(mockStorage.updateManagementGlobalSettings).toHaveBeenCalledWith(dummySettings)
    expect(isSuccess(result)).toBe(true)
  })

  it('resets remote settings and updates storage', async () => {
    const result = await repository.resetRemoteManagementGlobalSettings()
    expect(mockApi.resetManagementGlobalSettings).toHaveBeenCalled()
    expect(mockStorage.updateManagementGlobalSettings).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('updates settings on WebSocket MANAGEMENT_GLOBAL_SETTINGS_UPDATED event', async () => {
    const listener = vi.fn()
    repository.observeManagementGlobalSettings(listener)

    mockWsService.emitFrameLocally({
      id: 'evt_1' as any,
      type: SettingsWebSocketEventTypes.MANAGEMENT_GLOBAL_SETTINGS_UPDATED,
      payload: dummyPayload,
      metadata: {},
      timestamp: Date.now()
    })

    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(mockStorage.updateManagementGlobalSettings).toHaveBeenCalled()
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      isTracingEnabled: true
    }))
  })
})
