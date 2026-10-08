import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  OtpConfirmationPayload,
  ResetPasswordRequest,
  SendResetPasswordConfirmationRequest,
  UserIdentifierPayload
} from '@mudrichenkoevgeny/shared-foundation'
import { SelfManagementResetPasswordRoutes } from '@mudrichenkoevgeny/shared-foundation'
import { markAsPublic } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { ResetPasswordApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

/** Management {@link ResetPasswordApi} implementation backed by {@link HttpClient}. */
export class FetchSelfManagementResetPasswordApi implements ResetPasswordApi {
  /**
   * Constructs a new {@link FetchSelfManagementResetPasswordApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async resetPassword(request: ResetPasswordRequest): Promise<AppResult<UserIdentifierPayload, AppError>> {
    return callResult(() =>
      this.client.request<UserIdentifierPayload>(SelfManagementResetPasswordRoutes.RESET_PASSWORD, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }

  public async sendResetPasswordConfirmationToEmail(
    request: SendResetPasswordConfirmationRequest
  ): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    return callResult(() =>
      this.client.request<OtpConfirmationPayload>(SelfManagementResetPasswordRoutes.SEND_RESET_PASSWORD_CONFIRMATION, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }
}
