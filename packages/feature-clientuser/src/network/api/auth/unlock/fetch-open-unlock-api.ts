import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  OtpConfirmationPayload,
  SendConfirmationToEmailRequest,
  SendConfirmationToPhoneRequest,
  UnlockByEmailConfirmationRequest,
  UnlockByExternalAuthProviderRequest,
  UnlockByPhoneConfirmationRequest
} from '@mudrichenkoevgeny/shared-foundation'
import { OpenUnlockRoutes } from '@mudrichenkoevgeny/shared-foundation'
import { markAsPublic } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { OpenUnlockApi } from '@/network/api/auth/unlock/open-unlock-api'

/** {@link OpenUnlockApi} implementation backed by {@link HttpClient}. */
export class FetchOpenUnlockApi implements OpenUnlockApi {
  /**
   * Constructs a new {@link FetchOpenUnlockApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async sendUnlockEmailConfirmation(
    request: SendConfirmationToEmailRequest
  ): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    return callResult(() =>
      this.client.request<OtpConfirmationPayload>(OpenUnlockRoutes.SEND_UNLOCK_EMAIL_CONFIRMATION, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }

  public async unlockByEmail(request: UnlockByEmailConfirmationRequest): Promise<AppResult<void, AppError>> {
    return callResult(() =>
      this.client.request<void>(OpenUnlockRoutes.UNLOCK_BY_EMAIL, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }

  public async sendUnlockPhoneConfirmation(
    request: SendConfirmationToPhoneRequest
  ): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    return callResult(() =>
      this.client.request<OtpConfirmationPayload>(OpenUnlockRoutes.SEND_UNLOCK_PHONE_CONFIRMATION, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }

  public async unlockByPhone(request: UnlockByPhoneConfirmationRequest): Promise<AppResult<void, AppError>> {
    return callResult(() =>
      this.client.request<void>(OpenUnlockRoutes.UNLOCK_BY_PHONE, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }

  public async unlockByExternalAuthProvider(
    request: UnlockByExternalAuthProviderRequest
  ): Promise<AppResult<void, AppError>> {
    return callResult(() =>
      this.client.request<void>(OpenUnlockRoutes.UNLOCK_BY_EXTERNAL_PROVIDER, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }
}
