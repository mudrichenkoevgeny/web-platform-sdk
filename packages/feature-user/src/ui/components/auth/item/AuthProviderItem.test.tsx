import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { AuthProviderItem } from '@/ui/components/auth/item/AuthProviderItem'
import { enUserStrings } from '@/locales/index'

describe('AuthProviderItem', () => {
  it('renders provider icon tile and handles click event', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <AuthProviderItem authProvider={UserAuthProvider.GOOGLE} onClick={onClick} />
      </ComponentTestHarness>
    )

    const button = screen.getByRole('button', { name: enUserStrings.sign_in_with_google })
    expect(button).toBeDefined()

    await user.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders aria-label for all provider types', () => {
    const { rerender } = render(
      <ComponentTestHarness>
        <AuthProviderItem authProvider={UserAuthProvider.EMAIL} />
      </ComponentTestHarness>
    )
    expect(screen.getByRole('button', { name: enUserStrings.sign_in_with_email })).toBeDefined()

    rerender(
      <ComponentTestHarness>
        <AuthProviderItem authProvider={UserAuthProvider.PHONE} />
      </ComponentTestHarness>
    )
    expect(screen.getByRole('button', { name: enUserStrings.sign_in_with_phone })).toBeDefined()

    rerender(
      <ComponentTestHarness>
        <AuthProviderItem authProvider={UserAuthProvider.APPLE} />
      </ComponentTestHarness>
    )
    expect(screen.getByRole('button', { name: enUserStrings.sign_in_with_apple })).toBeDefined()
  })

  it('does not trigger click when disabled', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <AuthProviderItem authProvider={UserAuthProvider.EMAIL} disabled onClick={onClick} />
      </ComponentTestHarness>
    )

    const button = screen.getByRole('button')
    expect(button.getAttribute('disabled')).not.toBeNull()

    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })
})
