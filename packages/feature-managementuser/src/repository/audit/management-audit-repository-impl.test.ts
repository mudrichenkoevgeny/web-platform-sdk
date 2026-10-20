import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ManagementAuditRepositoryImpl } from '@/repository/audit/management-audit-repository-impl'
import { ManagementAuditApiMock } from '@/mock/network/api/audit/management-audit-api-mock'
import { createTestAuditEventPrivatePayload, createTestPagedResultPayload, managementAuditEventListParamsSchema, TEST_AUDIT_EVENT_ID, toAuditEventIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'

describe('ManagementAuditRepositoryImpl', () => {
  let mockApi: ManagementAuditApiMock
  let repository: ManagementAuditRepositoryImpl
  let mockActionParser: { fromValueOrThrow: ReturnType<typeof vi.fn> }
  let mockResourceParser: { fromValueOrThrow: ReturnType<typeof vi.fn> }
  let mockMetadataParser: { fromValueOrThrow: ReturnType<typeof vi.fn> }

  const mockAuditEventPayload = createTestAuditEventPrivatePayload({
    id: toAuditEventIdOrThrow(TEST_AUDIT_EVENT_ID)
  })

  beforeEach(() => {
    vi.clearAllMocks()

    mockActionParser = {
      fromValueOrThrow: vi.fn().mockImplementation((val) => val)
    }
    mockResourceParser = {
      fromValueOrThrow: vi.fn().mockImplementation((val) => val)
    }
    mockMetadataParser = {
      fromValueOrThrow: vi.fn().mockImplementation((val) => val)
    }

    mockApi = new ManagementAuditApiMock()
    mockApi.getAuditEventsResult = appResultSuccess(createTestPagedResultPayload({
      items: [mockAuditEventPayload],
      total_count: 1,
      page_number: 1,
      page_size: 10,
      total_pages: 1
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
    const params = managementAuditEventListParamsSchema.parse({ pageNumber: 1, pageSize: 10 })
    const result = await repository.getAuditEvents(params)
    expect(mockApi.getAuditEvents).toHaveBeenCalledWith(params)
    expect(isSuccess(result)).toBe(true)
    expect(mockActionParser.fromValueOrThrow).toHaveBeenCalledTimes(1)
    expect(mockActionParser.fromValueOrThrow).toHaveBeenCalledWith(mockAuditEventPayload.action)
    expect(mockResourceParser.fromValueOrThrow).toHaveBeenCalledTimes(1)
    expect(mockResourceParser.fromValueOrThrow).toHaveBeenCalledWith(mockAuditEventPayload.resource)
  })

  it('delegates getAuditEvent and maps response to domain event using toAuditEventPrivate', async () => {
    const id = toAuditEventIdOrThrow(TEST_AUDIT_EVENT_ID)
    const result = await repository.getAuditEvent(id)
    expect(mockApi.getAuditEvent).toHaveBeenCalledWith(id)
    expect(isSuccess(result)).toBe(true)
    expect(mockActionParser.fromValueOrThrow).toHaveBeenCalledWith(mockAuditEventPayload.action)
    expect(mockResourceParser.fromValueOrThrow).toHaveBeenCalledWith(mockAuditEventPayload.resource)
  })
})
