import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess, WebSocketServiceMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserWebSocketEventTypes } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementAuthSettingsRepositoryImpl } from '@/repository/auth/settings/management-auth-settings-repository-impl'
import type { ManagementAuthSettingsApi } from '@/network/api/auth/settings/management-auth-settings-api'
import type { ManagementAuthSettingsStorage } from '@/storage/auth/settings/management-auth-settings-storage'

describe('ManagementAuthSettingsRepositoryImpl', () => {
  let mockApi: ManagementAuthSettingsApi
  let mockStorage: ManagementAuthSettingsStorage
  let mockWsService: WebSocketServiceMock
  let repository: ManagementAuthSettingsRepositoryImpl

  const dummyPayload = {
    available_auth_providers: { primary: [], secondary: [] },
    max_total_identifiers: 10,
    max_email_identifiers: 5,
    max_phone_identifiers: 5,
    max_identifiers_per_external_provider: 3,
    max_active_sessions_open_user: 5,
    max_active_sessions_management_user: 5,
    access_token_expiration_seconds: 3600,
    refresh_token_expiration_seconds: 86400,
    account_deletion_grace_period_seconds: 2592000,
    account_deletion_check_interval_seconds: 3600,
    is_registration_enabled: true,
    open_email_restriction_policy: { is_blacklist_enabled: false, blacklist: [], is_whitelist_enabled: false, whitelist: [] },
    management_email_restriction_policy: { is_blacklist_enabled: false, blacklist: [], is_whitelist_enabled: false, whitelist: [] }
  } as any

  const dummySettings = {
    availableAuthProviders: { primary: [], secondary: [] },
    maxTotalIdentifiers: 10,
    maxEmailIdentifiers: 5,
    maxPhoneIdentifiers: 5,
    maxIdentifiersPerExternalProvider: 3,
    maxActiveSessionsForOpenUser: 5,
    maxActiveSessionsForManagementUser: 5,
    accessTokenExpirationSeconds: 3600,
    refreshTokenExpirationSeconds: 86400,
    accountDeletionGracePeriodSeconds: 2592000,
    accountDeletionCheckIntervalSeconds: 3600,
    isRegistrationEnabled: true,
    openEmailRestrictionPolicy: { isBlacklistEnabled: false, blacklist: [], isWhitelistEnabled: false, whitelist: [] },
    managementEmailRestrictionPolicy: { isBlacklistEnabled: false, blacklist: [], isWhitelistEnabled: false, whitelist: [] }
  } as any

  beforeEach(() => {
    mockApi = {
      getManagementAuthSettings: vi.fn().mockResolvedValue(appResultSuccess(dummyPayload)),
      updateManagementAuthSettings: vi.fn().mockResolvedValue(appResultSuccess(undefined)),
      resetManagementAuthSettings: vi.fn().mockResolvedValue(appResultSuccess(dummyPayload))
    } as unknown as ManagementAuthSettingsApi

    mockStorage = {
      getManagementAuthSettings: vi.fn().mockResolvedValue(null),
      updateManagementAuthSettings: vi.fn().mockResolvedValue(undefined),
      clearManagementAuthSettings: vi.fn().mockResolvedValue(undefined)
    } as unknown as ManagementAuthSettingsStorage

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
    const result = await repository.saveRemoteManagementAuthSettings(dummySettings)
    expect(mockApi.updateManagementAuthSettings).toHaveBeenCalled()
    expect(mockStorage.updateManagementAuthSettings).toHaveBeenCalledWith(dummySettings)
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
      id: 'evt_1' as any,
      type: UserWebSocketEventTypes.MANAGEMENT_AUTH_SETTINGS_UPDATED,
      payload: dummyPayload,
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
