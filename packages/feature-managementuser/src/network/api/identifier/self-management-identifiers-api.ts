import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  EmailPasswordChangeRequest,
  PagedResult,
  SelfIdentifierListParams,
  UserIdentifierId,
  UserIdentifierPrivatePayload,
  UserIdentifierSummaryPayload
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
   * @param params - Self identifier list parameters
   * @returns Paginated result containing matching user identifier summary payloads, or a mapped failure
   */
  getUserIdentifiers(
    params?: SelfIdentifierListParams | null
  ): Promise<AppResult<PagedResult<UserIdentifierSummaryPayload>, AppError>>

  /**
   * Updates the management account password using current credentials.
   *
   * @param userIdentifierId - Unique identifier payload ID
   * @param request - Current and new password payload from the shared contract
   * @returns Void result or a mapped failure
   */
  emailChangePassword(userIdentifierId: UserIdentifierId, request: EmailPasswordChangeRequest): Promise<AppResult<void, AppError>>
}
