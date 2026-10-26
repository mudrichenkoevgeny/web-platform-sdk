import React, { forwardRef, useEffect, useId, useState } from 'react'
import type { StorageModuleStrings, CommonModuleStrings, UserModuleStrings, StorageFileSummary } from '@mudrichenkoevgeny/shared-foundation'
import { storageStrings, commonStrings } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  cn,
  CoreBackButton,
  CoreErrorText,
  CoreScreenTitleText,
  FullscreenError,
  FullscreenLoading,
  ListingEmptyState,
  ListingHeaderBar,
  ListingOptionsPanel,
  PagingFooter,
  hasMorePages,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { StorageFileItem } from '@/ui/components/storage/item/StorageFileItem'
import { getStorageFileListOptionsConfig } from './storage-file-list-options-config'
import {
  searchParamsToListingStates,
  listingStatesToSearchParams
} from './storage-file-list-search-converters'
import {
  StorageFileListProvider,
  StorageFileListStatus,
  useStorageFileListStore
} from './storage-file-list-store'
import type {
  StorageFileListStoreDependencies,
  StorageFileListScreenState
} from './storage-file-list-store'

/**
 * DOM data-testid tags for UI testing {@link StorageFileListScreen}.
 */
export const StorageFileListTestTags = {
  TITLE: 'StorageFileList_Title',
  BACK_BUTTON: 'StorageFileList_BackButton',
  FILTER_BUTTON: 'StorageFileList_FilterButton',
  REFRESH_BUTTON: 'StorageFileList_RefreshButton',
  UPLOAD_BUTTON: 'StorageFileList_UploadButton',
  GLOBAL_ERROR_TEXT: 'StorageFileList_GlobalErrorText',
  FILE_LIST: 'StorageFileList_List',
  ACTION_ERROR_TEXT: 'StorageFileList_ActionErrorText',
  BATCH_ACTION_BAR: 'StorageFileList_BatchActionBar',
  BATCH_DELETE_BUTTON: 'StorageFileList_BatchDeleteButton',
  SELECT_ALL_BUTTON: 'StorageFileList_SelectAllButton',
  CLEAR_SELECTION_BUTTON: 'StorageFileList_ClearSelectionButton'
}

interface StorageFileListItemRowProps {
  file: StorageFileSummary
  isSelected: boolean
  strings: StorageModuleStrings
  deleteFileUseCaseAvailable: boolean
  onToggleSelect: (fileId: string) => void
  onFileClick: (fileId: string) => void
  onDeleteFileClick: (fileId: string) => void
}

const StorageFileListItemRow: React.FC<StorageFileListItemRowProps> = ({
  file,
  isSelected,
  strings,
  deleteFileUseCaseAvailable,
  onToggleSelect,
  onFileClick,
  onDeleteFileClick
}) => {
  const checkboxId = useId()

  return (
    <div className="flex items-center gap-2">
      <input
        aria-label={`${strings.ui.storageFileListTitle}: ${file.fileName}`}
        checked={isSelected}
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
        id={checkboxId}
        type="checkbox"
        onChange={() => onToggleSelect(file.id)}
      />
      <label htmlFor={checkboxId} className="sr-only">
        {strings.ui.storageFileListTitle}: {file.fileName}
      </label>
      <div className="flex-1">
        <StorageFileItem
          file={file}
          onFileClick={() => onFileClick(file.id)}
          onDeleteClick={deleteFileUseCaseAvailable ? () => onDeleteFileClick(file.id) : undefined}
        />
      </div>
    </div>
  )
}

interface StorageFileListContentProps {
  strings?: StorageModuleStrings
  commonModuleStrings?: CommonModuleStrings
  userModuleStrings?: UserModuleStrings
  includeOwnerFilter?: boolean
  searchParams?: Record<string, unknown>
  testTagPrefix?: string
}

