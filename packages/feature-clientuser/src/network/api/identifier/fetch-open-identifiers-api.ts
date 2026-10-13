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
    request: AddUserIdentifierEmailRequest
  ): Promise<AppResult<UserIdentifierPrivatePayload, AppError>> {
    return callResult(() =>
      this.client.request<UserIdentifierPrivatePayload>(OpenIdentifierRoutes.ADD_IDENTIFIER_EMAIL, {
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
  }

  public async addUserIdentifierPhone(
    request: AddUserIdentifierPhoneRequest
  ): Promise<AppResult<UserIdentifierPrivatePayload, AppError>> {
    return callResult(() =>
      this.client.request<UserIdentifierPrivatePayload>(OpenIdentifierRoutes.ADD_IDENTIFIER_PHONE, {
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
  }

  public async addUserIdentifierExternalAuthProvider(
    request: AddUserIdentifierExternalAuthProviderRequest
  ): Promise<AppResult<UserIdentifierPrivatePayload, AppError>> {
    return callResult(() =>
      this.client.request<UserIdentifierPrivatePayload>(OpenIdentifierRoutes.ADD_IDENTIFIER_EXTERNAL_AUTH_PROVIDER, {
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
  }

  public async sendAddEmailIdentifierConfirmation(
    request: SendConfirmationToEmailRequest
  ): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    return callResult(() =>
      this.client.request<OtpConfirmationPayload>(OpenIdentifierRoutes.SEND_ADD_EMAIL_IDENTIFIER_CONFIRMATION, {
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
  }

  public async sendAddPhoneIdentifierConfirmation(
    request: SendConfirmationToPhoneRequest
  ): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    return callResult(() =>
      this.client.request<OtpConfirmationPayload>(OpenIdentifierRoutes.SEND_ADD_PHONE_IDENTIFIER_CONFIRMATION, {
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
  }

  public async emailChangePassword(request: EmailPasswordChangeRequest): Promise<AppResult<void, AppError>> {
    return callResult(() =>
      this.client.request<void>(OpenIdentifierRoutes.IDENTIFIER_EMAIL_CHANGE_PASSWORD, {
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
  }
}
