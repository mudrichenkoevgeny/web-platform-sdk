import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuthDataPayload,
  LoginByEmailRequest,
  VerifyTotpPayload
} from '@mudrichenkoevgeny/shared-foundation'
import { SelfManagementLoginRoutes } from '@mudrichenkoevgeny/shared-foundation'
import { markAsPublic } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { SelfManagementLoginApi } from '@/network/api/auth/login/SelfManagementLoginApi'

/** {@link SelfManagementLoginApi} implementation backed by {@link HttpClient}. */
export class FetchSelfManagementLoginApi implements SelfManagementLoginApi {
  /**
   * Constructs a new {@link FetchSelfManagementLoginApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async loginByEmail(request: LoginByEmailRequest): Promise<AppResult<AuthDataPayload, AppError>> {
    return callResult(() =>
      this.client.request<AuthDataPayload>(SelfManagementLoginRoutes.LOGIN_BY_EMAIL, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }

  public async loginByTotp(request: VerifyTotpPayload): Promise<AppResult<AuthDataPayload, AppError>> {
    return callResult(() =>
      this.client.request<AuthDataPayload>(SelfManagementLoginRoutes.LOGIN_BY_TOTP, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }

  public async loginByTotpRecoveryCode(request: VerifyTotpPayload): Promise<AppResult<AuthDataPayload, AppError>> {
    return callResult(() =>
      this.client.request<AuthDataPayload>(SelfManagementLoginRoutes.LOGIN_BY_TOTP_RECOVERY_CODE, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }
}
