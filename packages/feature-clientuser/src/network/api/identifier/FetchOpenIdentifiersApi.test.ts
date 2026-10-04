import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchOpenIdentifiersApi } from '@/network/api/identifier/FetchOpenIdentifiersApi'
import { OpenIdentifierRoutes, toUserIdentifierIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchOpenIdentifiersApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchOpenIdentifiersApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchOpenIdentifiersApi(mockHttpClient)
  })

  it('dispatches getUserIdentifier request', async () => {
    const dummyPayload = { id: 'ident_1' } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const id = toUserIdentifierIdOrThrow('ident_1')
    const result = await api.getUserIdentifier(id)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.GET_IDENTIFIER.replace('{user_identifier_id}', 'ident_1')
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches getUserIdentifiers request with query params', async () => {
    const dummyPayload = { items: [] } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.getUserIdentifiers(1, 10)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining(OpenIdentifierRoutes.GET_IDENTIFIERS)
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches deleteUserIdentifier request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const id = toUserIdentifierIdOrThrow('ident_1')
    const result = await api.deleteUserIdentifier(id)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.DELETE_IDENTIFIER.replace('{user_identifier_id}', 'ident_1'),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ data: undefined, kind: 'Success' })
  })

  it('dispatches addUserIdentifierEmail request', async () => {
    const dummyPayload = { id: 'ident_1' } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { email: 'user@example.com', password: 'secret', confirmation_code: '123456' }
    const result = await api.addUserIdentifierEmail(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.ADD_IDENTIFIER_EMAIL,
      expect.objectContaining({ method: 'POST', body: JSON.stringify(request) })
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches addUserIdentifierPhone request', async () => {
    const dummyPayload = { id: 'ident_2' } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { phone_number: '+1234567890', confirmation_code: '123456' }
    const result = await api.addUserIdentifierPhone(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.ADD_IDENTIFIER_PHONE,
      expect.objectContaining({ method: 'POST', body: JSON.stringify(request) })
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches addUserIdentifierExternalAuthProvider request', async () => {
    const dummyPayload = { id: 'ident_3' } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { auth_provider: 'GOOGLE', external_provider_token: 'token123' } as any
    const result = await api.addUserIdentifierExternalAuthProvider(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.ADD_IDENTIFIER_EXTERNAL_AUTH_PROVIDER,
      expect.objectContaining({ method: 'POST', body: JSON.stringify(request) })
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches sendAddEmailIdentifierConfirmation request', async () => {
    const dummyPayload = { retryAfterSeconds: 60 } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { email: 'user@example.com' }
    const result = await api.sendAddEmailIdentifierConfirmation(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.SEND_ADD_EMAIL_IDENTIFIER_CONFIRMATION,
      expect.objectContaining({ method: 'POST', body: JSON.stringify(request) })
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches sendAddPhoneIdentifierConfirmation request', async () => {
    const dummyPayload = { retryAfterSeconds: 60 } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { phone_number: '+1234567890' } as any
    const result = await api.sendAddPhoneIdentifierConfirmation(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.SEND_ADD_PHONE_IDENTIFIER_CONFIRMATION,
      expect.objectContaining({ method: 'POST', body: JSON.stringify(request) })
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches emailChangePassword request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const request = { email: 'user@example.com', old_password: 'old', new_password: 'new' }
    const result = await api.emailChangePassword(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.IDENTIFIER_EMAIL_CHANGE_PASSWORD,
      expect.objectContaining({ method: 'POST', body: JSON.stringify(request) })
    )
    expect(result).toEqual({ data: undefined, kind: 'Success' })
  })
})
