import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  OtpConfirmationPayload,
  SendConfirmationToEmailRequest,
  SendConfirmationToPhoneRequest,
  UnlockByEmailConfirmationRequest,
  UnlockByExternalAuthProviderRequest,
  UnlockByPhoneConfirmationRequest
} from '@mudrichenkoevgeny/shared-foundation'
import type { OpenUnlockApi } from '@/network/api/auth/unlock/open-unlock-api'

/**
 * Mock implementation of {@link OpenUnlockApi}.
 */
export class OpenUnlockApiMock implements OpenUnlockApi {
  public sendUnlockEmailConfirmationResult: AppResult<OtpConfirmationPayload, AppError> = appResultFailure(CommonError.unknown())
  public unlockByEmailResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())
  public sendUnlockPhoneConfirmationResult: AppResult<OtpConfirmationPayload, AppError> = appResultFailure(CommonError.unknown())
  public unlockByPhoneResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())
  public unlockByExternalAuthProviderResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())

  public lastSendUnlockEmailConfirmationRequest: SendConfirmationToEmailRequest | null = null
  public lastUnlockByEmailRequest: UnlockByEmailConfirmationRequest | null = null
  public lastSendUnlockPhoneConfirmationRequest: SendConfirmationToPhoneRequest | null = null
  public lastUnlockByPhoneRequest: UnlockByPhoneConfirmationRequest | null = null
  public lastUnlockByExternalAuthProviderRequest: UnlockByExternalAuthProviderRequest | null = null

  public async sendUnlockEmailConfirmation(
    request: SendConfirmationToEmailRequest
  ): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    this.lastSendUnlockEmailConfirmationRequest = request
    return this.sendUnlockEmailConfirmationResult
  }

  public async unlockByEmail(
    request: UnlockByEmailConfirmationRequest
  ): Promise<AppResult<void, AppError>> {
    this.lastUnlockByEmailRequest = request
    return this.unlockByEmailResult
  }

  public async sendUnlockPhoneConfirmation(
    request: SendConfirmationToPhoneRequest
  ): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    this.lastSendUnlockPhoneConfirmationRequest = request
    return this.sendUnlockPhoneConfirmationResult
  }

  public async unlockByPhone(
    request: UnlockByPhoneConfirmationRequest
  ): Promise<AppResult<void, AppError>> {
    this.lastUnlockByPhoneRequest = request
    return this.unlockByPhoneResult
  }

  public async unlockByExternalAuthProvider(
    request: UnlockByExternalAuthProviderRequest
  ): Promise<AppResult<void, AppError>> {
    this.lastUnlockByExternalAuthProviderRequest = request
    return this.unlockByExternalAuthProviderResult
  }
}
