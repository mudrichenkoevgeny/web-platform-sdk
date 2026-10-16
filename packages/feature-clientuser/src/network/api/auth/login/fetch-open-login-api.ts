import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuthDataPayload,
  LoginByEmailRequest,
  LoginByExternalAuthProviderRequest,
  LoginByPhoneRequest,
  OtpConfirmationPayload,
  SendConfirmationToPhoneRequest,
  UserAuthProvider,
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

  public async loginByEmail(email: string, password: string): Promise<AppResult<AuthDataPayload, AppError>> {
    const request: LoginByEmailRequest = { email, password }
    return callResult(() =>
      this.client.request<AuthDataPayload>(OpenLoginRoutes.LOGIN_BY_EMAIL, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }

  public async loginByPhone(phoneNumber: string, confirmationCode: string): Promise<AppResult<AuthDataPayload, AppError>> {
    const request: LoginByPhoneRequest = {
      phone_number: phoneNumber,
      confirmation_code: confirmationCode
    }
    return callResult(() =>
      this.client.request<AuthDataPayload>(OpenLoginRoutes.LOGIN_BY_PHONE, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }

  public async loginByExternalAuthProvider(
    authProvider: UserAuthProvider,
    externalProviderToken: string
  ): Promise<AppResult<AuthDataPayload, AppError>> {
    const request: LoginByExternalAuthProviderRequest = {
      auth_provider: authProvider,
      external_provider_token: externalProviderToken
    }
    return callResult(() =>
      this.client.request<AuthDataPayload>(OpenLoginRoutes.LOGIN_BY_EXTERNAL_AUTH_PROVIDER, {
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
      this.client.request<AuthDataPayload>(OpenLoginRoutes.LOGIN_BY_TOTP, {
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
      this.client.request<AuthDataPayload>(OpenLoginRoutes.LOGIN_BY_TOTP_RECOVERY_CODE, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }

  public async sendLoginConfirmationToPhone(
    phoneNumber: string
  ): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    const request: SendConfirmationToPhoneRequest = { phone_number: phoneNumber }
    return callResult(() =>
      this.client.request<OtpConfirmationPayload>(OpenLoginRoutes.SEND_LOGIN_CONFIRMATION_TO_PHONE, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }
}
