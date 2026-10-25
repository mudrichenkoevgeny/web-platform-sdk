import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  OtpConfirmationPayload,
  SendConfirmationToEmailRequest,
  UnlockByEmailConfirmationRequest
} from '@mudrichenkoevgeny/shared-foundation'
import type { SelfManagementUnlockApi } from '@/network/api/auth/unlock/self-management-unlock-api'

export class SelfManagementUnlockApiMock implements SelfManagementUnlockApi {
  public sendUnlockEmailConfirmationResult: AppResult<OtpConfirmationPayload, AppError> = appResultFailure(CommonError.unknown())
  public unlockByEmailResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())

  public lastSendUnlockEmailConfirmationRequest: SendConfirmationToEmailRequest | null = null
  public lastUnlockByEmailRequest: UnlockByEmailConfirmationRequest | null = null

  public async sendUnlockEmailConfirmation(email: string): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    this.lastSendUnlockEmailConfirmationRequest = { email }
    return this.sendUnlockEmailConfirmationResult
  }

  public async unlockByEmail(email: string, confirmationCode: string): Promise<AppResult<void, AppError>> {
    this.lastUnlockByEmailRequest = { email, confirmation_code: confirmationCode }
    return this.unlockByEmailResult
  }
}
