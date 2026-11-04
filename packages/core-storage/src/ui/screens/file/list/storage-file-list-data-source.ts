import type {
  AppError,
  AppResult,
  ListingFilterState,
  ListingSortState
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  DeleteFilesBatchRequest,
  FileId,
  ManagementStorageFileListParams,
  PagedResult,
  SelfStorageFileListParams,
  StorageFileSummary
} from '@mudrichenkoevgeny/shared-foundation'
import {
  SortOrder,
  StorageCategory,
  StorageFileFilterValues,
  StorageFileSortBy,
  StorageFileStatus,
  StorageFileVisibility
} from '@mudrichenkoevgeny/shared-foundation'

/**
 * Structured query input representing current sort, filter, and pagination states.
 */
export interface StorageFileListQuery {
  pageNumber: number
  sortState: ListingSortState | null
  filterStates: Record<string, ListingFilterState>
  ownerUserId?: string | null
}

function isStorageFileSortBy(value: string): value is StorageFileSortBy {
  return Object.values<string>(StorageFileSortBy).includes(value)
}

function isStorageCategory(value: string): value is StorageCategory {
  return Object.values<string>(StorageCategory).includes(value)
}

function isStorageFileVisibility(value: string): value is StorageFileVisibility {
  return Object.values<string>(StorageFileVisibility).includes(value)
}

function isStorageFileStatus(value: string): value is StorageFileStatus {
  return Object.values<string>(StorageFileStatus).includes(value)
}

function parseCommaSeparatedStrings(value?: string): string[] | undefined {
  if (!value || value.trim() === '') {
    return undefined
  }
  const items = value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return items.length > 0 ? items : undefined
}

/**
 * Maps a UI {@link StorageFileListQuery} into a {@link SelfStorageFileListParams} DTO.
 *
 * @param query - Structured UI listing query parameters.
 * @returns Mapped parameters for self-storage file listing use cases.
 */
