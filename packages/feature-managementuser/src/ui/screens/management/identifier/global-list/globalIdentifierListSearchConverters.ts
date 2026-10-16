import { SortOrder, UserFilterValues } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalIdentifierListParams } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { GlobalIdentifierListSearchParams } from '@/ui/screens/management/identifier/global-list/globalIdentifierListSearchSchema'

export interface GlobalIdentifierListingOptionsState {
  sortState: ListingSortState | null
  filterStates: Record<string, ListingFilterState>
}

export const searchParamsToListingStates = (
  params?: ManagementGlobalIdentifierListParams | GlobalIdentifierListSearchParams
): GlobalIdentifierListingOptionsState => {
  if (!params) {
    return { sortState: null, filterStates: {} }
  }

  const p = params as ManagementGlobalIdentifierListParams & GlobalIdentifierListSearchParams
  const sortBy = 'sort_by' in params ? params.sort_by : p.sortBy
  const sortOrder = 'sort_order' in params ? params.sort_order : p.sortOrder
  const userAuthProviders = 'user_auth_providers' in params ? params.user_auth_providers : p.userAuthProviders
  const identifiers = 'identifiers' in params ? params.identifiers : p.identifiers

  const sortState: ListingSortState | null = sortBy
    ? {
        optionId: sortBy,
        isAscending: sortOrder === SortOrder.ASC
      }
    : null

  const filterStates: Record<string, ListingFilterState> = {}

  if (userAuthProviders && userAuthProviders.length > 0) {
    filterStates[UserFilterValues.UserIdentifierFilterValues.USER_AUTH_PROVIDER] = {
      type: 'choice',
      selectedIds: new Set(userAuthProviders)
    }
  }

  if (identifiers && identifiers.length > 0) {
    filterStates[UserFilterValues.UserIdentifierFilterValues.IDENTIFIER] = {
      type: 'text',
      value: identifiers[0] ?? ''
    }
  }

  return { sortState, filterStates }
}

export const listingStatesToSearchParams = (
  sortState: ListingSortState | null,
  filterStates: Record<string, ListingFilterState>
): GlobalIdentifierListSearchParams => {
  const params: GlobalIdentifierListSearchParams = {
    sort_by: 'created_at',
    sort_order: SortOrder.DESC,
    user_auth_providers: [],
    identifiers: []
  }

  if (sortState) {
    params.sort_by = sortState.optionId
    params.sort_order = sortState.isAscending ? SortOrder.ASC : SortOrder.DESC
  }

  const providerFilter = filterStates[UserFilterValues.UserIdentifierFilterValues.USER_AUTH_PROVIDER]
  if (providerFilter?.type === 'choice' && providerFilter.selectedIds.size > 0) {
    params.user_auth_providers = Array.from(providerFilter.selectedIds)
  }

  const identifierFilter = filterStates[UserFilterValues.UserIdentifierFilterValues.IDENTIFIER]
  if (identifierFilter?.type === 'text' && identifierFilter.value.trim()) {
    params.identifiers = [identifierFilter.value.trim()]
  }

  return params
}
