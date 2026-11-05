import { describe, it, expect } from 'vitest'
import {
  openGlobalSettingsPayloadSchema,
  toOpenGlobalSettings,
  createTestOpenGlobalSettingsPayload
} from '@mudrichenkoevgeny/shared-foundation'

describe('OpenGlobalSettings DTO Schema & Mapping', () => {
  it('parses valid snake_case wire payload and maps to camelCase domain model', () => {
    const rawPayload = createTestOpenGlobalSettingsPayload({
      privacy_policy_url: 'https://example.com/privacy',
      terms_of_service_url: 'https://example.com/terms',
      contact_support_email: 'support@example.com',
      min_supported_app_versions: { ANDROID: '1.2.0' }
    })

    const parseResult = openGlobalSettingsPayloadSchema.safeParse(rawPayload)
    expect(parseResult.success).toBe(true)

    if (parseResult.success) {
      const domainModel = toOpenGlobalSettings(parseResult.data)

      expect(domainModel.privacyPolicyUrl).toBe('https://example.com/privacy')
      expect(domainModel.termsOfServiceUrl).toBe('https://example.com/terms')
      expect(domainModel.contactSupportEmail).toBe('support@example.com')
      expect(domainModel.minSupportedAppVersions.ANDROID).toBe('1.2.0')
    }
  })

  it('rejects payloads with missing required properties', () => {
    const invalidPayload = {
      privacy_policy_url: 'https://example.com/privacy'
    }

    const parseResult = openGlobalSettingsPayloadSchema.safeParse(invalidPayload)
    expect(parseResult.success).toBe(false)
  })

  it('rejects payloads with invalid field types', () => {
    const invalidPayload = createTestOpenGlobalSettingsPayload({
      // @ts-expect-error Intentionally passing invalid type to verify Zod runtime validation
      privacy_policy_url: 12345
    })

    const parseResult = openGlobalSettingsPayloadSchema.safeParse(invalidPayload)
    expect(parseResult.success).toBe(false)
  })

  it('handles nullable/optional fields cleanly', () => {
    const payloadWithNulls = createTestOpenGlobalSettingsPayload({
      privacy_policy_url: null,
      terms_of_service_url: null,
      contact_support_email: null
    })

    const parseResult = openGlobalSettingsPayloadSchema.safeParse(payloadWithNulls)
    expect(parseResult.success).toBe(true)

    if (parseResult.success) {
      const domainModel = toOpenGlobalSettings(parseResult.data)
      expect(domainModel.privacyPolicyUrl).toBeNull()
      expect(domainModel.termsOfServiceUrl).toBeNull()
      expect(domainModel.contactSupportEmail).toBeNull()
    }
  })
})