export function mapQueryToSelfStorageParams(query: StorageFileListQuery): SelfStorageFileListParams {
  const { pageNumber, sortState, filterStates } = query
  const filterKeys = StorageFileFilterValues

  const fileIdFilter = filterStates[filterKeys.FILE_ID]
  const fileIds =
    fileIdFilter?.type === 'text' ? parseCommaSeparatedStrings(fileIdFilter.value) : undefined

  const categoryFilter = filterStates[filterKeys.CATEGORY]
  const selectedCategories =
    categoryFilter?.type === 'choice'
      ? Array.from(categoryFilter.selectedIds).filter(isStorageCategory)
      : []

  const excludeCategoryFilter = filterStates[filterKeys.EXCLUDE_CATEGORY]
  const excludeCategories =
    excludeCategoryFilter?.type === 'choice'
      ? Array.from(excludeCategoryFilter.selectedIds).filter(isStorageCategory)
      : []

  const visibilityFilter = filterStates[filterKeys.VISIBILITY]
  const selectedVisibilities =
    visibilityFilter?.type === 'choice'
      ? Array.from(visibilityFilter.selectedIds).filter(isStorageFileVisibility)
      : []

  const excludeVisibilityFilter = filterStates[filterKeys.EXCLUDE_VISIBILITY]
  const excludeVisibilities =
    excludeVisibilityFilter?.type === 'choice'
      ? Array.from(excludeVisibilityFilter.selectedIds).filter(isStorageFileVisibility)
      : []

  const statusFilter = filterStates[filterKeys.STATUS]
  const selectedStatuses =
    statusFilter?.type === 'choice'
      ? Array.from(statusFilter.selectedIds).filter(isStorageFileStatus)
      : []

  const excludeStatusFilter = filterStates[filterKeys.EXCLUDE_STATUS]
  const excludeStatuses =
    excludeStatusFilter?.type === 'choice'
      ? Array.from(excludeStatusFilter.selectedIds).filter(isStorageFileStatus)
      : []

  const mimeTypeFilter = filterStates[filterKeys.MIME_TYPE]
  const mimeTypes =
    mimeTypeFilter?.type === 'text' ? parseCommaSeparatedStrings(mimeTypeFilter.value) : undefined

  const fileNameFilter = filterStates[filterKeys.FILE_NAME]
  const fileName =
    fileNameFilter?.type === 'text' && fileNameFilter.value.trim() !== ''
      ? fileNameFilter.value.trim()
      : undefined

  const targetScopeFilter = filterStates[filterKeys.TARGET_SCOPE]
  const targetScopes =
    targetScopeFilter?.type === 'text' ? parseCommaSeparatedStrings(targetScopeFilter.value) : undefined

  const isTargetScopeSetFilter = filterStates[filterKeys.IS_TARGET_SCOPE_SET]
  const isTargetScopeSet =
    isTargetScopeSetFilter?.type === 'boolean'
      ? isTargetScopeSetFilter.value
      : undefined

  const sizeFromFilter = filterStates[filterKeys.FILE_SIZE_BYTES_FROM]
  const fileSizeBytesFrom =
    sizeFromFilter?.type === 'number' && sizeFromFilter.value != null
      ? sizeFromFilter.value
      : undefined

  const sizeToFilter = filterStates[filterKeys.FILE_SIZE_BYTES_TO]
  const fileSizeBytesTo =
    sizeToFilter?.type === 'number' && sizeToFilter.value != null
      ? sizeToFilter.value
      : undefined

  const createdAtFromFilter = filterStates[filterKeys.CREATED_AT_FROM]
  const createdAtFrom =
    createdAtFromFilter?.type === 'text' && createdAtFromFilter.value.trim() !== ''
      ? createdAtFromFilter.value.trim()
      : undefined

  const createdAtToFilter = filterStates[filterKeys.CREATED_AT_TO]
  const createdAtTo =
    createdAtToFilter?.type === 'text' && createdAtToFilter.value.trim() !== ''
      ? createdAtToFilter.value.trim()
      : undefined

  const updatedAtFromFilter = filterStates[filterKeys.UPDATED_AT_FROM]
  const updatedAtFrom =
    updatedAtFromFilter?.type === 'text' && updatedAtFromFilter.value.trim() !== ''
      ? updatedAtFromFilter.value.trim()
      : undefined

  const updatedAtToFilter = filterStates[filterKeys.UPDATED_AT_TO]
  const updatedAtTo =
    updatedAtToFilter?.type === 'text' && updatedAtToFilter.value.trim() !== ''
      ? updatedAtToFilter.value.trim()
      : undefined

  const isUpdatedAtSetFilter = filterStates[filterKeys.IS_UPDATED_AT_SET]
  const isUpdatedAtSet =
    isUpdatedAtSetFilter?.type === 'boolean'
      ? isUpdatedAtSetFilter.value
      : undefined

  const searchQueryFilter = filterStates[filterKeys.SEARCH_QUERY]
  const searchQuery =
    searchQueryFilter?.type === 'text' && searchQueryFilter.value.trim() !== ''
      ? searchQueryFilter.value.trim()
      : undefined

  const sortBy =
    sortState && isStorageFileSortBy(sortState.optionId) ? sortState.optionId : undefined

  return {
    pageNumber,
    sortBy,
    sortOrder: sortState ? (sortState.isAscending ? SortOrder.ASC : SortOrder.DESC) : undefined,
    fileIds,
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    excludeCategories: excludeCategories.length > 0 ? excludeCategories : undefined,
    visibilities: selectedVisibilities.length > 0 ? selectedVisibilities : undefined,
    excludeVisibilities: excludeVisibilities.length > 0 ? excludeVisibilities : undefined,
    statuses: selectedStatuses.length > 0 ? selectedStatuses : undefined,
    excludeStatuses: excludeStatuses.length > 0 ? excludeStatuses : undefined,
    mimeTypes,
    fileName,
    targetScopes,
    isTargetScopeSet,
    fileSizeBytesFrom,
    fileSizeBytesTo,
    createdAtFrom,
    createdAtTo,
    updatedAtFrom,
    updatedAtTo,
    isUpdatedAtSet,
    searchQuery
  }
}

/**
 * Maps a UI {@link StorageFileListQuery} into a {@link ManagementStorageFileListParams} DTO.
 *
 * @param query - Structured UI listing query parameters.
 * @returns Mapped parameters for management storage file listing use cases.
 */
