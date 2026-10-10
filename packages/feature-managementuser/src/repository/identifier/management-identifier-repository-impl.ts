import { mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
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
import { toUserIdentifierPrivate, toUserIdentifierSummary } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementIdentifierApi } from '@/network/api/identifier/management-identifier-api'
import type { ManagementIdentifierRepository } from '@/repository/identifier/management-identifier-repository'

/**
 * Implementation of {@link ManagementIdentifierRepository}.
 */
export class ManagementIdentifierRepositoryImpl implements ManagementIdentifierRepository {
  /**
   * Constructs a new {@link ManagementIdentifierRepositoryImpl}.
   *
   * @param managementIdentifierApi - Network API source
   */
  public constructor(private readonly managementIdentifierApi: ManagementIdentifierApi) {}

  public async getIdentifiers(
    pageNumber?: number | null,
    pageSize?: number | null,
    sortBy?: UserSortValues.UserIdentifierSortBy | null,
    sortOrder?: SortOrder | null,
    userIds?: string[] | null,
    userAuthProviders?: UserAuthProvider[] | null,
    identifiers?: string[] | null
  ): Promise<AppResult<PagedResult<UserIdentifierSummary>, AppError>> {
    const result = await this.managementIdentifierApi.getIdentifiers(
      pageNumber,
      pageSize,
      sortBy,
      sortOrder,
      userIds,
      userAuthProviders,
      identifiers
    )
    return mapSuccess(result, (pagedPayload) => ({
      ...pagedPayload,
      items: pagedPayload.items.map((payload) => toUserIdentifierSummary(payload))
    }))
  }

  public async getIdentifier(identifierId: UserIdentifierId): Promise<AppResult<UserIdentifierPrivate, AppError>> {
    const result = await this.managementIdentifierApi.getIdentifier(identifierId)
    return mapSuccess(result, (payload) => toUserIdentifierPrivate(payload))
  }

  public async deleteIdentifier(userId: UserId, identifierId: UserIdentifierId): Promise<AppResult<void, AppError>> {
    return this.managementIdentifierApi.deleteIdentifier(userId, identifierId)
  }

  public async deleteIdentifierPassword(userId: UserId, identifierId: UserIdentifierId): Promise<AppResult<void, AppError>> {
    return this.managementIdentifierApi.deleteIdentifierPassword(userId, identifierId)
  }
}
