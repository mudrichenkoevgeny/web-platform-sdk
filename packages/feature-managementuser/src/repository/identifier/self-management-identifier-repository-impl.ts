import { mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserIdentifier,
  UserIdentifierId,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import { toUserIdentifier } from '@mudrichenkoevgeny/shared-foundation'
import type { SelfManagementIdentifiersApi } from '@/network/api/identifier/self-management-identifiers-api'
import type { SelfManagementIdentifierRepository } from '@/repository/identifier/self-management-identifier-repository'

/**
 * Implements {@link SelfManagementIdentifierRepository} using {@link SelfManagementIdentifiersApi}.
 */
export class SelfManagementIdentifierRepositoryImpl implements SelfManagementIdentifierRepository {
  /**
   * Constructs a new {@link SelfManagementIdentifierRepositoryImpl}.
   *
   * @param selfManagementIdentifiersApi - HTTP endpoints for self management identifiers
   */
  public constructor(private readonly selfManagementIdentifiersApi: SelfManagementIdentifiersApi) {}

  public async getUserIdentifier(userIdentifierId: UserIdentifierId): Promise<AppResult<UserIdentifier, AppError>> {
    const result = await this.selfManagementIdentifiersApi.getUserIdentifier(userIdentifierId)
    return mapSuccess(result, (payload) => toUserIdentifier(payload))
  }

  public async getUserIdentifiers(
    pageNumber?: number | null,
    pageSize?: number | null,
    sortBy?: UserSortValues.UserIdentifierSortBy | null,
    sortOrder?: SortOrder | null,
    userAuthProviders?: UserAuthProvider[] | null,
    identifiers?: string[] | null
  ): Promise<AppResult<PagedResult<UserIdentifier>, AppError>> {
    const result = await this.selfManagementIdentifiersApi.getUserIdentifiers(
      pageNumber,
      pageSize,
      sortBy,
      sortOrder,
      userAuthProviders,
      identifiers
    )
    return mapSuccess(result, (pagedPayload) => ({
      ...pagedPayload,
      items: pagedPayload.items.map((payload) => toUserIdentifier(payload))
    }))
  }

  public async emailChangePassword(
    email: string,
    oldPassword: string,
    newPassword: string
  ): Promise<AppResult<void, AppError>> {
    return this.selfManagementIdentifiersApi.emailChangePassword({
      email,
      old_password: oldPassword,
      new_password: newPassword
    })
  }
}
