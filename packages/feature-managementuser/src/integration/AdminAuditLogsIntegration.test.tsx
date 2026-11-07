import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'

import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import {
  createTestAuditEventSummaryPayload,
  createTestAuditEventPrivatePayload,
  createTestPagedResultPayload,
  toAuditEventIdOrThrow,
  CompositeAuditActionTypeParser,
  CompositeAuditResourceTypeParser,
  CompositeAuditMetadataKeyParser,
  UserAuditActionType,
  CommonAuditResourceType,
  CommonAuditMetadataKey
} from '@mudrichenkoevgeny/shared-foundation'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AuditEventListScreen, AuditEventListTestTags } from '../ui/screens/management/audit/list/AuditEventListScreen'
import { AuditEventDetailScreen, AuditEventDetailTestTags } from '../ui/screens/management/audit/detail/AuditEventDetailScreen'
import { auditEventListDependenciesMock } from '../mock/ui/screen/management/audit/list/audit-event-list-component-mock'
import { auditEventDetailDependenciesMock } from '../mock/ui/screen/management/audit/detail/audit-event-detail-component-mock'
import { managementUserComponentMock } from '../mock/di/management-user-component-mock'

const EVENT_ID = '00000000-0000-4000-8000-000000000099'

const server = setupServer(
  http.get('https://api.example.com/management/audit/events', () => {
    return HttpResponse.json(createTestPagedResultPayload({
      items: [createTestAuditEventSummaryPayload({ id: toAuditEventIdOrThrow(EVENT_ID), action: 'login_by_email', resource: 'audit_event' })]
    }))
  }),
  http.get(`https://api.example.com/management/audit/events/${EVENT_ID}`, () => {
    return HttpResponse.json(createTestAuditEventPrivatePayload({ id: toAuditEventIdOrThrow(EVENT_ID), action: 'login_by_email', resource: 'audit_event' }))
  })
)

describe('Management Audit Logs Integration Suite', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  const createComponent = () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'https://api.example.com' })
    const compositeActionTypeParser = new CompositeAuditActionTypeParser([UserAuditActionType])
    const compositeResourceTypeParser = new CompositeAuditResourceTypeParser([CommonAuditResourceType])
    const compositeMetadataKeyParser = new CompositeAuditMetadataKeyParser([CommonAuditMetadataKey])

    return managementUserComponentMock({
      commonComponent,
      compositeActionTypeParser,
      compositeResourceTypeParser,
      compositeMetadataKeyParser
    })
  }

  it('Flow 1: Audit Event List - Fetch and render system audit log events', async () => {
    const managementUserComponent = createComponent()

    render(
      <AuditEventListScreen
        dependencies={auditEventListDependenciesMock({
          getAuditEventsUseCase: managementUserComponent.getAuditEventsUseCase,
          onNavigateToEventDetail: vi.fn(),
          onBack: vi.fn()
        })}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId(AuditEventListTestTags.TITLE)).toBeDefined()
    })
  })

  it('Flow 2: Audit Event Detail - View full audit entry metadata', async () => {
    const managementUserComponent = createComponent()

    render(
      <AuditEventDetailScreen
        dependencies={auditEventDetailDependenciesMock({
          eventId: toAuditEventIdOrThrow(EVENT_ID),
          getAuditEventUseCase: managementUserComponent.getAuditEventUseCase,
          onBack: vi.fn()
        })}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId(AuditEventDetailTestTags.TITLE)).toBeDefined()
    })
  })
})
