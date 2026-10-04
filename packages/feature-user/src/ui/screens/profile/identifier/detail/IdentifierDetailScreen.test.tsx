import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toUserIdentifierIdOrThrow, toUserIdOrThrow, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'
import { IdentifierDetailScreen, IdentifierDetailTestTags } from '@/ui/screens/profile/identifier/detail/IdentifierDetailScreen'
import type { IdentifierDetailStoreDependencies } from '@/ui/screens/profile/identifier/detail/IdentifierDetailStore'
import { enUserStrings } from '@/locales/index'

describe('IdentifierDetailScreen', () => {
  const mockIdentifier: UserIdentifier = {
    id: toUserIdentifierIdOrThrow('660e8400-e29b-41d4-a716-446655440001'),
    userId: toUserIdOrThrow('usr_12345'),
    userAuthProvider: UserAuthProvider.EMAIL,
    identifier: 'user@example.com',
    displayName: 'user@example.com',
    externalProviderEmail: null,
    isSensitiveValuesMasked: false,
    createdAt: 1680000000000,
    updatedAt: null
  }

  const createMockDeps = (isCurrent = false): IdentifierDetailStoreDependencies => ({
    identifier: mockIdentifier,
    isCurrentIdentifier: isCurrent,
    deleteUserIdentifierUseCase: {
      invoke: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as any,
    emailChangePasswordUseCase: {
      invoke: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as any,
    deletePassword: vi.fn().mockResolvedValue(undefined),
    onIdentifierDeleted: vi.fn(),
    onNavigateToUserDetail: vi.fn(),
    onNavigateToProfile: vi.fn(),
    onBack: vi.fn()
  })

  it('renders identifier detail card and buttons', () => {
    const deps = createMockDeps(false)

    render(
      <ComponentTestHarness>
        <IdentifierDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(screen.getByTestId(IdentifierDetailTestTags.TITLE).textContent).toBe(enUserStrings.identifier_detail_title)
    expect(screen.getByTestId(IdentifierDetailTestTags.CHANGE_PASSWORD_BUTTON)).not.toBeNull()
    expect(screen.getByTestId(IdentifierDetailTestTags.DELETE_PASSWORD_BUTTON)).not.toBeNull()
    expect(screen.getByTestId(IdentifierDetailTestTags.DELETE_BUTTON)).not.toBeNull()
  })

  it('hides delete button when identifier is current session identifier', () => {
    const deps = createMockDeps(true)

    render(
      <ComponentTestHarness>
        <IdentifierDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(screen.getByTestId(IdentifierDetailTestTags.TITLE).textContent).toBe(enUserStrings.identifier_detail_title_current)
    expect(screen.queryByTestId(IdentifierDetailTestTags.DELETE_BUTTON)).toBeNull()
  })

  it('shows change password modal and calls emailChangePasswordUseCase on submit', async () => {
    const deps = createMockDeps(false)
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <IdentifierDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await user.click(screen.getByTestId(IdentifierDetailTestTags.CHANGE_PASSWORD_BUTTON))

    const oldPassInput = screen.getByPlaceholderText(enUserStrings.old_password)
    const newPassInput = screen.getByPlaceholderText(enUserStrings.new_password)

    await user.type(oldPassInput, 'old_secret')
    await user.type(newPassInput, 'new_secret')

    const confirmBtn = screen.getByRole('button', { name: enUserStrings.dialog_confirm })
    await user.click(confirmBtn)

    expect(deps.emailChangePasswordUseCase?.invoke).toHaveBeenCalledWith('user@example.com', 'old_secret', 'new_secret')
  })

  it('calls deletePassword callback when delete password button is clicked', async () => {
    const deps = createMockDeps(false)
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <IdentifierDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await user.click(screen.getByTestId(IdentifierDetailTestTags.DELETE_PASSWORD_BUTTON))
    expect(deps.deletePassword).toHaveBeenCalledWith(mockIdentifier.id)
  })

  it('triggers onBack when back button is clicked', async () => {
    const deps = createMockDeps(false)
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <IdentifierDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await user.click(screen.getByTestId(IdentifierDetailTestTags.BACK_BUTTON))
    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })
})
