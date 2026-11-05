import { describe, it, expect, vi } from 'vitest'
import { appResultFailure, appResultSuccess, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestAuditEventSummaryList, createTestPagedResult } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuditEventListParams } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementAuditRepositoryMock } from '@/mock/audit/repository/management-audit-repository-mock'
import { GetAuditEventsUseCase } from './get-audit-events-use-case'

describe('GetAuditEventsUseCase', () => {
  it('delegates to audit repository with params and returns paged audit events on success', async () => {
    const expectedPagedResult = createTestPagedResult({ items: createTestAuditEventSummaryList(2) })
    const repo = new ManagementAuditRepositoryMock()
    repo.getAuditEventsResultProvider = async () => appResultSuccess(expectedPagedResult)
    const spy = vi.spyOn(repo, 'getAuditEvents')
    const useCase = new GetAuditEventsUseCase(repo)

    const params: ManagementAuditEventListParams = { pageNumber: 1, pageSize: 10 }
    const result = await useCase.execute(params)

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(expectedPagedResult)
    }
    expect(spy).toHaveBeenCalledWith(params)
  })

  it('returns failure when audit repository getAuditEvents fails', async () => {
    const expectedError = CommonError.unknown()
    const repo = new ManagementAuditRepositoryMock()
    repo.getAuditEventsResultProvider = async () => appResultFailure(expectedError)
    const useCase = new GetAuditEventsUseCase(repo)

    const result = await useCase.execute()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})
