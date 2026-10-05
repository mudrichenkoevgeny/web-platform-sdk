import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userDetailsMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'
import { UserDetailScreen, UserDetailTestTags } from '@/ui/screens/management/user/detail/UserDetailScreen'
import type { UserDetailStoreDependencies } from '@/ui/screens/management/user/detail/UserDetailStore'
import { enManagementUserStrings } from '@/locales/index'

describe('UserDetailScreen', () => {
  const createMockDeps = (): UserDetailStoreDependencies => ({
    userId: 'usr_123' as unknown as UserId,
    getUserUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(userDetailsMock()))
    } as unknown as UserDetailStoreDependencies['getUserUseCase'],
    updateUserUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(userDetailsMock()))
    } as unknown as UserDetailStoreDependencies['updateUserUseCase'],
    deleteUserUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({}))
    } as unknown as UserDetailStoreDependencies['deleteUserUseCase'],
    managementDisableTotpUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({}))
    } as unknown as UserDetailStoreDependencies['managementDisableTotpUseCase'],
    onNavigateToSessions: vi.fn(),
    onNavigateToIdentifiers: vi.fn(),
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
    expect(screen.getByText(enManagementUserStrings.user_details_title)).toBeDefined()
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
})
