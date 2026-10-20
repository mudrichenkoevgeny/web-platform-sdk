import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestUserPrivatePayload, TEST_USER_ID, toUserIdOrThrow, toUserPrivate, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { UserDetailScreen, UserDetailTestTags } from '@/ui/screens/management/user/detail/UserDetailScreen'
import { userDetailDependenciesMock } from '@/mock/ui/screen/management/user/detail/user-detail-component-mock'
import { GetUserUseCaseMock } from '@/mock/usecase/user/get-user-use-case-mock'
import { UpdateUserUseCaseMock } from '@/mock/usecase/user/update-user-use-case-mock'
import { DeleteUserUseCaseMock } from '@/mock/usecase/user/delete-user-use-case-mock'
import { ManagementDisableTotpUseCaseMock } from '@/mock/usecase/user/security/management-disable-totp-use-case-mock'
import type { UserDetailStoreDependencies } from '@/ui/screens/management/user/detail/UserDetailStore'

describe('UserDetailScreen', () => {
  const createMockDeps = (): UserDetailStoreDependencies => {
    const getUserUseCase = new GetUserUseCaseMock()
    getUserUseCase.resultProvider = async () => appResultSuccess(toUserPrivate(createTestUserPrivatePayload()))
    vi.spyOn(getUserUseCase, 'execute').mockImplementation(getUserUseCase.execute.bind(getUserUseCase))

    const updateUserUseCase = new UpdateUserUseCaseMock()
    updateUserUseCase.resultProvider = async () => appResultSuccess(undefined)
    vi.spyOn(updateUserUseCase, 'execute').mockImplementation(updateUserUseCase.execute.bind(updateUserUseCase))

    const deleteUserUseCase = new DeleteUserUseCaseMock()
    deleteUserUseCase.resultProvider = async () => appResultSuccess(undefined)
    vi.spyOn(deleteUserUseCase, 'execute').mockImplementation(deleteUserUseCase.execute.bind(deleteUserUseCase))

    const managementDisableTotpUseCase = new ManagementDisableTotpUseCaseMock()
    managementDisableTotpUseCase.resultProvider = async () => appResultSuccess(undefined)
    vi.spyOn(managementDisableTotpUseCase, 'execute').mockImplementation(managementDisableTotpUseCase.execute.bind(managementDisableTotpUseCase))

    return userDetailDependenciesMock({
      userId: toUserIdOrThrow(TEST_USER_ID),
      getUserUseCase,
      updateUserUseCase,
      deleteUserUseCase,
      managementDisableTotpUseCase,
      onNavigateToSessions: vi.fn(),
      onNavigateToIdentifiers: vi.fn(),
      onNavigateToAuditEvents: vi.fn(),
      onBack: vi.fn()
    })
  }

  it('renders user detail screen', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <UserDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(UserDetailTestTags.TITLE)).toBeDefined()
    expect(screen.getByText(userStrings.ui.userDetailsTitle)).toBeDefined()
    expect(screen.getByTestId(UserDetailTestTags.BACK_BUTTON)).toBeDefined()
    expect(screen.getByTestId(UserDetailTestTags.USER_ID_TEXT)).toBeDefined()
    expect(screen.getByTestId(UserDetailTestTags.SESSIONS_BUTTON)).toBeDefined()
    expect(screen.getByTestId(UserDetailTestTags.IDENTIFIERS_BUTTON)).toBeDefined()
    expect(screen.getByTestId(UserDetailTestTags.ACCOUNT_STATUS_SELECT)).toBeDefined()
    expect(screen.getByTestId(UserDetailTestTags.AUTHORITY_LEVEL_INPUT)).toBeDefined()
    expect(screen.getByTestId(UserDetailTestTags.LOCKOUT_TYPE_SELECT)).toBeDefined()
    expect(screen.getByTestId(UserDetailTestTags.LOCKOUT_UNTIL_INPUT)).toBeDefined()
    expect(screen.getByTestId(UserDetailTestTags.UPDATE_BUTTON)).toBeDefined()
    expect(screen.getByTestId(UserDetailTestTags.DELETE_BUTTON)).toBeDefined()
  })

  it('disables control buttons when user is self (currentUserId matches userId)', async () => {
    const deps = createMockDeps()
    deps.currentUserId = deps.userId
    const getUserUseCase = new GetUserUseCaseMock()
    getUserUseCase.resultProvider = async () => appResultSuccess(toUserPrivate(createTestUserPrivatePayload({ id: deps.userId })))
    vi.spyOn(getUserUseCase, 'execute').mockImplementation(getUserUseCase.execute.bind(getUserUseCase))
    deps.getUserUseCase = getUserUseCase

    render(
      <ComponentTestHarness>
        <UserDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(UserDetailTestTags.TITLE)).toBeDefined()
    const deleteBtn = screen.getByTestId(UserDetailTestTags.DELETE_BUTTON) as HTMLButtonElement
    const updateBtn = screen.getByTestId(UserDetailTestTags.UPDATE_BUTTON) as HTMLButtonElement
    const statusSelect = screen.getByTestId(UserDetailTestTags.ACCOUNT_STATUS_SELECT) as HTMLSelectElement

    expect(deleteBtn.disabled).toBe(true)
    expect(updateBtn.disabled).toBe(true)
    expect(statusSelect.disabled).toBe(true)
  })
})
