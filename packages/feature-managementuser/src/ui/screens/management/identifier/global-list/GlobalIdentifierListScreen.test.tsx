import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  createTestPagedResult,
  createTestUserIdentifierPrivateList,
  userStrings,
  UserIdentifierFilterValues,
  UserIdentifierSortBy,
  UserAuthProvider
} from '@mudrichenkoevgeny/shared-foundation'
import { GlobalIdentifierListScreen, GlobalIdentifierListTestTags } from '@/ui/screens/management/identifier/global-list/GlobalIdentifierListScreen'
import { globalIdentifierListDependenciesMock } from '@/mock/ui/screen/management/identifier/global-list/global-identifier-list-component-mock'
import { ManagementGetIdentifiersUseCaseMock } from '@/mock/usecase/identifier/management-get-identifiers-use-case-mock'
import { ManagementDeleteIdentifierUseCaseMock } from '@/mock/usecase/identifier/management-delete-identifier-use-case-mock'
import type { GlobalIdentifierListStoreDependencies } from '@/ui/screens/management/identifier/global-list/GlobalIdentifierListStore'
import { getGlobalIdentifierListingOptionsConfig } from './global-identifier-list-options-config'
import {
  searchParamsToListingStates,
  listingStatesToSearchParams
} from './globalIdentifierListSearchConverters'

describe('GlobalIdentifierListScreen', () => {
  const createMockDeps = (): GlobalIdentifierListStoreDependencies => {
    const managementGetIdentifiersUseCase = new ManagementGetIdentifiersUseCaseMock()
    managementGetIdentifiersUseCase.resultProvider = async () =>
      appResultSuccess(
        createTestPagedResult({
          items: createTestUserIdentifierPrivateList(1)
        })
      )
    vi.spyOn(managementGetIdentifiersUseCase, 'execute')

    const managementDeleteIdentifierUseCase = new ManagementDeleteIdentifierUseCaseMock()
    managementDeleteIdentifierUseCase.resultProvider = async () => appResultSuccess(undefined)
    vi.spyOn(managementDeleteIdentifierUseCase, 'execute')

    return globalIdentifierListDependenciesMock({
      managementGetIdentifiersUseCase,
      managementDeleteIdentifierUseCase,
      onNavigateToIdentifierDetail: vi.fn(),
      onBack: vi.fn()
    })
  }

  it('renders global identifiers list', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <GlobalIdentifierListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(GlobalIdentifierListTestTags.TITLE)).toBeDefined()
    expect(screen.getByText(userStrings.ui.userIdentifiers)).toBeDefined()
    expect(screen.getByTestId(GlobalIdentifierListTestTags.BACK_BUTTON)).toBeDefined()
    expect(screen.getByTestId(GlobalIdentifierListTestTags.FILTER_BUTTON)).toBeDefined()
    expect(screen.getByTestId(GlobalIdentifierListTestTags.REFRESH_BUTTON)).toBeDefined()
  })

  it('executes managementGetIdentifiersUseCase only once on initial render and prevents duplicate calls', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <GlobalIdentifierListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(GlobalIdentifierListTestTags.TITLE)).toBeDefined()
    expect(deps.managementGetIdentifiersUseCase.execute).toHaveBeenCalledTimes(1)
  })

  it('dynamically covers all sort options and filter fields declared in shared-foundation', () => {
    const config = getGlobalIdentifierListingOptionsConfig()

    const expectedSortKeys = Object.values(UserIdentifierSortBy)
    const actualSortKeys = config.sortOptions.map((s) => s.id)
    expect(actualSortKeys).toEqual(expect.arrayContaining(expectedSortKeys))
    expect(actualSortKeys.length).toBe(expectedSortKeys.length)

    const expectedFilterKeys = Object.values(UserIdentifierFilterValues)
    const actualFilterKeys = config.filters.map((f) => f.id)
    expect(actualFilterKeys).toEqual(expect.arrayContaining(expectedFilterKeys))
    expect(actualFilterKeys.length).toBe(expectedFilterKeys.length)
  })

  it('converts identifier search parameters to listing states and back bidirectionally', () => {
    const originalParams = {
      sort_by: UserIdentifierSortBy.IDENTIFIER,
      sort_order: 'asc' as const,
      identifier_id: ['id-101'],
      user_id: ['usr-202'],
      user_auth_provider: [UserAuthProvider.EMAIL],
      exclude_user_auth_provider: [UserAuthProvider.PHONE],
      identifier: 'user@example.com',
      display_name: 'John Doe',
      external_provider_email: 'john.external@gmail.com',
      is_external_provider_email_set: true,
      created_at_from: '2025-01-01T00:00:00Z',
      created_at_to: '2025-01-31T23:59:59Z',
      updated_at_from: '2025-02-01T00:00:00Z',
      updated_at_to: '2025-02-28T23:59:59Z',
      is_updated_at_set: true,
      search_query: 'example.com'
    }

    const { sortState, filterStates } = searchParamsToListingStates(originalParams)

    expect(sortState).toEqual({ optionId: UserIdentifierSortBy.IDENTIFIER, isAscending: true })
    expect(filterStates[UserIdentifierFilterValues.IDENTIFIER_ID]).toEqual({ type: 'text', value: 'id-101' })
    expect(filterStates[UserIdentifierFilterValues.USER_ID]).toEqual({ type: 'text', value: 'usr-202' })
    expect(filterStates[UserIdentifierFilterValues.USER_AUTH_PROVIDER]).toEqual({ type: 'choice', selectedIds: new Set([UserAuthProvider.EMAIL]) })
    expect(filterStates[UserIdentifierFilterValues.EXCLUDE_USER_AUTH_PROVIDER]).toEqual({ type: 'choice', selectedIds: new Set([UserAuthProvider.PHONE]) })
    expect(filterStates[UserIdentifierFilterValues.IDENTIFIER]).toEqual({ type: 'text', value: 'user@example.com' })
    expect(filterStates[UserIdentifierFilterValues.DISPLAY_NAME]).toEqual({ type: 'text', value: 'John Doe' })
    expect(filterStates[UserIdentifierFilterValues.EXTERNAL_PROVIDER_EMAIL]).toEqual({ type: 'text', value: 'john.external@gmail.com' })
    expect(filterStates[UserIdentifierFilterValues.IS_EXTERNAL_PROVIDER_EMAIL_SET]).toEqual({ type: 'boolean', value: true })
    expect(filterStates[UserIdentifierFilterValues.SEARCH_QUERY]).toEqual({ type: 'text', value: 'example.com' })

    const reserialized = listingStatesToSearchParams(sortState, filterStates)
    expect(reserialized.identifier_id).toEqual(['id-101'])
    expect(reserialized.user_id).toEqual(['usr-202'])
    expect(reserialized.user_auth_provider).toEqual([UserAuthProvider.EMAIL])
    expect(reserialized.exclude_user_auth_provider).toEqual([UserAuthProvider.PHONE])
    expect(reserialized.identifier).toEqual(['user@example.com'])
    expect(reserialized.display_name).toBe('John Doe')
    expect(reserialized.external_provider_email).toBe('john.external@gmail.com')
    expect(reserialized.is_external_provider_email_set).toBe(true)
    expect(reserialized.search_query).toBe('example.com')
  })

  it('toggles filter panel in UI when filter button is clicked', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <GlobalIdentifierListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(GlobalIdentifierListTestTags.TITLE)).toBeDefined()

    const filterBtn = screen.getByTestId(GlobalIdentifierListTestTags.FILTER_BUTTON)
    fireEvent.click(filterBtn)

    expect(screen.getByText('Apply')).toBeDefined()
  })
})
