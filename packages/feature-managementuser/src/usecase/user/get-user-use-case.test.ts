import { describe, it, expect, vi } from 'vitest'
import { appResultFailure, appResultSuccess, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestUserPrivate, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementUserRepositoryMock } from '@/mock/repository/user/management-user-repository-mock'
import { GetUserUseCase } from './get-user-use-case'

describe('GetUserUseCase', () => {
  it('delegates to user repository getUser and returns payload on success', async () => {
    const expectedUser = createTestUserPrivate()
    const repo = new ManagementUserRepositoryMock()
    repo.getUserResultProvider = async () => appResultSuccess(expectedUser)
    const spy = vi.spyOn(repo, 'getUser')
    const useCase = new GetUserUseCase(repo)
    const userId = toUserIdOrThrow('user-123')

    const result = await useCase.execute(userId)

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(expectedUser)
    }
    expect(spy).toHaveBeenCalledWith(userId)
  })

  it('returns failure when management user repository getUser fails', async () => {
    const expectedError = CommonError.unknown()
    const repo = new ManagementUserRepositoryMock()
    repo.getUserResultProvider = async () => appResultFailure(expectedError)
    const useCase = new GetUserUseCase(repo)
    const userId = toUserIdOrThrow('user-123')

    const result = await useCase.execute(userId)

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})
