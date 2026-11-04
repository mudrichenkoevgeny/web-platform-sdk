import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  createTestAuditEventPrivateList,
  createTestPagedResult,
  userStrings,
  AuditEventFilterValues,
  AuditEventSortBy,
  AuditActorType,
  AuditStatus,
  UserRole
} from '@mudrichenkoevgeny/shared-foundation'
import { AuditEventListScreen, AuditEventListTestTags } from '@/ui/screens/management/audit/list/AuditEventListScreen'
import { auditEventListDependenciesMock } from '@/mock/ui/screen/management/audit/list/audit-event-list-component-mock'
import { GetAuditEventsUseCaseMock } from '@/mock/usecase/audit/get-audit-events-use-case-mock'
import type { AuditEventListStoreDependencies } from '@/ui/screens/management/audit/list/audit-event-list-store'
import { getAuditEventListingOptionsConfig } from './audit-event-list-options-config'
import {
  searchParamsToListingStates,
  listingStatesToSearchParams
} from './auditEventListSearchConverters'

describe('AuditEventListScreen', () => {
  const createMockDeps = (): AuditEventListStoreDependencies => {
    const getAuditEventsUseCase = new GetAuditEventsUseCaseMock()
    getAuditEventsUseCase.resultProvider = async () =>
      appResultSuccess(
        createTestPagedResult({
          items: createTestAuditEventPrivateList(1)
        })
      )
    vi.spyOn(getAuditEventsUseCase, 'execute')

    return auditEventListDependenciesMock({
      getAuditEventsUseCase,
      onNavigateToEventDetail: vi.fn(),
      onBack: vi.fn()
    })
  }

  it('renders audit events list and handles item click', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <AuditEventListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(AuditEventListTestTags.TITLE)).toBeDefined()
    expect(screen.getByText(userStrings.ui.auditLogsTitle)).toBeDefined()
    expect(screen.getByTestId(AuditEventListTestTags.BACK_BUTTON)).toBeDefined()
    expect(screen.getByTestId(AuditEventListTestTags.FILTER_BUTTON)).toBeDefined()
    expect(screen.getByTestId(AuditEventListTestTags.REFRESH_BUTTON)).toBeDefined()

    const item = screen.getByTestId(/^AuditItem_/)
    await user.click(item)

    expect(deps.onNavigateToEventDetail).toHaveBeenCalledTimes(1)
  })

  it('executes getAuditEventsUseCase only once on initial render and prevents duplicate calls', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <AuditEventListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(AuditEventListTestTags.TITLE)).toBeDefined()
    expect(deps.getAuditEventsUseCase.execute).toHaveBeenCalledTimes(1)
  })

  it('dynamically covers all sort options and filter fields declared in shared-foundation', () => {
    const config = getAuditEventListingOptionsConfig()

    const expectedSortKeys = Object.values(AuditEventSortBy)
    const actualSortKeys = config.sortOptions.map((s) => s.id)
    expect(actualSortKeys).toEqual(expect.arrayContaining(expectedSortKeys))
    expect(actualSortKeys.length).toBe(expectedSortKeys.length)

    const expectedFilterKeys = Object.values(AuditEventFilterValues)
    const actualFilterKeys = config.filters.map((f) => f.id)
    expect(actualFilterKeys).toEqual(expect.arrayContaining(expectedFilterKeys))
    expect(actualFilterKeys.length).toBe(expectedFilterKeys.length)
  })

  it('converts all audit event search parameters to listing states and back bidirectionally', () => {
    const originalParams = {
      sort_by: AuditEventSortBy.CREATED_AT,
      sort_order: 'asc' as const,
      event_id: ['evt-101'],
      actor_id: ['actor-202'],
      actor_type: [AuditActorType.USER],
      exclude_actor_type: [AuditActorType.SERVICE],
      actor_user_role: [UserRole.ADMIN],
      action: ['USER_LOGIN'],
      exclude_action: ['USER_LOGOUT'],
      resource: ['USER'],
      resource_id: ['user-303'],
      status: [AuditStatus.SUCCESS],
      exclude_status: [AuditStatus.FAILED],
      created_at_from: '2025-01-01T00:00:00Z',
      created_at_to: '2025-01-31T23:59:59Z',
      search_query: 'login failed'
    }

    const { sortState, filterStates } = searchParamsToListingStates(originalParams)

    expect(sortState).toEqual({ optionId: AuditEventSortBy.CREATED_AT, isAscending: true })
    expect(filterStates[AuditEventFilterValues.EVENT_ID]).toEqual({ type: 'text', value: 'evt-101' })
    expect(filterStates[AuditEventFilterValues.ACTOR_ID]).toEqual({ type: 'text', value: 'actor-202' })
    expect(filterStates[AuditEventFilterValues.ACTOR_TYPE]).toEqual({ type: 'choice', selectedIds: new Set([AuditActorType.USER]) })
    expect(filterStates[AuditEventFilterValues.EXCLUDE_ACTOR_TYPE]).toEqual({ type: 'choice', selectedIds: new Set([AuditActorType.SERVICE]) })
    expect(filterStates[AuditEventFilterValues.ACTOR_USER_ROLE]).toEqual({ type: 'choice', selectedIds: new Set([UserRole.ADMIN]) })
    expect(filterStates[AuditEventFilterValues.ACTION]).toEqual({ type: 'text', value: 'USER_LOGIN' })
    expect(filterStates[AuditEventFilterValues.EXCLUDE_ACTION]).toEqual({ type: 'text', value: 'USER_LOGOUT' })
    expect(filterStates[AuditEventFilterValues.RESOURCE]).toEqual({ type: 'text', value: 'USER' })
    expect(filterStates[AuditEventFilterValues.RESOURCE_ID]).toEqual({ type: 'text', value: 'user-303' })
    expect(filterStates[AuditEventFilterValues.STATUS]).toEqual({ type: 'choice', selectedIds: new Set([AuditStatus.SUCCESS]) })
    expect(filterStates[AuditEventFilterValues.EXCLUDE_STATUS]).toEqual({ type: 'choice', selectedIds: new Set([AuditStatus.FAILED]) })
    expect(filterStates[AuditEventFilterValues.CREATED_AT_FROM]).toEqual({ type: 'text', value: '2025-01-01T00:00:00Z' })
    expect(filterStates[AuditEventFilterValues.CREATED_AT_TO]).toEqual({ type: 'text', value: '2025-01-31T23:59:59Z' })
    expect(filterStates[AuditEventFilterValues.SEARCH_QUERY]).toEqual({ type: 'text', value: 'login failed' })

    const reserialized = listingStatesToSearchParams(sortState, filterStates)
    expect(reserialized.event_id).toEqual(['evt-101'])
    expect(reserialized.actor_id).toEqual(['actor-202'])
    expect(reserialized.actor_type).toEqual([AuditActorType.USER])
    expect(reserialized.exclude_actor_type).toEqual([AuditActorType.SERVICE])
    expect(reserialized.actor_user_role).toEqual([UserRole.ADMIN])
    expect(reserialized.action).toEqual(['USER_LOGIN'])
    expect(reserialized.exclude_action).toEqual(['USER_LOGOUT'])
    expect(reserialized.resource).toEqual(['USER'])
    expect(reserialized.resource_id).toEqual(['user-303'])
    expect(reserialized.status).toEqual([AuditStatus.SUCCESS])
    expect(reserialized.exclude_status).toEqual([AuditStatus.FAILED])
    expect(reserialized.created_at_from).toBe('2025-01-01T00:00:00Z')
    expect(reserialized.created_at_to).toBe('2025-01-31T23:59:59Z')
    expect(reserialized.search_query).toBe('login failed')
  })

  it('toggles filter panel in UI when filter button is clicked', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <AuditEventListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(AuditEventListTestTags.TITLE)).toBeDefined()

    const filterBtn = screen.getByTestId(AuditEventListTestTags.FILTER_BUTTON)
    fireEvent.click(filterBtn)

    expect(screen.getByText('Apply')).toBeDefined()
  })
})
