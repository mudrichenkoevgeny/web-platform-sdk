import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { StorageFileListSearchParams } from './storage-file-list-search-schema'
import { storageFileListSearchSchema } from './storage-file-list-search-schema'

/**
 * Converts sort and filter UI states to a search parameters DTO object.
 *
 * @param sortState - Current active sort state or null if no sorting selected.
 * @param filterStates - Map of filter states indexed by filter field identifier.
 * @returns Search parameters DTO object suitable for URL or query map.
 */
export const listingStatesToSearchParams = (
  sortState: ListingSortState | null,
  filterStates: Record<string, ListingFilterState>
): StorageFileListSearchParams => {
  const rawParams: Record<string, unknown> = {}

  if (sortState) {
    rawParams.sortBy = sortState.optionId
    rawParams.sortOrder = sortState.isAscending ? 'asc' : 'desc'
  }

  if (filterStates.ownerUserId && filterStates.ownerUserId.type === 'text') {
    rawParams.ownerUserId = filterStates.ownerUserId.value
  }

  if (
    filterStates.category &&
    filterStates.category.type === 'choice' &&
    filterStates.category.selectedIds.size > 0
  ) {
    rawParams.category = Array.from(filterStates.category.selectedIds)[0]
  }

  if (
    filterStates.visibility &&
    filterStates.visibility.type === 'choice' &&
    filterStates.visibility.selectedIds.size > 0
  ) {
    rawParams.visibility = Array.from(filterStates.visibility.selectedIds)[0]
  }

  if (
    filterStates.status &&
    filterStates.status.type === 'choice' &&
    filterStates.status.selectedIds.size > 0
  ) {
    rawParams.status = Array.from(filterStates.status.selectedIds)[0]
  }

  if (filterStates.mimeType && filterStates.mimeType.type === 'text') {
    rawParams.mimeType = filterStates.mimeType.value
  }

  if (filterStates.fileName && filterStates.fileName.type === 'text') {
    rawParams.fileName = filterStates.fileName.value
  }

  const parseResult = storageFileListSearchSchema.safeParse(rawParams)
  return parseResult.success ? parseResult.data : {}
}

/**
 * Converts raw search parameters into structured sort and filter UI states.
 *
 * @param searchParams - Raw search parameter DTO or query map.
 * @returns Object containing structured `sortState` and `filterStates`.
 */
export const searchParamsToListingStates = (
  searchParams?: unknown
): {
  sortState: ListingSortState | null
  filterStates: Record<string, ListingFilterState>
} => {
  const parseResult = storageFileListSearchSchema.safeParse(searchParams)

  if (!parseResult.success) {
    return { sortState: null, filterStates: {} }
  }

  const params = parseResult.data
  const filterStates: Record<string, ListingFilterState> = {}

  if (params.ownerUserId) {
    filterStates.ownerUserId = { type: 'text', value: params.ownerUserId }
  }

  if (params.category) {
    filterStates.category = { type: 'choice', selectedIds: new Set([params.category]) }
  }

  if (params.visibility) {
    filterStates.visibility = { type: 'choice', selectedIds: new Set([params.visibility]) }
  }

  if (params.status) {
    filterStates.status = { type: 'choice', selectedIds: new Set([params.status]) }
  }

  if (params.mimeType) {
    filterStates.mimeType = { type: 'text', value: params.mimeType }
  }

  if (params.fileName) {
    filterStates.fileName = { type: 'text', value: params.fileName }
  }

  let sortState: ListingSortState | null = null
  if (params.sortBy) {
    sortState = { optionId: params.sortBy, isAscending: params.sortOrder === 'asc' }
  }

  return { sortState, filterStates }
}
