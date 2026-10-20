import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ManagementAuditRepositoryImpl } from '@/repository/audit/management-audit-repository-impl'
import { ManagementAuditApiMock } from '@/mock/network/api/audit/management-audit-api-mock'
import { createTestAuditEventPrivatePayload, createTestPagedResult, managementAuditEventListParamsSchema, TEST_AUDIT_EVENT_ID, toAuditEventIdOrThrow, CompositeAuditActionTypeParser, CompositeAuditResourceTypeParser, CompositeAuditMetadataKeyParser } from '@mudrichenkoevgeny/shared-foundation'

describe('ManagementAuditRepositoryImpl', () => {
  let mockApi: ManagementAuditApiMock
  let repository: ManagementAuditRepositoryImpl
  let mockActionParser: CompositeAuditActionTypeParser
  let mockResourceParser: CompositeAuditResourceTypeParser
  let mockMetadataParser: CompositeAuditMetadataKeyParser

  const mockAuditEventPayload = createTestAuditEventPrivatePayload({
    id: toAuditEventIdOrThrow(TEST_AUDIT_EVENT_ID)
  })

  beforeEach(() => {
    vi.clearAllMocks()

    mockActionParser = new CompositeAuditActionTypeParser([])
    vi.spyOn(mockActionParser, 'fromValueOrThrow').mockImplementation((val: string) => val)
    mockResourceParser = new CompositeAuditResourceTypeParser([])
    vi.spyOn(mockResourceParser, 'fromValueOrThrow').mockImplementation((val: string) => val)
    mockMetadataParser = new CompositeAuditMetadataKeyParser([])
    vi.spyOn(mockMetadataParser, 'fromValueOrThrow').mockImplementation((val: string) => val)

    mockApi = new ManagementAuditApiMock()
    mockApi.getAuditEventsResult = appResultSuccess(createTestPagedResult({
      items: [mockAuditEventPayload],
      totalCount: 1,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1
    }))
    mockApi.getAuditEventResult = appResultSuccess(mockAuditEventPayload)

    vi.spyOn(mockApi, 'getAuditEvents').mockImplementation(mockApi.getAuditEvents.bind(mockApi))
    vi.spyOn(mockApi, 'getAuditEvent').mockImplementation(mockApi.getAuditEvent.bind(mockApi))

    repository = new ManagementAuditRepositoryImpl(
      mockApi,
      mockActionParser,
      mockResourceParser,
      mockMetadataParser
    )
  })

  it('delegates getAuditEvents and maps paged items to domain events', async () => {
    const auditEventListParams = managementAuditEventListParamsSchema.parse({ pageNumber: 1, pageSize: 10 })
    const auditEventsResult = await repository.getAuditEvents(auditEventListParams)
    expect(mockApi.getAuditEvents).toHaveBeenCalledWith(auditEventListParams)
    expect(isSuccess(auditEventsResult)).toBe(true)
    expect(mockActionParser.fromValueOrThrow).toHaveBeenCalledTimes(1)
    expect(mockActionParser.fromValueOrThrow).toHaveBeenCalledWith(mockAuditEventPayload.action)
    expect(mockResourceParser.fromValueOrThrow).toHaveBeenCalledTimes(1)
    expect(mockResourceParser.fromValueOrThrow).toHaveBeenCalledWith(mockAuditEventPayload.resource)
  })

  it('delegates getAuditEvent and maps response to domain event using toAuditEventPrivate', async () => {
    const auditEventId = toAuditEventIdOrThrow(TEST_AUDIT_EVENT_ID)
    const auditEventResult = await repository.getAuditEvent(auditEventId)
    expect(mockApi.getAuditEvent).toHaveBeenCalledWith(auditEventId)
    expect(isSuccess(auditEventResult)).toBe(true)
    expect(mockActionParser.fromValueOrThrow).toHaveBeenCalledWith(mockAuditEventPayload.action)
    expect(mockResourceParser.fromValueOrThrow).toHaveBeenCalledWith(mockAuditEventPayload.resource)
  })
})
