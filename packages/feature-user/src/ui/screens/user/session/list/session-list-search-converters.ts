import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserSessionFilterValues } from '@mudrichenkoevgeny/shared-foundation'

export const listingStatesToSearchParams = (
  sortState: ListingSortState | null,
  filterStates: Record<string, ListingFilterState>
): Record<string, unknown> => {
  const rawParams: Record<string, unknown> = {}

  if (sortState) {
    rawParams.sortBy = sortState.optionId
    rawParams.sortOrder = sortState.isAscending ? 'asc' : 'desc'
  }

  const keys = UserSessionFilterValues

  const userIdFilter = filterStates[keys.USER_ID]
  if (userIdFilter?.type === 'text' && userIdFilter.value.trim() !== '') {
    rawParams.userId = userIdFilter.value.trim()
  }

  const sessionIdFilter = filterStates[keys.SESSION_ID]
  if (sessionIdFilter?.type === 'text' && sessionIdFilter.value.trim() !== '') {
    rawParams.sessionId = sessionIdFilter.value.trim()
  }

  const userRoleFilter = filterStates[keys.USER_ROLE]
  if (userRoleFilter?.type === 'choice' && userRoleFilter.selectedIds.size > 0) {
    rawParams.userRoles = Array.from(userRoleFilter.selectedIds)
  }

  const identifierFilter = filterStates[keys.IDENTIFIER]
  if (identifierFilter?.type === 'text' && identifierFilter.value.trim() !== '') {
    rawParams.identifier = identifierFilter.value.trim()
  }

  const identifierAuthProviderFilter = filterStates[keys.IDENTIFIER_AUTH_PROVIDER]
  if (identifierAuthProviderFilter?.type === 'choice' && identifierAuthProviderFilter.selectedIds.size > 0) {
    rawParams.identifierAuthProviders = Array.from(identifierAuthProviderFilter.selectedIds)
  }

  const clientTypeFilter = filterStates[keys.CLIENT_TYPE]
  if (clientTypeFilter?.type === 'choice' && clientTypeFilter.selectedIds.size > 0) {
    rawParams.clientTypes = Array.from(clientTypeFilter.selectedIds)
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
  const keys = UserSessionFilterValues

  if (typeof params.userId === 'string' && params.userId) {
    filterStates[keys.USER_ID] = { type: 'text', value: params.userId }
  }

  if (typeof params.sessionId === 'string' && params.sessionId) {
    filterStates[keys.SESSION_ID] = { type: 'text', value: params.sessionId }
  }

  if (Array.isArray(params.userRoles) && params.userRoles.length > 0) {
    filterStates[keys.USER_ROLE] = {
      type: 'choice',
      selectedIds: new Set(params.userRoles.map(String))
    }
  }

  if (typeof params.identifier === 'string' && params.identifier) {
    filterStates[keys.IDENTIFIER] = { type: 'text', value: params.identifier }
  }

  if (Array.isArray(params.identifierAuthProviders) && params.identifierAuthProviders.length > 0) {
    filterStates[keys.IDENTIFIER_AUTH_PROVIDER] = {
      type: 'choice',
      selectedIds: new Set(params.identifierAuthProviders.map(String))
    }
  }

  if (Array.isArray(params.clientTypes) && params.clientTypes.length > 0) {
    filterStates[keys.CLIENT_TYPE] = {
      type: 'choice',
      selectedIds: new Set(params.clientTypes.map(String))
    }
  }

  if (typeof params.searchQuery === 'string' && params.searchQuery) {
    filterStates[keys.SEARCH_QUERY] = { type: 'text', value: params.searchQuery }
  }

  return { sortState, filterStates }
}
