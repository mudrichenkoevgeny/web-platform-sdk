import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserId,
  UserIdentifier,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'

/** Administrative repository for managing user identity identifiers across all accounts. */
export interface ManagementIdentifierRepository {
  /**
   * Returns a paginated and filtered list of identifiers based on search criteria.
   *
   * @param pageNumber - One-based page index
   * @param pageSize - Maximum items returned per page
   * @param sortBy - Field to sort by
   * @param sortOrder - Sorting direction
   * @param userIds - Filters by specific user identifiers
   * @param userAuthProviders - Filters by authentication provider types
   * @param identifiers - Filters by server-defined free-text identifier values
   * @returns Paginated result containing matching user identifier models, or a mapped failure
   */
  getIdentifiers(
    pageNumber?: number | null,
    pageSize?: number | null,
    sortBy?: UserSortValues.UserIdentifierSortBy | null,
    sortOrder?: SortOrder | null,
    userIds?: string[] | null,
    userAuthProviders?: UserAuthProvider[] | null,
    identifiers?: string[] | null
  ): Promise<AppResult<PagedResult<UserIdentifier>, AppError>>

  /**
   * Retrieves specific identifier details.
   *
   * @param identifierId - Unique identifier record ID
   * @returns Detailed information of the target identifier, or a mapped failure
   */
  getIdentifier(identifierId: string): Promise<AppResult<UserIdentifier, AppError>>

  /**
   * Removes the identifier record for the given user.
   *
   * @param userId - Unique identifier of the record owner
   * @param identifierId - Unique identifier record ID to delete
   * @returns Void result or a mapped failure
   */
  deleteIdentifier(userId: UserId, identifierId: string): Promise<AppResult<void, AppError>>

  /**
   * Removes the password credential for the given user's identifier record.
   *
   * @param userId - Unique identifier of the record owner
   * @param identifierId - Unique identifier record ID to remove password for
   * @returns Void result or a mapped failure
   */
  deleteIdentifierPassword(userId: UserId, identifierId: string): Promise<AppResult<void, AppError>>
}
