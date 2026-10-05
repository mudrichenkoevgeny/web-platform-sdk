import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AddUserIdentifierEmailRequest,
  AddUserIdentifierExternalAuthProviderRequest,
  AddUserIdentifierPhoneRequest,
  EmailPasswordChangeRequest,
  OtpConfirmationPayload,
  PagedResult,
  SendConfirmationToEmailRequest,
  SendConfirmationToPhoneRequest,
  SortOrder,
  UserAuthProvider,
  UserIdentifierId,
  UserIdentifierPayload,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import {
  ListingParamNames,
  OpenIdentifierRoutes,
  UserApiPaths,
  UserFilterValues
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
  ): Promise<AppResult<UserIdentifierPayload, AppError>> {
    const path = OpenIdentifierRoutes.GET_IDENTIFIER.replace(`{${UserApiPaths.USER_IDENTIFIER_ID}}`, userIdentifierId)
    return callResult(() => this.client.request<UserIdentifierPayload>(path))
  }

  public async getUserIdentifiers(
    pageNumber?: number | null,
    pageSize?: number | null,
    sortBy?: UserSortValues.UserIdentifierSortBy | null,
    sortOrder?: SortOrder | null,
    userAuthProviders?: UserAuthProvider[] | null,
    identifiers?: string[] | null
  ): Promise<AppResult<PagedResult<UserIdentifierPayload>, AppError>> {
    const query = new URLSearchParams()
    if (pageNumber != null) {
      query.append(ListingParamNames.PAGE_NUMBER, String(pageNumber))
    }
    if (pageSize != null) {
      query.append(ListingParamNames.PAGE_SIZE, String(pageSize))
    }
    if (sortBy != null) {
      query.append(ListingParamNames.SORT_BY, String(sortBy))
    }
    if (sortOrder != null) {
      query.append(ListingParamNames.SORT_ORDER, String(sortOrder))
    }
    if (userAuthProviders) {
      userAuthProviders.forEach((provider) =>
        query.append(UserFilterValues.UserIdentifierFilterValues.USER_AUTH_PROVIDER, String(provider))
      )
    }
    if (identifiers) {
      identifiers.forEach((identifier) =>
        query.append(UserFilterValues.UserIdentifierFilterValues.IDENTIFIER, identifier)
      )
    }

    const queryString = query.toString()
    const path = queryString
      ? `${OpenIdentifierRoutes.GET_IDENTIFIERS}?${queryString}`
      : OpenIdentifierRoutes.GET_IDENTIFIERS

    return callResult(() => this.client.request<PagedResult<UserIdentifierPayload>>(path))
  }

  public async deleteUserIdentifier(identifierId: UserIdentifierId): Promise<AppResult<void, AppError>> {
    const path = OpenIdentifierRoutes.DELETE_IDENTIFIER.replace(`{${UserApiPaths.USER_IDENTIFIER_ID}}`, identifierId)
    return callResult(() => this.client.request<void>(path, { method: 'DELETE' }))
  }

  public async addUserIdentifierEmail(
    request: AddUserIdentifierEmailRequest
  ): Promise<AppResult<UserIdentifierPayload, AppError>> {
    return callResult(() =>
      this.client.request<UserIdentifierPayload>(OpenIdentifierRoutes.ADD_IDENTIFIER_EMAIL, {
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
  }

  public async addUserIdentifierPhone(
    request: AddUserIdentifierPhoneRequest
  ): Promise<AppResult<UserIdentifierPayload, AppError>> {
    return callResult(() =>
      this.client.request<UserIdentifierPayload>(OpenIdentifierRoutes.ADD_IDENTIFIER_PHONE, {
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
  }

  public async addUserIdentifierExternalAuthProvider(
    request: AddUserIdentifierExternalAuthProviderRequest
  ): Promise<AppResult<UserIdentifierPayload, AppError>> {
    return callResult(() =>
      this.client.request<UserIdentifierPayload>(OpenIdentifierRoutes.ADD_IDENTIFIER_EXTERNAL_AUTH_PROVIDER, {
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
