import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SecurityErrorArgs, SecurityErrorCodes } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { MfaStepUpHttpClientConfigPlugin } from '@/network/httpclient/mfa/MfaStepUpHttpClientConfigPlugin'
import type { MfaChallengeHandler } from '@/network/httpclient/mfa/MfaChallengeHandler'

describe('MfaStepUpHttpClientConfigPlugin', () => {
  let mockChallengeHandler: MfaChallengeHandler
  let reauthenticateAction: ReturnType<typeof vi.fn>
  let plugin: MfaStepUpHttpClientConfigPlugin

  beforeEach(() => {
    mockChallengeHandler = {
      onRequestMfaCode: vi.fn().mockResolvedValue('654321')
    }

    reauthenticateAction = vi.fn().mockResolvedValue(appResultSuccess(undefined))

    plugin = new MfaStepUpHttpClientConfigPlugin({
      baseUrl: 'https://api.example.com',
      reauthenticateRoute: '/auth/reauthenticate',
      mfaChallengeHandler: mockChallengeHandler,
      reauthenticateAction: reauthenticateAction as any
    })
  })

  it('passes through successful responses unmodified', async () => {
    const response = new Response(JSON.stringify({ ok: true }), { status: 200 })
    const result = await plugin.onResponse(response)

    expect(result).toBe(response)
    expect(mockChallengeHandler.onRequestMfaCode).not.toHaveBeenCalled()
  })

  it('prompts MFA code, reauthenticates, and retries request on MFA_CONFIRMATION_REQUIRED', async () => {
    const errorBody = {
      code: SecurityErrorCodes.MFA_CONFIRMATION_REQUIRED,
      args: {
        [SecurityErrorArgs.MFA_TOKEN]: 'mfa-challenge-token-123'
      }
    }

    const response = new Response(JSON.stringify(errorBody), { status: 403 })
    const retriedSuccessResponse = new Response(JSON.stringify({ data: 'ok' }), { status: 200 })

    const mockFetch = vi.fn().mockResolvedValue(retriedSuccessResponse)

    const result = await plugin.onResponse(
      response,
      'https://api.example.com/sensitive-data',
      {},
      mockFetch
    )

    expect(mockChallengeHandler.onRequestMfaCode).toHaveBeenCalledWith('mfa-challenge-token-123')
    expect(reauthenticateAction).toHaveBeenCalledWith('mfa-challenge-token-123', '654321')
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/sensitive-data', {})
    expect(result).toBe(retriedSuccessResponse)
  })

  it('uses fallback POST request to reauthenticateRoute when reauthenticateAction is not provided', async () => {
    const fallbackPlugin = new MfaStepUpHttpClientConfigPlugin({
      baseUrl: 'https://api.example.com',
      reauthenticateRoute: '/auth/reauthenticate',
      mfaChallengeHandler: mockChallengeHandler,
      reauthenticateAction: null
    })

    const errorBody = {
      code: SecurityErrorCodes.MFA_CONFIRMATION_REQUIRED,
      args: {
        [SecurityErrorArgs.MFA_TOKEN]: 'mfa-challenge-token-123'
      }
    }

    const response = new Response(JSON.stringify(errorBody), { status: 403 })
    const retriedSuccessResponse = new Response(JSON.stringify({ data: 'ok' }), { status: 200 })

    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('/auth/reauthenticate')) {
        return new Response(null, { status: 200 })
      }
      return retriedSuccessResponse
    })

    const result = await fallbackPlugin.onResponse(
      response,
      'https://api.example.com/sensitive-data',
      {},
      mockFetch
    )

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/auth/reauthenticate',
      expect.objectContaining({ method: 'POST' })
    )
    expect(result).toBe(retriedSuccessResponse)
  })
})
