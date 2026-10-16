import { SortOrder, UserFilterValues } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalSessionListParams } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { GlobalSessionListSearchParams } from '@/ui/screens/management/session/global-list/globalSessionListSearchSchema'

export interface GlobalSessionListingOptionsState {
  sortState: ListingSortState | null
  filterStates: Record<string, ListingFilterState>
}

export const searchParamsToListingStates = (
  params?: ManagementGlobalSessionListParams | GlobalSessionListSearchParams
): GlobalSessionListingOptionsState => {
  if (!params) {
    return { sortState: null, filterStates: {} }
  }

  const p = params as ManagementGlobalSessionListParams & GlobalSessionListSearchParams
  const sortBy = 'sort_by' in params ? params.sort_by : p.sortBy
  const sortOrder = 'sort_order' in params ? params.sort_order : p.sortOrder
  const userAuthProviders = 'user_auth_providers' in params ? params.user_auth_providers : p.userAuthProviders
  const clientTypes = 'client_types' in params ? params.client_types : p.clientTypes
  const identifiers = 'identifiers' in params ? params.identifiers : p.identifiers
  const ipAddresses = 'ip_addresses' in params ? params.ip_addresses : p.ipAddresses

  const sortState: ListingSortState | null = sortBy
    ? {
        optionId: sortBy,
        isAscending: sortOrder === SortOrder.ASC
      }
    : null

  const filterStates: Record<string, ListingFilterState> = {}

  if (userAuthProviders && userAuthProviders.length > 0) {
    filterStates[UserFilterValues.UserSessionFilterValues.USER_AUTH_PROVIDER] = {
      type: 'choice',
      selectedIds: new Set(userAuthProviders)
    }
  }

  if (clientTypes && clientTypes.length > 0) {
    filterStates[UserFilterValues.UserSessionFilterValues.CLIENT_TYPE] = {
      type: 'choice',
      selectedIds: new Set(clientTypes)
    }
  }

  if (identifiers && identifiers.length > 0) {
    filterStates[UserFilterValues.UserSessionFilterValues.IDENTIFIER] = {
      type: 'text',
      value: identifiers[0] ?? ''
    }
  }

  if (ipAddresses && ipAddresses.length > 0) {
    filterStates[UserFilterValues.UserSessionFilterValues.IP_ADDRESS] = {
      type: 'text',
      value: ipAddresses[0] ?? ''
    }
  }

  return { sortState, filterStates }
}

export const listingStatesToSearchParams = (
  sortState: ListingSortState | null,
  filterStates: Record<string, ListingFilterState>
): GlobalSessionListSearchParams => {
  const params: GlobalSessionListSearchParams = {
    sort_by: 'created_at',
    sort_order: SortOrder.DESC,
    user_auth_providers: [],
    client_types: [],
    identifiers: [],
    ip_addresses: []
  }

  if (sortState) {
    params.sort_by = sortState.optionId
    params.sort_order = sortState.isAscending ? SortOrder.ASC : SortOrder.DESC
  }

  const providerFilter = filterStates[UserFilterValues.UserSessionFilterValues.USER_AUTH_PROVIDER]
  if (providerFilter?.type === 'choice' && providerFilter.selectedIds.size > 0) {
    params.user_auth_providers = Array.from(providerFilter.selectedIds)
  }

  const clientTypeFilter = filterStates[UserFilterValues.UserSessionFilterValues.CLIENT_TYPE]
  if (clientTypeFilter?.type === 'choice' && clientTypeFilter.selectedIds.size > 0) {
    params.client_types = Array.from(clientTypeFilter.selectedIds)
  }

  const identifierFilter = filterStates[UserFilterValues.UserSessionFilterValues.IDENTIFIER]
  if (identifierFilter?.type === 'text' && identifierFilter.value.trim()) {
    params.identifiers = [identifierFilter.value.trim()]
  }

  const ipFilter = filterStates[UserFilterValues.UserSessionFilterValues.IP_ADDRESS]
  if (ipFilter?.type === 'text' && ipFilter.value.trim()) {
    params.ip_addresses = [ipFilter.value.trim()]
  }

  return params
}
