import { mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserId,
  UserIdentifier,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import { toUserIdentifier } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementIdentifierApi } from '@/network/api/identifier/ManagementIdentifierApi'
import type { ManagementIdentifierRepository } from '@/repository/identifier/ManagementIdentifierRepository'

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
  ): Promise<AppResult<PagedResult<UserIdentifier>, AppError>> {
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
      items: pagedPayload.items.map((payload) => toUserIdentifier(payload))
    }))
  }

  public async getIdentifier(identifierId: string): Promise<AppResult<UserIdentifier, AppError>> {
    const result = await this.managementIdentifierApi.getIdentifier(identifierId)
    return mapSuccess(result, (payload) => toUserIdentifier(payload))
  }

  public async deleteIdentifier(userId: UserId, identifierId: string): Promise<AppResult<void, AppError>> {
    return this.managementIdentifierApi.deleteIdentifier(userId, identifierId)
  }

  public async deleteIdentifierPassword(userId: UserId, identifierId: string): Promise<AppResult<void, AppError>> {
    return this.managementIdentifierApi.deleteIdentifierPassword(userId, identifierId)
  }
}
