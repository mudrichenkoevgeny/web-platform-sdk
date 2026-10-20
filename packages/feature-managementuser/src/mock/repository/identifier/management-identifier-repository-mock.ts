import { createTestPagedResult, createTestUserIdentifierPrivate, createTestUserIdentifierSummaryList } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ManagementGlobalIdentifierListParams,
  ManagementUserIdentifierListParams,
  PagedResult,
  UserId,
  UserIdentifierId,
  UserIdentifierPrivate,
  UserIdentifierSummary
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementIdentifierRepository } from '@/repository/identifier/management-identifier-repository'

/** Mock implementation of {@link ManagementIdentifierRepository}. */
export class ManagementIdentifierRepositoryMock implements ManagementIdentifierRepository {
  public getIdentifiersResultProvider: () => Promise<AppResult<PagedResult<UserIdentifierSummary>, AppError>> = async () =>
    appResultSuccess(createTestPagedResult({
      items: createTestUserIdentifierSummaryList(2)
    }))

  public getIdentifierResultProvider: (identifierId: UserIdentifierId) => Promise<AppResult<UserIdentifierPrivate, AppError>> =
    async () => appResultSuccess(createTestUserIdentifierPrivate())

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
    _params?: ManagementGlobalIdentifierListParams | ManagementUserIdentifierListParams | null
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
