import { callResult, HttpClient, markAsPublic } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuthDataPayload,
  LoginByEmailRequest,
  VerifyTotpPayload
} from '@mudrichenkoevgeny/shared-foundation'
import { SelfManagementLoginRoutes } from '@mudrichenkoevgeny/shared-foundation'
import type { SelfManagementLoginApi } from '@/network/api/auth/login/self-management-login-api'

/** {@link SelfManagementLoginApi} implementation backed by {@link HttpClient}. */
export class FetchSelfManagementLoginApi implements SelfManagementLoginApi {
  /**
   * Constructs a new {@link FetchSelfManagementLoginApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async loginByEmail(email: string, password: string): Promise<AppResult<AuthDataPayload, AppError>> {
    const request: LoginByEmailRequest = { email, password }
    return callResult(() =>
      this.client.request<AuthDataPayload>(SelfManagementLoginRoutes.LOGIN_BY_EMAIL, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }

  public async loginByTotp(mfaToken: string, code: string): Promise<AppResult<AuthDataPayload, AppError>> {
    const request: VerifyTotpPayload = {
      mfa_token: mfaToken,
      totp_code: code
    }
    return callResult(() =>
      this.client.request<AuthDataPayload>(SelfManagementLoginRoutes.LOGIN_BY_TOTP, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }

  public async loginByTotpRecoveryCode(mfaToken: string, code: string): Promise<AppResult<AuthDataPayload, AppError>> {
    const request: VerifyTotpPayload = {
      mfa_token: mfaToken,
      totp_code: code
    }
    return callResult(() =>
      this.client.request<AuthDataPayload>(SelfManagementLoginRoutes.LOGIN_BY_TOTP_RECOVERY_CODE, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }
}
