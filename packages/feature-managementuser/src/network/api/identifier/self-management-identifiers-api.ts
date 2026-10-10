import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  EmailPasswordChangeRequest,
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserIdentifierId,
  UserIdentifierPrivatePayload,
  UserIdentifierSummaryPayload,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'

/** Manage user identifiers (email, phone, external providers) and related confirmations. */
export interface SelfManagementIdentifiersApi {
  /**
   * Retrieves specific identifier details by its unique id.
   *
   * @param userIdentifierId - Unique identifier payload id
   * @returns Detailed identifier info or a mapped failure
   */
  getUserIdentifier(userIdentifierId: UserIdentifierId): Promise<AppResult<UserIdentifierPrivatePayload, AppError>>

  /**
   * Returns a paginated and filtered list of identifiers linked to the current authenticated management account.
   *
   * @param pageNumber - One-based page index
   * @param pageSize - Maximum items returned per page
   * @param sortBy - Field to sort by
   * @param sortOrder - Sorting direction
   * @param userAuthProviders - Filters by specific provider types
   * @param identifiers - Filters by substring patterns of identifier values
   * @returns Paginated result containing matching user identifier summary payloads, or a mapped failure
   */
  getUserIdentifiers(
    pageNumber?: number | null,
    pageSize?: number | null,
    sortBy?: UserSortValues.UserIdentifierSortBy | null,
    sortOrder?: SortOrder | null,
    userAuthProviders?: UserAuthProvider[] | null,
    identifiers?: string[] | null
  ): Promise<AppResult<PagedResult<UserIdentifierSummaryPayload>, AppError>>

  /**
   * Updates the management account password using current credentials.
   *
   * @param request - Current and new password payload from the shared contract
   * @returns Void result or a mapped failure
   */
  emailChangePassword(request: EmailPasswordChangeRequest): Promise<AppResult<void, AppError>>
}
