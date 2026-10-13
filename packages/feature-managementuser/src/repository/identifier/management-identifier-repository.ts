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

/** Administrative repository for managing user identity identifiers across all accounts. */
export interface ManagementIdentifierRepository {
  /**
   * Returns a paginated and filtered list of identifiers based on search criteria.
   *
   * @param params - Query parameters for global or user-specific identifier list
   * @returns Paginated result containing matching user identifier summary models, or a mapped failure
   */
  getIdentifiers(
    params?: ManagementGlobalIdentifierListParams | ManagementUserIdentifierListParams | null
  ): Promise<AppResult<PagedResult<UserIdentifierSummary>, AppError>>

  /**
   * Retrieves specific identifier details.
   *
   * @param identifierId - Unique identifier record ID
   * @returns Detailed information of the target identifier, or a mapped failure
   */
  getIdentifier(identifierId: UserIdentifierId): Promise<AppResult<UserIdentifierPrivate, AppError>>

  /**
   * Removes the identifier record for the given user.
   *
   * @param userId - Unique identifier of the record owner
   * @param identifierId - Unique identifier record ID to delete
   * @returns Void result or a mapped failure
   */
  deleteIdentifier(userId: UserId, identifierId: UserIdentifierId): Promise<AppResult<void, AppError>>

  /**
   * Removes the password credential for the given user's identifier record.
   *
   * @param userId - Unique identifier of the record owner
   * @param identifierId - Unique identifier record ID to remove password for
   * @returns Void result or a mapped failure
   */
  deleteIdentifierPassword(userId: UserId, identifierId: UserIdentifierId): Promise<AppResult<void, AppError>>
}
