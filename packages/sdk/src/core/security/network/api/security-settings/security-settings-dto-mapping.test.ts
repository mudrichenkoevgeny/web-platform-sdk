import { describe, it, expect } from 'vitest'
import {
  openSecuritySettingsPayloadSchema,
  toOpenSecuritySettings,
  createTestOpenSecuritySettingsPayload
} from '@mudrichenkoevgeny/shared-foundation'

describe('OpenSecuritySettings DTO Schema & Mapping', () => {
  it('parses valid snake_case payload and maps to camelCase domain model', () => {
    const rawPayload = createTestOpenSecuritySettingsPayload()

    const parseResult = openSecuritySettingsPayloadSchema.safeParse(rawPayload)
    expect(parseResult.success).toBe(true)

    if (parseResult.success) {
      const domainModel = toOpenSecuritySettings(parseResult.data)

      expect(domainModel.passwordPolicy.minLength).toBe(rawPayload.open_password_policy.min_length)
      expect(domainModel.passwordPolicy.requireDigit).toBe(rawPayload.open_password_policy.require_digit)
      expect(domainModel.otpConfirmation.retryAfterSeconds).toBe(
        rawPayload.otp_confirmation.retry_after_seconds
      )
    }
  })

  it('rejects malformed password policy payloads', () => {
    const invalidPayload = {
      ...createTestOpenSecuritySettingsPayload(),
      open_password_policy: {
        min_length: 'eight'
      }
    }

    const parseResult = openSecuritySettingsPayloadSchema.safeParse(invalidPayload)
    expect(parseResult.success).toBe(false)
  })

  it('rejects empty or non-object payloads', () => {
    expect(openSecuritySettingsPayloadSchema.safeParse(null).success).toBe(false)
    expect(openSecuritySettingsPayloadSchema.safeParse(undefined).success).toBe(false)
    expect(openSecuritySettingsPayloadSchema.safeParse([]).success).toBe(false)
  })
})
