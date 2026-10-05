import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { toUserIdentifierIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { OpenIdentifierRepositoryImpl } from '@/repository/identifier/open-identifier-repository-impl'
import type { OpenIdentifiersApi } from '@/network/api/identifier/open-identifiers-api'
import type { ConfirmationRepository, UserStorage } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('OpenIdentifierRepositoryImpl', () => {
  let mockApi: OpenIdentifiersApi
  let mockConfirmationRepo: ConfirmationRepository
  let mockUserStorage: UserStorage
  let repository: OpenIdentifierRepositoryImpl

  const dummyIdentifierPayload = {
    id: 'ident_1',
    user_id: 'usr_1',
    identifier: 'user@example.com',
    user_auth_provider: 'EMAIL',
    is_primary: true,
    is_confirmed: true,
    created_at: 1000,
    updated_at: null
  } as any

  beforeEach(() => {
    mockApi = {
      getUserIdentifier: vi.fn().mockResolvedValue(appResultSuccess(dummyIdentifierPayload)),
      getUserIdentifiers: vi.fn().mockResolvedValue(appResultSuccess({ items: [dummyIdentifierPayload], totalCount: 1, pageNumber: 1, pageSize: 10, totalPages: 1 })),
      deleteUserIdentifier: vi.fn().mockResolvedValue(appResultSuccess(undefined)),
      addUserIdentifierEmail: vi.fn().mockResolvedValue(appResultSuccess(dummyIdentifierPayload)),
      addUserIdentifierPhone: vi.fn().mockResolvedValue(appResultSuccess(dummyIdentifierPayload)),
      addUserIdentifierExternalAuthProvider: vi.fn().mockResolvedValue(appResultSuccess(dummyIdentifierPayload)),
      sendAddEmailIdentifierConfirmation: vi.fn().mockResolvedValue(appResultSuccess({ retry_after_seconds: 60, number_of_symbols: 6, expiration_seconds: 300 })),
      sendAddPhoneIdentifierConfirmation: vi.fn().mockResolvedValue(appResultSuccess({ retry_after_seconds: 60, number_of_symbols: 6, expiration_seconds: 300 })),
      emailChangePassword: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as unknown as OpenIdentifiersApi

    mockConfirmationRepo = {
      executeWithTimer: vi.fn().mockImplementation((_type, _identifier, action) => action()),
      getRemainingDelay: vi.fn().mockReturnValue(0)
    } as unknown as ConfirmationRepository

    mockUserStorage = {
      addUserIdentifier: vi.fn().mockResolvedValue(undefined),
      removeUserIdentifier: vi.fn().mockResolvedValue(undefined)
    } as unknown as UserStorage

    repository = new OpenIdentifierRepositoryImpl(mockApi, mockConfirmationRepo, mockUserStorage)
  })

  it('delegates getUserIdentifier and maps response', async () => {
    const id = toUserIdentifierIdOrThrow('ident_1')
    const result = await repository.getUserIdentifier(id)
    expect(mockApi.getUserIdentifier).toHaveBeenCalledWith(id)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates getUserIdentifiers and maps paged items', async () => {
    const result = await repository.getUserIdentifiers(1, 10)
    expect(mockApi.getUserIdentifiers).toHaveBeenCalledWith(1, 10, undefined, undefined, undefined, undefined)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates deleteUserIdentifier and removes from storage', async () => {
    const id = toUserIdentifierIdOrThrow('ident_1')
    const result = await repository.deleteUserIdentifier(id)
    expect(mockApi.deleteUserIdentifier).toHaveBeenCalledWith(id)
    expect(mockUserStorage.removeUserIdentifier).toHaveBeenCalledWith(id)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates addUserIdentifierEmail and updates storage', async () => {
    const result = await repository.addUserIdentifierEmail('user@example.com', 'secret', '123456')
    expect(mockApi.addUserIdentifierEmail).toHaveBeenCalledWith({ email: 'user@example.com', password: 'secret', confirmation_code: '123456' })
    expect(mockUserStorage.addUserIdentifier).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates addUserIdentifierPhone and updates storage', async () => {
    const result = await repository.addUserIdentifierPhone('+1234567890', '123456')
    expect(mockApi.addUserIdentifierPhone).toHaveBeenCalledWith({ phone_number: '+1234567890', confirmation_code: '123456' })
    expect(mockUserStorage.addUserIdentifier).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates addUserIdentifierExternalAuthProvider and updates storage', async () => {
    const result = await repository.addUserIdentifierExternalAuthProvider('GOOGLE', 'token123')
    expect(mockApi.addUserIdentifierExternalAuthProvider).toHaveBeenCalledWith({ auth_provider: 'GOOGLE', external_provider_token: 'token123' })
    expect(mockUserStorage.addUserIdentifier).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates sendAddEmailIdentifierConfirmation with timer', async () => {
    const result = await repository.sendAddEmailIdentifierConfirmation('user@example.com')
    expect(mockConfirmationRepo.executeWithTimer).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates sendAddPhoneIdentifierConfirmation with timer', async () => {
    const result = await repository.sendAddPhoneIdentifierConfirmation('+1234567890')
    expect(mockConfirmationRepo.executeWithTimer).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates emailChangePassword request', async () => {
    const result = await repository.emailChangePassword('user@example.com', 'old', 'new')
    expect(mockApi.emailChangePassword).toHaveBeenCalledWith({ email: 'user@example.com', old_password: 'old', new_password: 'new' })
    expect(isSuccess(result)).toBe(true)
  })

  it('queries remaining confirmation delays', () => {
    expect(repository.getRemainingEmailConfirmationDelayInSeconds('user@example.com')).toBe(0)
    expect(repository.getRemainingPhoneNumberConfirmationDelayInSeconds('+1234567890')).toBe(0)
  })
})
