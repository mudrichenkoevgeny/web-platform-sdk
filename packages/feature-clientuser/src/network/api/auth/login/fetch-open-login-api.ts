import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuthDataPayload,
  LoginByEmailRequest,
  LoginByExternalAuthProviderRequest,
  LoginByPhoneRequest,
  OtpConfirmationPayload,
  SendConfirmationToPhoneRequest,
  VerifyTotpPayload
} from '@mudrichenkoevgeny/shared-foundation'
import { OpenLoginRoutes } from '@mudrichenkoevgeny/shared-foundation'
import { markAsPublic } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { OpenLoginApi } from '@/network/api/auth/login/open-login-api'

/** {@link OpenLoginApi} implementation backed by {@link HttpClient}. */
export class FetchOpenLoginApi implements OpenLoginApi {
  /**
   * Constructs a new {@link FetchOpenLoginApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async loginByEmail(request: LoginByEmailRequest): Promise<AppResult<AuthDataPayload, AppError>> {
    return callResult(() =>
      this.client.request<AuthDataPayload>(OpenLoginRoutes.LOGIN_BY_EMAIL, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }

  public async loginByPhone(request: LoginByPhoneRequest): Promise<AppResult<AuthDataPayload, AppError>> {
    return callResult(() =>
      this.client.request<AuthDataPayload>(OpenLoginRoutes.LOGIN_BY_PHONE, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }

  public async loginByExternalAuthProvider(
    request: LoginByExternalAuthProviderRequest
  ): Promise<AppResult<AuthDataPayload, AppError>> {
    return callResult(() =>
      this.client.request<AuthDataPayload>(OpenLoginRoutes.LOGIN_BY_EXTERNAL_AUTH_PROVIDER, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }

  public async loginByTotp(request: VerifyTotpPayload): Promise<AppResult<AuthDataPayload, AppError>> {
    return callResult(() =>
      this.client.request<AuthDataPayload>(OpenLoginRoutes.LOGIN_BY_TOTP, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }

  public async loginByTotpRecoveryCode(request: VerifyTotpPayload): Promise<AppResult<AuthDataPayload, AppError>> {
    return callResult(() =>
      this.client.request<AuthDataPayload>(OpenLoginRoutes.LOGIN_BY_TOTP_RECOVERY_CODE, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }

  public async sendLoginConfirmationToPhone(
    request: SendConfirmationToPhoneRequest
  ): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    return callResult(() =>
      this.client.request<OtpConfirmationPayload>(OpenLoginRoutes.SEND_LOGIN_CONFIRMATION_TO_PHONE, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }
}
