import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { auditEventMock } from '@/mock/audit/domain/model/event/audit-event-mock'
import { AuditEventDetailScreen } from '@/ui/screens/management/audit/detail/AuditEventDetailScreen'
import type { AuditEventDetailStoreDependencies } from '@/ui/screens/management/audit/detail/AuditEventDetailStore'
import { enManagementUserStrings } from '@/locales/index'

describe('AuditEventDetailScreen', () => {
  const createMockDeps = (): AuditEventDetailStoreDependencies => ({
    eventId: auditEventMock().id,
    getAuditEventUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(auditEventMock()))
    } as any,
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

    expect(await screen.findByText(enManagementUserStrings.audit_event_details_title)).toBeDefined()

    const backButton = screen.getByRole('button', { name: 'Go back' })
    await user.click(backButton)

    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })
})
