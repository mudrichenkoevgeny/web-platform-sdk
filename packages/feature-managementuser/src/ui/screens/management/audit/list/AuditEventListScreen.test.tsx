import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { auditEventMock } from '@/mock/audit/domain/model/event/audit-event-mock'
import { AuditEventListScreen, AuditEventListTestTags } from '@/ui/screens/management/audit/list/AuditEventListScreen'
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
    } as unknown as AuditEventListStoreDependencies['getAuditEventsUseCase'],
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

    expect(await screen.findByTestId(AuditEventListTestTags.TITLE)).toBeDefined()
    expect(screen.getByText(enManagementUserStrings.audit_logs_title)).toBeDefined()
    expect(screen.getByTestId(AuditEventListTestTags.BACK_BUTTON)).toBeDefined()
    expect(screen.getByTestId(AuditEventListTestTags.FILTER_BUTTON)).toBeDefined()
    expect(screen.getByTestId(AuditEventListTestTags.REFRESH_BUTTON)).toBeDefined()

    const item = screen.getByTestId(/^AuditItem_/)
    await user.click(item)

    expect(deps.onNavigateToEventDetail).toHaveBeenCalledTimes(1)
  })

  it('executes getAuditEventsUseCase only once on initial render and prevents duplicate calls', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <AuditEventListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(AuditEventListTestTags.TITLE)).toBeDefined()
    expect(deps.getAuditEventsUseCase.execute).toHaveBeenCalledTimes(1)
  })
})
