import { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageFileListParams } from '@mudrichenkoevgeny/shared-foundation'
import {
  globalStorageFileListSearchSchema,
  GlobalStorageFileListSearchParams
} from './global-storage-file-list-search-schema'

/**
 * Converts sort and filter UI states to a search parameters DTO object.
 *
 * @param sortState - Current active sort state or null if no sorting selected.
 * @param filterStates - Map of filter states indexed by filter field identifier.
 * @returns Search parameters DTO object suitable for URL or API query.
 */
export const listingStatesToSearchParams = (
  sortState: ListingSortState | null,
  filterStates: Record<string, ListingFilterState>
): GlobalStorageFileListSearchParams => {
  const params: GlobalStorageFileListSearchParams = {}

  if (sortState) {
    params.sortBy = sortState.sortBy
    params.sortOrder = sortState.sortOrder
  }

  if (filterStates.ownerUserId && filterStates.ownerUserId.value.length > 0) {
    params.ownerUserId = filterStates.ownerUserId.value[0]
  }

  if (filterStates.category && filterStates.category.value.length > 0) {
    params.category = filterStates.category.value[0]
  }

  if (filterStates.visibility && filterStates.visibility.value.length > 0) {
    params.visibility = filterStates.visibility.value[0]
  }

  if (filterStates.status && filterStates.status.value.length > 0) {
    params.status = filterStates.status.value[0]
  }

  if (filterStates.mimeType && filterStates.mimeType.value.length > 0) {
    params.mimeType = filterStates.mimeType.value[0]
  }

  if (filterStates.fileName && filterStates.fileName.value.length > 0) {
    params.fileName = filterStates.fileName.value[0]
  }

  return params
}

/**
 * Converts raw search parameters into structured sort and filter UI states.
 *
 * @param searchParams - Raw search parameter DTO or query map.
 * @returns Object containing structured `sortState` and `filterStates`.
 */
export const searchParamsToListingStates = (
  searchParams?: GlobalStorageFileListSearchParams | ManagementStorageFileListParams
): {
  sortState: ListingSortState | null
  filterStates: Record<string, ListingFilterState>
} => {
  const parseResult = globalStorageFileListSearchSchema.safeParse(searchParams)

  if (!parseResult.success) {
    return { sortState: null, filterStates: {} }
  }

  const params = parseResult.data
  const filterStates: Record<string, ListingFilterState> = {}

  if (params.ownerUserId) {
    filterStates.ownerUserId = new ListingFilterState('ownerUserId', [params.ownerUserId])
  }

  if (params.category) {
    filterStates.category = new ListingFilterState('category', [params.category])
  }

  if (params.visibility) {
    filterStates.visibility = new ListingFilterState('visibility', [params.visibility])
  }

  if (params.status) {
    filterStates.status = new ListingFilterState('status', [params.status])
  }

  if (params.mimeType) {
    filterStates.mimeType = new ListingFilterState('mimeType', [params.mimeType])
  }

  if (params.fileName) {
    filterStates.fileName = new ListingFilterState('fileName', [params.fileName])
  }

  let sortState: ListingSortState | null = null
  if (params.sortBy) {
    sortState = new ListingSortState(params.sortBy, params.sortOrder === 'asc' || params.sortOrder === 'desc' ? params.sortOrder : 'desc')
  }

  return { sortState, filterStates }
}
