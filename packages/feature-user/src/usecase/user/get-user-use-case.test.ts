import { describe, it, expect, vi } from 'vitest'
import { appResultFailure, appResultSuccess, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestUserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { UserRepositoryMock } from '@/mock/repository/user/user-repository-mock'
import { GetUserUseCase } from './get-user-use-case'

describe('GetUserUseCase', () => {
  it('refreshes and returns current user details on success', async () => {
    const expectedUser = createTestUserPrivate()
    const repo = new UserRepositoryMock()
    repo.resultProvider = async () => appResultSuccess(expectedUser)
    const spy = vi.spyOn(repo, 'refreshCurrentUser')
    const useCase = new GetUserUseCase(repo)

    const result = await useCase.execute()

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(expectedUser)
    }
    expect(spy).toHaveBeenCalledOnce()
  })

  it('returns failure when user repository refresh fails', async () => {
    const expectedError = CommonError.unknown()
    const repo = new UserRepositoryMock()
    repo.resultProvider = async () => appResultFailure(expectedError)
    const useCase = new GetUserUseCase(repo)

    const result = await useCase.execute()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})
