import { mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
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
    params?: ManagementGlobalIdentifierListParams | ManagementUserIdentifierListParams | null
  ): Promise<AppResult<PagedResult<UserIdentifierSummary>, AppError>> {
    const result = await this.managementIdentifierApi.getIdentifiers(params)
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
