import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  OtpConfirmationPayload,
  ResetPasswordRequest,
  SendResetPasswordConfirmationRequest,
  UserIdentifierPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { ResetPasswordApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

/** Mock implementation of {@link ResetPasswordApi} for self management. */
export class SelfManagementResetPasswordApiMock implements ResetPasswordApi {
  public resetPasswordResult: AppResult<UserIdentifierPayload, AppError> = appResultFailure(CommonError.unknown())
  public sendResetPasswordConfirmationResult: AppResult<OtpConfirmationPayload, AppError> = appResultFailure(CommonError.unknown())

  public lastResetPasswordRequest: ResetPasswordRequest | null = null
  public lastSendResetPasswordConfirmationRequest: SendResetPasswordConfirmationRequest | null = null

  public async resetPassword(request: ResetPasswordRequest): Promise<AppResult<UserIdentifierPayload, AppError>> {
    this.lastResetPasswordRequest = request
    return this.resetPasswordResult
  }

  public async sendResetPasswordConfirmationToEmail(
    request: SendResetPasswordConfirmationRequest
  ): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    this.lastSendResetPasswordConfirmationRequest = request
    return this.sendResetPasswordConfirmationResult
  }
}
