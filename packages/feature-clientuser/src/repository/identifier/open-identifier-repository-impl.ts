import { mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  OtpConfirmation,
  PagedResult,
  SelfIdentifierListParams,
  UserIdentifierId,
  UserIdentifierPrivate,
  UserIdentifierSummary
} from '@mudrichenkoevgeny/shared-foundation'
import {
  ConfirmationType,
  toOtpConfirmation,
  toUserIdentifierPrivate,
  toUserIdentifierSummary
} from '@mudrichenkoevgeny/shared-foundation'
import type {
  ConfirmationRepository,
  IdentifierRepository
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { OpenIdentifiersApi } from '@/network/api/identifier/open-identifiers-api'

/**
 * Implements {@link IdentifierRepository} using {@link OpenIdentifiersApi} and {@link ConfirmationRepository} for throttled confirmation sends.
 */
export class OpenIdentifierRepositoryImpl implements IdentifierRepository {
  /**
   * Constructs a new {@link OpenIdentifierRepositoryImpl}.
   *
   * @param openIdentifiersApi - HTTP endpoints for managing user identifiers and sending confirmations
   * @param confirmationRepository - Client-side cooldown manager for adding email and phone identifiers
   */
  public constructor(
    private readonly openIdentifiersApi: OpenIdentifiersApi,
    private readonly confirmationRepository: ConfirmationRepository
  ) {}

  public async getUserIdentifier(userIdentifierId: UserIdentifierId): Promise<AppResult<UserIdentifierPrivate, AppError>> {
    const result = await this.openIdentifiersApi.getUserIdentifier(userIdentifierId)
    return mapSuccess(result, (payload) => toUserIdentifierPrivate(payload))
  }

  public async getUserIdentifiers(
    params?: SelfIdentifierListParams | null
  ): Promise<AppResult<PagedResult<UserIdentifierSummary>, AppError>> {
    const result = await this.openIdentifiersApi.getUserIdentifiers(params)
    return mapSuccess(result, (pagedPayload) => ({
      ...pagedPayload,
      items: pagedPayload.items.map((payload) => toUserIdentifierSummary(payload))
    }))
  }

  public async deleteUserIdentifier(identifierId: UserIdentifierId): Promise<AppResult<void, AppError>> {
    return this.openIdentifiersApi.deleteUserIdentifier(identifierId)
  }

  public async deletePassword(userIdentifierId: UserIdentifierId): Promise<AppResult<void, AppError>> {
    return this.openIdentifiersApi.deletePassword(userIdentifierId)
  }

  public async addUserIdentifierEmail(
    email: string,
    password: string,
    confirmationCode: string
  ): Promise<AppResult<UserIdentifierPrivate, AppError>> {
    const result = await this.openIdentifiersApi.addUserIdentifierEmail(email, password, confirmationCode)
    return mapSuccess(result, (payload) => toUserIdentifierPrivate(payload))
  }

  public async addUserIdentifierPhone(
    phoneNumber: string,
    confirmationCode: string
  ): Promise<AppResult<UserIdentifierPrivate, AppError>> {
    const result = await this.openIdentifiersApi.addUserIdentifierPhone(phoneNumber, confirmationCode)
    return mapSuccess(result, (payload) => toUserIdentifierPrivate(payload))
  }

  public async addUserIdentifierExternalAuthProvider(
    authProvider: string,
    externalProviderToken: string
  ): Promise<AppResult<UserIdentifierPrivate, AppError>> {
    const result = await this.openIdentifiersApi.addUserIdentifierExternalAuthProvider(authProvider, externalProviderToken)
    return mapSuccess(result, (payload) => toUserIdentifierPrivate(payload))
  }

  public async sendAddEmailIdentifierConfirmation(email: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return this.confirmationRepository.executeWithTimer(
      ConfirmationType.ADD_EMAIL,
      email,
      async () => {
        const result = await this.openIdentifiersApi.sendAddEmailIdentifierConfirmation(email)
        return mapSuccess(result, (payload) => toOtpConfirmation(payload))
      }
    )
  }

  public async sendAddPhoneIdentifierConfirmation(phoneNumber: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return this.confirmationRepository.executeWithTimer(
      ConfirmationType.ADD_PHONE,
      phoneNumber,
      async () => {
        const result = await this.openIdentifiersApi.sendAddPhoneIdentifierConfirmation(phoneNumber)
        return mapSuccess(result, (payload) => toOtpConfirmation(payload))
      }
    )
  }

  public async emailChangePassword(
    userIdentifierId: UserIdentifierId,
    oldPassword: string,
    newPassword: string
  ): Promise<AppResult<void, AppError>> {
    return this.openIdentifiersApi.emailChangePassword(userIdentifierId, oldPassword, newPassword)
  }

  public getRemainingEmailConfirmationDelayInSeconds(email: string): number {
    return this.confirmationRepository.getRemainingDelay(ConfirmationType.ADD_EMAIL, email)
  }

  public getRemainingPhoneNumberConfirmationDelayInSeconds(phoneNumber: string): number {
    return this.confirmationRepository.getRemainingDelay(ConfirmationType.ADD_PHONE, phoneNumber)
  }
}
