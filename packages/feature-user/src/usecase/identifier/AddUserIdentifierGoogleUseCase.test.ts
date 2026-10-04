import { describe, it, expect, vi, beforeEach } from 'vitest'
import { toUserIdOrThrow, toUserIdentifierIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { AddUserIdentifierGoogleUseCase } from './AddUserIdentifierGoogleUseCase'
import { GoogleAuthService } from '@/auth/google/GoogleAuthService'
import { IdentifierRepository } from '@/repository/identifier/IdentifierRepository'
import { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'

describe('AddUserIdentifierGoogleUseCase', () => {
  let mockAuthService: GoogleAuthService
  let mockRepository: IdentifierRepository
  let useCase: AddUserIdentifierGoogleUseCase

  const dummyIdentifier: UserIdentifier = {
    id: toUserIdentifierIdOrThrow('ident_1'),
    userId: toUserIdOrThrow('usr_1'),
    userAuthProvider: UserAuthProvider.GOOGLE,
    identifier: 'user@google.com',
    displayName: 'Google User',
    externalProviderEmail: 'user@google.com',
    isSensitiveValuesMasked: false,
    createdAt: Date.now(),
    updatedAt: null
  }

  beforeEach(() => {
    mockAuthService = {
      signIn: vi.fn().mockResolvedValue(appResultSuccess('google-id-token'))
    } as unknown as GoogleAuthService

    mockRepository = {
      addUserIdentifierExternalAuthProvider: vi.fn().mockResolvedValue(appResultSuccess(dummyIdentifier))
    } as unknown as IdentifierRepository

    useCase = new AddUserIdentifierGoogleUseCase(mockAuthService, mockRepository)
  })

  it('signs in with google and adds external auth provider identifier', async () => {
    const result = await useCase.execute()

    expect(isSuccess(result)).toBe(true)
    expect(mockAuthService.signIn).toHaveBeenCalled()
    expect(mockRepository.addUserIdentifierExternalAuthProvider).toHaveBeenCalledWith(
      UserAuthProvider.GOOGLE,
      'google-id-token'
    )
  })
})
