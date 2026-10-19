import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userDetailsMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { toUserIdOrThrow, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { UserDetailScreen, UserDetailTestTags } from '@/ui/screens/management/user/detail/UserDetailScreen'
import type { UserDetailStoreDependencies } from '@/ui/screens/management/user/detail/UserDetailStore'

describe('UserDetailScreen', () => {
  const createMockDeps = (): UserDetailStoreDependencies => ({
    userId: toUserIdOrThrow('usr_123'),
    getUserUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(userDetailsMock()))
    },
    updateUserUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(userDetailsMock()))
    },
    deleteUserUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({}))
    },
    managementDisableTotpUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({}))
    },
    onNavigateToSessions: vi.fn(),
    onNavigateToIdentifiers: vi.fn(),
    onNavigateToAuditEvents: vi.fn(),
    onBack: vi.fn()
  })

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
    deps.getUserUseCase = {
      execute: vi.fn().mockResolvedValue(appResultSuccess(userDetailsMock({ id: deps.userId })))
    }

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
