import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  OtpConfirmationPayload,
  PagedResult,
  SelfIdentifierListParams,
  UserIdentifierId,
  UserIdentifierPrivatePayload,
  UserIdentifierSummaryPayload
} from '@mudrichenkoevgeny/shared-foundation'

/** Manage user identifiers (email, phone, external providers) and related confirmations. */
export interface OpenIdentifiersApi {
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
   * @param params - Self identifier list query parameters
   * @returns Paginated result containing matching user identifier payloads, or a mapped failure
   */
  getUserIdentifiers(
    params?: SelfIdentifierListParams | null
  ): Promise<AppResult<PagedResult<UserIdentifierSummaryPayload>, AppError>>

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
   * @param email - Target email
   * @param password - Account password
   * @param confirmationCode - Confirmation code
   * @returns Created or pending identifier row, or a mapped failure
   */
  addUserIdentifierEmail(
    email: string,
    password: string,
    confirmationCode: string
  ): Promise<AppResult<UserIdentifierPrivatePayload, AppError>>

  /**
   * Starts linking a new phone identifier to the account.
   *
   * @param phoneNumber - Target phone number
   * @param confirmationCode - Confirmation code
   * @returns Created or pending identifier row, or a mapped failure
   */
  addUserIdentifierPhone(
    phoneNumber: string,
    confirmationCode: string
  ): Promise<AppResult<UserIdentifierPrivatePayload, AppError>>

  /**
   * Starts linking an external auth provider identity to the account.
   *
   * @param authProvider - Provider type
   * @param externalProviderToken - OAuth token
   * @returns Created or pending identifier row, or a mapped failure
   */
  addUserIdentifierExternalAuthProvider(
    authProvider: string,
    externalProviderToken: string
  ): Promise<AppResult<UserIdentifierPrivatePayload, AppError>>

  /**
   * Sends a confirmation message for adding an email identifier.
   *
   * @param email - Target email
   * @returns Confirmation dispatch result, or a mapped failure
   */
  sendAddEmailIdentifierConfirmation(
    email: string
  ): Promise<AppResult<OtpConfirmationPayload, AppError>>

  /**
   * Sends a confirmation message for adding a phone identifier.
   *
   * @param phoneNumber - Target phone number
   * @returns Confirmation dispatch result, or a mapped failure
   */
  sendAddPhoneIdentifierConfirmation(
    phoneNumber: string
  ): Promise<AppResult<OtpConfirmationPayload, AppError>>

  /**
   * Changes the password for the target email identifier.
   *
   * @param userIdentifierId - Unique user identifier ID
   * @param oldPassword - Current password
   * @param newPassword - New password
   * @returns Void result or a mapped failure
   */
  emailChangePassword(userIdentifierId: UserIdentifierId, oldPassword: string, newPassword: string): Promise<AppResult<void, AppError>>
}
