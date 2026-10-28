import React, { forwardRef, useEffect, useId } from 'react'
import type { StorageModuleStrings, CommonModuleStrings, StorageFileSummary } from '@mudrichenkoevgeny/shared-foundation'
import { storageStrings, commonStrings, StorageFileStatus } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  cn,
  CoreBackButton,
  CoreErrorText,
  CoreScreenTitleText,
  CoreTextButton,
  FullscreenError,
  FullscreenLoading,
  ListingEmptyState,
  ListingHeaderBar,
  ListingOptionsPanel,
  PagingFooter,
  hasMorePages,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { StorageFileItem } from '@/ui/components/item/StorageFileItem'
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
  StorageFileListScreenState,
  StorageFileListGetFilesUseCase,
  StorageFileListDeleteFileUseCase,
  StorageFileListBatchDeleteUseCase
} from './storage-file-list-store'

/**
 * DOM data-testid tags for UI testing {@link StorageFileListScreen}.
 */
export const StorageFileListTestTags = {
  /** Test ID for screen title element. */
  TITLE: 'StorageFileList_Title',
  /** Test ID for back button element. */
  BACK_BUTTON: 'StorageFileList_BackButton',
  /** Test ID for filter button element. */
  FILTER_BUTTON: 'StorageFileList_FilterButton',
  /** Test ID for refresh button element. */
  REFRESH_BUTTON: 'StorageFileList_RefreshButton',
  /** Test ID for upload button element. */
  UPLOAD_BUTTON: 'StorageFileList_UploadButton',
  /** Test ID for global error text container. */
  GLOBAL_ERROR_TEXT: 'StorageFileList_GlobalErrorText',
  /** Test ID for file list container. */
  FILE_LIST: 'StorageFileList_List',
  /** Test ID for inline action error text container. */
  ACTION_ERROR_TEXT: 'StorageFileList_ActionErrorText',
  /** Test ID for batch action bar container. */
  BATCH_ACTION_BAR: 'StorageFileList_BatchActionBar',
  /** Test ID for batch delete button element. */
  BATCH_DELETE_BUTTON: 'StorageFileList_BatchDeleteButton',
  /** Test ID for select all button element. */
  SELECT_ALL_BUTTON: 'StorageFileList_SelectAllButton',
  /** Test ID for clear selection button element. */
  CLEAR_SELECTION_BUTTON: 'StorageFileList_ClearSelectionButton'
}

interface StorageFileListItemRowProps {
  file: StorageFileSummary
  isSelected: boolean
  strings: StorageModuleStrings
  deleteFileUseCaseAvailable: boolean
  batchDeleteUseCaseAvailable: boolean
  onToggleSelect: (fileId: string) => void
  onFileClick: (fileId: string) => void
  onDeleteFileClick: (fileId: string) => void
}

