import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuthDataPayload,
  OtpConfirmationPayload,
  RegistrationByEmailRequest,
  SendConfirmationToEmailRequest
} from '@mudrichenkoevgeny/shared-foundation'
import type { RegistrationApi } from '@/network/api/auth/registration/registration-api'

/**
 * Mock implementation of {@link RegistrationApi}.
 */
export class OpenRegistrationApiMock implements RegistrationApi {
  public registerByEmailResult: AppResult<AuthDataPayload, AppError> = appResultFailure(CommonError.unknown())
  public sendRegistrationConfirmationToEmailResult: AppResult<OtpConfirmationPayload, AppError> = appResultFailure(CommonError.unknown())

  public lastRegistrationByEmailRequest: RegistrationByEmailRequest | null = null
  public lastSendRegistrationConfirmationToEmailRequest: SendConfirmationToEmailRequest | null = null

  public async registerByEmail(request: RegistrationByEmailRequest): Promise<AppResult<AuthDataPayload, AppError>> {
    this.lastRegistrationByEmailRequest = request
    return this.registerByEmailResult
  }

  public async sendRegistrationConfirmationToEmail(
    request: SendConfirmationToEmailRequest
  ): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    this.lastSendRegistrationConfirmationToEmailRequest = request
    return this.sendRegistrationConfirmationToEmailResult
  }
}
