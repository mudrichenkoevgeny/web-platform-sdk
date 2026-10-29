import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  OtpConfirmation,
  PagedResult,
  SelfIdentifierListParams,
  UserIdentifierId,
  UserIdentifierPrivate,
  UserIdentifierSummary
} from '@mudrichenkoevgeny/shared-foundation'
import type { IdentifierRepository } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { SelfManagementIdentifierRepository } from './self-management-identifier-repository'

/**
 * Adapter converting {@link SelfManagementIdentifierRepository} to the {@link IdentifierRepository} contract.
 */
export class SelfManagementIdentifierRepositoryAdapter implements IdentifierRepository {
  /**
   * Constructs a new {@link SelfManagementIdentifierRepositoryAdapter}.
   *
   * @param repository - Underlying self management identifier repository
   */
  public constructor(private readonly repository: SelfManagementIdentifierRepository) {}

  /**
   * Retrieves specific identifier details by its unique id.
   *
   * @param userIdentifierId - Unique identifier id
   * @returns Detailed identifier info
   */
  public async getUserIdentifier(userIdentifierId: UserIdentifierId): Promise<AppResult<UserIdentifierPrivate, AppError>> {
    return this.repository.getUserIdentifier(userIdentifierId)
  }

  /**
   * Returns a paginated and filtered list of identifiers.
   *
   * @param params - Self identifier list parameters
   * @returns Paginated result
   */
  public async getUserIdentifiers(
    params?: SelfIdentifierListParams | null
  ): Promise<AppResult<PagedResult<UserIdentifierSummary>, AppError>> {
    return this.repository.getUserIdentifiers(params)
  }

  /**
   * Updates the management account password using current credentials.
   *
   * @param userIdentifierId - Unique identifier ID
   * @param oldPassword - Current password
   * @param newPassword - New password
   * @returns Void result
   */
  public async emailChangePassword(userIdentifierId: UserIdentifierId, oldPassword: string, newPassword: string): Promise<AppResult<void, AppError>> {
    return this.repository.emailChangePassword(userIdentifierId, oldPassword, newPassword)
  }

  /**
   * Unsupported in self-management context.
   */
  public async deleteUserIdentifier(_identifierId: UserIdentifierId): Promise<AppResult<void, AppError>> {
    return appResultFailure(CommonError.unknown(false))
  }

  /**
   * Unsupported in self-management context.
   */
  public async deletePassword(_userIdentifierId: UserIdentifierId): Promise<AppResult<void, AppError>> {
    return appResultFailure(CommonError.unknown(false))
  }

  /**
   * Unsupported in self-management context.
   */
  public async addUserIdentifierEmail(_email: string, _password: string, _confirmationCode: string): Promise<AppResult<UserIdentifierPrivate, AppError>> {
    return appResultFailure(CommonError.unknown(false))
  }

  /**
   * Unsupported in self-management context.
   */
  public async addUserIdentifierPhone(_phoneNumber: string, _confirmationCode: string): Promise<AppResult<UserIdentifierPrivate, AppError>> {
    return appResultFailure(CommonError.unknown(false))
  }

  /**
   * Unsupported in self-management context.
   */
  public async addUserIdentifierExternalAuthProvider(_authProvider: string, _externalProviderToken: string): Promise<AppResult<UserIdentifierPrivate, AppError>> {
    return appResultFailure(CommonError.unknown(false))
  }

  /**
   * Unsupported in self-management context.
   */
  public async sendAddEmailIdentifierConfirmation(_email: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return appResultFailure(CommonError.unknown(false))
  }

  /**
   * Unsupported in self-management context.
   */
  public async sendAddPhoneIdentifierConfirmation(_phoneNumber: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return appResultFailure(CommonError.unknown(false))
  }

  /**
   * Unsupported in self-management context.
   */
  public getRemainingEmailConfirmationDelayInSeconds(_email: string): number {
    return 0
  }

  /**
   * Unsupported in self-management context.
   */
  public getRemainingPhoneNumberConfirmationDelayInSeconds(_phoneNumber: string): number {
    return 0
  }
}
