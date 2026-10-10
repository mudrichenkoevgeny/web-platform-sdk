import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserId,
  UserIdentifierId,
  UserIdentifierPrivate,
  UserIdentifierSummary,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import { userIdentifierPrivateMock, userIdentifierSummaryMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { ManagementIdentifierRepository } from '@/repository/identifier/management-identifier-repository'

/** Mock implementation of {@link ManagementIdentifierRepository}. */
export class ManagementIdentifierRepositoryMock implements ManagementIdentifierRepository {
  public getIdentifiersResultProvider: () => Promise<AppResult<PagedResult<UserIdentifierSummary>, AppError>> = async () =>
    appResultSuccess({
      items: [userIdentifierSummaryMock()],
      totalCount: 1,
      pageNumber: 1,
      pageSize: 20,
      totalPages: 1
    })

  public getIdentifierResultProvider: (identifierId: UserIdentifierId) => Promise<AppResult<UserIdentifierPrivate, AppError>> =
    async () => appResultSuccess(userIdentifierPrivateMock())

  public deleteIdentifierResultProvider: (
    userId: UserId,
    identifierId: UserIdentifierId
  ) => Promise<AppResult<void, AppError>> = async () => appResultSuccess(undefined)

  public deleteIdentifierPasswordResultProvider: (
    userId: UserId,
    identifierId: UserIdentifierId
  ) => Promise<AppResult<void, AppError>> = async () => appResultSuccess(undefined)

  public lastUserId: UserId | null = null
  public lastIdentifierId: UserIdentifierId | null = null

  public async getIdentifiers(
    _pageNumber?: number | null,
    _pageSize?: number | null,
    _sortBy?: UserSortValues.UserIdentifierSortBy | null,
    _sortOrder?: SortOrder | null,
    _userIds?: string[] | null,
    _userAuthProviders?: UserAuthProvider[] | null,
    _identifiers?: string[] | null
  ): Promise<AppResult<PagedResult<UserIdentifierSummary>, AppError>> {
    return this.getIdentifiersResultProvider()
  }

  public async getIdentifier(identifierId: UserIdentifierId): Promise<AppResult<UserIdentifierPrivate, AppError>> {
    this.lastIdentifierId = identifierId
    return this.getIdentifierResultProvider(identifierId)
  }

  public async deleteIdentifier(userId: UserId, identifierId: UserIdentifierId): Promise<AppResult<void, AppError>> {
    this.lastUserId = userId
    this.lastIdentifierId = identifierId
    return this.deleteIdentifierResultProvider(userId, identifierId)
  }

  public async deleteIdentifierPassword(userId: UserId, identifierId: UserIdentifierId): Promise<AppResult<void, AppError>> {
    this.lastUserId = userId
    this.lastIdentifierId = identifierId
    return this.deleteIdentifierPasswordResultProvider(userId, identifierId)
  }
}
