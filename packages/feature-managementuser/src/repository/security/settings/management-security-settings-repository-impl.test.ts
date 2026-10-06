import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess, WebSocketServiceMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementSecuritySettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import {
  SecurityWebSocketEventTypes,
  toManagementSecuritySettings,
  toWebSocketEventIdOrThrow
} from '@mudrichenkoevgeny/shared-foundation'
import { ManagementSecuritySettingsRepositoryImpl } from '@/repository/security/settings/management-security-settings-repository-impl'
import type { ManagementSecuritySettingsApi } from '@/network/api/security/settings/management-security-settings-api'
import type { ManagementSecuritySettingsStorage } from '@/storage/security-settings/management-security-settings-storage'

describe('ManagementSecuritySettingsRepositoryImpl', () => {
  let mockApi: ManagementSecuritySettingsApi
  let mockStorage: ManagementSecuritySettingsStorage
  let mockWsService: WebSocketServiceMock
  let repository: ManagementSecuritySettingsRepositoryImpl

  const dummyPayload: ManagementSecuritySettingsPayload = {
    recent_authentication_validity_seconds_for_open_user: 300,
    recent_authentication_validity_seconds_for_management_user: 300,
    password_policy: {
      min_length: 8,
      require_letter: true,
      require_upper_case: true,
      require_lower_case: true,
      require_digit: true,
      require_special_char: true,
      common_passwords: []
    },
    otp_confirmation: {
      retry_after_seconds: 60,
      number_of_symbols: 6,
      expiration_seconds: 300
    },
    account_lockout_policy: {
      max_failed_password_attempts: 5,
      max_failed_otp_attempts: 5,
      max_failed_totp_attempts: 5,
      failed_attempts_window_seconds: 600,
      lockout_duration_seconds: 1800,
      indefinite_lockout_threshold: 10,
      is_self_service_unlock_enabled: true
    },
    account_lockout_check_interval_seconds: 60,
    open_ip_restriction_policy: {
      is_blacklist_enabled: false,
      blacklist: [],
      is_whitelist_enabled: false,
      whitelist: []
    },
    management_ip_restriction_policy: {
      is_blacklist_enabled: false,
      blacklist: [],
      is_whitelist_enabled: false,
      whitelist: []
    },
    mfa_token_expiration_seconds: 300,
    max_requests_per_period: 100,
    rate_limit_period_seconds: 60,
    refresh_token_rotation_grace_period_seconds: 10
  }

  const dummySettings = toManagementSecuritySettings(dummyPayload)

  beforeEach(() => {
    mockApi = {
      getManagementSecuritySettings: vi.fn().mockResolvedValue(appResultSuccess(dummyPayload)),
      updateManagementSecuritySettings: vi.fn().mockResolvedValue(appResultSuccess(undefined)),
      resetManagementSecuritySettings: vi.fn().mockResolvedValue(appResultSuccess(dummyPayload))
    } as unknown as ManagementSecuritySettingsApi

    mockStorage = {
      getManagementSecuritySettings: vi.fn().mockResolvedValue(null),
      updateManagementSecuritySettings: vi.fn().mockResolvedValue(undefined),
      clearManagementSecuritySettings: vi.fn().mockResolvedValue(undefined)
    } as unknown as ManagementSecuritySettingsStorage

    mockWsService = new WebSocketServiceMock()

    repository = new ManagementSecuritySettingsRepositoryImpl(mockApi, mockStorage, mockWsService)
  })

  it('fetches settings from network when cache and storage are empty', async () => {
    const result = await repository.getManagementSecuritySettings()
    expect(mockStorage.getManagementSecuritySettings).toHaveBeenCalled()
    expect(mockApi.getManagementSecuritySettings).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('saves remote settings and updates storage', async () => {
    const result = await repository.saveRemoteManagementSecuritySettings(dummySettings)
    expect(mockApi.updateManagementSecuritySettings).toHaveBeenCalled()
    expect(mockStorage.updateManagementSecuritySettings).toHaveBeenCalledWith(dummySettings)
    expect(isSuccess(result)).toBe(true)
  })

  it('resets remote settings and updates storage', async () => {
    const result = await repository.resetRemoteManagementSecuritySettings()
    expect(mockApi.resetManagementSecuritySettings).toHaveBeenCalled()
    expect(mockStorage.updateManagementSecuritySettings).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('updates settings on WebSocket MANAGEMENT_SECURITY_SETTINGS_UPDATED event', async () => {
    const listener = vi.fn()
    repository.observeManagementSecuritySettings(listener)

    mockWsService.emitFrameLocally({
      id: toWebSocketEventIdOrThrow('evt_1'),
      type: SecurityWebSocketEventTypes.MANAGEMENT_SECURITY_SETTINGS_UPDATED,
      payload: dummyPayload,
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
