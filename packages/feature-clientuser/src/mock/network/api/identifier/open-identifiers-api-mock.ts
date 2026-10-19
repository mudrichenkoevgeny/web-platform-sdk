import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  OtpConfirmationPayload,
  PagedResult,
  SelfIdentifierListParams,
  UserIdentifierId,
  UserIdentifierPrivatePayload,
  UserIdentifierSummaryPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { OpenIdentifiersApi } from '@/network/api/identifier/open-identifiers-api'

/**
 * Mock implementation of {@link OpenIdentifiersApi}.
 */
export class OpenIdentifiersApiMock implements OpenIdentifiersApi {
  public getUserIdentifierResult: AppResult<UserIdentifierPrivatePayload, AppError> = appResultFailure(CommonError.unknown())
  public getUserIdentifiersResult: AppResult<PagedResult<UserIdentifierSummaryPayload>, AppError> = appResultSuccess({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 0
  })
  public deleteUserIdentifierResult: AppResult<void, AppError> = appResultSuccess(undefined)
  public deletePasswordResult: AppResult<void, AppError> = appResultSuccess(undefined)
  public addUserIdentifierEmailResult: AppResult<UserIdentifierPrivatePayload, AppError> = appResultFailure(CommonError.unknown())
  public addUserIdentifierPhoneResult: AppResult<UserIdentifierPrivatePayload, AppError> = appResultFailure(CommonError.unknown())
  public addUserIdentifierExternalAuthProviderResult: AppResult<UserIdentifierPrivatePayload, AppError> = appResultFailure(CommonError.unknown())
  public sendAddEmailIdentifierConfirmationResult: AppResult<OtpConfirmationPayload, AppError> = appResultFailure(CommonError.unknown())
  public sendAddPhoneIdentifierConfirmationResult: AppResult<OtpConfirmationPayload, AppError> = appResultFailure(CommonError.unknown())
  public emailChangePasswordResult: AppResult<void, AppError> = appResultSuccess(undefined)

  public async getUserIdentifier(
    _userIdentifierId: UserIdentifierId
  ): Promise<AppResult<UserIdentifierPrivatePayload, AppError>> {
    return this.getUserIdentifierResult
  }

  public async getUserIdentifiers(
    _params?: SelfIdentifierListParams | null
  ): Promise<AppResult<PagedResult<UserIdentifierSummaryPayload>, AppError>> {
    return this.getUserIdentifiersResult
  }

  public async deleteUserIdentifier(
    _identifierId: UserIdentifierId
  ): Promise<AppResult<void, AppError>> {
    return this.deleteUserIdentifierResult
  }

  public async deletePassword(
    _userIdentifierId: UserIdentifierId
  ): Promise<AppResult<void, AppError>> {
    return this.deletePasswordResult
  }

  public async addUserIdentifierEmail(
    _email: string,
    _password: string,
    _confirmationCode: string
  ): Promise<AppResult<UserIdentifierPrivatePayload, AppError>> {
    return this.addUserIdentifierEmailResult
  }

  public async addUserIdentifierPhone(
    _phoneNumber: string,
    _confirmationCode: string
  ): Promise<AppResult<UserIdentifierPrivatePayload, AppError>> {
    return this.addUserIdentifierPhoneResult
  }

  public async addUserIdentifierExternalAuthProvider(
    _authProvider: string,
    _externalProviderToken: string
  ): Promise<AppResult<UserIdentifierPrivatePayload, AppError>> {
    return this.addUserIdentifierExternalAuthProviderResult
  }

  public async sendAddEmailIdentifierConfirmation(
    _email: string
  ): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    return this.sendAddEmailIdentifierConfirmationResult
  }

  public async sendAddPhoneIdentifierConfirmation(
    _phoneNumber: string
  ): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    return this.sendAddPhoneIdentifierConfirmationResult
  }

  public async emailChangePassword(
    _userIdentifierId: UserIdentifierId,
    _oldPassword: string,
    _newPassword: string
  ): Promise<AppResult<void, AppError>> {
    return this.emailChangePasswordResult
  }
}
