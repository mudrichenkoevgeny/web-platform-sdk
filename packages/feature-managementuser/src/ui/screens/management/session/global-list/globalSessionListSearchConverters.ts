import { SortOrder, UserFilterValues } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalSessionListParams } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

export interface GlobalSessionListingOptionsState {
  sortState: ListingSortState | null
  filterStates: Record<string, ListingFilterState>
}

export const searchParamsToListingStates = (
  params?: ManagementGlobalSessionListParams
): GlobalSessionListingOptionsState => {
  if (!params) {
    return { sortState: null, filterStates: {} }
  }

  const sortState: ListingSortState | null = params.sortBy
    ? {
        optionId: params.sortBy,
        isAscending: params.sortOrder === SortOrder.ASC
      }
    : null

  const filterStates: Record<string, ListingFilterState> = {}

  if (params.userAuthProviders && params.userAuthProviders.length > 0) {
    filterStates[UserFilterValues.UserSessionFilterValues.USER_AUTH_PROVIDER] = {
      type: 'choice',
      selectedIds: new Set(params.userAuthProviders)
    }
  }

  if (params.clientTypes && params.clientTypes.length > 0) {
    filterStates[UserFilterValues.UserSessionFilterValues.CLIENT_TYPE] = {
      type: 'choice',
      selectedIds: new Set(params.clientTypes)
    }
  }

  if (params.identifiers && params.identifiers.length > 0) {
    filterStates[UserFilterValues.UserSessionFilterValues.IDENTIFIER] = {
      type: 'text',
      value: params.identifiers[0] ?? ''
    }
  }

  if (params.ipAddresses && params.ipAddresses.length > 0) {
    filterStates[UserFilterValues.UserSessionFilterValues.IP_ADDRESS] = {
      type: 'text',
      value: params.ipAddresses[0] ?? ''
    }
  }

  return { sortState, filterStates }
}

export const listingStatesToSearchParams = (
  sortState: ListingSortState | null,
  filterStates: Record<string, ListingFilterState>
): ManagementGlobalSessionListParams => {
  const params: ManagementGlobalSessionListParams = {
    pageNumber: 1,
    pageSize: 20,
    sortBy: 'created_at',
    sortOrder: SortOrder.DESC,
    userAuthProviders: [],
    clientTypes: [],
    identifiers: [],
    ipAddresses: []
  }

  if (sortState) {
    params.sortBy = sortState.optionId as NonNullable<ManagementGlobalSessionListParams['sortBy']>
    params.sortOrder = sortState.isAscending ? SortOrder.ASC : SortOrder.DESC
  }

  const providerFilter = filterStates[UserFilterValues.UserSessionFilterValues.USER_AUTH_PROVIDER]
  if (providerFilter?.type === 'choice' && providerFilter.selectedIds.size > 0) {
    params.userAuthProviders = Array.from(providerFilter.selectedIds) as NonNullable<ManagementGlobalSessionListParams['userAuthProviders']>
  }

  const clientTypeFilter = filterStates[UserFilterValues.UserSessionFilterValues.CLIENT_TYPE]
  if (clientTypeFilter?.type === 'choice' && clientTypeFilter.selectedIds.size > 0) {
    params.clientTypes = Array.from(clientTypeFilter.selectedIds) as NonNullable<ManagementGlobalSessionListParams['clientTypes']>
  }

  const identifierFilter = filterStates[UserFilterValues.UserSessionFilterValues.IDENTIFIER]
  if (identifierFilter?.type === 'text' && identifierFilter.value.trim()) {
    params.identifiers = [identifierFilter.value.trim()]
  }

  const ipFilter = filterStates[UserFilterValues.UserSessionFilterValues.IP_ADDRESS]
  if (ipFilter?.type === 'text' && ipFilter.value.trim()) {
    params.ipAddresses = [ipFilter.value.trim()]
  }

  return params
}
