import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { auditEventMock } from '@/mock/audit/domain/model/event/audit-event-mock'
import { AuditEventDetailScreen, AuditEventDetailTestTags } from '@/ui/screens/management/audit/detail/AuditEventDetailScreen'
import type { AuditEventDetailStoreDependencies } from '@/ui/screens/management/audit/detail/AuditEventDetailStore'
import { enManagementUserStrings } from '@/locales/index'

describe('AuditEventDetailScreen', () => {
  const createMockDeps = (): AuditEventDetailStoreDependencies => ({
    eventId: auditEventMock().id,
    getAuditEventUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(auditEventMock()))
    } as unknown as AuditEventDetailStoreDependencies['getAuditEventUseCase'],
    onBack: vi.fn()
  })

  it('renders event details and handles back button click', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <AuditEventDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(AuditEventDetailTestTags.TITLE)).toBeDefined()
    expect(screen.getByTestId(AuditEventDetailTestTags.TITLE).textContent).toContain(enManagementUserStrings.audit_event_details_title)
    expect(screen.getByTestId(AuditEventDetailTestTags.BACK_BUTTON)).toBeDefined()

    const backButton = screen.getByTestId(AuditEventDetailTestTags.BACK_BUTTON)
    await user.click(backButton)

    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })
})
