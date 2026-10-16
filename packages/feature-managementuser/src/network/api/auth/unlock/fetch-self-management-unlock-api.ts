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
import { SelfManagementUnlockRoutes } from '@mudrichenkoevgeny/shared-foundation'
import { markAsPublic } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { SelfManagementUnlockApi } from '@/network/api/auth/unlock/self-management-unlock-api'

/** {@link SelfManagementUnlockApi} implementation backed by {@link HttpClient}. */
export class FetchSelfManagementUnlockApi implements SelfManagementUnlockApi {
  /**
   * Constructs a new {@link FetchSelfManagementUnlockApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async sendUnlockEmailConfirmation(email: string): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    const request: SendConfirmationToEmailRequest = { email }
    return callResult(() =>
      this.client.request<OtpConfirmationPayload>(SelfManagementUnlockRoutes.SEND_UNLOCK_EMAIL_CONFIRMATION, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }

  public async unlockByEmail(email: string, confirmationCode: string): Promise<AppResult<void, AppError>> {
    const request: UnlockByEmailConfirmationRequest = {
      email,
      confirmation_code: confirmationCode
    }
    return callResult(() =>
      this.client.request<void>(SelfManagementUnlockRoutes.UNLOCK_BY_EMAIL, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }

  public async sendUnlockPhoneConfirmation(phoneNumber: string): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    const request: SendConfirmationToPhoneRequest = { phone_number: phoneNumber }
    return callResult(() =>
      this.client.request<OtpConfirmationPayload>(SelfManagementUnlockRoutes.SEND_UNLOCK_PHONE_CONFIRMATION, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }

  public async unlockByPhone(phoneNumber: string, confirmationCode: string): Promise<AppResult<void, AppError>> {
    const request: UnlockByPhoneConfirmationRequest = {
      phone_number: phoneNumber,
      confirmation_code: confirmationCode
    }
    return callResult(() =>
      this.client.request<void>(SelfManagementUnlockRoutes.UNLOCK_BY_PHONE, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }

  public async unlockByExternalAuthProvider(
    authProvider: string,
    externalProviderToken: string
  ): Promise<AppResult<void, AppError>> {
    const request: UnlockByExternalAuthProviderRequest = {
      auth_provider: authProvider,
      external_provider_token: externalProviderToken
    }
    return callResult(() =>
      this.client.request<void>(SelfManagementUnlockRoutes.UNLOCK_BY_EXTERNAL_PROVIDER, {
        method: 'POST',
        body: JSON.stringify(request),
        ...markAsPublic()
      })
    )
  }
}
