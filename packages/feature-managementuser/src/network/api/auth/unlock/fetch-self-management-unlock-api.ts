import { callResult, HttpClient, markAsPublic } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  OtpConfirmationPayload,
  SendConfirmationToEmailRequest,
  UnlockByEmailConfirmationRequest
} from '@mudrichenkoevgeny/shared-foundation'
import { SelfManagementUnlockRoutes } from '@mudrichenkoevgeny/shared-foundation'
import type { SelfManagementUnlockApi } from '@/network/api/auth/unlock/self-management-unlock-api'

/** {@link SelfManagementUnlockApi} implementation backed by {@link HttpClient}. */
export class FetchSelfManagementUnlockApi implements SelfManagementUnlockApi {
  /**
   * Constructs a new {@link FetchSelfManagementUnlockApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  /**
   * Sends an account unlock confirmation code (OTP) to the specified management email address.
   *
   * @param email - Target email address
   * @returns Confirmation dispatch result, or a mapped failure
   */
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

  /**
   * Unlocks a temporarily locked management account using an email confirmation code.
   *
   * @param email - User email
   * @param confirmationCode - OTP confirmation code
   * @returns Void result on success, or a mapped failure
   */
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
}
