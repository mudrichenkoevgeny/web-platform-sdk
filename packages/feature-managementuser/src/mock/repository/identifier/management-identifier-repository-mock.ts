import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserId,
  UserIdentifier,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import { userIdentifierMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { ManagementIdentifierRepository } from '@/repository/identifier/ManagementIdentifierRepository'

/** Mock implementation of {@link ManagementIdentifierRepository}. */
export class ManagementIdentifierRepositoryMock implements ManagementIdentifierRepository {
  public getIdentifiersResultProvider: () => Promise<AppResult<PagedResult<UserIdentifier>, AppError>> = async () =>
    appResultSuccess({
      items: [userIdentifierMock()],
      totalCount: 1,
      pageNumber: 1,
      pageSize: 20,
      totalPages: 1
    })

  public getIdentifierResultProvider: (identifierId: string) => Promise<AppResult<UserIdentifier, AppError>> =
    async () => appResultSuccess(userIdentifierMock())

  public deleteIdentifierResultProvider: (
    userId: UserId,
    identifierId: string
  ) => Promise<AppResult<void, AppError>> = async () => appResultSuccess(undefined)

  public deleteIdentifierPasswordResultProvider: (
    userId: UserId,
    identifierId: string
  ) => Promise<AppResult<void, AppError>> = async () => appResultSuccess(undefined)

  public lastUserId: UserId | null = null
  public lastIdentifierId: string | null = null

  public async getIdentifiers(
    _pageNumber?: number | null,
    _pageSize?: number | null,
    _sortBy?: UserSortValues.UserIdentifierSortBy | null,
    _sortOrder?: SortOrder | null,
    _userIds?: string[] | null,
    _userAuthProviders?: UserAuthProvider[] | null,
    _identifiers?: string[] | null
  ): Promise<AppResult<PagedResult<UserIdentifier>, AppError>> {
    return this.getIdentifiersResultProvider()
  }

  public async getIdentifier(identifierId: string): Promise<AppResult<UserIdentifier, AppError>> {
    this.lastIdentifierId = identifierId
    return this.getIdentifierResultProvider(identifierId)
  }

  public async deleteIdentifier(userId: UserId, identifierId: string): Promise<AppResult<void, AppError>> {
    this.lastUserId = userId
    this.lastIdentifierId = identifierId
    return this.deleteIdentifierResultProvider(userId, identifierId)
  }

  public async deleteIdentifierPassword(userId: UserId, identifierId: string): Promise<AppResult<void, AppError>> {
    this.lastUserId = userId
    this.lastIdentifierId = identifierId
    return this.deleteIdentifierPasswordResultProvider(userId, identifierId)
  }
}
