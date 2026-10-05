import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SessionItem } from '@/ui/components/session/item/SessionItem'
import { enUserStrings } from '@/locales/index'
import { userSessionMock } from '@/mock/domain/model/session/user-session-mock'

describe('SessionItem', () => {
  it('renders session details and handles revoke button click', async () => {
    const onRevokeClick = vi.fn()
    const user = userEvent.setup()

    const session = userSessionMock({
      identifierDisplayName: 'user@example.com',
      ipAddress: '192.168.1.1'
    })

    render(
      <ComponentTestHarness>
        <SessionItem session={session} onRevokeClick={onRevokeClick} enabled />
      </ComponentTestHarness>
    )

    expect(screen.getByText('user@example.com')).toBeDefined()
    expect(screen.getByText('IP: 192.168.1.1')).toBeDefined()

    const revokeButton = screen.getByRole('button', { name: enUserStrings.session_revoke })
    await user.click(revokeButton)

    expect(onRevokeClick).toHaveBeenCalledTimes(1)
  })

  it('handles keyboard navigation with Enter key when onSessionClick is provided', async () => {
    const onSessionClick = vi.fn()
    const user = userEvent.setup()
    const session = userSessionMock()

    render(
      <ComponentTestHarness>
        <SessionItem session={session} onRevokeClick={vi.fn()} onSessionClick={onSessionClick} />
      </ComponentTestHarness>
    )

    const button = screen.getByRole('button', { name: enUserStrings.session_detail_title_session })
    button.focus()
    expect(button).toBe(document.activeElement)

    await user.keyboard('{Enter}')
    expect(onSessionClick).toHaveBeenCalledTimes(1)
  })

  it('hides revoke button when isCurrentSession is true', () => {
    const session = userSessionMock()

    render(
      <ComponentTestHarness>
        <SessionItem session={session} onRevokeClick={vi.fn()} enabled isCurrentSession />
      </ComponentTestHarness>
    )

    expect(screen.queryByRole('button', { name: enUserStrings.session_revoke })).toBeNull()
  })

  it('disables revoke button when enabled is false', async () => {
    const onRevokeClick = vi.fn()
    const user = userEvent.setup()

    const session = userSessionMock()

    render(
      <ComponentTestHarness>
        <SessionItem session={session} onRevokeClick={onRevokeClick} enabled={false} />
      </ComponentTestHarness>
    )

    const revokeButton = screen.getByRole('button', { name: enUserStrings.session_revoke })
    expect(revokeButton.getAttribute('disabled')).not.toBeNull()

    await user.click(revokeButton)
    expect(onRevokeClick).not.toHaveBeenCalled()
  })
})
