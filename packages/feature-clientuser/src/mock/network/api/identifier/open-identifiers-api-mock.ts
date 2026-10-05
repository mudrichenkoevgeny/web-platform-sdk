import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AddUserIdentifierEmailRequest,
  AddUserIdentifierExternalAuthProviderRequest,
  AddUserIdentifierPhoneRequest,
  EmailPasswordChangeRequest,
  OtpConfirmationPayload,
  PagedResult,
  SendConfirmationToEmailRequest,
  SendConfirmationToPhoneRequest,
  SortOrder,
  UserAuthProvider,
  UserIdentifierId,
  UserIdentifierPayload,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import type { OpenIdentifiersApi } from '@/network/api/identifier/open-identifiers-api'

/**
 * Mock implementation of {@link OpenIdentifiersApi}.
 */
export class OpenIdentifiersApiMock implements OpenIdentifiersApi {
  public getUserIdentifierResult: AppResult<UserIdentifierPayload, AppError> = appResultFailure(CommonError.unknown())
  public getUserIdentifiersResult: AppResult<PagedResult<UserIdentifierPayload>, AppError> = appResultSuccess({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 0
  })
  public deleteUserIdentifierResult: AppResult<void, AppError> = appResultSuccess(undefined)
  public addUserIdentifierEmailResult: AppResult<UserIdentifierPayload, AppError> = appResultFailure(CommonError.unknown())
  public addUserIdentifierPhoneResult: AppResult<UserIdentifierPayload, AppError> = appResultFailure(CommonError.unknown())
  public addUserIdentifierExternalAuthProviderResult: AppResult<UserIdentifierPayload, AppError> = appResultFailure(CommonError.unknown())
  public sendAddEmailIdentifierConfirmationResult: AppResult<OtpConfirmationPayload, AppError> = appResultFailure(CommonError.unknown())
  public sendAddPhoneIdentifierConfirmationResult: AppResult<OtpConfirmationPayload, AppError> = appResultFailure(CommonError.unknown())
  public emailChangePasswordResult: AppResult<void, AppError> = appResultSuccess(undefined)

  public async getUserIdentifier(
    _userIdentifierId: UserIdentifierId
  ): Promise<AppResult<UserIdentifierPayload, AppError>> {
    return this.getUserIdentifierResult
  }

  public async getUserIdentifiers(
    _pageNumber?: number | null,
    _pageSize?: number | null,
    _sortBy?: UserSortValues.UserIdentifierSortBy | null,
    _sortOrder?: SortOrder | null,
    _userAuthProviders?: UserAuthProvider[] | null,
    _identifiers?: string[] | null
  ): Promise<AppResult<PagedResult<UserIdentifierPayload>, AppError>> {
    return this.getUserIdentifiersResult
  }

  public async deleteUserIdentifier(
    _identifierId: UserIdentifierId
  ): Promise<AppResult<void, AppError>> {
    return this.deleteUserIdentifierResult
  }

  public async addUserIdentifierEmail(
    _request: AddUserIdentifierEmailRequest
  ): Promise<AppResult<UserIdentifierPayload, AppError>> {
    return this.addUserIdentifierEmailResult
  }

  public async addUserIdentifierPhone(
    _request: AddUserIdentifierPhoneRequest
  ): Promise<AppResult<UserIdentifierPayload, AppError>> {
    return this.addUserIdentifierPhoneResult
  }

  public async addUserIdentifierExternalAuthProvider(
    _request: AddUserIdentifierExternalAuthProviderRequest
  ): Promise<AppResult<UserIdentifierPayload, AppError>> {
    return this.addUserIdentifierExternalAuthProviderResult
  }

  public async sendAddEmailIdentifierConfirmation(
    _request: SendConfirmationToEmailRequest
  ): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    return this.sendAddEmailIdentifierConfirmationResult
  }

  public async sendAddPhoneIdentifierConfirmation(
    _request: SendConfirmationToPhoneRequest
  ): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    return this.sendAddPhoneIdentifierConfirmationResult
  }

  public async emailChangePassword(
    _request: EmailPasswordChangeRequest
  ): Promise<AppResult<void, AppError>> {
    return this.emailChangePasswordResult
  }
}
