import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserIdentifierFilterValues } from '@mudrichenkoevgeny/shared-foundation'

export const listingStatesToSearchParams = (
  sortState: ListingSortState | null,
  filterStates: Record<string, ListingFilterState>
): Record<string, unknown> => {
  const rawParams: Record<string, unknown> = {}

  if (sortState) {
    rawParams.sortBy = sortState.optionId
    rawParams.sortOrder = sortState.isAscending ? 'asc' : 'desc'
  }

  const keys = UserIdentifierFilterValues

  const userIdFilter = filterStates[keys.USER_ID]
  if (userIdFilter?.type === 'text' && userIdFilter.value.trim() !== '') {
    rawParams.userId = userIdFilter.value.trim()
  }

  const identifierIdFilter = filterStates[keys.IDENTIFIER_ID]
  if (identifierIdFilter?.type === 'text' && identifierIdFilter.value.trim() !== '') {
    rawParams.identifierId = identifierIdFilter.value.trim()
  }

  const identifierFilter = filterStates[keys.IDENTIFIER]
  if (identifierFilter?.type === 'text' && identifierFilter.value.trim() !== '') {
    rawParams.identifier = identifierFilter.value.trim()
  }

  const userAuthProviderFilter = filterStates[keys.USER_AUTH_PROVIDER]
  if (userAuthProviderFilter?.type === 'choice' && userAuthProviderFilter.selectedIds.size > 0) {
    rawParams.userAuthProviders = Array.from(userAuthProviderFilter.selectedIds)
  }

  const searchQueryFilter = filterStates[keys.SEARCH_QUERY]
  if (searchQueryFilter?.type === 'text' && searchQueryFilter.value.trim() !== '') {
    rawParams.searchQuery = searchQueryFilter.value.trim()
  }

  return rawParams
}

export const searchParamsToListingStates = (
  params?: Record<string, unknown>
): {
  sortState: ListingSortState | null
  filterStates: Record<string, ListingFilterState>
} => {
  if (!params) {
    return { sortState: null, filterStates: {} }
  }

  let sortState: ListingSortState | null = null
  if (typeof params.sortBy === 'string' && params.sortBy) {
    sortState = {
      optionId: params.sortBy,
      isAscending: params.sortOrder === 'asc'
    }
  }

  const filterStates: Record<string, ListingFilterState> = {}
  const keys = UserIdentifierFilterValues

  if (typeof params.userId === 'string' && params.userId) {
    filterStates[keys.USER_ID] = { type: 'text', value: params.userId }
  }

  if (typeof params.identifierId === 'string' && params.identifierId) {
    filterStates[keys.IDENTIFIER_ID] = { type: 'text', value: params.identifierId }
  }

  if (typeof params.identifier === 'string' && params.identifier) {
    filterStates[keys.IDENTIFIER] = { type: 'text', value: params.identifier }
  }

  if (Array.isArray(params.userAuthProviders) && params.userAuthProviders.length > 0) {
    filterStates[keys.USER_AUTH_PROVIDER] = {
      type: 'choice',
      selectedIds: new Set(params.userAuthProviders.map(String))
    }
  }

  if (typeof params.searchQuery === 'string' && params.searchQuery) {
    filterStates[keys.SEARCH_QUERY] = { type: 'text', value: params.searchQuery }
  }

  return { sortState, filterStates }
}
