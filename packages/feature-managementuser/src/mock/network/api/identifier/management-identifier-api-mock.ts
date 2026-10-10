import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserId,
  UserIdentifierPrivatePayload,
  UserIdentifierSummaryPayload,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementIdentifierApi } from '@/network/api/identifier/management-identifier-api'

/** Mock implementation of {@link ManagementIdentifierApi}. */
export class ManagementIdentifierApiMock implements ManagementIdentifierApi {
  public getIdentifiersResult: AppResult<PagedResult<UserIdentifierSummaryPayload>, AppError> = appResultSuccess({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 0
  })
  public getIdentifierResult: AppResult<UserIdentifierPrivatePayload, AppError> = appResultFailure(CommonError.unknown())
  public deleteIdentifierResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())
  public deleteIdentifierPasswordResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())

  public async getIdentifiers(
    _pageNumber?: number | null,
    _pageSize?: number | null,
    _sortBy?: UserSortValues.UserIdentifierSortBy | null,
    _sortOrder?: SortOrder | null,
    _userIds?: string[] | null,
    _userAuthProviders?: UserAuthProvider[] | null,
    _identifiers?: string[] | null
  ): Promise<AppResult<PagedResult<UserIdentifierSummaryPayload>, AppError>> {
    return this.getIdentifiersResult
  }

  public async getIdentifier(_identifierId: string): Promise<AppResult<UserIdentifierPrivatePayload, AppError>> {
    return this.getIdentifierResult
  }

  public async deleteIdentifier(_userId: UserId, _identifierId: string): Promise<AppResult<void, AppError>> {
    return this.deleteIdentifierResult
  }

  public async deleteIdentifierPassword(_userId: UserId, _identifierId: string): Promise<AppResult<void, AppError>> {
    return this.deleteIdentifierPasswordResult
  }
}
