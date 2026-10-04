import { describe, it, expect } from 'vitest'
import { isFailure } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { DisabledGoogleAuthService } from '@/auth/google/DisabledGoogleAuthService'
import { ClientUserErrorCodes } from '@/error/naming/ClientUserErrorCodes'

describe('DisabledGoogleAuthService', () => {
  const service = new DisabledGoogleAuthService()

  it('fails signIn with EXTERNAL_AUTH_FAILED', async () => {
    const result = await service.signIn()
    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toBe(ClientUserErrorCodes.EXTERNAL_AUTH_FAILED)
    }
  })

  it('fails signOut with EXTERNAL_AUTH_FAILED', async () => {
    const result = await service.signOut()
    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toBe(ClientUserErrorCodes.EXTERNAL_AUTH_FAILED)
    }
  })
})
