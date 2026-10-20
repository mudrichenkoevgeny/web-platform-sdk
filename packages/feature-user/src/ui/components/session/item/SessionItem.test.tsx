import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { TEST_EMAIL, TEST_IP_ADDRESS, userStrings, createTestUserSessionPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { SessionItem } from '@/ui/components/session/item/SessionItem'

describe('SessionItem', () => {
  it('renders session details and handles revoke button click', async () => {
    const onRevokeClick = vi.fn()
    const user = userEvent.setup()

    const session = createTestUserSessionPrivate({
      identifierDisplayName: TEST_EMAIL,
      ipAddress: TEST_IP_ADDRESS
    })

    render(
      <ComponentTestHarness>
        <SessionItem session={session} onRevokeClick={onRevokeClick} enabled />
      </ComponentTestHarness>
    )

    expect(screen.getByText(TEST_EMAIL)).toBeDefined()

    const revokeButton = screen.getByRole('button', { name: userStrings.ui.sessionRevoke })
    await user.click(revokeButton)

    expect(onRevokeClick).toHaveBeenCalledTimes(1)
  })

  it('handles keyboard navigation with Enter key when onSessionClick is provided', async () => {
    const onSessionClick = vi.fn()
    const user = userEvent.setup()
    const session = createTestUserSessionPrivate()

    render(
      <ComponentTestHarness>
        <SessionItem session={session} onRevokeClick={vi.fn()} onSessionClick={onSessionClick} />
      </ComponentTestHarness>
    )

    const button = screen.getByRole('button', { name: userStrings.ui.sessionDetailTitleSession })
    button.focus()
    expect(button).toBe(document.activeElement)

    await user.keyboard('{Enter}')
    expect(onSessionClick).toHaveBeenCalledTimes(1)
  })

  it('hides revoke button when isCurrentSession is true', () => {
    const session = createTestUserSessionPrivate()

    render(
      <ComponentTestHarness>
        <SessionItem session={session} onRevokeClick={vi.fn()} enabled isCurrentSession />
      </ComponentTestHarness>
    )

    expect(screen.queryByRole('button', { name: userStrings.ui.sessionRevoke })).toBeNull()
  })

  it('disables revoke button when enabled is false', async () => {
    const onRevokeClick = vi.fn()
    const user = userEvent.setup()

    const session = createTestUserSessionPrivate()

    render(
      <ComponentTestHarness>
        <SessionItem session={session} onRevokeClick={onRevokeClick} enabled={false} />
      </ComponentTestHarness>
    )

    const revokeButton = screen.getByRole('button', { name: userStrings.ui.sessionRevoke })
    expect(revokeButton.getAttribute('disabled')).not.toBeNull()

    await user.click(revokeButton)
    expect(onRevokeClick).not.toHaveBeenCalled()
  })
})
