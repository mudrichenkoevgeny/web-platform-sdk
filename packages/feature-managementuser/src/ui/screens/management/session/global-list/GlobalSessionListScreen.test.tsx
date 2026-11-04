import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  createTestPagedResult,
  createTestUserSessionPrivateList,
  userStrings,
  UserSessionSortBy,
  UserAuthProvider,
  ClientType,
  UserRole
} from '@mudrichenkoevgeny/shared-foundation'
import { GlobalSessionListScreen, GlobalSessionListTestTags } from '@/ui/screens/management/session/global-list/GlobalSessionListScreen'
import { globalSessionListDependenciesMock } from '@/mock/ui/screen/management/session/global-list/global-session-list-component-mock'
import { ManagementGetSessionsUseCaseMock } from '@/mock/usecase/session/management-get-sessions-use-case-mock'
import { ManagementDeleteSessionUseCaseMock } from '@/mock/usecase/session/management-delete-session-use-case-mock'
import type { GlobalSessionListStoreDependencies } from '@/ui/screens/management/session/global-list/GlobalSessionListStore'
import { getGlobalSessionListingOptionsConfig, SessionFilterValues } from './global-session-list-options-config'
import {
  searchParamsToListingStates,
  listingStatesToSearchParams
} from './globalSessionListSearchConverters'

