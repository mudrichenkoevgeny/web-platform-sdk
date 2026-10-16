import { SortOrder, UserFilterValues } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalIdentifierListParams } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

export interface GlobalIdentifierListingOptionsState {
  sortState: ListingSortState | null
  filterStates: Record<string, ListingFilterState>
}

export const searchParamsToListingStates = (
  params?: ManagementGlobalIdentifierListParams
): GlobalIdentifierListingOptionsState => {
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
    filterStates[UserFilterValues.UserIdentifierFilterValues.USER_AUTH_PROVIDER] = {
      type: 'choice',
      selectedIds: new Set(params.userAuthProviders)
    }
  }

  if (params.identifiers && params.identifiers.length > 0) {
    filterStates[UserFilterValues.UserIdentifierFilterValues.IDENTIFIER] = {
      type: 'text',
      value: params.identifiers[0] ?? ''
    }
  }

  return { sortState, filterStates }
}

export const listingStatesToSearchParams = (
  sortState: ListingSortState | null,
  filterStates: Record<string, ListingFilterState>
): ManagementGlobalIdentifierListParams => {
  const params: ManagementGlobalIdentifierListParams = {
    pageNumber: 1,
    pageSize: 20,
    sortBy: 'created_at',
    sortOrder: SortOrder.DESC,
    userAuthProviders: [],
    identifiers: []
  }

  if (sortState) {
    params.sortBy = sortState.optionId as NonNullable<ManagementGlobalIdentifierListParams['sortBy']>
    params.sortOrder = sortState.isAscending ? SortOrder.ASC : SortOrder.DESC
  }

  const providerFilter = filterStates[UserFilterValues.UserIdentifierFilterValues.USER_AUTH_PROVIDER]
  if (providerFilter?.type === 'choice' && providerFilter.selectedIds.size > 0) {
    params.userAuthProviders = Array.from(providerFilter.selectedIds) as NonNullable<ManagementGlobalIdentifierListParams['userAuthProviders']>
  }

  const identifierFilter = filterStates[UserFilterValues.UserIdentifierFilterValues.IDENTIFIER]
  if (identifierFilter?.type === 'text' && identifierFilter.value.trim()) {
    params.identifiers = [identifierFilter.value.trim()]
  }

  return params
}