const StorageFileListItemRow: React.FC<StorageFileListItemRowProps> = ({
  file,
  isSelected,
  strings,
  deleteFileUseCaseAvailable,
  batchDeleteUseCaseAvailable,
  onToggleSelect,
  onFileClick,
  onDeleteFileClick
}) => {
  const checkboxId = useId()

  return (
    <div className="flex items-center gap-2">
      {batchDeleteUseCaseAvailable && (
        <>
          <input
            aria-label={`${strings.ui.storageFileListTitle}: ${file.fileName}`}
            checked={isSelected}
            disabled={file.status === StorageFileStatus.DELETED}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            id={checkboxId}
            type="checkbox"
            onChange={() => onToggleSelect(file.id)}
          />
          <label htmlFor={checkboxId} className="sr-only">
            {strings.ui.storageFileListTitle}: {file.fileName}
          </label>
        </>
      )}
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
  includeOwnerFilter?: boolean
  searchParams?: Record<string, unknown>
  testTagPrefix?: string
}

const StorageFileListContent: React.FC<StorageFileListContentProps> = ({
  strings = storageStrings,
  commonModuleStrings = commonStrings,
  includeOwnerFilter = false,
  searchParams,
  testTagPrefix = ''
}) => {
  const screenState = useStorageFileListStore((s) => s.screenState)
  const deps = useStorageFileListStore((s) => s.dependencies)

  const initScreen = useStorageFileListStore((s) => s.initScreen)
  const onSearchParamsUpdated = useStorageFileListStore((s) => s.onSearchParamsUpdated)
  const onRefresh = useStorageFileListStore((s) => s.onRefresh)
  const onUploadClick = useStorageFileListStore((s) => s.onUploadClick)
  const onFileClick = useStorageFileListStore((s) => s.onFileClick)
  const onDeleteFileClick = useStorageFileListStore((s) => s.onDeleteFileClick)
  const onDismissDeleteDialog = useStorageFileListStore((s) => s.onDismissDeleteDialog)
  const onConfirmDeleteFile = useStorageFileListStore((s) => s.onConfirmDeleteFile)
  const toggleSelectFile = useStorageFileListStore((s) => s.toggleSelectFile)
  const selectAllFiles = useStorageFileListStore((s) => s.selectAllFiles)
  const clearFileSelection = useStorageFileListStore((s) => s.clearFileSelection)
  const onDeleteSelectedFilesClick = useStorageFileListStore((s) => s.onDeleteSelectedFilesClick)
  const onConfirmBatchDeleteFiles = useStorageFileListStore((s) => s.onConfirmBatchDeleteFiles)
  const onBackClick = useStorageFileListStore((s) => s.onBackClick)
  const onToggleFilterPanel = useStorageFileListStore((s) => s.onToggleFilterPanel)

  const errorParser = useAppErrorParser()

  const { sortState: activeSortState, filterStates: activeFilterStates } =
    searchParamsToListingStates(searchParams)

  useEffect(() => {
    void initScreen(searchParams)
  }, [initScreen, searchParams])

  if (screenState.status === StorageFileListStatus.LOADING) {
    return <FullscreenLoading />
  }

  if (screenState.status === StorageFileListStatus.ERROR) {
    return (
      <FullscreenError
        error={screenState.error}
        onRetry={() => void onRefresh(searchParams)}
        onBack={onBackClick}
        title={strings.ui.storageFileListTitle}
      />
    )
  }

  const { paging, selectedFileIds, isFilterPanelExpanded, actionLoading, actionError } = screenState
  const selectedCount = Object.values(selectedFileIds).filter(Boolean).length
  const optionsConfig = getStorageFileListOptionsConfig(commonModuleStrings, strings, includeOwnerFilter)

  const handleSortChange = (newSort: ListingSortState | null) => {
    const newParams = listingStatesToSearchParams(newSort, activeFilterStates)
    deps.onSearchParamsChanged?.(newParams)
    void onSearchParamsUpdated(newParams)
  }

  const handleFilterChange = (newFilters: Record<string, ListingFilterState>) => {
    const newParams = listingStatesToSearchParams(activeSortState, newFilters)
    deps.onSearchParamsChanged?.(newParams)
    void onSearchParamsUpdated(newParams)
  }

  const tag = (base: string) => (testTagPrefix ? `${testTagPrefix}_${base}` : base)

  return (
    <div className="flex h-full w-full flex-col relative overflow-hidden bg-background">
      <div className="w-full flex items-center justify-between p-6 pb-2 border-b border-border bg-surface z-10">
        <CoreBackButton data-testid={tag(StorageFileListTestTags.BACK_BUTTON)} onClick={onBackClick} />
        <CoreScreenTitleText
          data-testid={tag(StorageFileListTestTags.TITLE)}
          text={strings.ui.storageFileListTitle}
        />
        <div className="w-10" />
      </div>

      <div className="w-full p-4 border-b border-border bg-surface">
        <ListingHeaderBar
          addAriaLabel={strings.ui.uploadFileAction}
          hasActiveFilters={Object.keys(activeFilterStates).length > 0}
          onAddClick={deps.onNavigateToUpload ? onUploadClick : undefined}
          onOptionsClick={onToggleFilterPanel}
          onRefreshClick={() => void onRefresh(searchParams)}
        />

        {isFilterPanelExpanded && (
          <div className="mt-4 pt-4 border-t border-border">
            <ListingOptionsPanel
              config={optionsConfig}
              filterStates={activeFilterStates}
              sortState={activeSortState}
              onFilterChanged={(filterId, newState) => {
                const nextFilters = { ...activeFilterStates }
                if (newState === null) {
                  delete nextFilters[filterId]
                } else {
                  nextFilters[filterId] = newState
                }
                handleFilterChange(nextFilters)
              }}
              onSortChanged={handleSortChange}
              onApplyClick={() => void onRefresh(searchParams)}
            />
          </div>
        )}
      </div>

      {actionError && (
        <div className="p-4 bg-error/10 border-b border-error/20">
          <CoreErrorText
            data-testid={tag(StorageFileListTestTags.ACTION_ERROR_TEXT)}
            text={errorParser.parse(actionError) ?? ''}
          />
        </div>
      )}

      {selectedCount > 0 && (
        <div
          className="flex items-center justify-between p-4 bg-muted border-b border-border"
          data-testid={tag(StorageFileListTestTags.BATCH_ACTION_BAR)}
        >
          <span className="text-sm font-medium text-surface-foreground">
            {commonModuleStrings.ui.selectedCount(selectedCount)}
          </span>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 text-xs font-semibold text-muted-foreground hover:text-surface-foreground rounded"
              data-testid={tag(StorageFileListTestTags.SELECT_ALL_BUTTON)}
              type="button"
              onClick={selectAllFiles}
            >
              {commonModuleStrings.ui.selectAll}
            </button>
            <button
              className="px-3 py-1 text-xs font-semibold text-muted-foreground hover:text-surface-foreground rounded"
              data-testid={tag(StorageFileListTestTags.CLEAR_SELECTION_BUTTON)}
              type="button"
              onClick={clearFileSelection}
            >
              {commonModuleStrings.ui.clearAll}
            </button>
            {deps.deleteFilesBatchUseCase && (
              <button
                className="px-3 py-1.5 text-xs font-semibold bg-error text-error-foreground hover:bg-error/90 rounded transition-colors disabled:opacity-50"
                data-testid={tag(StorageFileListTestTags.BATCH_DELETE_BUTTON)}
                disabled={actionLoading}
                type="button"
                onClick={onDeleteSelectedFilesClick}
              >
                {strings.ui.deleteFileAction}
              </button>
            )}
          </div>
        </div>
      )}

      <div
        className="flex-1 overflow-y-auto p-6 flex flex-col gap-4"
        data-testid={tag(StorageFileListTestTags.FILE_LIST)}
      >
        {paging.items.length === 0 ? (
          <ListingEmptyState text={commonModuleStrings.ui.emptyList} />
        ) : (
          paging.items.map((file) => (
            <StorageFileListItemRow
              key={file.id}
              batchDeleteUseCaseAvailable={Boolean(deps.deleteFilesBatchUseCase)}
              deleteFileUseCaseAvailable={Boolean(deps.deleteFileUseCase)}
              file={file}
              isSelected={Boolean(selectedFileIds[file.id])}
              strings={strings}
              onDeleteFileClick={(id) => onDeleteFileClick(id)}
              onFileClick={(id) => onFileClick(id)}
              onToggleSelect={(id) => toggleSelectFile(id)}
            />
          ))
        )}

        {hasMorePages(paging) ? (
          <PagingFooter
            currentPage={paging.pageNumber}
            totalPages={paging.totalPages}
            onPageChange={(page) => {
              const newParams = { ...(searchParams ?? {}), pageNumber: page }
              deps.onSearchParamsChanged?.(newParams)
              void onSearchParamsUpdated(newParams)
            }}
          />
        ) : null}
      </div>

      {screenState.status === StorageFileListStatus.CONTENT && screenState.fileIdToDelete !== null && (
        <div role="alertdialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <button
            type="button"
            tabIndex={-1}
            aria-label={commonModuleStrings.ui.no}
            onClick={onDismissDeleteDialog}
            className="absolute inset-0 bg-transparent cursor-default border-none outline-none"
          />
          <div className="relative z-10 bg-surface border border-border p-6 rounded-xl shadow-lg max-w-md w-full flex flex-col gap-4">
            <h3 className="text-lg font-bold text-surface-foreground">{strings.ui.deleteFile}</h3>
            <p className="text-sm text-muted-foreground">{strings.ui.deleteFileConfirm}</p>
            <div className="flex justify-end gap-2 pt-2">
              <CoreTextButton label={commonModuleStrings.ui.no} onClick={onDismissDeleteDialog} />
              <CoreTextButton label={strings.ui.deleteFile} onClick={() => void onConfirmDeleteFile(searchParams)} />
            </div>
          </div>
        </div>
      )}

      {screenState.status === StorageFileListStatus.CONTENT && screenState.showBatchDeleteConfirmation && (
        <div role="alertdialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <button
            type="button"
            tabIndex={-1}
            aria-label={commonModuleStrings.ui.no}
            onClick={onDismissDeleteDialog}
            className="absolute inset-0 bg-transparent cursor-default border-none outline-none"
          />
          <div className="relative z-10 bg-surface border border-border p-6 rounded-xl shadow-lg max-w-md w-full flex flex-col gap-4">
            <h3 className="text-lg font-bold text-surface-foreground">{strings.ui.deleteSelected}</h3>
            <p className="text-sm text-muted-foreground">
              {strings.ui.deleteFilesBatchConfirm(selectedCount)}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <CoreTextButton label={commonModuleStrings.ui.no} onClick={onDismissDeleteDialog} />
              <CoreTextButton label={strings.ui.deleteSelected} onClick={() => void onConfirmBatchDeleteFiles(searchParams)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Props for {@link StorageFileListScreen}.
 *
 * @template TParams - Query parameters type.
 * @template TGetUseCase - Fetch usecase execution contract.
 * @template TDeleteUseCase - Single delete usecase execution contract.
 * @template TBatchDeleteUseCase - Batch delete usecase execution contract.
 */
export interface StorageFileListScreenProps<
  TParams extends Record<string, unknown> = Record<string, unknown>,
  TGetUseCase extends StorageFileListGetFilesUseCase = StorageFileListGetFilesUseCase,
  TDeleteUseCase extends StorageFileListDeleteFileUseCase = StorageFileListDeleteFileUseCase,
  TBatchDeleteUseCase extends StorageFileListBatchDeleteUseCase = StorageFileListBatchDeleteUseCase
> extends React.HTMLAttributes<HTMLDivElement> {
  /** Dependencies injected into the store. */
  dependencies: StorageFileListStoreDependencies<TParams, TGetUseCase, TDeleteUseCase, TBatchDeleteUseCase>
  /** Optional initial screen state. */
  initialState?: StorageFileListScreenState
  /** Optional storage module strings override. */
  strings?: StorageModuleStrings
  /** Optional common module strings override. */
  commonModuleStrings?: CommonModuleStrings
  /** Whether to include ownerUserId filter. */
  includeOwnerFilter?: boolean
  /** Active search parameters passed from route URL. */
  searchParams?: TParams
  /** Optional prefix prepended to all data-testid attributes. */
  testTagPrefix?: string
}

/**
 * Unified Storage File List Screen component.
 *
 * @param props - Component properties configuring dependencies, search params, and filters.
 * @param ref - Optional forwarding ref bound to root container element.
 * @returns React node rendering storage file list screen.
 */
export const StorageFileListScreen = forwardRef<HTMLDivElement, StorageFileListScreenProps>(
  (
    {
      dependencies,
      initialState,
      strings,
      commonModuleStrings,
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
          />
        </StorageFileListProvider>
      </div>
    )
  }
)

StorageFileListScreen.displayName = 'StorageFileListScreen'
