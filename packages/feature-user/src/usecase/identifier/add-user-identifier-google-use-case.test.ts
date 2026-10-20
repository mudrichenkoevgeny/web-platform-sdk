import { describe, it, expect, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserAuthProvider, createTestUserIdentifierPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { AddUserIdentifierGoogleUseCase } from '@/usecase/identifier/add-user-identifier-google-use-case'
import { GoogleAuthServiceMock } from '@/mock/auth/google/google-auth-service-mock'
import { IdentifierRepositoryMock } from '@/mock/repository/identifier/identifier-repository-mock'
import type { UserIdentifierPrivate } from '@mudrichenkoevgeny/shared-foundation'

describe('AddUserIdentifierGoogleUseCase', () => {
  let mockAuthService: GoogleAuthServiceMock
  let mockRepository: IdentifierRepositoryMock
  let useCase: AddUserIdentifierGoogleUseCase

  const mockIdentifier: UserIdentifierPrivate = createTestUserIdentifierPrivate({
    userAuthProvider: UserAuthProvider.GOOGLE,
    displayName: 'Google User'
  })

  beforeEach(() => {
    mockAuthService = new GoogleAuthServiceMock()
    mockAuthService.signInResultProvider = async () => appResultSuccess('google-id-token')

    mockRepository = new IdentifierRepositoryMock()
    mockRepository.addUserIdentifierResultProvider = async () => appResultSuccess(mockIdentifier)

    useCase = new AddUserIdentifierGoogleUseCase(mockAuthService, mockRepository)
  })

  it('signs in with google and adds external auth provider identifier', async () => {
    const result = await useCase.execute()

    expect(isSuccess(result)).toBe(true)
    expect(mockRepository.lastAuthProvider).toBe(UserAuthProvider.GOOGLE)
    expect(mockRepository.lastToken).toBe('google-id-token')
  })
})
