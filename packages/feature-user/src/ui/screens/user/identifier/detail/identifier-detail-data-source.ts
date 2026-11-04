import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserIdentifierId, UserIdentifierPrivate } from '@mudrichenkoevgeny/shared-foundation'

/** Interface representing a data source for user identifier detail retrieval and management. */
export interface IdentifierDetailDataSource {
  /** Fetches private details for a specific user identifier. */
  getIdentifier(
    identifierId: UserIdentifierId
  ): Promise<AppResult<UserIdentifierPrivate, AppError>>
  /** Optional method to delete a user identifier. */
  deleteIdentifier?(identifierId: UserIdentifierId): Promise<AppResult<void, AppError>>
  /** Optional method to change email password. */
  changePassword?(
    identifierId: UserIdentifierId,
    oldPass: string,
    newPass: string
  ): Promise<AppResult<void, AppError>>
  /** Optional method to delete email password credentials. */
  deletePassword?(identifierId: UserIdentifierId): Promise<AppResult<void, AppError>>
  /** Flag indicating whether identifier deletion is available. */
  isDeleteAvailable?: boolean
  /** Flag indicating whether changing password is available. */
  isChangePasswordAvailable?: boolean
  /** Flag indicating whether deleting password credentials is available. */
  isDeletePasswordAvailable?: boolean
}

/** Dependencies required to construct a self-identifier {@link IdentifierDetailDataSource}. */
export interface SelfIdentifierDetailDataSourceDeps {
  getIdentifierUseCase: {
    execute(identifierId: UserIdentifierId): Promise<AppResult<UserIdentifierPrivate, AppError>>
  }
  deleteIdentifierUseCase?: {
    execute(identifierId: UserIdentifierId): Promise<AppResult<void, AppError>>
  }
  changePasswordUseCase?: {
    execute(
      identifierId: UserIdentifierId,
      oldPassword: string,
      newPassword: string
    ): Promise<AppResult<void, AppError>>
  }
  deletePasswordUseCase?: {
    execute(identifierId: UserIdentifierId): Promise<AppResult<void, AppError>>
  }
}

/**
 * Factory creating an {@link IdentifierDetailDataSource} for self-identifier operations.
 *
 * @param deps - Self identifier detail data source dependencies.
 * @returns Configured IdentifierDetailDataSource instance.
 */
export const createSelfIdentifierDetailDataSource = (
  deps: SelfIdentifierDetailDataSourceDeps
): IdentifierDetailDataSource => ({
  getIdentifier: (id) => deps.getIdentifierUseCase.execute(id),
  deleteIdentifier: deps.deleteIdentifierUseCase
    ? (id) => deps.deleteIdentifierUseCase!.execute(id)
    : undefined,
  changePassword: deps.changePasswordUseCase
    ? (id, oldPass, newPass) =>
        deps.changePasswordUseCase!.execute(id, oldPass, newPass)
    : undefined,
  deletePassword: deps.deletePasswordUseCase
    ? (id) => deps.deletePasswordUseCase!.execute(id)
    : undefined,
  isDeleteAvailable: Boolean(deps.deleteIdentifierUseCase),
  isChangePasswordAvailable: Boolean(deps.changePasswordUseCase),
  isDeletePasswordAvailable: Boolean(deps.deletePasswordUseCase)
})

/** Dependencies required to construct a management identifier {@link IdentifierDetailDataSource}. */
export interface ManagementIdentifierDetailDataSourceDeps {
  managementGetIdentifierUseCase: {
    execute(identifierId: UserIdentifierId): Promise<AppResult<UserIdentifierPrivate, AppError>>
  }
  managementDeleteIdentifierUseCase?: {
    execute(identifierId: UserIdentifierId): Promise<AppResult<void, AppError>>
  }
  managementDeletePasswordUseCase?: {
    execute(identifierId: UserIdentifierId): Promise<AppResult<void, AppError>>
  }
}

/**
 * Factory creating an {@link IdentifierDetailDataSource} for management identifier operations.
 *
 * @param deps - Management identifier detail data source dependencies.
 * @returns Configured IdentifierDetailDataSource instance.
 */
export const createManagementIdentifierDetailDataSource = (
  deps: ManagementIdentifierDetailDataSourceDeps
): IdentifierDetailDataSource => ({
  getIdentifier: (id) => deps.managementGetIdentifierUseCase.execute(id),
  deleteIdentifier: deps.managementDeleteIdentifierUseCase
    ? (id) => deps.managementDeleteIdentifierUseCase!.execute(id)
    : undefined,
  deletePassword: deps.managementDeletePasswordUseCase
    ? (id) => deps.managementDeletePasswordUseCase!.execute(id)
    : undefined,
  isDeleteAvailable: Boolean(deps.managementDeleteIdentifierUseCase),
  isChangePasswordAvailable: false,
  isDeletePasswordAvailable: Boolean(deps.managementDeletePasswordUseCase)
})
