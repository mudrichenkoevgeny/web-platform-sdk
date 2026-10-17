import { SortOrder, UserFilterValues } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalSessionListParams } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { GlobalSessionListSearchParams } from '@/ui/screens/management/session/global-list/globalSessionListSearchSchema'

/** State representation of global session list sorting and filtering options. */
export interface GlobalSessionListingOptionsState {
  /** Selected sorting option state. */
  sortState: ListingSortState | null
  /** Map of filter identifiers to their current filter states. */
  filterStates: Record<string, ListingFilterState>
}

/**
 * Converts global session list search parameters into listing option states.
 *
 * @param params - Search parameters in snake_case (URL) or camelCase (internal) format
 * @returns Parsed listing options state containing sort and filter states
 */
export const searchParamsToListingStates = (
  params?: ManagementGlobalSessionListParams | GlobalSessionListSearchParams
): GlobalSessionListingOptionsState => {
  if (!params) {
    return { sortState: null, filterStates: {} }
  }

  const sortBy = 'sort_by' in params ? params.sort_by : ('sortBy' in params ? params.sortBy : undefined)
  const sortOrder = 'sort_order' in params ? params.sort_order : ('sortOrder' in params ? params.sortOrder : undefined)
  const userAuthProvidersRaw = 'user_auth_provider' in params
    ? params.user_auth_provider
    : ('user_auth_providers' in params ? params.user_auth_providers : ('userAuthProviders' in params ? params.userAuthProviders : undefined))
  const clientTypesRaw = 'client_type' in params
    ? params.client_type
    : ('client_types' in params ? params.client_types : ('clientTypes' in params ? params.clientTypes : undefined))
  const identifiersRaw = 'identifier' in params
    ? params.identifier
    : ('identifiers' in params ? params.identifiers : undefined)
  const ipAddressesRaw = 'ip_address' in params
    ? params.ip_address
    : ('ip_addresses' in params ? params.ip_addresses : ('ipAddresses' in params ? params.ipAddresses : undefined))

  const userAuthProviders: readonly string[] = Array.isArray(userAuthProvidersRaw)
    ? userAuthProvidersRaw.map(String)
    : (typeof userAuthProvidersRaw === 'string' ? [userAuthProvidersRaw] : [])

  const clientTypes: readonly string[] = Array.isArray(clientTypesRaw)
    ? clientTypesRaw.map(String)
    : (typeof clientTypesRaw === 'string' ? [clientTypesRaw] : [])

  const identifiers: readonly string[] = Array.isArray(identifiersRaw)
    ? identifiersRaw.map(String)
    : (typeof identifiersRaw === 'string' ? [identifiersRaw] : [])

  const ipAddresses: readonly string[] = Array.isArray(ipAddressesRaw)
    ? ipAddressesRaw.map(String)
    : (typeof ipAddressesRaw === 'string' ? [ipAddressesRaw] : [])

  const sortState: ListingSortState | null = sortBy
    ? {
        optionId: sortBy,
        isAscending: sortOrder === SortOrder.ASC
      }
    : null

  const filterStates: Record<string, ListingFilterState> = {}

  if (userAuthProviders.length > 0) {
    filterStates[UserFilterValues.UserSessionFilterValues.USER_AUTH_PROVIDER] = {
      type: 'choice',
      selectedIds: new Set(userAuthProviders)
    }
  }

  if (clientTypes.length > 0) {
    filterStates[UserFilterValues.UserSessionFilterValues.CLIENT_TYPE] = {
      type: 'choice',
      selectedIds: new Set(clientTypes)
    }
  }

  if (identifiers.length > 0) {
    filterStates[UserFilterValues.UserSessionFilterValues.IDENTIFIER] = {
      type: 'text',
      value: identifiers[0] ?? ''
    }
  }

  if (ipAddresses.length > 0) {
    filterStates[UserFilterValues.UserSessionFilterValues.IP_ADDRESS] = {
      type: 'text',
      value: ipAddresses[0] ?? ''
    }
  }

  return { sortState, filterStates }
}

/**
 * Converts listing option states back into global session search parameter format.
 *
 * @param sortState - Current sorting state
 * @param filterStates - Map of current filter states
 * @returns Search parameter object suitable for URL parameter validation
 */
export const listingStatesToSearchParams = (
  sortState: ListingSortState | null,
  filterStates: Record<string, ListingFilterState>
): GlobalSessionListSearchParams => {
  const searchParams: GlobalSessionListSearchParams = {
    sort_by: 'created_at',
    sort_order: SortOrder.DESC,
    user_auth_provider: [],
    client_type: [],
    identifier: [],
    ip_address: []
  }

  if (sortState) {
    searchParams.sort_by = sortState.optionId
    searchParams.sort_order = sortState.isAscending ? SortOrder.ASC : SortOrder.DESC
  }

  const providerFilter = filterStates[UserFilterValues.UserSessionFilterValues.USER_AUTH_PROVIDER]
  if (providerFilter?.type === 'choice' && providerFilter.selectedIds.size > 0) {
    searchParams.user_auth_provider = Array.from(providerFilter.selectedIds)
  }

  const clientTypeFilter = filterStates[UserFilterValues.UserSessionFilterValues.CLIENT_TYPE]
  if (clientTypeFilter?.type === 'choice' && clientTypeFilter.selectedIds.size > 0) {
    searchParams.client_type = Array.from(clientTypeFilter.selectedIds)
  }

  const identifierFilter = filterStates[UserFilterValues.UserSessionFilterValues.IDENTIFIER]
  if (identifierFilter?.type === 'text' && identifierFilter.value.trim()) {
    searchParams.identifier = [identifierFilter.value.trim()]
  }

  const ipFilter = filterStates[UserFilterValues.UserSessionFilterValues.IP_ADDRESS]
  if (ipFilter?.type === 'text' && ipFilter.value.trim()) {
    searchParams.ip_address = [ipFilter.value.trim()]
  }

  return searchParams
}
