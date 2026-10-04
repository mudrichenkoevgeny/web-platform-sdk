import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { AuthProviderButton } from './AuthProviderButton'
import { AuthProviderButtonMode } from './AuthProviderButtonMode'
import { enUserStrings } from '@/locales/index'

describe('AuthProviderButton', () => {
  it('renders default SIGN_IN mode label for Email and handles click event', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <AuthProviderButton authProvider={UserAuthProvider.EMAIL} onClick={onClick} />
      </ComponentTestHarness>
    )

    const button = screen.getByRole('button', { name: enUserStrings.sign_in_with_email })
    expect(button).toBeDefined()

    await user.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders ADD mode label for Phone', () => {
    render(
      <ComponentTestHarness>
        <AuthProviderButton
          authProvider={UserAuthProvider.PHONE}
          mode={AuthProviderButtonMode.ADD}
        />
      </ComponentTestHarness>
    )

    expect(screen.getByRole('button', { name: enUserStrings.identifier_add_phone })).toBeDefined()
  })

  it('renders Google sign in button', () => {
    render(
      <ComponentTestHarness>
        <AuthProviderButton authProvider={UserAuthProvider.GOOGLE} />
      </ComponentTestHarness>
    )

    expect(screen.getByRole('button', { name: enUserStrings.sign_in_with_google })).toBeDefined()
  })

  it('renders Apple add identifier button', () => {
    render(
      <ComponentTestHarness>
        <AuthProviderButton
          authProvider={UserAuthProvider.APPLE}
          mode={AuthProviderButtonMode.ADD}
        />
      </ComponentTestHarness>
    )

    expect(screen.getByRole('button', { name: enUserStrings.identifier_add_apple })).toBeDefined()
  })

  it('does not trigger click when disabled', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <AuthProviderButton
          authProvider={UserAuthProvider.EMAIL}
          disabled
          onClick={onClick}
        />
      </ComponentTestHarness>
    )

    const button = screen.getByRole('button')
    expect(button.getAttribute('disabled')).not.toBeNull()

    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })
})
