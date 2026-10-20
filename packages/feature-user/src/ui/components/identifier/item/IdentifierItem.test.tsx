import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { TEST_EMAIL, UserAuthProvider, createTestUserIdentifierPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { IdentifierItem } from '@/ui/components/identifier/item/IdentifierItem'

describe('IdentifierItem', () => {
  it('renders display name and provider and handles click', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    const identifier = createTestUserIdentifierPrivate({
      displayName: TEST_EMAIL,
      userAuthProvider: UserAuthProvider.EMAIL
    })

    render(
      <ComponentTestHarness>
        <IdentifierItem identifier={identifier} onClick={onClick} />
      </ComponentTestHarness>
    )

    expect(screen.getByText(TEST_EMAIL)).toBeDefined()
    expect(screen.getByText('email')).toBeDefined()

    await user.click(screen.getByText(TEST_EMAIL))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('handles keyboard navigation with Enter key when onClick is provided', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    const identifier = createTestUserIdentifierPrivate()

    render(
      <ComponentTestHarness>
        <IdentifierItem identifier={identifier} onClick={onClick} />
      </ComponentTestHarness>
    )

    const button = screen.getByRole('button')
    button.focus()
    expect(button).toBe(document.activeElement)

    await user.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('applies highlighted current identifier styling when isCurrentIdentifier is true', () => {
    const identifier = createTestUserIdentifierPrivate()

    const { container } = render(
      <ComponentTestHarness>
        <IdentifierItem identifier={identifier} isCurrentIdentifier />
      </ComponentTestHarness>
    )

    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('bg-primary/10')
  })
})
