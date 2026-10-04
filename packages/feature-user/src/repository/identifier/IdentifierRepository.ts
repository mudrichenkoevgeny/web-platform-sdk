import { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserIdentifierId,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'
import { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'

/** Parameters for filtering and paginating user identifiers. */
export interface GetUserIdentifiersParams {
  pageNumber?: number | null
  pageSize?: number | null
  sortBy?: UserSortValues.UserIdentifierSortBy | null
  sortOrder?: SortOrder | null
  userAuthProviders?: UserAuthProvider[] | null
  identifiers?: string[] | null
}

/**
 * Manages user identity identifiers, facilitating retrieval, pagination,
 * identifier lifecycle management, and security operations.
 */
export interface IdentifierRepository {
  /** Retrieves specific identifier details by its unique ID. */
  getUserIdentifier(userIdentifierId: UserIdentifierId): Promise<AppResult<UserIdentifier, AppError>>

  /** Returns a paginated and filtered list of identifiers. */
  getUserIdentifiers(params?: GetUserIdentifiersParams): Promise<AppResult<PagedResult<UserIdentifier>, AppError>>

  /** Removes an existing identifier from user profile. */
  deleteUserIdentifier(identifierId: UserIdentifierId): Promise<AppResult<void, AppError>>

  /** Associates a new email identifier with account. */
  addUserIdentifierEmail(email: string, password: string, confirmationCode: string): Promise<AppResult<UserIdentifier, AppError>>

  /** Associates a new phone number identifier with account. */
  addUserIdentifierPhone(phoneNumber: string, confirmationCode: string): Promise<AppResult<UserIdentifier, AppError>>

  /** Associates an external authentication provider identifier. */
  addUserIdentifierExternalAuthProvider(authProvider: string, externalProviderToken: string): Promise<AppResult<UserIdentifier, AppError>>

  /** Triggers a confirmation challenge for email association. */
  sendAddEmailIdentifierConfirmation(email: string): Promise<AppResult<OtpConfirmation, AppError>>

  /** Triggers a confirmation challenge for phone association. */
  sendAddPhoneIdentifierConfirmation(phoneNumber: string): Promise<AppResult<OtpConfirmation, AppError>>

  /** Updates account password using current credentials. */
  emailChangePassword(email: string, oldPassword: string, newPassword: string): Promise<AppResult<void, AppError>>

  /** Returns remaining cooldown for email confirmation requests. */
  getRemainingEmailConfirmationDelayInSeconds(email: string): number

  /** Returns remaining cooldown for phone confirmation requests. */
  getRemainingPhoneNumberConfirmationDelayInSeconds(phoneNumber: string): number
}
