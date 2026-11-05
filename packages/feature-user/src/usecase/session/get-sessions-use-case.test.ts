import { describe, it, expect, vi } from 'vitest'
import { appResultFailure, appResultSuccess, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestPagedResult, createTestUserSessionSummaryList } from '@mudrichenkoevgeny/shared-foundation'
import type { SelfSessionListParams } from '@mudrichenkoevgeny/shared-foundation'
import { SessionRepositoryMock } from '@/mock/repository/session/session-repository-mock'
import { GetSessionsUseCase } from './get-sessions-use-case'

describe('GetSessionsUseCase', () => {
  it('delegates call with params and returns sessions list on success', async () => {
    const expectedPagedResult = createTestPagedResult({ items: createTestUserSessionSummaryList(2) })
    const repo = new SessionRepositoryMock()
    repo.getSessionsResultProvider = async () => appResultSuccess(expectedPagedResult)
    const spy = vi.spyOn(repo, 'getSessions')
    const useCase = new GetSessionsUseCase(repo)

    const params: SelfSessionListParams = { pageNumber: 1, pageSize: 10 }
    const result = await useCase.execute(params)

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(expectedPagedResult)
    }
    expect(spy).toHaveBeenCalledWith(params)
  })

  it('returns failure when repository fails to retrieve sessions', async () => {
    const expectedError = CommonError.unknown()
    const repo = new SessionRepositoryMock()
    repo.getSessionsResultProvider = async () => appResultFailure(expectedError)
    const useCase = new GetSessionsUseCase(repo)

    const result = await useCase.execute()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})
