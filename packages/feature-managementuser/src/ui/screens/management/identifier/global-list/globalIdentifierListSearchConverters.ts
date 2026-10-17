import { SortOrder, UserFilterValues } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalIdentifierListParams } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { GlobalIdentifierListSearchParams } from '@/ui/screens/management/identifier/global-list/globalIdentifierListSearchSchema'

/** State representation of global identifier list sorting and filtering options. */
export interface GlobalIdentifierListingOptionsState {
  /** Selected sorting option state. */
  sortState: ListingSortState | null
  /** Map of filter identifiers to their current filter states. */
  filterStates: Record<string, ListingFilterState>
}

/**
 * Converts global identifier list search parameters into listing option states.
 *
 * @param params - Search parameters in snake_case (URL) or camelCase (internal) format
 * @returns Parsed listing options state containing sort and filter states
 */
export const searchParamsToListingStates = (
  params?: ManagementGlobalIdentifierListParams | GlobalIdentifierListSearchParams
): GlobalIdentifierListingOptionsState => {
  if (!params) {
    return { sortState: null, filterStates: {} }
  }

  const sortBy = 'sort_by' in params ? params.sort_by : ('sortBy' in params ? params.sortBy : undefined)
  const sortOrder = 'sort_order' in params ? params.sort_order : ('sortOrder' in params ? params.sortOrder : undefined)
  const userAuthProviders = 'user_auth_provider' in params
    ? params.user_auth_provider
    : ('user_auth_providers' in params ? params.user_auth_providers : ('userAuthProviders' in params ? params.userAuthProviders : undefined))
  const identifiers = 'identifier' in params
    ? params.identifier
    : ('identifiers' in params ? params.identifiers : undefined)

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

/**
 * Converts listing option states back into global identifier search parameter format.
 *
 * @param sortState - Current sorting state
 * @param filterStates - Map of current filter states
 * @returns Search parameter object suitable for URL parameter validation
 */
export const listingStatesToSearchParams = (
  sortState: ListingSortState | null,
  filterStates: Record<string, ListingFilterState>
): GlobalIdentifierListSearchParams => {
  const searchParams: GlobalIdentifierListSearchParams = {
    sort_by: 'created_at',
    sort_order: SortOrder.DESC,
    user_auth_provider: [],
    identifier: []
  }

  if (sortState) {
    searchParams.sort_by = sortState.optionId
    searchParams.sort_order = sortState.isAscending ? SortOrder.ASC : SortOrder.DESC
  }

  const providerFilter = filterStates[UserFilterValues.UserIdentifierFilterValues.USER_AUTH_PROVIDER]
  if (providerFilter?.type === 'choice' && providerFilter.selectedIds.size > 0) {
    searchParams.user_auth_provider = Array.from(providerFilter.selectedIds)
  }

  const identifierFilter = filterStates[UserFilterValues.UserIdentifierFilterValues.IDENTIFIER]
  if (identifierFilter?.type === 'text' && identifierFilter.value.trim()) {
    searchParams.identifier = [identifierFilter.value.trim()]
  }

  return searchParams
}
