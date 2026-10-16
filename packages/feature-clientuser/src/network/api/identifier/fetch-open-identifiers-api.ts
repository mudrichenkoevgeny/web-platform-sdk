import { appendQueryParamsToPath, callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AddUserIdentifierEmailRequest,
  AddUserIdentifierExternalAuthProviderRequest,
  AddUserIdentifierPhoneRequest,
  EmailPasswordChangeRequest,
  OtpConfirmationPayload,
  PagedResult,
  SelfIdentifierListParams,
  SendConfirmationToEmailRequest,
  SendConfirmationToPhoneRequest,
  UserIdentifierId,
  UserIdentifierPrivatePayload,
  UserIdentifierSummaryPayload
} from '@mudrichenkoevgeny/shared-foundation'
import {
  OpenIdentifierRoutes,
  pagedResultSchema,
  UserApiPaths,
  userIdentifierPrivatePayloadSchema,
  userIdentifierSummaryPayloadSchema
} from '@mudrichenkoevgeny/shared-foundation'
import type { OpenIdentifiersApi } from '@/network/api/identifier/open-identifiers-api'

/** {@link OpenIdentifiersApi} implementation backed by {@link HttpClient}. */
export class FetchOpenIdentifiersApi implements OpenIdentifiersApi {
  /**
   * Constructs a new {@link FetchOpenIdentifiersApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async getUserIdentifier(
    userIdentifierId: UserIdentifierId
  ): Promise<AppResult<UserIdentifierPrivatePayload, AppError>> {
    const path = OpenIdentifierRoutes.GET_IDENTIFIER.replace(`{${UserApiPaths.USER_IDENTIFIER_ID}}`, userIdentifierId)
    return callResult(async () => {
      const raw = await this.client.request<unknown>(path)
      return userIdentifierPrivatePayloadSchema.parse(raw)
    })
  }

  public async getUserIdentifiers(
    params?: SelfIdentifierListParams | null
  ): Promise<AppResult<PagedResult<UserIdentifierSummaryPayload>, AppError>> {
    const path = appendQueryParamsToPath(
      OpenIdentifierRoutes.GET_IDENTIFIERS,
      params
    )
    return callResult(async () => {
      const raw = await this.client.request<unknown>(path)
      return pagedResultSchema(userIdentifierSummaryPayloadSchema).parse(raw)
    })
  }

  public async deleteUserIdentifier(identifierId: UserIdentifierId): Promise<AppResult<void, AppError>> {
    const path = OpenIdentifierRoutes.DELETE_IDENTIFIER.replace(`{${UserApiPaths.USER_IDENTIFIER_ID}}`, identifierId)
    return callResult(() => this.client.request<void>(path, { method: 'DELETE' }))
  }

  public async addUserIdentifierEmail(
    email: string,
    password: string,
    confirmationCode: string
  ): Promise<AppResult<UserIdentifierPrivatePayload, AppError>> {
    const request: AddUserIdentifierEmailRequest = {
      email,
      password,
      confirmation_code: confirmationCode
    }
    return callResult(() =>
      this.client.request<UserIdentifierPrivatePayload>(OpenIdentifierRoutes.ADD_IDENTIFIER_EMAIL, {
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
  }

  public async addUserIdentifierPhone(
    phoneNumber: string,
    confirmationCode: string
  ): Promise<AppResult<UserIdentifierPrivatePayload, AppError>> {
    const request: AddUserIdentifierPhoneRequest = {
      phone_number: phoneNumber,
      confirmation_code: confirmationCode
    }
    return callResult(() =>
      this.client.request<UserIdentifierPrivatePayload>(OpenIdentifierRoutes.ADD_IDENTIFIER_PHONE, {
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
  }

  public async addUserIdentifierExternalAuthProvider(
    authProvider: string,
    externalProviderToken: string
  ): Promise<AppResult<UserIdentifierPrivatePayload, AppError>> {
    const request: AddUserIdentifierExternalAuthProviderRequest = {
      auth_provider: authProvider,
      external_provider_token: externalProviderToken
    }
    return callResult(() =>
      this.client.request<UserIdentifierPrivatePayload>(OpenIdentifierRoutes.ADD_IDENTIFIER_EXTERNAL_AUTH_PROVIDER, {
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
  }

  public async sendAddEmailIdentifierConfirmation(
    email: string
  ): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    const request: SendConfirmationToEmailRequest = { email }
    return callResult(() =>
      this.client.request<OtpConfirmationPayload>(OpenIdentifierRoutes.SEND_ADD_EMAIL_IDENTIFIER_CONFIRMATION, {
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
  }

  public async sendAddPhoneIdentifierConfirmation(
    phoneNumber: string
  ): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    const request: SendConfirmationToPhoneRequest = { phone_number: phoneNumber }
    return callResult(() =>
      this.client.request<OtpConfirmationPayload>(OpenIdentifierRoutes.SEND_ADD_PHONE_IDENTIFIER_CONFIRMATION, {
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
  }

  public async emailChangePassword(
    userIdentifierId: UserIdentifierId,
    oldPassword: string,
    newPassword: string
  ): Promise<AppResult<void, AppError>> {
    const path = OpenIdentifierRoutes.IDENTIFIER_EMAIL_CHANGE_PASSWORD.replace(`{${UserApiPaths.USER_IDENTIFIER_ID}}`, userIdentifierId)
    const request: EmailPasswordChangeRequest = {
      old_password: oldPassword,
      new_password: newPassword
    }
    return callResult(() =>
      this.client.request<void>(path, {
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
  }
}
