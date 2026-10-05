import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserIdentifier,
  UserIdentifierId,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'

/** Repository interface for managing user identifiers in self-management context. */
export interface SelfManagementIdentifierRepository {
  /**
   * Retrieves specific identifier details by its unique id.
   *
   * @param userIdentifierId - Unique identifier id
   * @returns Detailed identifier info or a mapped failure
   */
  getUserIdentifier(userIdentifierId: UserIdentifierId): Promise<AppResult<UserIdentifier, AppError>>

  /**
   * Returns a paginated and filtered list of identifiers linked to the current authenticated management account.
   *
   * @param pageNumber - One-based page index
   * @param pageSize - Maximum items returned per page
   * @param sortBy - Field to sort by
   * @param sortOrder - Sorting direction
   * @param userAuthProviders - Filters by specific provider types
   * @param identifiers - Filters by substring patterns of identifier values
   * @returns Paginated result containing matching user identifier models, or a mapped failure
   */
  getUserIdentifiers(
    pageNumber?: number | null,
    pageSize?: number | null,
    sortBy?: UserSortValues.UserIdentifierSortBy | null,
    sortOrder?: SortOrder | null,
    userAuthProviders?: UserAuthProvider[] | null,
    identifiers?: string[] | null
  ): Promise<AppResult<PagedResult<UserIdentifier>, AppError>>

  /**
   * Updates the management account password using current credentials.
   *
   * @param email - User email address
   * @param oldPassword - Current password
   * @param newPassword - New password
   * @returns Void result or a mapped failure
   */
  emailChangePassword(email: string, oldPassword: string, newPassword: string): Promise<AppResult<void, AppError>>
}
