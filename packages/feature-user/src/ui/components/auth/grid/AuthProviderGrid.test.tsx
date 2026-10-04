import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { AuthProviderGrid } from './AuthProviderGrid'
import { enUserStrings } from '@/locales/index'

describe('AuthProviderGrid', () => {
  it('renders provider items and triggers onProviderClick with clicked provider', async () => {
    const onProviderClick = vi.fn()
    const user = userEvent.setup()

    const providers = [
      UserAuthProvider.EMAIL,
      UserAuthProvider.PHONE,
      UserAuthProvider.GOOGLE,
      UserAuthProvider.APPLE
    ]

    render(
      <ComponentTestHarness>
        <AuthProviderGrid authProviders={providers} onProviderClick={onProviderClick} />
      </ComponentTestHarness>
    )

    const googleButton = screen.getByRole('button', { name: enUserStrings.sign_in_with_google })
    expect(googleButton).toBeDefined()

    await user.click(googleButton)
    expect(onProviderClick).toHaveBeenCalledTimes(1)
    expect(onProviderClick).toHaveBeenCalledWith(UserAuthProvider.GOOGLE)
  })

  it('renders empty container when authProviders list is empty', () => {
    const onProviderClick = vi.fn()

    const { container } = render(
      <ComponentTestHarness>
        <AuthProviderGrid authProviders={[]} onProviderClick={onProviderClick} />
      </ComponentTestHarness>
    )

    expect(container.querySelectorAll('button').length).toBe(0)
  })

  it('disables all items when disabled is true', async () => {
    const onProviderClick = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <AuthProviderGrid
          authProviders={[UserAuthProvider.GOOGLE, UserAuthProvider.APPLE]}
          onProviderClick={onProviderClick}
          disabled
        />
      </ComponentTestHarness>
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBe(2)
    buttons.forEach((btn) => {
      expect(btn.getAttribute('disabled')).not.toBeNull()
    })

    if (buttons[0]) {
      await user.click(buttons[0])
    }
    expect(onProviderClick).not.toHaveBeenCalled()
  })
})
