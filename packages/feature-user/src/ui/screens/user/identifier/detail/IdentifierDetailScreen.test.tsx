import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TEST_EMAIL, TEST_IDENTIFIER_ID, TEST_USER_ID, toUserIdentifierIdOrThrow, toUserIdOrThrow, UserAuthProvider, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserIdentifierPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { IdentifierDetailScreen, IdentifierDetailTestTags } from '@/ui/screens/user/identifier/detail/IdentifierDetailScreen'
import { DeleteUserIdentifierUseCaseMock } from '@/mock/usecase/identifier/delete-user-identifier-use-case-mock'
import { EmailChangePasswordUseCaseMock } from '@/mock/usecase/identifier/email-change-password-use-case-mock'
import { GetUserIdentifierUseCaseMock } from '@/mock/usecase/identifier/get-user-identifier-use-case-mock'
import type { IdentifierDetailStoreDependencies } from '@/ui/screens/user/identifier/detail/identifier-detail-store'

describe('IdentifierDetailScreen', () => {
  const mockIdentifier: UserIdentifierPrivate = {
    id: toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID),
    userId: toUserIdOrThrow(TEST_USER_ID),
    userAuthProvider: UserAuthProvider.EMAIL,
    identifier: TEST_EMAIL,
    displayName: TEST_EMAIL,
    externalProviderEmail: null,
    isSensitiveValuesMasked: false,
    createdAt: 1680000000000,
    updatedAt: null
  }

  const createMockDeps = (isCurrent = false): IdentifierDetailStoreDependencies => {
    const deleteUserIdentifierUseCase = new DeleteUserIdentifierUseCaseMock()
    vi.spyOn(deleteUserIdentifierUseCase, 'execute')

    const emailChangePasswordUseCase = new EmailChangePasswordUseCaseMock()
    vi.spyOn(emailChangePasswordUseCase, 'execute')

    return {
      identifier: mockIdentifier,
      isCurrentIdentifier: isCurrent,
      deleteUserIdentifierUseCase,
      emailChangePasswordUseCase,
      deletePassword: vi.fn().mockResolvedValue(undefined),
      onIdentifierDeleted: vi.fn(),
      onNavigateToUserDetail: vi.fn(),
      onNavigateToUserMain: vi.fn(),
      onBack: vi.fn()
    }
  }

  it('renders identifier detail card and buttons', () => {
    const deps = createMockDeps(false)

    render(
      <ComponentTestHarness>
        <IdentifierDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(screen.getByTestId(IdentifierDetailTestTags.TITLE).textContent).toBe(userStrings.ui.identifierDetailTitle)
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

    expect(screen.getByTestId(IdentifierDetailTestTags.TITLE).textContent).toBe(userStrings.ui.identifierDetailTitleCurrent)
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

    const oldPassInput = screen.getByPlaceholderText(userStrings.ui.oldPassword)
    const newPassInput = screen.getByPlaceholderText(userStrings.ui.newPassword)

    await user.type(oldPassInput, 'old_secret')
    await user.type(newPassInput, 'new_secret')

    const confirmBtn = screen.getByRole('button', { name: userStrings.ui.dialogConfirm })
    await user.click(confirmBtn)

    expect(deps.emailChangePasswordUseCase?.execute).toHaveBeenCalledWith(mockIdentifier.id, 'old_secret', 'new_secret')
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

  it('navigates to user detail when clicking user for identifier matching currentUserId', async () => {
    const deps = createMockDeps(false)
    deps.currentUserId = mockIdentifier.userId
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <IdentifierDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await user.click(screen.getByTestId(IdentifierDetailTestTags.USER_ROW))
    expect(deps.onNavigateToUserDetail).toHaveBeenCalledWith(mockIdentifier.userId)
  })

  it('detects own identifier when fetching via getUserIdentifierUseCase and currentUserId matches', async () => {
    const getUserIdentifierUseCase = new GetUserIdentifierUseCaseMock()
    getUserIdentifierUseCase.resultProvider = async () => appResultSuccess(mockIdentifier)
    vi.spyOn(getUserIdentifierUseCase, 'execute')

    const deps: IdentifierDetailStoreDependencies = {
      identifierId: mockIdentifier.id,
      currentUserId: mockIdentifier.userId,
      getUserIdentifierUseCase,
      onBack: vi.fn()
    }

    render(
      <ComponentTestHarness>
        <IdentifierDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(IdentifierDetailTestTags.TITLE)).not.toBeNull()
    expect(screen.queryByTestId(IdentifierDetailTestTags.DELETE_BUTTON)).toBeNull()
  })
})
