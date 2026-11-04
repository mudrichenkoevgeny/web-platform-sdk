import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AvailableAuthProviders,
  OtpConfirmation,
  PagedResult,
  SelfIdentifierListParams,
  UserIdentifierPrivate,
  UserIdentifierSummary
} from '@mudrichenkoevgeny/shared-foundation'

/** Structured query input representing current identifier list query parameters. */
export interface IdentifierListQuery {
  pageNumber: number
  userId?: string | null
}

/** Interface representing a data source for user identifier listing and addition actions. */
export interface IdentifierListDataSource {
  /** Fetches a paginated list of user identifiers. */
  getIdentifiers(
    query: IdentifierListQuery
  ): Promise<AppResult<PagedResult<UserIdentifierSummary>, AppError>>
  /** Optional method to fetch available auth providers for adding an identifier. */
  getAvailableAuthProviders?(): Promise<AppResult<AvailableAuthProviders, AppError>>
  /** Optional method to send email confirmation code for adding email identifier. */
  sendAddEmailConfirmation?(email: string): Promise<AppResult<unknown, AppError>>
  /** Optional method to add email identifier. */
  addEmailIdentifier?(params: {
    email: string
    code: string
    password: string
  }): Promise<AppResult<UserIdentifierSummary, AppError>>
  /** Optional method to send phone confirmation code for adding phone identifier. */
  sendAddPhoneConfirmation?(phoneNumber: string): Promise<AppResult<unknown, AppError>>
  /** Optional method to add phone identifier. */
  addPhoneIdentifier?(params: {
    phoneNumber: string
    code: string
  }): Promise<AppResult<UserIdentifierSummary, AppError>>
  /** Optional method to add Google identifier. */
  addGoogleIdentifier?(): Promise<AppResult<UserIdentifierSummary, AppError>>
  /** Flag indicating whether adding identifiers is available. */
  isAddIdentifierAvailable?: boolean
}

/** Dependencies required to construct a self-identifier {@link IdentifierListDataSource}. */
export interface SelfIdentifierListDataSourceDeps {
  getIdentifiersUseCase: {
    execute(
      params?: SelfIdentifierListParams | null
    ): Promise<AppResult<PagedResult<UserIdentifierSummary>, AppError>>
  }
  getAvailableUserAuthProvidersUseCase?: {
    execute(): Promise<AppResult<AvailableAuthProviders, AppError>>
  }
  sendAddEmailIdentifierConfirmationUseCase?: {
    execute(email: string): Promise<AppResult<OtpConfirmation, AppError>>
  }
  addEmailIdentifierUseCase?: {
    execute(
      email: string,
      password: string,
      confirmationCode: string
    ): Promise<AppResult<UserIdentifierPrivate, AppError>>
  }
  sendAddPhoneIdentifierConfirmationUseCase?: {
    execute(phoneNumber: string): Promise<AppResult<OtpConfirmation, AppError>>
  }
  addPhoneIdentifierUseCase?: {
    execute(
      phoneNumber: string,
      confirmationCode: string
    ): Promise<AppResult<UserIdentifierPrivate, AppError>>
  }
  addGoogleIdentifierUseCase?: {
    execute(): Promise<AppResult<UserIdentifierPrivate, AppError>>
  }
}

/**
 * Factory creating an {@link IdentifierListDataSource} for self-identifier operations.
 *
 * @param deps - Self identifier list data source dependencies.
 * @returns Configured IdentifierListDataSource instance.
 */
export const createSelfIdentifierListDataSource = (
  deps: SelfIdentifierListDataSourceDeps
): IdentifierListDataSource => ({
  getIdentifiers: (query) =>
    deps.getIdentifiersUseCase.execute({ pageNumber: query.pageNumber }),
  getAvailableAuthProviders: deps.getAvailableUserAuthProvidersUseCase
    ? () => deps.getAvailableUserAuthProvidersUseCase!.execute()
    : undefined,
  sendAddEmailConfirmation: deps.sendAddEmailIdentifierConfirmationUseCase
    ? (email) => deps.sendAddEmailIdentifierConfirmationUseCase!.execute(email)
    : undefined,
  addEmailIdentifier: deps.addEmailIdentifierUseCase
    ? (params) =>
        deps.addEmailIdentifierUseCase!.execute(params.email, params.password, params.code)
    : undefined,
  sendAddPhoneConfirmation: deps.sendAddPhoneIdentifierConfirmationUseCase
    ? (phone) => deps.sendAddPhoneIdentifierConfirmationUseCase!.execute(phone)
    : undefined,
  addPhoneIdentifier: deps.addPhoneIdentifierUseCase
    ? (params) =>
        deps.addPhoneIdentifierUseCase!.execute(params.phoneNumber, params.code)
    : undefined,
  addGoogleIdentifier: deps.addGoogleIdentifierUseCase
    ? () => deps.addGoogleIdentifierUseCase!.execute()
    : undefined,
  isAddIdentifierAvailable: Boolean(deps.getAvailableUserAuthProvidersUseCase)
})

/** Dependencies required to construct a management identifier {@link IdentifierListDataSource}. */
export interface ManagementIdentifierListDataSourceDeps {
  managementGetIdentifiersUseCase: {
    execute(
      params?: { pageNumber?: number; userIds?: string[] } | null
    ): Promise<AppResult<PagedResult<UserIdentifierSummary>, AppError>>
  }
}

/**
 * Factory creating an {@link IdentifierListDataSource} for management identifier operations.
 *
 * @param deps - Management identifier list data source dependencies.
 * @returns Configured IdentifierListDataSource instance.
 */
export const createManagementIdentifierListDataSource = (
  deps: ManagementIdentifierListDataSourceDeps
): IdentifierListDataSource => ({
  getIdentifiers: (query) =>
    deps.managementGetIdentifiersUseCase.execute({
      pageNumber: query.pageNumber,
      userIds: query.userId ? [query.userId] : undefined
    }),
  isAddIdentifierAvailable: false
})
