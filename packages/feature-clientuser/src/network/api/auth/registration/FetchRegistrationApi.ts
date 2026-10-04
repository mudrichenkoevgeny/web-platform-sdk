import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuthDataPayload,
  OtpConfirmationPayload,
  RegisterByEmailRequest,
  SendConfirmationToEmailRequest
} from '@mudrichenkoevgeny/shared-foundation'
import { OpenRegisterRoutes } from '@mudrichenkoevgeny/shared-foundation'
import { markAsPublic } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { RegistrationApi } from '@/network/api/auth/registration/RegistrationApi'

/** {@link RegistrationApi} implementation backed by {@link HttpClient}. */
export class FetchRegistrationApi implements RegistrationApi {
  /**
   * Constructs a new {@link FetchRegistrationApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async registerByEmail(request: RegisterByEmailRequest): Promise<AppResult<AuthDataPayload, AppError>> {
    return callResult(() =>
      this.client.request<AuthDataPayload>(OpenRegisterRoutes.REGISTER_BY_EMAIL, {
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
      this.client.request<OtpConfirmationPayload>(OpenRegisterRoutes.SEND_REGISTER_CONFIRMATION_TO_EMAIL, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }
}
