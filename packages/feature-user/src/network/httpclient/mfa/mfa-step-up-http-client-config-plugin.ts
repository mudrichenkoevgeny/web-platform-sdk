import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { HttpClientConfigPlugin, AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SecurityErrorArgs, SecurityErrorCodes } from '@mudrichenkoevgeny/shared-foundation'
import type { MfaChallengeHandler } from '@/network/httpclient/mfa/mfa-challenge-handler'
/**
 * Options for configuring {@link MfaStepUpHttpClientConfigPlugin}.
 */
export interface MfaStepUpHttpClientConfigOptions {
  readonly baseUrl: string
  readonly reauthenticateRoute: string
  readonly mfaChallengeHandler?: MfaChallengeHandler | null
  readonly reauthenticateAction?: ((mfaToken: string, code: string) => Promise<AppResult<void, AppError>>) | null
  readonly logger?: ((msg: string) => void) | null
}

/**
 * {@link HttpClientConfigPlugin} that intercepts responses requiring MFA confirmation (`MFA_CONFIRMATION_REQUIRED`),
 * prompts for MFA code via {@link MfaChallengeHandler}, performs re-authentication (via action or fallback API endpoint),
 * and retries the original request upon success.
 */
export class MfaStepUpHttpClientConfigPlugin implements HttpClientConfigPlugin {
  private readonly baseUrl: string
  private readonly reauthenticateRoute: string
  private readonly mfaChallengeHandler?: MfaChallengeHandler | null
  private readonly reauthenticateAction?: ((mfaToken: string, code: string) => Promise<AppResult<void, AppError>>) | null
  private readonly logger?: ((msg: string) => void) | null

  /**
   * Constructs a new {@link MfaStepUpHttpClientConfigPlugin}.
   *
   * @param options - MFA plugin options
   */
  public constructor(options: MfaStepUpHttpClientConfigOptions) {
    this.baseUrl = options.baseUrl.endsWith('/') ? options.baseUrl.slice(0, -1) : options.baseUrl
    this.reauthenticateRoute = options.reauthenticateRoute.startsWith('/')
      ? options.reauthenticateRoute
      : `/${options.reauthenticateRoute}`
    this.mfaChallengeHandler = options.mfaChallengeHandler
    this.reauthenticateAction = options.reauthenticateAction
    this.logger = options.logger
  }

  /**
   * Intercepts responses to handle MFA step-up challenge if required.
   *
   * @param response - Received HTTP response
   * @param url - Optional request target URL
   * @param init - Optional request options
   * @param fetchImpl - Optional fetch implementation function
   * @returns Original or retried HTTP response
   */
  public async onResponse(
    response: Response,
    url?: string,
    init?: RequestInit,
    fetchImpl?: typeof fetch
  ): Promise<Response> {
    if (response.ok || !this.mfaChallengeHandler) {
      return response
    }

    try {
      const clone = response.clone()
      const json = await clone.json()

      if (json && json.code === SecurityErrorCodes.MFA_CONFIRMATION_REQUIRED) {
        const mfaToken = json.args?.[SecurityErrorArgs.MFA_TOKEN]
        if (!mfaToken) {
          return response
        }

        this.logger?.('MFA: Step-up authentication required')
        const code = await this.mfaChallengeHandler.onRequestMfaCode(mfaToken)
        if (!code) {
          this.logger?.('MFA: User cancelled step-up prompt')
          return response
        }

        let reauthSuccess = false

        if (this.reauthenticateAction) {
          const result = await this.reauthenticateAction(mfaToken, code)
          reauthSuccess = isSuccess(result)
        } else if (fetchImpl) {
          try {
            const reauthUrl = `${this.baseUrl}${this.reauthenticateRoute}`
            this.logger?.(`MFA: Executing fallback re-authentication POST to ${reauthUrl}`)
            const reauthResponse = await fetchImpl(reauthUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
              },
              body: JSON.stringify({ mfa_token: mfaToken, code })
            })
            reauthSuccess = reauthResponse.ok
          } catch {
            reauthSuccess = false
          }
        }

        if (reauthSuccess && url && fetchImpl) {
          this.logger?.(`MFA: Step-up re-authentication successful. Retrying original request to ${url}`)
          return await fetchImpl(url, init)
        }
      }
    } catch {
      // Unparseable error response
    }

    return response
  }
}
