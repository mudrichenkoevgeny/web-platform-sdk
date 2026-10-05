import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { WebGoogleAuthService } from '@/auth/google/web-google-auth-service'

describe('WebGoogleAuthService', () => {
  let service: WebGoogleAuthService

  beforeEach(() => {
    service = new WebGoogleAuthService('test-client-id')
  })

  it('signs out cleanly when google GSI is present', async () => {
    window.google = {
      accounts: {
        id: {
          initialize: vi.fn(),
          prompt: vi.fn(),
          cancel: vi.fn(),
          disableAutoSelect: vi.fn()
        }
      }
    }

    const result = await service.signOut()
    expect(isSuccess(result)).toBe(true)
    expect(window.google.accounts.id.disableAutoSelect).toHaveBeenCalled()
  })
})
