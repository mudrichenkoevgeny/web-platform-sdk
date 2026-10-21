import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SortOrder, TEST_EMAIL, TEST_IDENTIFIER_ID, TEST_PHONE, toUserIdentifierIdOrThrow, toUserIdentifierPrivatePayload, createTestUserIdentifierPrivate, createTestOtpConfirmationPayload, createTestPagedResult } from '@mudrichenkoevgeny/shared-foundation'
import { OpenIdentifierRepositoryImpl } from '@/repository/identifier/open-identifier-repository-impl'
import { OpenIdentifiersApiMock } from '@/mock/network/api/identifier/open-identifiers-api-mock'
import { ConfirmationRepositoryMock, UserStorageMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('OpenIdentifierRepositoryImpl', () => {
  let mockApi: OpenIdentifiersApiMock
  let mockConfirmationRepo: ConfirmationRepositoryMock
  let mockUserStorage: UserStorageMock
  let repository: OpenIdentifierRepositoryImpl

  const mockIdentifierPayload = toUserIdentifierPrivatePayload(createTestUserIdentifierPrivate({ id: toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID) }))

  beforeEach(() => {
    mockApi = new OpenIdentifiersApiMock()
    mockApi.getUserIdentifierResult = appResultSuccess(mockIdentifierPayload)
    mockApi.getUserIdentifiersResult = appResultSuccess(createTestPagedResult({ items: [mockIdentifierPayload] }))
    mockApi.deleteUserIdentifierResult = appResultSuccess(undefined)
    mockApi.addUserIdentifierEmailResult = appResultSuccess(mockIdentifierPayload)
    mockApi.addUserIdentifierPhoneResult = appResultSuccess(mockIdentifierPayload)
    mockApi.addUserIdentifierExternalAuthProviderResult = appResultSuccess(mockIdentifierPayload)
    mockApi.sendAddEmailIdentifierConfirmationResult = appResultSuccess(createTestOtpConfirmationPayload())
    mockApi.sendAddPhoneIdentifierConfirmationResult = appResultSuccess(createTestOtpConfirmationPayload())
    mockApi.emailChangePasswordResult = appResultSuccess(undefined)

    vi.spyOn(mockApi, 'getUserIdentifier')
    vi.spyOn(mockApi, 'getUserIdentifiers')
    vi.spyOn(mockApi, 'deleteUserIdentifier')
    vi.spyOn(mockApi, 'addUserIdentifierEmail')
    vi.spyOn(mockApi, 'addUserIdentifierPhone')
    vi.spyOn(mockApi, 'addUserIdentifierExternalAuthProvider')
    vi.spyOn(mockApi, 'sendAddEmailIdentifierConfirmation')
    vi.spyOn(mockApi, 'sendAddPhoneIdentifierConfirmation')
    vi.spyOn(mockApi, 'emailChangePassword')

    mockConfirmationRepo = new ConfirmationRepositoryMock()
    vi.spyOn(mockConfirmationRepo, 'executeWithTimer')

    mockUserStorage = new UserStorageMock()
    vi.spyOn(mockUserStorage, 'addUserIdentifier')
    vi.spyOn(mockUserStorage, 'removeUserIdentifier')

    repository = new OpenIdentifierRepositoryImpl(mockApi, mockConfirmationRepo, mockUserStorage)
  })

  it('delegates getUserIdentifier and maps response', async () => {
    const identifierId = toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    const identifierResult = await repository.getUserIdentifier(identifierId)
    expect(mockApi.getUserIdentifier).toHaveBeenCalledWith(identifierId)
    expect(isSuccess(identifierResult)).toBe(true)
  })

  it('delegates getUserIdentifiers and maps paged items', async () => {
    const selfIdentifierListParams = {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at' as const,
      sortOrder: SortOrder.DESC,
      userAuthProviders: [],
      identifiers: []
    }
    const identifierListResult = await repository.getUserIdentifiers(selfIdentifierListParams)
    expect(mockApi.getUserIdentifiers).toHaveBeenCalledWith(selfIdentifierListParams)
    expect(isSuccess(identifierListResult)).toBe(true)
  })

  it('delegates deleteUserIdentifier and removes from storage', async () => {
    const identifierId = toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    const deleteIdentifierResult = await repository.deleteUserIdentifier(identifierId)
    expect(mockApi.deleteUserIdentifier).toHaveBeenCalledWith(identifierId)
    expect(mockUserStorage.removeUserIdentifier).toHaveBeenCalledWith(identifierId)
    expect(isSuccess(deleteIdentifierResult)).toBe(true)
  })

  it('delegates addUserIdentifierEmail and updates storage', async () => {
    const addEmailResult = await repository.addUserIdentifierEmail(TEST_EMAIL, 'secret', '123456')
    expect(mockApi.addUserIdentifierEmail).toHaveBeenCalledWith(TEST_EMAIL, 'secret', '123456')
    expect(mockUserStorage.addUserIdentifier).toHaveBeenCalled()
    expect(isSuccess(addEmailResult)).toBe(true)
  })

  it('delegates addUserIdentifierPhone and updates storage', async () => {
    const addPhoneResult = await repository.addUserIdentifierPhone(TEST_PHONE, '123456')
    expect(mockApi.addUserIdentifierPhone).toHaveBeenCalledWith(TEST_PHONE, '123456')
    expect(mockUserStorage.addUserIdentifier).toHaveBeenCalled()
    expect(isSuccess(addPhoneResult)).toBe(true)
  })

  it('delegates addUserIdentifierExternalAuthProvider and updates storage', async () => {
    const addExternalProviderResult = await repository.addUserIdentifierExternalAuthProvider('GOOGLE', 'token123')
    expect(mockApi.addUserIdentifierExternalAuthProvider).toHaveBeenCalledWith('GOOGLE', 'token123')
    expect(mockUserStorage.addUserIdentifier).toHaveBeenCalled()
    expect(isSuccess(addExternalProviderResult)).toBe(true)
  })

  it('delegates sendAddEmailIdentifierConfirmation with timer', async () => {
    const sendEmailConfirmationResult = await repository.sendAddEmailIdentifierConfirmation(TEST_EMAIL)
    expect(mockConfirmationRepo.executeWithTimer).toHaveBeenCalled()
    expect(isSuccess(sendEmailConfirmationResult)).toBe(true)
  })

  it('delegates sendAddPhoneIdentifierConfirmation with timer', async () => {
    const sendPhoneConfirmationResult = await repository.sendAddPhoneIdentifierConfirmation(TEST_PHONE)
    expect(mockConfirmationRepo.executeWithTimer).toHaveBeenCalled()
    expect(isSuccess(sendPhoneConfirmationResult)).toBe(true)
  })

  it('delegates emailChangePassword request', async () => {
    const identifierId = toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    const emailChangePasswordResult = await repository.emailChangePassword(identifierId, 'old', 'new')
    expect(mockApi.emailChangePassword).toHaveBeenCalledWith(identifierId, 'old', 'new')
    expect(isSuccess(emailChangePasswordResult)).toBe(true)
  })

  it('queries remaining confirmation delays', () => {
    expect(repository.getRemainingEmailConfirmationDelayInSeconds(TEST_EMAIL)).toBe(0)
    expect(repository.getRemainingPhoneNumberConfirmationDelayInSeconds(TEST_PHONE)).toBe(0)
  })
})
