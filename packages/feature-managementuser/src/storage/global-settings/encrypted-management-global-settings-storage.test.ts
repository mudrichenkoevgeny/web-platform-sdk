import { describe, it, expect, beforeEach } from 'vitest'
import { EncryptedSettingsMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { EncryptedManagementGlobalSettingsStorage } from '@/storage/globalsettings/EncryptedManagementGlobalSettingsStorage'
import type { ManagementGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'

describe('EncryptedManagementGlobalSettingsStorage', () => {
  let mockSettings: EncryptedSettingsMock
  let storage: EncryptedManagementGlobalSettingsStorage

  const dummySettings: ManagementGlobalSettings = {
    privacyPolicyUrl: 'https://example.com/privacy',
    termsOfServiceUrl: 'https://example.com/terms',
    contactSupportEmail: 'support@example.com',
    minSupportedAppVersions: {},
    isTracingEnabled: true,
    isMetricsEnabled: true,
    isVerboseLoggingEnabled: false
  }

  beforeEach(() => {
    mockSettings = new EncryptedSettingsMock()
    storage = new EncryptedManagementGlobalSettingsStorage(mockSettings)
  })

  it('returns null when storage is empty', async () => {
    expect(await storage.getManagementGlobalSettings()).toBeNull()
  })

  it('saves and retrieves management global settings', async () => {
    await storage.updateManagementGlobalSettings(dummySettings)
    expect(await storage.getManagementGlobalSettings()).toEqual(dummySettings)
  })

  it('clears stored settings', async () => {
    await storage.updateManagementGlobalSettings(dummySettings)
    await storage.clearManagementGlobalSettings()
    expect(await storage.getManagementGlobalSettings()).toBeNull()
  })
})
