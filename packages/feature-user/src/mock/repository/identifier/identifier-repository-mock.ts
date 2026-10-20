import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { createTestPagedResult, createTestUserIdentifierPrivate, createTestUserIdentifierSummaryList } from '@mudrichenkoevgeny/shared-foundation'
import type {
  PagedResult,
  SelfIdentifierListParams,
  UserIdentifierId,
  UserIdentifierPrivate,
  UserIdentifierSummary
} from '@mudrichenkoevgeny/shared-foundation'
import type { IdentifierRepository } from '@/repository/identifier/identifier-repository'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Mock implementation of {@link IdentifierRepository}.
 */
export class IdentifierRepositoryMock implements IdentifierRepository {
  public getUserIdentifierResultProvider: (userIdentifierId: UserIdentifierId) => Promise<AppResult<UserIdentifierPrivate, AppError>> = async () =>
    appResultSuccess(createTestUserIdentifierPrivate())

  public getUserIdentifiersResultProvider: () => Promise<AppResult<PagedResult<UserIdentifierSummary>, AppError>> = async () =>
    appResultSuccess(createTestPagedResult({ items: createTestUserIdentifierSummaryList(2) }))

  public deleteUserIdentifierResultProvider: (identifierId: UserIdentifierId) => Promise<AppResult<void, AppError>> = async () =>
    appResultSuccess(undefined)

  public deletePasswordResultProvider: (userIdentifierId: UserIdentifierId) => Promise<AppResult<void, AppError>> = async () =>
    appResultSuccess(undefined)

  public addUserIdentifierResultProvider: () => Promise<AppResult<UserIdentifierPrivate, AppError>> = async () =>
    appResultSuccess(createTestUserIdentifierPrivate())

  public otpConfirmationResultProvider: () => Promise<AppResult<OtpConfirmation, AppError>> = async () =>
    appResultSuccess({ retryAfterSeconds: 0, numberOfSymbols: 6, expirationSeconds: 300 })

  public emailChangePasswordResultProvider: () => Promise<AppResult<void, AppError>> = async () =>
    appResultSuccess(undefined)

  public lastIdentifierId: UserIdentifierId | null = null
  public lastEmail: string | null = null
  public lastPassword: string | null = null
  public lastConfirmationCode: string | null = null
  public lastPhoneNumber: string | null = null
  public lastAuthProvider: string | null = null
  public lastToken: string | null = null
  public lastOldPassword: string | null = null
  public lastNewPassword: string | null = null

  public async getUserIdentifier(userIdentifierId: UserIdentifierId): Promise<AppResult<UserIdentifierPrivate, AppError>> {
    this.lastIdentifierId = userIdentifierId
    return this.getUserIdentifierResultProvider(userIdentifierId)
  }

  public async getUserIdentifiers(
    _params?: SelfIdentifierListParams | null
  ): Promise<AppResult<PagedResult<UserIdentifierSummary>, AppError>> {
    return this.getUserIdentifiersResultProvider()
  }

  public async deleteUserIdentifier(identifierId: UserIdentifierId): Promise<AppResult<void, AppError>> {
    this.lastIdentifierId = identifierId
    return this.deleteUserIdentifierResultProvider(identifierId)
  }

  public async deletePassword(userIdentifierId: UserIdentifierId): Promise<AppResult<void, AppError>> {
    this.lastIdentifierId = userIdentifierId
    return this.deletePasswordResultProvider(userIdentifierId)
  }

  public async addUserIdentifierEmail(
    email: string,
    password: string,
    confirmationCode: string
  ): Promise<AppResult<UserIdentifierPrivate, AppError>> {
    this.lastEmail = email
    this.lastPassword = password
    this.lastConfirmationCode = confirmationCode
    return this.addUserIdentifierResultProvider()
  }

  public async addUserIdentifierPhone(
    phoneNumber: string,
    confirmationCode: string
  ): Promise<AppResult<UserIdentifierPrivate, AppError>> {
    this.lastPhoneNumber = phoneNumber
    this.lastConfirmationCode = confirmationCode
    return this.addUserIdentifierResultProvider()
  }

  public async addUserIdentifierExternalAuthProvider(
    authProvider: string,
    externalProviderToken: string
  ): Promise<AppResult<UserIdentifierPrivate, AppError>> {
    this.lastAuthProvider = authProvider
    this.lastToken = externalProviderToken
    return this.addUserIdentifierResultProvider()
  }

  public async sendAddEmailIdentifierConfirmation(email: string): Promise<AppResult<OtpConfirmation, AppError>> {
    this.lastEmail = email
    return this.otpConfirmationResultProvider()
  }

  public async sendAddPhoneIdentifierConfirmation(phoneNumber: string): Promise<AppResult<OtpConfirmation, AppError>> {
    this.lastPhoneNumber = phoneNumber
    return this.otpConfirmationResultProvider()
  }

  public async emailChangePassword(
    _userIdentifierId: UserIdentifierId,
    oldPassword: string,
    newPassword: string
  ): Promise<AppResult<void, AppError>> {
    this.lastOldPassword = oldPassword
    this.lastNewPassword = newPassword
    return this.emailChangePasswordResultProvider()
  }

  public getRemainingEmailConfirmationDelayInSeconds(): number {
    return 0
  }

  public getRemainingPhoneNumberConfirmationDelayInSeconds(): number {
    return 0
  }
}
