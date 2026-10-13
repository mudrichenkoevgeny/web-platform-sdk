import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ManagementGlobalIdentifierListParams,
  ManagementUserIdentifierListParams,
  PagedResult,
  UserId,
  UserIdentifierId,
  UserIdentifierPrivatePayload,
  UserIdentifierSummaryPayload
} from '@mudrichenkoevgeny/shared-foundation'

/** Administrative user identifiers management. */
export interface ManagementIdentifierApi {
  /**
   * Returns a paginated and filtered list of identifiers based on search criteria.
   *
   * @param params - Query parameters for global or user-specific identifiers list
   * @returns Paginated result containing matching identifier summary payloads, or a mapped failure
   */
  getIdentifiers(
    params?: ManagementGlobalIdentifierListParams | ManagementUserIdentifierListParams | null
  ): Promise<AppResult<PagedResult<UserIdentifierSummaryPayload>, AppError>>

  /**
   * Retrieves specific identifier details.
   *
   * @param identifierId - Unique identifier record ID
   * @returns Detailed information of the target identifier, or a mapped failure
   */
  getIdentifier(identifierId: UserIdentifierId): Promise<AppResult<UserIdentifierPrivatePayload, AppError>>

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
