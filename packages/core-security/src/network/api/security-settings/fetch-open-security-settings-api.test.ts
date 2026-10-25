import { describe, it, expect, vi } from 'vitest'
import type { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenSecuritySettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { FetchOpenSecuritySettingsApi } from './fetch-open-security-settings-api'

describe('FetchOpenSecuritySettingsApi', () => {
  const mockHttpClient: HttpClient = {
    request: vi.fn()
  } as unknown as HttpClient

  const api = new FetchOpenSecuritySettingsApi(mockHttpClient)

  it('fetches open security settings successfully', async () => {
    const mockPayload: OpenSecuritySettingsPayload = {
      openPasswordPolicy: {
        minLength: 8,
        requireLetter: true,
        requireUpperCase: false,
        requireLowerCase: false,
        requireDigit: false,
        requireSpecialChar: false
      },
      otpConfirmation: {
        retryAfterSeconds: 60,
        numberOfSymbols: 6,
        expirationSeconds: 300
      }
    }

    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const result = await api.getSecuritySettings()
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(mockPayload)
    }
  })
})
