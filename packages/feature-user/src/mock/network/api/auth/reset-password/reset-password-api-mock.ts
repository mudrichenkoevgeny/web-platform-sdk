import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type {
  OtpConfirmationPayload,
  ResetPasswordRequest,
  SendResetPasswordConfirmationRequest,
  UserIdentifierPrivatePayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { ResetPasswordApi } from '@/network/api/auth/reset-password/reset-password-api'
/**
 * Mock implementation of {@link ResetPasswordApi}.
 */
export class ResetPasswordApiMock implements ResetPasswordApi {
  public resetPasswordResult: AppResult<UserIdentifierPrivatePayload, AppError> = appResultFailure(CommonError.unknown())
  public sendResetPasswordConfirmationToEmailResult: AppResult<OtpConfirmationPayload, AppError> = appResultFailure(CommonError.unknown())

  public lastResetPasswordRequest: ResetPasswordRequest | null = null
  public lastSendResetPasswordConfirmationRequest: SendResetPasswordConfirmationRequest | null = null

  /** Mocks password reset. */
  public async resetPassword(request: ResetPasswordRequest): Promise<AppResult<UserIdentifierPrivatePayload, AppError>> {
    this.lastResetPasswordRequest = request
    return this.resetPasswordResult
  }

  /** Mocks sending password reset confirmation email. */
  public async sendResetPasswordConfirmationToEmail(
    request: SendResetPasswordConfirmationRequest
  ): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    this.lastSendResetPasswordConfirmationRequest = request
    return this.sendResetPasswordConfirmationToEmailResult
  }
}
