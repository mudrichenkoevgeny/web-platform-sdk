import { describe, it, expect } from 'vitest'
import {
  openUserConfigurationPayloadSchema,
  createTestOpenUserConfigurationPayload,
  toOpenUserConfiguration
} from '@mudrichenkoevgeny/shared-foundation'

describe('OpenUserConfiguration DTO Schema & Mapping', () => {
  it('parses valid bundled configuration payload and maps all 4 slices', () => {
    const rawPayload = createTestOpenUserConfigurationPayload()

    const parseResult = openUserConfigurationPayloadSchema.safeParse(rawPayload)
    expect(parseResult.success).toBe(true)

    if (parseResult.success) {
      const bundle = toOpenUserConfiguration(parseResult.data)

      expect(bundle.openGlobalSettings).toBeDefined()
      expect(bundle.openSecuritySettings).toBeDefined()
      expect(bundle.openStorageSettings).toBeDefined()
      expect(bundle.openAuthSettings).toBeDefined()

      expect(bundle.openGlobalSettings.privacyPolicyUrl).toBe(
        rawPayload.open_global_settings.privacy_policy_url
      )
      expect(bundle.openAuthSettings.maxTotalIdentifiers).toBe(
        rawPayload.open_auth_settings.max_total_identifiers
      )
    }
  })

  it('fails validation when any slice is missing or corrupted', () => {
    const rawPayload = createTestOpenUserConfigurationPayload()
    const corruptedPayload = {
      ...rawPayload,
      open_security_settings: null
    }

    const parseResult = openUserConfigurationPayloadSchema.safeParse(corruptedPayload)
    expect(parseResult.success).toBe(false)
  })
})
