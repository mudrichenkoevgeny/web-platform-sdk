import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AddUserIdentifierEmailRequest,
  AddUserIdentifierExternalAuthProviderRequest,
  AddUserIdentifierPhoneRequest,
  EmailPasswordChangeRequest,
  OtpConfirmationPayload,
  PagedResult,
  SendConfirmationToEmailRequest,
  SendConfirmationToPhoneRequest,
  SortOrder,
  UserAuthProvider,
  UserIdentifierId,
  UserIdentifierPayload,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'

/** Manage user identifiers (email, phone, external providers) and related confirmations. */
export interface OpenIdentifiersApi {
  /**
   * Retrieves specific identifier details by its unique id.
   *
   * @param userIdentifierId - Unique identifier payload id
   * @returns Detailed identifier info or a mapped failure
   */
  getUserIdentifier(userIdentifierId: UserIdentifierId): Promise<AppResult<UserIdentifierPayload, AppError>>

  /**
   * Returns a paginated and filtered list of identifiers linked to the current authenticated management account.
   *
   * @param pageNumber - One-based page index
   * @param pageSize - Maximum items returned per page
   * @param sortBy - Field to sort by
   * @param sortOrder - Sorting direction
   * @param userAuthProviders - Filters by specific provider types
   * @param identifiers - Filters by substring patterns of identifier values
   * @returns Paginated result containing matching user identifier payloads, or a mapped failure
   */
  getUserIdentifiers(
    pageNumber?: number | null,
    pageSize?: number | null,
    sortBy?: UserSortValues.UserIdentifierSortBy | null,
    sortOrder?: SortOrder | null,
    userAuthProviders?: UserAuthProvider[] | null,
    identifiers?: string[] | null
  ): Promise<AppResult<PagedResult<UserIdentifierPayload>, AppError>>

  /**
   * Removes an identifier from the account.
   *
   * @param identifierId - Server identifier of the user-identifier row to delete
   * @returns Void result or a mapped failure
   */
  deleteUserIdentifier(identifierId: UserIdentifierId): Promise<AppResult<void, AppError>>

  /**
   * Starts linking a new email identifier to the account.
   *
   * @param request - Email linkage payload from the shared contract
   * @returns Created or pending identifier row, or a mapped failure
   */
  addUserIdentifierEmail(
    request: AddUserIdentifierEmailRequest
  ): Promise<AppResult<UserIdentifierPayload, AppError>>

  /**
   * Starts linking a new phone identifier to the account.
   *
   * @param request - Phone linkage payload from the shared contract
   * @returns Created or pending identifier row, or a mapped failure
   */
  addUserIdentifierPhone(
    request: AddUserIdentifierPhoneRequest
  ): Promise<AppResult<UserIdentifierPayload, AppError>>

  /**
   * Starts linking an external auth provider identity to the account.
   *
   * @param request - Provider linkage payload from the shared contract
   * @returns Created or pending identifier row, or a mapped failure
   */
  addUserIdentifierExternalAuthProvider(
    request: AddUserIdentifierExternalAuthProviderRequest
  ): Promise<AppResult<UserIdentifierPayload, AppError>>

  /**
   * Sends a confirmation message for adding an email identifier.
   *
   * @param request - Target email and template parameters
   * @returns Confirmation dispatch result, or a mapped failure
   */
  sendAddEmailIdentifierConfirmation(
    request: SendConfirmationToEmailRequest
  ): Promise<AppResult<OtpConfirmationPayload, AppError>>

  /**
   * Sends a confirmation message for adding a phone identifier.
   *
   * @param request - Target phone and channel details
   * @returns Confirmation dispatch result, or a mapped failure
   */
  sendAddPhoneIdentifierConfirmation(
    request: SendConfirmationToPhoneRequest
  ): Promise<AppResult<OtpConfirmationPayload, AppError>>

  /**
   * Changes the password for the signed-in user.
   *
   * @param request - Current and new password payload from the shared contract
   * @returns Void result or a mapped failure
   */
  emailChangePassword(request: EmailPasswordChangeRequest): Promise<AppResult<void, AppError>>
}