describe('GlobalSessionListScreen', () => {
  const createMockDeps = (): GlobalSessionListStoreDependencies => {
    const managementGetSessionsUseCase = new ManagementGetSessionsUseCaseMock()
    managementGetSessionsUseCase.resultProvider = async () =>
      appResultSuccess(
        createTestPagedResult({
          items: createTestUserSessionPrivateList(1)
        })
      )
    vi.spyOn(managementGetSessionsUseCase, 'execute')

    const managementDeleteSessionUseCase = new ManagementDeleteSessionUseCaseMock()
    managementDeleteSessionUseCase.resultProvider = async () => appResultSuccess(undefined)
    vi.spyOn(managementDeleteSessionUseCase, 'execute')

    return globalSessionListDependenciesMock({
      managementGetSessionsUseCase,
      managementDeleteSessionUseCase,
      onNavigateToSessionDetail: vi.fn(),
      onNavigateToUserDetail: vi.fn(),
      onBack: vi.fn()
    })
  }

  it('renders global sessions list', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <GlobalSessionListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(GlobalSessionListTestTags.TITLE)).toBeDefined()
    expect(screen.getByText(userStrings.ui.sessions)).toBeDefined()
    expect(screen.getByTestId(GlobalSessionListTestTags.BACK_BUTTON)).toBeDefined()
    expect(screen.getByTestId(GlobalSessionListTestTags.FILTER_BUTTON)).toBeDefined()
    expect(screen.getByTestId(GlobalSessionListTestTags.REFRESH_BUTTON)).toBeDefined()
  })

  it('executes managementGetSessionsUseCase only once on initial render and prevents duplicate calls', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <GlobalSessionListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(GlobalSessionListTestTags.TITLE)).toBeDefined()
    expect(deps.managementGetSessionsUseCase.execute).toHaveBeenCalledTimes(1)
  })

  it('hides revoke button for session matching currentSessionId', async () => {
    const sessions = createTestUserSessionPrivateList(1)
    const mockSession = sessions.at(0)
    if (!mockSession) throw new Error('Mock session required')

    const deps = createMockDeps()
    deps.currentSessionId = mockSession.id

    render(
      <ComponentTestHarness>
        <GlobalSessionListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const sessionCard = await screen.findByTestId(`SessionItem_${mockSession.id}`)
    expect(sessionCard).toBeDefined()
    expect(screen.queryByRole('button', { name: userStrings.ui.sessionRevoke })).toBeNull()
  })

  it('dynamically covers all sort options and filter fields declared in shared-foundation', () => {
    const config = getGlobalSessionListingOptionsConfig()

    const expectedSortKeys = Object.values(UserSessionSortBy)
    const actualSortKeys = config.sortOptions.map((s) => s.id)
    expect(actualSortKeys).toEqual(expect.arrayContaining(expectedSortKeys))
    expect(actualSortKeys.length).toBe(expectedSortKeys.length)

    const expectedFilterKeys = Object.values(SessionFilterValues)
    const actualFilterKeys = config.filters.map((f) => f.id)
    expect(actualFilterKeys).toEqual(expect.arrayContaining(expectedFilterKeys))
    expect(actualFilterKeys.length).toBe(expectedFilterKeys.length)
  })

  it('converts session search parameters to listing states and back bidirectionally', () => {
    const originalParams = {
      sort_by: UserSessionSortBy.EXPIRES_AT,
      sort_order: 'asc' as const,
      session_id: ['sess-100'],
      user_id: ['usr-200'],
      user_role: [UserRole.ADMIN],
      exclude_user_role: [UserRole.STAFF],
      identifier: 'user@example.com',
      identifier_id: ['id-303'],
      identifier_display_name: 'John',
      identifier_auth_provider: [UserAuthProvider.EMAIL],
      exclude_identifier_auth_provider: [UserAuthProvider.PHONE],
      client_type: [ClientType.WEB],
      exclude_client_type: [ClientType.ANDROID],
      is_client_type_set: true,
      user_agent: 'Mozilla/5.0',
      is_user_agent_set: true,
      ip_address: ['192.168.1.1'],
      is_ip_address_set: true,
      device_id: ['dev-123'],
      is_device_id_set: true,
      device_name: ['MacBook Pro'],
      is_device_name_set: true,
      app_version: ['1.0.0'],
      is_app_version_set: true,
      os_version: ['macOS 15.0'],
      is_operation_system_version_set: true,
      expires_at_from: '2025-01-01T00:00:00Z',
      expires_at_to: '2025-01-31T23:59:59Z',
      last_accessed_at_from: '2025-01-01T00:00:00Z',
      last_accessed_at_to: '2025-01-31T23:59:59Z',
      last_reauthenticated_at_from: '2025-01-01T00:00:00Z',
      last_reauthenticated_at_to: '2025-01-31T23:59:59Z',
      created_at_from: '2025-01-01T00:00:00Z',
      created_at_to: '2025-01-31T23:59:59Z',
      updated_at_from: '2025-02-01T00:00:00Z',
      updated_at_to: '2025-02-28T23:59:59Z',
      is_updated_at_set: true,
      search_query: 'MacBook'
    }

    const { sortState, filterStates } = searchParamsToListingStates(originalParams)

    expect(sortState).toEqual({ optionId: UserSessionSortBy.EXPIRES_AT, isAscending: true })
    expect(filterStates[SessionFilterValues.SESSION_ID]).toEqual({ type: 'text', value: 'sess-100' })
    expect(filterStates[SessionFilterValues.USER_ID]).toEqual({ type: 'text', value: 'usr-200' })
    expect(filterStates[SessionFilterValues.USER_ROLE]).toEqual({ type: 'choice', selectedIds: new Set([UserRole.ADMIN]) })
    expect(filterStates[SessionFilterValues.IDENTIFIER_AUTH_PROVIDER]).toEqual({ type: 'choice', selectedIds: new Set([UserAuthProvider.EMAIL]) })
    expect(filterStates[SessionFilterValues.CLIENT_TYPE]).toEqual({ type: 'choice', selectedIds: new Set([ClientType.WEB]) })
    expect(filterStates[SessionFilterValues.DEVICE_ID]).toEqual({ type: 'text', value: 'dev-123' })
    expect(filterStates[SessionFilterValues.DEVICE_NAME]).toEqual({ type: 'text', value: 'MacBook Pro' })
    expect(filterStates[SessionFilterValues.SEARCH_QUERY]).toEqual({ type: 'text', value: 'MacBook' })

    const reserialized = listingStatesToSearchParams(sortState, filterStates)
    expect(reserialized.session_id).toEqual(['sess-100'])
    expect(reserialized.user_id).toEqual(['usr-200'])
    expect(reserialized.user_role).toEqual([UserRole.ADMIN])
    expect(reserialized.identifier_auth_provider).toEqual([UserAuthProvider.EMAIL])
    expect(reserialized.client_type).toEqual([ClientType.WEB])
    expect(reserialized.device_id).toEqual(['dev-123'])
    expect(reserialized.device_name).toEqual(['MacBook Pro'])
    expect(reserialized.search_query).toBe('MacBook')
  })

  it('toggles filter panel in UI when filter button is clicked', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <GlobalSessionListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(GlobalSessionListTestTags.TITLE)).toBeDefined()

    const filterBtn = screen.getByTestId(GlobalSessionListTestTags.FILTER_BUTTON)
    fireEvent.click(filterBtn)

    expect(screen.getByText('Apply')).toBeDefined()
  })
})
