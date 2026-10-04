import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ProfileRootContainer } from './ProfileRootContainer'

describe('ProfileRootContainer', () => {
  it('renders children inside dialog modal', () => {
    render(
      <ComponentTestHarness>
        <ProfileRootContainer onDismiss={vi.fn()}>
          <div>Profile Root Content</div>
        </ProfileRootContainer>
      </ComponentTestHarness>
    )

    expect(screen.getByRole('dialog')).not.toBeNull()
    expect(screen.getByText('Profile Root Content')).not.toBeNull()
  })

  it('triggers onDismiss when overlay backdrop is clicked', async () => {
    const onDismiss = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <ProfileRootContainer onDismiss={onDismiss}>
          <div>Inner Content</div>
        </ProfileRootContainer>
      </ComponentTestHarness>
    )

    const overlay = screen.getByRole('dialog')
    await user.click(overlay)

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('triggers onDismiss when Escape key is pressed', async () => {
    const onDismiss = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <ProfileRootContainer onDismiss={onDismiss}>
          <button type="button">Focusable Button</button>
        </ProfileRootContainer>
      </ComponentTestHarness>
    )

    await user.keyboard('{Escape}')
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})
