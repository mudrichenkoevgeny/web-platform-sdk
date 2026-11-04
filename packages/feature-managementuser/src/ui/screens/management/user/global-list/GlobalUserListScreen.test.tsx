import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  createTestPagedResult,
  createTestUserSummaryList,
  userStrings,
  UserFilterValues,
  UserSortBy,
  UserRole,
  UserAccountStatus,
  AccountLockoutType
} from '@mudrichenkoevgeny/shared-foundation'
import { GlobalUserListScreen, GlobalUserListTestTags } from '@/ui/screens/management/user/global-list/GlobalUserListScreen'
import { globalUserListDependenciesMock } from '@/mock/ui/screen/management/user/global-list/global-user-list-component-mock'
import { GetUsersUseCaseMock } from '@/mock/usecase/user/get-users-use-case-mock'
import type { GlobalUserListStoreDependencies } from '@/ui/screens/management/user/global-list/global-user-list-store'
import { getGlobalUserListingOptionsConfig } from './global-user-list-options-config'
import {
  searchParamsToListingStates,
  listingStatesToSearchParams
} from './globalUserListSearchConverters'

describe('GlobalUserListScreen', () => {
  const createMockDeps = (): GlobalUserListStoreDependencies => {
    const getUsersUseCase = new GetUsersUseCaseMock()
    getUsersUseCase.resultProvider = async () =>
      appResultSuccess(
        createTestPagedResult({
          items: createTestUserSummaryList(1)
        })
      )
    vi.spyOn(getUsersUseCase, 'execute')

    return globalUserListDependenciesMock({
      getUsersUseCase,
      onNavigateToUserDetail: vi.fn(),
      onNavigateToCreateUser: vi.fn(),
      onBack: vi.fn()
    })
  }

  it('renders global user list screen', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <GlobalUserListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(GlobalUserListTestTags.TITLE)).toBeDefined()
    expect(screen.getByText(userStrings.ui.usersManagementTitle)).toBeDefined()
    expect(screen.getByTestId(GlobalUserListTestTags.BACK_BUTTON)).toBeDefined()
    expect(screen.getByTestId(GlobalUserListTestTags.CREATE_BUTTON)).toBeDefined()
    expect(screen.getByTestId(GlobalUserListTestTags.FILTER_BUTTON)).toBeDefined()
    expect(screen.getByTestId(GlobalUserListTestTags.REFRESH_BUTTON)).toBeDefined()
  })

  it('executes getUsersUseCase only once on initial render and prevents duplicate calls', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <GlobalUserListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(GlobalUserListTestTags.TITLE)).toBeDefined()
    expect(deps.getUsersUseCase.execute).toHaveBeenCalledTimes(1)
  })

  it('navigates to user detail when clicking own user card', async () => {
    const users = createTestUserSummaryList(1)
    const mockUser = users.at(0)
    if (!mockUser) throw new Error('Mock user required')

    const deps = createMockDeps()
    deps.currentUserId = mockUser.id

    render(
      <ComponentTestHarness>
        <GlobalUserListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const userCard = await screen.findByTestId(`UserItem_${mockUser.id}`)
    userCard.click()

    expect(deps.onNavigateToUserDetail).toHaveBeenCalledWith(mockUser.id)
  })

  it('dynamically covers all sort options and filter fields declared in shared-foundation', () => {
    const config = getGlobalUserListingOptionsConfig()

    const expectedSortKeys = Object.values(UserSortBy)
    const actualSortKeys = config.sortOptions.map((s) => s.id)
    expect(actualSortKeys).toEqual(expect.arrayContaining(expectedSortKeys))
    expect(actualSortKeys.length).toBe(expectedSortKeys.length)

    const expectedFilterKeys = Object.values(UserFilterValues)
    const actualFilterKeys = config.filters.map((f) => f.id)
    expect(actualFilterKeys).toEqual(expect.arrayContaining(expectedFilterKeys))
    expect(actualFilterKeys.length).toBe(expectedFilterKeys.length)
  })

  it('converts user search parameters to listing states and back bidirectionally', () => {
    const originalParams = {
      sort_by: UserSortBy.DISPLAY_NAME,
      sort_order: 'asc' as const,
      user_id: ['usr-100'],
      role: [UserRole.ADMIN],
      exclude_role: [UserRole.STAFF],
      account_status: [UserAccountStatus.ACTIVE],
      exclude_account_status: [UserAccountStatus.BANNED],
      account_status_on_restore: [UserAccountStatus.ACTIVE],
      exclude_account_status_on_restore: [UserAccountStatus.READ_ONLY],
      is_account_status_on_restore_set: true,
      authority_level_from: 10,
      authority_level_to: 90,
      permission_codes: ['USERS_READ'],
      exclude_permission_codes: ['USERS_DELETE'],
      is_totp_enabled: true,
      account_lockout_type: [AccountLockoutType.NONE],
      exclude_account_lockout_type: [AccountLockoutType.INDEFINITE],
      temporary_lockout_until_from: '2025-01-01T00:00:00Z',
      temporary_lockout_until_to: '2025-01-31T23:59:59Z',
      is_temporary_lockout_until_set: false,
      last_login_at_from: '2025-01-01T00:00:00Z',
      last_login_at_to: '2025-01-31T23:59:59Z',
      is_last_login_at_set: true,
      last_active_at_from: '2025-01-01T00:00:00Z',
      last_active_at_to: '2025-01-31T23:59:59Z',
      is_last_active_at_set: true,
      scheduled_permanent_deletion_at_from: '2025-02-01T00:00:00Z',
      scheduled_permanent_deletion_at_to: '2025-02-28T23:59:59Z',
      is_scheduled_permanent_deletion_at_set: false,
      storage_quota_bytes_from: 1000,
      storage_quota_bytes_to: 500000,
      is_storage_quota_bytes_set: true,
      storage_max_upload_size_bytes_from: 500,
      storage_max_upload_size_bytes_to: 10000,
      is_storage_max_upload_size_bytes_set: true,
      storage_max_pending_uploads_from: 1,
      storage_max_pending_uploads_to: 10,
      is_storage_max_pending_uploads_set: true,
      is_storage_configuration_set: true,
      nickname: 'jdoe',
      is_nickname_set: true,
      display_name: 'John Doe',
      is_display_name_set: true,
      is_avatar_set: true,
      birthdate_from: 100,
      birthdate_to: 200,
      is_birthdate_set: true,
      created_at_from: '2025-01-01T00:00:00Z',
      created_at_to: '2025-01-31T23:59:59Z',
      updated_at_from: '2025-02-01T00:00:00Z',
      updated_at_to: '2025-02-28T23:59:59Z',
      is_updated_at_set: true,
      search_query: 'John'
    }

    const { sortState, filterStates } = searchParamsToListingStates(originalParams)

    expect(sortState).toEqual({ optionId: UserSortBy.DISPLAY_NAME, isAscending: true })
    expect(filterStates[UserFilterValues.USER_ID]).toEqual({ type: 'text', value: 'usr-100' })
    expect(filterStates[UserFilterValues.ROLE]).toEqual({ type: 'choice', selectedIds: new Set([UserRole.ADMIN]) })
    expect(filterStates[UserFilterValues.EXCLUDE_ROLE]).toEqual({ type: 'choice', selectedIds: new Set([UserRole.STAFF]) })
    expect(filterStates[UserFilterValues.ACCOUNT_STATUS]).toEqual({ type: 'choice', selectedIds: new Set([UserAccountStatus.ACTIVE]) })
    expect(filterStates[UserFilterValues.EXCLUDE_ACCOUNT_STATUS]).toEqual({ type: 'choice', selectedIds: new Set([UserAccountStatus.BANNED]) })
    expect(filterStates[UserFilterValues.NICKNAME]).toEqual({ type: 'text', value: 'jdoe' })
    expect(filterStates[UserFilterValues.DISPLAY_NAME]).toEqual({ type: 'text', value: 'John Doe' })
    expect(filterStates[UserFilterValues.SEARCH_QUERY]).toEqual({ type: 'text', value: 'John' })

    const reserialized = listingStatesToSearchParams(sortState, filterStates)
    expect(reserialized.user_id).toEqual(['usr-100'])
    expect(reserialized.user_role).toEqual([UserRole.ADMIN])
    expect(reserialized.nickname).toBe('jdoe')
    expect(reserialized.display_name).toBe('John Doe')
    expect(reserialized.search_query).toBe('John')
  })

  it('toggles filter panel in UI when filter button is clicked', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <GlobalUserListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(GlobalUserListTestTags.TITLE)).toBeDefined()

    const filterBtn = screen.getByTestId(GlobalUserListTestTags.FILTER_BUTTON)
    fireEvent.click(filterBtn)

    expect(screen.getByText('Apply')).toBeDefined()
  })
})
