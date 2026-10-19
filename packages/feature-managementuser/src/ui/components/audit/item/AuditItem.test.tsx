import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { AuditItem } from '@/ui/components/audit/item/AuditItem'
import { auditEventMock } from '@/mock/audit/domain/model/event/audit-event-mock'

describe('AuditItem', () => {
  it('renders event details and handles click', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    const event = auditEventMock()

    render(
      <ComponentTestHarness>
        <AuditItem event={event} onClick={onClick} />
      </ComponentTestHarness>
    )

    expect(screen.getByText(`${userStrings.ui.auditEventId}: ${event.id}`)).toBeDefined()
    expect(screen.getByText(`${userStrings.ui.auditEventStatus}: ${event.status}`)).toBeDefined()

    const item = screen.getByTestId(`AuditItem_${event.id}`)
    await user.click(item)

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
