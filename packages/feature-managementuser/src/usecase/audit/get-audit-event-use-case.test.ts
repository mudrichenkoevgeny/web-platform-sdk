import { describe, it, expect, vi } from 'vitest'
import { appResultFailure, appResultSuccess, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestAuditEventPrivate, toAuditEventIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementAuditRepositoryMock } from '@/mock/audit/repository/management-audit-repository-mock'
import { GetAuditEventUseCase } from './get-audit-event-use-case'

describe('GetAuditEventUseCase', () => {
  it('delegates to audit repository getAuditEvent and returns payload on success', async () => {
    const expectedEvent = createTestAuditEventPrivate()
    const repo = new ManagementAuditRepositoryMock()
    repo.getAuditEventResultProvider = async () => appResultSuccess(expectedEvent)
    const spy = vi.spyOn(repo, 'getAuditEvent')
    const useCase = new GetAuditEventUseCase(repo)
    const eventId = toAuditEventIdOrThrow('event-123')

    const result = await useCase.execute(eventId)

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(expectedEvent)
    }
    expect(spy).toHaveBeenCalledWith(eventId)
  })

  it('returns failure when audit repository getAuditEvent fails', async () => {
    const expectedError = CommonError.unknown()
    const repo = new ManagementAuditRepositoryMock()
    repo.getAuditEventResultProvider = async () => appResultFailure(expectedError)
    const useCase = new GetAuditEventUseCase(repo)
    const eventId = toAuditEventIdOrThrow('event-123')

    const result = await useCase.execute(eventId)

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})
