import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { StorageFileFilterValues } from '@mudrichenkoevgeny/shared-foundation'
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

  const keys = StorageFileFilterValues

  const ownerUserIdFilter = filterStates[keys.OWNER_USER_ID]
  if (ownerUserIdFilter?.type === 'text') {
    rawParams.ownerUserId = ownerUserIdFilter.value
  }

  const isOwnerUserIdSetFilter = filterStates[keys.IS_OWNER_USER_ID_SET]
  if (isOwnerUserIdSetFilter?.type === 'boolean') {
    rawParams.isOwnerUserIdSet = isOwnerUserIdSetFilter.value
  }

  const fileIdFilter = filterStates[keys.FILE_ID]
  if (fileIdFilter?.type === 'text') {
    rawParams.fileId = fileIdFilter.value
  }

  const fileNameFilter = filterStates[keys.FILE_NAME]
  if (fileNameFilter?.type === 'text') {
    rawParams.fileName = fileNameFilter.value
  }

  const fileSizeBytesFromFilter = filterStates[keys.FILE_SIZE_BYTES_FROM]
  if (fileSizeBytesFromFilter?.type === 'number') {
    rawParams.fileSizeBytesFrom = fileSizeBytesFromFilter.value
  }

  const fileSizeBytesToFilter = filterStates[keys.FILE_SIZE_BYTES_TO]
  if (fileSizeBytesToFilter?.type === 'number') {
    rawParams.fileSizeBytesTo = fileSizeBytesToFilter.value
  }

  const mimeTypeFilter = filterStates[keys.MIME_TYPE]
  if (mimeTypeFilter?.type === 'text') {
    rawParams.mimeType = mimeTypeFilter.value
  }

  const categoryFilter = filterStates[keys.CATEGORY]
  if (categoryFilter?.type === 'choice' && categoryFilter.selectedIds.size > 0) {
    rawParams.category = Array.from(categoryFilter.selectedIds)[0]
  }

  const excludeCategoryFilter = filterStates[keys.EXCLUDE_CATEGORY]
  if (excludeCategoryFilter?.type === 'choice' && excludeCategoryFilter.selectedIds.size > 0) {
    rawParams.excludeCategory = Array.from(excludeCategoryFilter.selectedIds)[0]
  }

  const visibilityFilter = filterStates[keys.VISIBILITY]
  if (visibilityFilter?.type === 'choice' && visibilityFilter.selectedIds.size > 0) {
    rawParams.visibility = Array.from(visibilityFilter.selectedIds)[0]
  }

  const excludeVisibilityFilter = filterStates[keys.EXCLUDE_VISIBILITY]
  if (excludeVisibilityFilter?.type === 'choice' && excludeVisibilityFilter.selectedIds.size > 0) {
    rawParams.excludeVisibility = Array.from(excludeVisibilityFilter.selectedIds)[0]
  }

  const statusFilter = filterStates[keys.STATUS]
  if (statusFilter?.type === 'choice' && statusFilter.selectedIds.size > 0) {
    const selected = Array.from(statusFilter.selectedIds)
    if (selected.length === 1) {
      rawParams.status = selected[0]
      rawParams.statuses = undefined
    } else {
      rawParams.statuses = selected
      rawParams.status = undefined
    }
  }

  const excludeStatusFilter = filterStates[keys.EXCLUDE_STATUS]
  if (excludeStatusFilter?.type === 'choice' && excludeStatusFilter.selectedIds.size > 0) {
    const selected = Array.from(excludeStatusFilter.selectedIds)
    if (selected.length === 1) {
      rawParams.excludeStatus = selected[0]
      rawParams.excludeStatuses = undefined
    } else {
      rawParams.excludeStatuses = selected
      rawParams.excludeStatus = undefined
    }
  }

  const targetScopeFilter = filterStates[keys.TARGET_SCOPE]
  if (targetScopeFilter?.type === 'text') {
    rawParams.targetScope = targetScopeFilter.value
  }

  const isTargetScopeSetFilter = filterStates[keys.IS_TARGET_SCOPE_SET]
  if (isTargetScopeSetFilter?.type === 'boolean') {
    rawParams.isTargetScopeSet = isTargetScopeSetFilter.value
  }

  const createdAtFromFilter = filterStates[keys.CREATED_AT_FROM]
  if (createdAtFromFilter?.type === 'text') {
    rawParams.createdAtFrom = createdAtFromFilter.value
  }

  const createdAtToFilter = filterStates[keys.CREATED_AT_TO]
  if (createdAtToFilter?.type === 'text') {
    rawParams.createdAtTo = createdAtToFilter.value
  }

  const updatedAtFromFilter = filterStates[keys.UPDATED_AT_FROM]
  if (updatedAtFromFilter?.type === 'text') {
    rawParams.updatedAtFrom = updatedAtFromFilter.value
  }

  const updatedAtToFilter = filterStates[keys.UPDATED_AT_TO]
  if (updatedAtToFilter?.type === 'text') {
    rawParams.updatedAtTo = updatedAtToFilter.value
  }

  const isUpdatedAtSetFilter = filterStates[keys.IS_UPDATED_AT_SET]
  if (isUpdatedAtSetFilter?.type === 'boolean') {
    rawParams.isUpdatedAtSet = isUpdatedAtSetFilter.value
  }

  const searchQueryFilter = filterStates[keys.SEARCH_QUERY]
  if (searchQueryFilter?.type === 'text') {
    rawParams.searchQuery = searchQueryFilter.value
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
  const keys = StorageFileFilterValues

  if (params.ownerUserId) {
    filterStates[keys.OWNER_USER_ID] = { type: 'text', value: params.ownerUserId }
  }

  if (typeof params.isOwnerUserIdSet === 'boolean') {
    filterStates[keys.IS_OWNER_USER_ID_SET] = { type: 'boolean', value: params.isOwnerUserIdSet }
  }

  if (params.fileId) {
    filterStates[keys.FILE_ID] = { type: 'text', value: params.fileId }
  }

  if (params.fileName) {
    filterStates[keys.FILE_NAME] = { type: 'text', value: params.fileName }
  }

  if (typeof params.fileSizeBytesFrom === 'number') {
    filterStates[keys.FILE_SIZE_BYTES_FROM] = { type: 'number', value: params.fileSizeBytesFrom }
  }

  if (typeof params.fileSizeBytesTo === 'number') {
    filterStates[keys.FILE_SIZE_BYTES_TO] = { type: 'number', value: params.fileSizeBytesTo }
  }

  if (params.mimeType) {
    filterStates[keys.MIME_TYPE] = { type: 'text', value: params.mimeType }
  }

  if (params.category) {
    filterStates[keys.CATEGORY] = { type: 'choice', selectedIds: new Set([params.category]) }
  }

  if (params.excludeCategory) {
    filterStates[keys.EXCLUDE_CATEGORY] = { type: 'choice', selectedIds: new Set([params.excludeCategory]) }
  }

  if (params.visibility) {
    filterStates[keys.VISIBILITY] = { type: 'choice', selectedIds: new Set([params.visibility]) }
  }

  if (params.excludeVisibility) {
    filterStates[keys.EXCLUDE_VISIBILITY] = { type: 'choice', selectedIds: new Set([params.excludeVisibility]) }
  }

  if (params.statuses && params.statuses.length > 0) {
    filterStates[keys.STATUS] = { type: 'choice', selectedIds: new Set(params.statuses) }
  } else if (params.status) {
    filterStates[keys.STATUS] = { type: 'choice', selectedIds: new Set([params.status]) }
  }

  if (params.excludeStatuses && params.excludeStatuses.length > 0) {
    filterStates[keys.EXCLUDE_STATUS] = { type: 'choice', selectedIds: new Set(params.excludeStatuses) }
  } else if (params.excludeStatus) {
    filterStates[keys.EXCLUDE_STATUS] = { type: 'choice', selectedIds: new Set([params.excludeStatus]) }
  }

  if (params.targetScope) {
    filterStates[keys.TARGET_SCOPE] = { type: 'text', value: params.targetScope }
  }

  if (typeof params.isTargetScopeSet === 'boolean') {
    filterStates[keys.IS_TARGET_SCOPE_SET] = { type: 'boolean', value: params.isTargetScopeSet }
  }

  if (params.createdAtFrom) {
    filterStates[keys.CREATED_AT_FROM] = { type: 'text', value: params.createdAtFrom }
  }

  if (params.createdAtTo) {
    filterStates[keys.CREATED_AT_TO] = { type: 'text', value: params.createdAtTo }
  }

  if (params.updatedAtFrom) {
    filterStates[keys.UPDATED_AT_FROM] = { type: 'text', value: params.updatedAtFrom }
  }

  if (params.updatedAtTo) {
    filterStates[keys.UPDATED_AT_TO] = { type: 'text', value: params.updatedAtTo }
  }

  if (typeof params.isUpdatedAtSet === 'boolean') {
    filterStates[keys.IS_UPDATED_AT_SET] = { type: 'boolean', value: params.isUpdatedAtSet }
  }

  if (params.searchQuery) {
    filterStates[keys.SEARCH_QUERY] = { type: 'text', value: params.searchQuery }
  }

  let sortState: ListingSortState | null = null
  if (params.sortBy) {
    sortState = { optionId: params.sortBy, isAscending: params.sortOrder === 'asc' }
  }

  return { sortState, filterStates }
}
