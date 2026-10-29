import type {
  AppError,
  AppResult,
  ListingFilterState,
  ListingSortState
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  DeleteFilesBatchRequest,
  ManagementStorageFileListParams,
  PagedResult,
  SelfStorageFileListParams,
  StorageFileSummary
} from '@mudrichenkoevgeny/shared-foundation'
import {
  SortOrder,
  StorageCategory,
  StorageFileSortBy,
  StorageFileStatus,
  StorageFileVisibility,
  StorageFilterValues
} from '@mudrichenkoevgeny/shared-foundation'

/**
 * Query parameters extracted from the UI state for fetching storage files.
 */
export interface StorageFileListQuery {
  /** Target 1-based page number to load. */
  pageNumber: number
  /** Active sort state or null if default sorting is used. */
  sortState: ListingSortState | null
  /** Map of active filter states keyed by filter identifier. */
  filterStates: Record<string, ListingFilterState>
  /** Optional target owner user ID restricting the file list. */
  ownerUserId?: string | null
}

/**
 * Data source contract isolating {@link StorageFileListStore} from specific contour use cases.
 */
export interface StorageFileListDataSource {
  /** Indicates whether single file deletion is supported in the current contour. */
  readonly isSingleDeleteAvailable: boolean
  /** Indicates whether batch file deletion is supported in the current contour. */
  readonly isBatchDeleteAvailable: boolean
  /**
   * Fetches a paginated list of storage files matching the UI query.
   *
   * @param query - Structured UI listing query parameters.
   * @returns Promise resolving to an {@link AppResult} with paged {@link StorageFileSummary} items.
   */
  getFiles(query: StorageFileListQuery): Promise<AppResult<PagedResult<StorageFileSummary>, AppError>>
  /**
   * Optional method deleting a single storage file by its identifier.
   *
   * @param fileId - Target file identifier.
   * @returns Promise resolving to an {@link AppResult} containing void on success.
   */
  deleteFile?: (fileId: string) => Promise<AppResult<void, AppError>>
  /**
   * Optional method deleting multiple storage files in a batch operation.
   *
   * @param request - Batch deletion request payload containing target file IDs.
   * @returns Promise resolving to an {@link AppResult} containing void on success.
   */
  deleteFilesBatch?: (request: DeleteFilesBatchRequest) => Promise<AppResult<void, AppError>>
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

function isStorageFileSortBy(value: string): value is StorageFileSortBy {
  return Object.values<string>(StorageFileSortBy).includes(value)
}

/**
 * Maps a UI {@link StorageFileListQuery} into a {@link SelfStorageFileListParams} DTO.
 *
 * @param query - Structured UI listing query parameters.
 * @returns Mapped parameters for self-storage file listing use cases.
 */
export function mapQueryToSelfStorageParams(query: StorageFileListQuery): SelfStorageFileListParams {
  const { pageNumber, sortState, filterStates } = query
  const filterKeys = StorageFilterValues.StorageFileFilterValues

  const categoryFilter = filterStates[filterKeys.CATEGORY]
  const selectedCategories =
    categoryFilter?.type === 'choice'
      ? Array.from(categoryFilter.selectedIds).filter(isStorageCategory)
      : []

  const visibilityFilter = filterStates[filterKeys.VISIBILITY]
  const selectedVisibilities =
    visibilityFilter?.type === 'choice'
      ? Array.from(visibilityFilter.selectedIds).filter(isStorageFileVisibility)
      : []

  const statusFilter = filterStates[filterKeys.STATUS]
  const selectedStatuses =
    statusFilter?.type === 'choice'
      ? Array.from(statusFilter.selectedIds).filter(isStorageFileStatus)
      : []

  const mimeTypeFilter = filterStates[filterKeys.MIME_TYPE]
  const mimeTypes =
    mimeTypeFilter?.type === 'text' && mimeTypeFilter.value.trim() !== ''
      ? [mimeTypeFilter.value.trim()]
      : undefined

  const fileNameFilter = filterStates[filterKeys.FILE_NAME]
  const fileName =
    fileNameFilter?.type === 'text' && fileNameFilter.value.trim() !== ''
      ? fileNameFilter.value.trim()
      : undefined

  const sortBy =
    sortState && isStorageFileSortBy(sortState.optionId) ? sortState.optionId : undefined

  return {
    pageNumber,
    sortBy,
    sortOrder: sortState ? (sortState.isAscending ? SortOrder.ASC : SortOrder.DESC) : undefined,
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    visibilities: selectedVisibilities.length > 0 ? selectedVisibilities : undefined,
    statuses: selectedStatuses.length > 0 ? selectedStatuses : undefined,
    mimeTypes,
    fileName
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
  const filterKeys = StorageFilterValues.StorageFileFilterValues
  const ownerFilter = query.filterStates[filterKeys.OWNER_USER_ID]
  const filterOwnerId =
    ownerFilter?.type === 'text' && ownerFilter.value.trim() !== ''
      ? ownerFilter.value.trim()
      : undefined

  const ownerId = query.ownerUserId ?? filterOwnerId

  return {
    ...baseParams,
    ownerUserIds: ownerId ? [ownerId] : undefined
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
    execute(fileId: string): Promise<AppResult<void, AppError>>
  }
  /** Optional use case deleting a batch of self-storage files. */
  deleteFilesBatchUseCase?: {
    execute(request: DeleteFilesBatchRequest): Promise<AppResult<void, AppError>>
  }
}

/**
 * Creates a {@link StorageFileListDataSource} bound to self-storage use cases.
 *
 * @param deps - Self-storage use case dependencies.
 * @returns Configured {@link StorageFileListDataSource} instance.
 */
export function createSelfStorageFileListDataSource(
  deps: SelfStorageFileListDataSourceDeps
): StorageFileListDataSource {
  const deleteFileUseCase = deps.deleteFileUseCase
  const deleteFilesBatchUseCase = deps.deleteFilesBatchUseCase

  return {
    isSingleDeleteAvailable: Boolean(deleteFileUseCase),
    isBatchDeleteAvailable: Boolean(deleteFilesBatchUseCase),
    getFiles: (query) => deps.getFilesUseCase.execute(mapQueryToSelfStorageParams(query)),
    deleteFile: deleteFileUseCase
      ? (fileId) => deleteFileUseCase.execute(fileId)
      : undefined,
    deleteFilesBatch: deleteFilesBatchUseCase
      ? (request) => deleteFilesBatchUseCase.execute(request)
      : undefined
  }
}

/**
 * Dependencies required to create a management {@link StorageFileListDataSource}.
 */
export interface ManagementStorageFileListDataSourceDeps {
  /** Use case fetching paginated management storage files. */
  getFilesUseCase: {
    execute(
      params?: ManagementStorageFileListParams | null
    ): Promise<AppResult<PagedResult<StorageFileSummary>, AppError>>
  }
  /** Optional use case deleting a single management storage file. */
  deleteFileUseCase?: {
    execute(fileId: string): Promise<AppResult<void, AppError>>
  }
  /** Optional use case deleting a batch of management storage files. */
  deleteFilesBatchUseCase?: {
    execute(request: DeleteFilesBatchRequest): Promise<AppResult<void, AppError>>
  }
}

/**
 * Creates a {@link StorageFileListDataSource} bound to management storage use cases.
 *
 * @param deps - Management storage use case dependencies.
 * @returns Configured {@link StorageFileListDataSource} instance.
 */
export function createManagementStorageFileListDataSource(
  deps: ManagementStorageFileListDataSourceDeps
): StorageFileListDataSource {
  const deleteFileUseCase = deps.deleteFileUseCase
  const deleteFilesBatchUseCase = deps.deleteFilesBatchUseCase

  return {
    isSingleDeleteAvailable: Boolean(deleteFileUseCase),
    isBatchDeleteAvailable: Boolean(deleteFilesBatchUseCase),
    getFiles: (query) => deps.getFilesUseCase.execute(mapQueryToManagementStorageParams(query)),
    deleteFile: deleteFileUseCase
      ? (fileId) => deleteFileUseCase.execute(fileId)
      : undefined,
    deleteFilesBatch: deleteFilesBatchUseCase
      ? (request) => deleteFilesBatchUseCase.execute(request)
      : undefined
  }
}
