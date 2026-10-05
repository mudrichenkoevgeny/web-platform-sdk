import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { auditEventMock } from '@/mock/audit/domain/model/event/audit-event-mock'
import { AuditEventListScreen } from '@/ui/screens/management/audit/list/AuditEventListScreen'
import type { AuditEventListStoreDependencies } from '@/ui/screens/management/audit/list/AuditEventListStore'
import { enManagementUserStrings } from '@/locales/index'

describe('AuditEventListScreen', () => {
  const createMockDeps = (): AuditEventListStoreDependencies => ({
    getAuditEventsUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          items: [auditEventMock()],
          pageNumber: 1,
          pageSize: 20,
          totalItems: 1,
          totalPages: 1
        })
      )
    } as any,
    onNavigateToEventDetail: vi.fn(),
    onBack: vi.fn()
  })

  it('renders audit events list and handles item click', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <AuditEventListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByText(enManagementUserStrings.audit_logs_title)).toBeDefined()

    const item = screen.getByTestId(/^AuditItem_/)
    await user.click(item)

    expect(deps.onNavigateToEventDetail).toHaveBeenCalledTimes(1)
  })
})