export function mapQueryToManagementStorageParams(
  query: StorageFileListQuery
): ManagementStorageFileListParams {
  const baseParams = mapQueryToSelfStorageParams(query)
  const filterKeys = StorageFileFilterValues

  const ownerFilter = query.filterStates[filterKeys.OWNER_USER_ID]
  const filterOwnerIds =
    ownerFilter?.type === 'text' ? parseCommaSeparatedStrings(ownerFilter.value) : undefined

  const ownerUserIds = query.ownerUserId ? [query.ownerUserId] : filterOwnerIds

  const isOwnerUserIdSetFilter = query.filterStates[filterKeys.IS_OWNER_USER_ID_SET]
  const isOwnerUserIdSet =
    isOwnerUserIdSetFilter?.type === 'boolean'
      ? isOwnerUserIdSetFilter.value
      : undefined

  return {
    ...baseParams,
    ownerUserIds,
    isOwnerUserIdSet
  }
}

/**
 * Dependencies required to create a self-storage {@link StorageFileListDataSource}.
 */
export interface SelfStorageFileListDataSourceDeps {
  /** Use case fetching paginated self-storage files. */
  getFilesUseCase: {
    execute(
      params?: SelfStorageFileListParams | null
    ): Promise<AppResult<PagedResult<StorageFileSummary>, AppError>>
  }
  /** Optional use case deleting a single self-storage file. */
  deleteFileUseCase?: {
    execute(fileId: FileId): Promise<AppResult<void, AppError>>
  }
  /** Optional use case deleting multiple self-storage files in batch. */
  deleteFilesBatchUseCase?: {
    execute(request: DeleteFilesBatchRequest | FileId[]): Promise<AppResult<void, AppError>>
  }
}

/**
 * Data source managing self-storage file list state and deletion actions.
 */
export interface StorageFileListDataSource {
  getFiles(
    query: StorageFileListQuery
  ): Promise<AppResult<PagedResult<StorageFileSummary>, AppError>>
  deleteFile?(fileId: FileId): Promise<AppResult<void, AppError>>
  deleteFilesBatch?(fileIds: FileId[]): Promise<AppResult<void, AppError>>
  isSingleDeleteAvailable?: boolean
  isBatchDeleteAvailable?: boolean
}

/**
 * Factory creating a {@link StorageFileListDataSource} for self-storage.
 */
export const createSelfStorageFileListDataSource = (
  deps: SelfStorageFileListDataSourceDeps
): StorageFileListDataSource => ({
  getFiles: (query) => deps.getFilesUseCase.execute(mapQueryToSelfStorageParams(query)),
  deleteFile: deps.deleteFileUseCase
    ? (fileId) => deps.deleteFileUseCase!.execute(fileId)
    : undefined,
  deleteFilesBatch: deps.deleteFilesBatchUseCase
    ? (fileIds) => deps.deleteFilesBatchUseCase!.execute(fileIds)
    : undefined,
  isSingleDeleteAvailable: Boolean(deps.deleteFileUseCase),
  isBatchDeleteAvailable: Boolean(deps.deleteFilesBatchUseCase)
})

/**
 * Dependencies required to create a management storage {@link StorageFileListDataSource}.
 */
export interface ManagementStorageFileListDataSourceDeps {
  /** Use case fetching paginated management storage files. */
  managementGetFilesUseCase: {
    execute(
      params?: ManagementStorageFileListParams | null
    ): Promise<AppResult<PagedResult<StorageFileSummary>, AppError>>
  }
  /** Optional use case deleting a single management storage file. */
  managementDeleteFileUseCase?: {
    execute(fileId: FileId): Promise<AppResult<void, AppError>>
  }
  /** Optional use case deleting multiple management storage files in batch. */
  managementDeleteFilesBatchUseCase?: {
    execute(request: DeleteFilesBatchRequest | FileId[]): Promise<AppResult<void, AppError>>
  }
}

/**
 * Factory creating a {@link StorageFileListDataSource} for management storage.
 */
export const createManagementStorageFileListDataSource = (
  deps: ManagementStorageFileListDataSourceDeps
): StorageFileListDataSource => ({
  getFiles: (query) =>
    deps.managementGetFilesUseCase.execute(mapQueryToManagementStorageParams(query)),
  deleteFile: deps.managementDeleteFileUseCase
    ? (fileId) => deps.managementDeleteFileUseCase!.execute(fileId)
    : undefined,
  deleteFilesBatch: deps.managementDeleteFilesBatchUseCase
    ? (fileIds) => deps.managementDeleteFilesBatchUseCase!.execute(fileIds)
    : undefined,
  isSingleDeleteAvailable: Boolean(deps.managementDeleteFileUseCase),
  isBatchDeleteAvailable: Boolean(deps.managementDeleteFilesBatchUseCase)
})
