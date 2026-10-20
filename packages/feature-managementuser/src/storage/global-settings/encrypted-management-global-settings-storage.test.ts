import { describe, it, expect, beforeEach } from 'vitest'
import { EncryptedSettingsMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { EncryptedManagementGlobalSettingsStorage } from '@/storage/global-settings/encrypted-management-global-settings-storage'
import type { ManagementGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'

describe('EncryptedManagementGlobalSettingsStorage', () => {
  let mockSettingsStorage: EncryptedSettingsMock
  let storage: EncryptedManagementGlobalSettingsStorage

  const mockSettings: ManagementGlobalSettings = {
    privacyPolicyUrl: 'https://example.com/privacy',
    termsOfServiceUrl: 'https://example.com/terms',
    contactSupportEmail: 'support@example.com',
    minSupportedAppVersions: {},
    isTracingEnabled: true,
    isMetricsEnabled: true,
    isVerboseLoggingEnabled: false
  }

  beforeEach(() => {
    mockSettingsStorage = new EncryptedSettingsMock()
    storage = new EncryptedManagementGlobalSettingsStorage(mockSettingsStorage)
  })

  it('returns null when storage is empty', async () => {
    expect(await storage.getManagementGlobalSettings()).toBeNull()
  })

  it('saves and retrieves management global settings', async () => {
    await storage.updateManagementGlobalSettings(mockSettings)
    expect(await storage.getManagementGlobalSettings()).toEqual(mockSettings)
  })

  it('clears stored settings', async () => {
    await storage.updateManagementGlobalSettings(mockSettings)
    await storage.clearManagementGlobalSettings()
    expect(await storage.getManagementGlobalSettings()).toBeNull()
  })
})
