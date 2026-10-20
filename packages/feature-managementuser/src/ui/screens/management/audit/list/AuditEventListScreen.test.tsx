import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestAuditEventPrivateList, createTestPagedResult, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { AuditEventListScreen, AuditEventListTestTags } from '@/ui/screens/management/audit/list/AuditEventListScreen'
import { auditEventListDependenciesMock } from '@/mock/ui/screen/management/audit/list/audit-event-list-component-mock'
import { GetAuditEventsUseCaseMock } from '@/mock/usecase/audit/get-audit-events-use-case-mock'
import type { AuditEventListStoreDependencies } from '@/ui/screens/management/audit/list/AuditEventListStore'

describe('AuditEventListScreen', () => {
  const createMockDeps = (): AuditEventListStoreDependencies => {
    const getAuditEventsUseCase = new GetAuditEventsUseCaseMock()
    getAuditEventsUseCase.resultProvider = async () =>
      appResultSuccess(
        createTestPagedResult({
          items: createTestAuditEventPrivateList(1)
        })
      )
    vi.spyOn(getAuditEventsUseCase, 'execute').mockImplementation(getAuditEventsUseCase.execute.bind(getAuditEventsUseCase))

    return auditEventListDependenciesMock({
      getAuditEventsUseCase,
      onNavigateToEventDetail: vi.fn(),
      onBack: vi.fn()
    })
  }

  it('renders audit events list and handles item click', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <AuditEventListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(AuditEventListTestTags.TITLE)).toBeDefined()
    expect(screen.getByText(userStrings.ui.auditLogsTitle)).toBeDefined()
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
