import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UnlockRootContainer } from '@/ui/screens/auth/unlock/root/UnlockRootContainer'

describe('UnlockRootContainer', () => {
  it('renders children content and triggers onDismiss when backdrop clicked', async () => {
    const onDismiss = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <UnlockRootContainer onDismiss={onDismiss}>
          <div>Unlock Step Content</div>
        </UnlockRootContainer>
      </ComponentTestHarness>
    )

    expect(screen.getByText('Unlock Step Content')).toBeDefined()

    const dialogBackdrop = screen.getByRole('dialog')
    await user.click(dialogBackdrop)

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('triggers onDismiss when Escape key is pressed', async () => {
    const onDismiss = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <UnlockRootContainer onDismiss={onDismiss}>
          <div>Unlock Step Content</div>
        </UnlockRootContainer>
      </ComponentTestHarness>
    )

    await user.keyboard('{Escape}')
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})
