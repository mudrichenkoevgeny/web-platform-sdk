import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  PagedResult,
  SelfIdentifierListParams,
  UserIdentifierId,
  UserIdentifierPrivate,
  UserIdentifierSummary
} from '@mudrichenkoevgeny/shared-foundation'

/** Repository interface for managing user identifiers in self-management context. */
export interface SelfManagementIdentifierRepository {
  /**
   * Retrieves specific identifier details by its unique id.
   *
   * @param userIdentifierId - Unique identifier id
   * @returns Detailed identifier info or a mapped failure
   */
  getUserIdentifier(userIdentifierId: UserIdentifierId): Promise<AppResult<UserIdentifierPrivate, AppError>>

  /**
   * Returns a paginated and filtered list of identifiers linked to the current authenticated management account.
   *
   * @param params - Self identifier list parameters
   * @returns Paginated result containing matching user identifier models, or a mapped failure
   */
  getUserIdentifiers(
    params?: SelfIdentifierListParams | null
  ): Promise<AppResult<PagedResult<UserIdentifierSummary>, AppError>>

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
