import { describe, it, expect, vi } from 'vitest'
import { appResultFailure, appResultSuccess, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestPagedResult, createTestUserSummaryList } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserListParams } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementUserRepositoryMock } from '@/mock/repository/user/management-user-repository-mock'
import { GetUsersUseCase } from './get-users-use-case'

describe('GetUsersUseCase', () => {
  it('delegates to user repository with params and returns paged user list on success', async () => {
    const expectedPagedResult = createTestPagedResult({ items: createTestUserSummaryList(2) })
    const repo = new ManagementUserRepositoryMock()
    repo.getUsersResultProvider = async () => appResultSuccess(expectedPagedResult)
    const spy = vi.spyOn(repo, 'getUsers')
    const useCase = new GetUsersUseCase(repo)

    const params: ManagementUserListParams = { pageNumber: 1, pageSize: 10 }
    const result = await useCase.execute(params)

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(expectedPagedResult)
    }
    expect(spy).toHaveBeenCalledWith(params)
  })

  it('returns failure when user repository getUsers fails', async () => {
    const expectedError = CommonError.unknown()
    const repo = new ManagementUserRepositoryMock()
    repo.getUsersResultProvider = async () => appResultFailure(expectedError)
    const useCase = new GetUsersUseCase(repo)

    const result = await useCase.execute()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})
