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

    vi.spyOn(mockApi, 'getUserIdentifier').mockImplementation(mockApi.getUserIdentifier.bind(mockApi))
    vi.spyOn(mockApi, 'getUserIdentifiers').mockImplementation(mockApi.getUserIdentifiers.bind(mockApi))
    vi.spyOn(mockApi, 'deleteUserIdentifier').mockImplementation(mockApi.deleteUserIdentifier.bind(mockApi))
    vi.spyOn(mockApi, 'addUserIdentifierEmail').mockImplementation(mockApi.addUserIdentifierEmail.bind(mockApi))
    vi.spyOn(mockApi, 'addUserIdentifierPhone').mockImplementation(mockApi.addUserIdentifierPhone.bind(mockApi))
    vi.spyOn(mockApi, 'addUserIdentifierExternalAuthProvider').mockImplementation(mockApi.addUserIdentifierExternalAuthProvider.bind(mockApi))
    vi.spyOn(mockApi, 'sendAddEmailIdentifierConfirmation').mockImplementation(mockApi.sendAddEmailIdentifierConfirmation.bind(mockApi))
    vi.spyOn(mockApi, 'sendAddPhoneIdentifierConfirmation').mockImplementation(mockApi.sendAddPhoneIdentifierConfirmation.bind(mockApi))
    vi.spyOn(mockApi, 'emailChangePassword').mockImplementation(mockApi.emailChangePassword.bind(mockApi))

    mockConfirmationRepo = new ConfirmationRepositoryMock()
    vi.spyOn(mockConfirmationRepo, 'executeWithTimer').mockImplementation(mockConfirmationRepo.executeWithTimer.bind(mockConfirmationRepo))

    mockUserStorage = new UserStorageMock()
    vi.spyOn(mockUserStorage, 'addUserIdentifier').mockImplementation(mockUserStorage.addUserIdentifier.bind(mockUserStorage))
    vi.spyOn(mockUserStorage, 'removeUserIdentifier').mockImplementation(mockUserStorage.removeUserIdentifier.bind(mockUserStorage))

    repository = new OpenIdentifierRepositoryImpl(mockApi, mockConfirmationRepo, mockUserStorage)
  })

  it('delegates getUserIdentifier and maps response', async () => {
    const id = toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    const result = await repository.getUserIdentifier(id)
    expect(mockApi.getUserIdentifier).toHaveBeenCalledWith(id)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates getUserIdentifiers and maps paged items', async () => {
    const params = {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at' as const,
      sortOrder: SortOrder.DESC,
      userAuthProviders: [],
      identifiers: []
    }
    const result = await repository.getUserIdentifiers(params)
    expect(mockApi.getUserIdentifiers).toHaveBeenCalledWith(params)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates deleteUserIdentifier and removes from storage', async () => {
    const id = toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    const result = await repository.deleteUserIdentifier(id)
    expect(mockApi.deleteUserIdentifier).toHaveBeenCalledWith(id)
    expect(mockUserStorage.removeUserIdentifier).toHaveBeenCalledWith(id)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates addUserIdentifierEmail and updates storage', async () => {
    const result = await repository.addUserIdentifierEmail(TEST_EMAIL, 'secret', '123456')
    expect(mockApi.addUserIdentifierEmail).toHaveBeenCalledWith(TEST_EMAIL, 'secret', '123456')
    expect(mockUserStorage.addUserIdentifier).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates addUserIdentifierPhone and updates storage', async () => {
    const result = await repository.addUserIdentifierPhone(TEST_PHONE, '123456')
    expect(mockApi.addUserIdentifierPhone).toHaveBeenCalledWith(TEST_PHONE, '123456')
    expect(mockUserStorage.addUserIdentifier).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates addUserIdentifierExternalAuthProvider and updates storage', async () => {
    const result = await repository.addUserIdentifierExternalAuthProvider('GOOGLE', 'token123')
    expect(mockApi.addUserIdentifierExternalAuthProvider).toHaveBeenCalledWith('GOOGLE', 'token123')
    expect(mockUserStorage.addUserIdentifier).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates sendAddEmailIdentifierConfirmation with timer', async () => {
    const result = await repository.sendAddEmailIdentifierConfirmation(TEST_EMAIL)
    expect(mockConfirmationRepo.executeWithTimer).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates sendAddPhoneIdentifierConfirmation with timer', async () => {
    const result = await repository.sendAddPhoneIdentifierConfirmation(TEST_PHONE)
    expect(mockConfirmationRepo.executeWithTimer).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates emailChangePassword request', async () => {
    const identifierId = toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    const result = await repository.emailChangePassword(identifierId, 'old', 'new')
    expect(mockApi.emailChangePassword).toHaveBeenCalledWith(identifierId, 'old', 'new')
    expect(isSuccess(result)).toBe(true)
  })

  it('queries remaining confirmation delays', () => {
    expect(repository.getRemainingEmailConfirmationDelayInSeconds(TEST_EMAIL)).toBe(0)
    expect(repository.getRemainingPhoneNumberConfirmationDelayInSeconds(TEST_PHONE)).toBe(0)
  })
})