const StorageFileListContent: React.FC<StorageFileListContentProps> = ({
  strings = storageStrings,
  commonModuleStrings = commonStrings,
  includeOwnerFilter = false,
  searchParams,
  testTagPrefix
}) => {
  const deps = useStorageFileListStore((s) => s.dependencies)
  const screenState = useStorageFileListStore((s) => s.screenState)
  const onRefresh = useStorageFileListStore((s) => s.onRefresh)
  const onFileClick = useStorageFileListStore((s) => s.onFileClick)
  const onDeleteFileClick = useStorageFileListStore((s) => s.onDeleteFileClick)
  const onUploadClick = useStorageFileListStore((s) => s.onUploadClick)
  const onBackClick = useStorageFileListStore((s) => s.onBackClick)
  const onToggleFilterPanel = useStorageFileListStore((s) => s.onToggleFilterPanel)
  const onSearchParamsUpdated = useStorageFileListStore((s) => s.onSearchParamsUpdated)
  const initScreen = useStorageFileListStore((s) => s.initScreen)
  const toggleSelectFile = useStorageFileListStore((s) => s.toggleSelectFile)
  const selectAllFiles = useStorageFileListStore((s) => s.selectAllFiles)
  const clearFileSelection = useStorageFileListStore((s) => s.clearFileSelection)
  const onDeleteSelectedFilesClick = useStorageFileListStore((s) => s.onDeleteSelectedFilesClick)

  const parseError = useAppErrorParser()

  const getTag = (tag: string) => (testTagPrefix ? `${testTagPrefix}_${tag}` : tag)

  useEffect(() => {
    void initScreen(searchParams)
  }, [initScreen, searchParams])

  const initialListingStates = searchParamsToListingStates(searchParams)
  const [sortState, setSortState] = useState<ListingSortState | null>(initialListingStates.sortState)
  const [filterStates, setFilterStates] = useState<Record<string, ListingFilterState>>(initialListingStates.filterStates)

  useEffect(() => {
    const listingStates = searchParamsToListingStates(searchParams)
    setSortState(listingStates.sortState)
    setFilterStates(listingStates.filterStates)
  }, [searchParams])

  if (screenState.status === StorageFileListStatus.LOADING) {
    return <FullscreenLoading />
  }

  if (screenState.status === StorageFileListStatus.ERROR) {
    return (
      <FullscreenError
        error={screenState.error}
        onRetry={onRefresh}
        onBack={onBackClick}
        title={strings.ui.storageFileListTitle}
      />
    )
  }

  const { paging, isFilterPanelExpanded, actionLoading, actionError, selectedFileIds } = screenState
  const optionsConfig = getStorageFileListOptionsConfig(commonModuleStrings, strings, includeOwnerFilter)

  const handleSortChange = (newSort: ListingSortState) => {
    setSortState(newSort)
    const newParams = listingStatesToSearchParams(newSort, filterStates)
    deps.onSearchParamsChanged?.(newParams)
    void onSearchParamsUpdated(newParams)
  }

  const handleFilterChange = (newFilters: Record<string, ListingFilterState>) => {
    setFilterStates(newFilters)
    const newParams = listingStatesToSearchParams(sortState, newFilters)
    deps.onSearchParamsChanged?.(newParams)
    void onSearchParamsUpdated(newParams)
  }

  const selectedCount = Object.values(selectedFileIds).filter(Boolean).length

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground overflow-hidden">
      <div className="w-full flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <CoreBackButton data-testid={getTag(StorageFileListTestTags.BACK_BUTTON)} onClick={onBackClick} />
          <CoreScreenTitleText data-testid={getTag(StorageFileListTestTags.TITLE)} text={strings.ui.storageFileListTitle} />
        </div>
        <div className="flex items-center gap-2">
          {deps.onNavigateToUpload && (
            <button
              type="button"
              data-testid={getTag(StorageFileListTestTags.UPLOAD_BUTTON)}
              onClick={onUploadClick}
              aria-label={strings.ui.storageFileListTitle}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <CoreBackButton onClick={onUploadClick} />
            </button>
          )}
          <ListingHeaderBar
            hasActiveFilters={Object.keys(filterStates).length > 0}
            onOptionsClick={onToggleFilterPanel}
            onRefreshClick={onRefresh}
          />
        </div>
      </div>

      {isFilterPanelExpanded ? (
        <div className="p-4 border-b border-border bg-card">
          <ListingOptionsPanel
            config={optionsConfig}
            filterStates={filterStates}
            sortState={sortState}
            onApplyClick={onToggleFilterPanel}
            onFilterChanged={(filterId, newState) => {
              const newFilters = { ...filterStates }
              if (newState) {
                newFilters[filterId] = newState
              } else {
                delete newFilters[filterId]
              }
              handleFilterChange(newFilters)
            }}
            onSortChanged={handleSortChange}
          />
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {selectedCount > 0 ? (
          <div
            className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border"
            data-testid={getTag(StorageFileListTestTags.BATCH_ACTION_BAR)}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {strings.ui.deleteFilesBatchConfirm(selectedCount)}
              </span>
              <button
                className="text-xs text-muted-foreground hover:underline"
                data-testid={getTag(StorageFileListTestTags.SELECT_ALL_BUTTON)}
                type="button"
                onClick={selectAllFiles}
              >
                {commonModuleStrings.ui.selectAll}
              </button>
              <button
                className="text-xs text-muted-foreground hover:underline"
                data-testid={getTag(StorageFileListTestTags.CLEAR_SELECTION_BUTTON)}
                type="button"
                onClick={clearFileSelection}
              >
                {commonModuleStrings.ui.clearAll}
              </button>
            </div>
            {deps.deleteFilesBatchUseCase ? (
              <button
                className="px-3 py-1 text-xs font-semibold text-white bg-destructive hover:bg-destructive/90 rounded-md transition-colors"
                data-testid={getTag(StorageFileListTestTags.BATCH_DELETE_BUTTON)}
                disabled={actionLoading}
                type="button"
                onClick={onDeleteSelectedFilesClick}
              >
                {actionLoading ? commonModuleStrings.ui.loading : strings.ui.deleteFile}
              </button>
            ) : null}
          </div>
        ) : null}

        {actionError ? (
          <CoreErrorText
            data-testid={getTag(StorageFileListTestTags.ACTION_ERROR_TEXT)}
            text={parseError.parse(actionError) ?? ''}
          />
        ) : null}

        {paging.items.length === 0 ? (
          <ListingEmptyState text={strings.ui.storageFileListTitle} />
        ) : (
          <div className="flex flex-col gap-2" data-testid={getTag(StorageFileListTestTags.FILE_LIST)}>
            {paging.items.map((file) => (
              <StorageFileListItemRow
                key={file.id}
                deleteFileUseCaseAvailable={Boolean(deps.deleteFileUseCase)}
                file={file}
                isSelected={Boolean(selectedFileIds[file.id])}
                strings={strings}
                onDeleteFileClick={onDeleteFileClick}
                onFileClick={onFileClick}
                onToggleSelect={toggleSelectFile}
              />
            ))}
          </div>
        )}

        {hasMorePages(paging) ? (
          <PagingFooter
            currentPage={paging.pageNumber}
            totalCount={paging.totalCount}
            totalPages={paging.totalPages}
            onPageChange={(page) => {
              const newParams = { ...(searchParams ?? {}), pageNumber: page }
              deps.onSearchParamsChanged?.(newParams)
              void onSearchParamsUpdated(newParams)
            }}
          />
        ) : null}
      </div>
    </div>
  )
}

/**
 * Props for {@link StorageFileListScreen}.
 *
 * @template TParams - Query parameters type.
 */
export interface StorageFileListScreenProps<TParams extends Record<string, unknown> = Record<string, unknown>>
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Dependencies injected into the store. */
  dependencies: StorageFileListStoreDependencies<TParams>
  /** Optional initial screen state. */
  initialState?: StorageFileListScreenState
  /** Optional storage module strings override. */
  strings?: StorageModuleStrings
  /** Optional common module strings override. */
  commonModuleStrings?: CommonModuleStrings
  /** Optional user module strings override. */
  userModuleStrings?: UserModuleStrings
  /** Whether to include ownerUserId filter. */
  includeOwnerFilter?: boolean
  /** Active search parameters passed from route URL. */
  searchParams?: TParams
  /** Optional prefix prepended to all data-testid attributes. */
  testTagPrefix?: string
}

/**
 * Unified Storage File List Screen component.
 */
export const StorageFileListScreen = forwardRef<
  HTMLDivElement,
  StorageFileListScreenProps<Record<string, unknown>>
>(
  (
    {
      dependencies,
      initialState,
      strings,
      commonModuleStrings,
      userModuleStrings,
      includeOwnerFilter,
      searchParams,
      testTagPrefix,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('h-full w-full', className)} {...props}>
        <StorageFileListProvider dependencies={dependencies} initialState={initialState}>
          <StorageFileListContent
            commonModuleStrings={commonModuleStrings}
            includeOwnerFilter={includeOwnerFilter}
            searchParams={searchParams}
            strings={strings}
            testTagPrefix={testTagPrefix}
            userModuleStrings={userModuleStrings}
          />
        </StorageFileListProvider>
      </div>
    )
  }
)

StorageFileListScreen.displayName = 'StorageFileListScreen'
