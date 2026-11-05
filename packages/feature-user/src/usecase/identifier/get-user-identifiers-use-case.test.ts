import { describe, it, expect, vi } from 'vitest'
import { appResultFailure, appResultSuccess, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestPagedResult, createTestUserIdentifierSummaryList } from '@mudrichenkoevgeny/shared-foundation'
import type { SelfIdentifierListParams } from '@mudrichenkoevgeny/shared-foundation'
import { IdentifierRepositoryMock } from '@/mock/repository/identifier/identifier-repository-mock'
import { GetUserIdentifiersUseCase } from './get-user-identifiers-use-case'

describe('GetUserIdentifiersUseCase', () => {
  it('delegates call with params and returns identifiers list on success', async () => {
    const expectedPagedResult = createTestPagedResult({ items: createTestUserIdentifierSummaryList(2) })
    const repo = new IdentifierRepositoryMock()
    repo.getUserIdentifiersResultProvider = async () => appResultSuccess(expectedPagedResult)
    const spy = vi.spyOn(repo, 'getUserIdentifiers')
    const useCase = new GetUserIdentifiersUseCase(repo)

    const params: SelfIdentifierListParams = { pageNumber: 2, pageSize: 20 }
    const result = await useCase.execute(params)

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(expectedPagedResult)
    }
    expect(spy).toHaveBeenCalledWith(params)
  })

  it('returns failure when repository fails to retrieve user identifiers', async () => {
    const expectedError = CommonError.unknown()
    const repo = new IdentifierRepositoryMock()
    repo.getUserIdentifiersResultProvider = async () => appResultFailure(expectedError)
    const useCase = new GetUserIdentifiersUseCase(repo)

    const result = await useCase.execute()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})
