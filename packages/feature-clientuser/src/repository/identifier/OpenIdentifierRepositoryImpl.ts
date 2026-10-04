import { isSuccess, mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  OtpConfirmation,
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserIdentifier,
  UserIdentifierId,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import {
  ConfirmationType,
  toOtpConfirmation,
  toUserIdentifier
} from '@mudrichenkoevgeny/shared-foundation'
import {
  ConfirmationRepository,
  IdentifierRepository,
  UserStorage
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { OpenIdentifiersApi } from '@/network/api/identifier/OpenIdentifiersApi'

/**
 * Implements {@link IdentifierRepository} using {@link OpenIdentifiersApi} and {@link ConfirmationRepository} for throttled confirmation sends.
 */
export class OpenIdentifierRepositoryImpl implements IdentifierRepository {
  /**
   * Constructs a new {@link OpenIdentifierRepositoryImpl}.
   *
   * @param openIdentifiersApi - HTTP endpoints for managing user identifiers and sending confirmations
   * @param confirmationRepository - Client-side cooldown manager for adding email and phone identifiers
   * @param userStorage - Local user storage for updating identifier cache
   */
  public constructor(
    private readonly openIdentifiersApi: OpenIdentifiersApi,
    private readonly confirmationRepository: ConfirmationRepository,
    private readonly userStorage: UserStorage
  ) {}

  public async getUserIdentifier(userIdentifierId: UserIdentifierId): Promise<AppResult<UserIdentifier, AppError>> {
    const result = await this.openIdentifiersApi.getUserIdentifier(userIdentifierId)
    return mapSuccess(result, (payload) => toUserIdentifier(payload))
  }

  public async getUserIdentifiers(
    pageNumber?: number | null,
    pageSize?: number | null,
    sortBy?: UserSortValues.UserIdentifierSortBy | null,
    sortOrder?: SortOrder | null,
    userAuthProviders?: UserAuthProvider[] | null,
    identifiers?: string[] | null
  ): Promise<AppResult<PagedResult<UserIdentifier>, AppError>> {
    const result = await this.openIdentifiersApi.getUserIdentifiers(
      pageNumber,
      pageSize,
      sortBy,
      sortOrder,
      userAuthProviders,
      identifiers
    )
    return mapSuccess(result, (pagedPayload) => ({
      ...pagedPayload,
      items: pagedPayload.items.map((payload) => toUserIdentifier(payload))
    }))
  }

  public async deleteUserIdentifier(identifierId: UserIdentifierId): Promise<AppResult<void, AppError>> {
    const result = await this.openIdentifiersApi.deleteUserIdentifier(identifierId)
    if (isSuccess(result)) {
      await this.userStorage.removeUserIdentifier(identifierId)
    }
    return result
  }

  public async addUserIdentifierEmail(
    email: string,
    password: string,
    confirmationCode: string
  ): Promise<AppResult<UserIdentifier, AppError>> {
    const result = await this.openIdentifiersApi.addUserIdentifierEmail({
      email,
      password,
      confirmation_code: confirmationCode
    })
    const mapped = mapSuccess(result, (payload) => toUserIdentifier(payload))
    if (isSuccess(mapped)) {
      await this.userStorage.addUserIdentifier(mapped.data)
    }
    return mapped
  }

  public async addUserIdentifierPhone(
    phoneNumber: string,
    confirmationCode: string
  ): Promise<AppResult<UserIdentifier, AppError>> {
    const result = await this.openIdentifiersApi.addUserIdentifierPhone({
      phone_number: phoneNumber,
      confirmation_code: confirmationCode
    })
    const mapped = mapSuccess(result, (payload) => toUserIdentifier(payload))
    if (isSuccess(mapped)) {
      await this.userStorage.addUserIdentifier(mapped.data)
    }
    return mapped
  }

  public async addUserIdentifierExternalAuthProvider(
    authProvider: string,
    externalProviderToken: string
  ): Promise<AppResult<UserIdentifier, AppError>> {
    const result = await this.openIdentifiersApi.addUserIdentifierExternalAuthProvider({
      auth_provider: authProvider,
      external_provider_token: externalProviderToken
    })
    const mapped = mapSuccess(result, (payload) => toUserIdentifier(payload))
    if (isSuccess(mapped)) {
      await this.userStorage.addUserIdentifier(mapped.data)
    }
    return mapped
  }

  public async sendAddEmailIdentifierConfirmation(email: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return this.confirmationRepository.executeWithTimer(
      ConfirmationType.ADD_EMAIL,
      email,
      async () => {
        const result = await this.openIdentifiersApi.sendAddEmailIdentifierConfirmation({ email })
        return mapSuccess(result, (payload) => toOtpConfirmation(payload))
      }
    )
  }

  public async sendAddPhoneIdentifierConfirmation(phoneNumber: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return this.confirmationRepository.executeWithTimer(
      ConfirmationType.ADD_PHONE,
      phoneNumber,
      async () => {
        const result = await this.openIdentifiersApi.sendAddPhoneIdentifierConfirmation({ phone_number: phoneNumber })
        return mapSuccess(result, (payload) => toOtpConfirmation(payload))
      }
    )
  }

  public async emailChangePassword(
    email: string,
    oldPassword: string,
    newPassword: string
  ): Promise<AppResult<void, AppError>> {
    return this.openIdentifiersApi.emailChangePassword({
      email,
      old_password: oldPassword,
      new_password: newPassword
    })
  }

  public getRemainingEmailConfirmationDelayInSeconds(email: string): number {
    return this.confirmationRepository.getRemainingDelay(ConfirmationType.ADD_EMAIL, email)
  }

  public getRemainingPhoneNumberConfirmationDelayInSeconds(phoneNumber: string): number {
    return this.confirmationRepository.getRemainingDelay(ConfirmationType.ADD_PHONE, phoneNumber)
  }
}
