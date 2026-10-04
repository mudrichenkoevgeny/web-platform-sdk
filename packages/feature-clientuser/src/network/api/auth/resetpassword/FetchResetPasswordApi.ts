import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  OtpConfirmationPayload,
  ResetPasswordRequest,
  SendResetPasswordConfirmationRequest,
  UserIdentifierPayload
} from '@mudrichenkoevgeny/shared-foundation'
import { OpenResetPasswordRoutes } from '@mudrichenkoevgeny/shared-foundation'
import { markAsPublic, ResetPasswordApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

/** Open {@link ResetPasswordApi} implementation backed by {@link HttpClient}. */
export class FetchResetPasswordApi implements ResetPasswordApi {
  /**
   * Constructs a new {@link FetchResetPasswordApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async resetPassword(request: ResetPasswordRequest): Promise<AppResult<UserIdentifierPayload, AppError>> {
    return callResult(() =>
      this.client.request<UserIdentifierPayload>(OpenResetPasswordRoutes.RESET_EMAIL_PASSWORD, {
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
      this.client.request<OtpConfirmationPayload>(OpenResetPasswordRoutes.SEND_RESET_EMAIL_PASSWORD_CONFIRMATION, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }
}
