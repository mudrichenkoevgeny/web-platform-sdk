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
    email: string
  ): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    this.lastSendUnlockEmailConfirmationRequest = { email }
    return this.sendUnlockEmailConfirmationResult
  }

  public async unlockByEmail(
    email: string,
    confirmationCode: string
  ): Promise<AppResult<void, AppError>> {
    this.lastUnlockByEmailRequest = { email, confirmation_code: confirmationCode }
    return this.unlockByEmailResult
  }

  public async sendUnlockPhoneConfirmation(
    phoneNumber: string
  ): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    this.lastSendUnlockPhoneConfirmationRequest = { phone_number: phoneNumber }
    return this.sendUnlockPhoneConfirmationResult
  }

  public async unlockByPhone(
    phoneNumber: string,
    confirmationCode: string
  ): Promise<AppResult<void, AppError>> {
    this.lastUnlockByPhoneRequest = { phone_number: phoneNumber, confirmation_code: confirmationCode }
    return this.unlockByPhoneResult
  }

  public async unlockByExternalAuthProvider(
    authProvider: string,
    externalProviderToken: string
  ): Promise<AppResult<void, AppError>> {
    this.lastUnlockByExternalAuthProviderRequest = { auth_provider: authProvider, external_provider_token: externalProviderToken }
    return this.unlockByExternalAuthProviderResult
  }
}
