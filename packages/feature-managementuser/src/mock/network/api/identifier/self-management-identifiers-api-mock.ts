import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  EmailPasswordChangeRequest,
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserIdentifierId,
  UserIdentifierPayload,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import type { SelfManagementIdentifiersApi } from '@/network/api/identifier/SelfManagementIdentifiersApi'

/** Mock implementation of {@link SelfManagementIdentifiersApi}. */
export class SelfManagementIdentifiersApiMock implements SelfManagementIdentifiersApi {
  public getUserIdentifierResult: AppResult<UserIdentifierPayload, AppError> = appResultFailure(CommonError.unknown())
  public getUserIdentifiersResult: AppResult<PagedResult<UserIdentifierPayload>, AppError> = appResultSuccess({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 0
  })
  public emailChangePasswordResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())

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

  public async emailChangePassword(
    _request: EmailPasswordChangeRequest
  ): Promise<AppResult<void, AppError>> {
    return this.emailChangePasswordResult
  }
}
