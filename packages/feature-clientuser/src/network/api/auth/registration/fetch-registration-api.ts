import { callResult, HttpClient, markAsPublic } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuthDataPayload,
  OtpConfirmationPayload,
  RegistrationByEmailRequest,
  SendConfirmationToEmailRequest
} from '@mudrichenkoevgeny/shared-foundation'
import { OpenRegistrationRoutes } from '@mudrichenkoevgeny/shared-foundation'
import type { RegistrationApi } from '@/network/api/auth/registration/registration-api'

/** {@link RegistrationApi} implementation backed by {@link HttpClient}. */
export class FetchRegistrationApi implements RegistrationApi {
  /**
   * Constructs a new {@link FetchRegistrationApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async registerByEmail(request: RegistrationByEmailRequest): Promise<AppResult<AuthDataPayload, AppError>> {
    return callResult(() =>
      this.client.request<AuthDataPayload>(OpenRegistrationRoutes.REGISTRATION_BY_EMAIL, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }

  public async sendRegistrationConfirmationToEmail(
    request: SendConfirmationToEmailRequest
  ): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    return callResult(() =>
      this.client.request<OtpConfirmationPayload>(OpenRegistrationRoutes.SEND_REGISTRATION_CONFIRMATION_TO_EMAIL, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }
}
