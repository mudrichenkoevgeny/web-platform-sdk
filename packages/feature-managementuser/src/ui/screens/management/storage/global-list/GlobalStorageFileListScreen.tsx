import React, { forwardRef, useEffect, useState } from 'react'
import { StorageModuleStrings, storageStrings, commonStrings, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  cn,
  CoreBackButton,
  CoreErrorText,
  CoreIcon,
  CoreScreenTitleText,
  FullscreenError,
  FullscreenLoading,
  icons,
  ListingEmptyState,
  ListingHeaderBar,
  ListingOptionsPanel,
  PagingFooter,
  hasMorePages,
  useAppErrorParser,
  useInfiniteScroll
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { StorageFileItem } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { getGlobalStorageFileListOptionsConfig } from '@/ui/screens/management/storage/global-list/global-storage-file-list-options-config'
import {
  searchParamsToListingStates,
  listingStatesToSearchParams
} from '@/ui/screens/management/storage/global-list/global-storage-file-list-search-converters'
import {
  GlobalStorageFileListProvider,
  GlobalStorageFileListStatus,
  useGlobalStorageFileListStore
} from '@/ui/screens/management/storage/global-list/global-storage-file-list-store'
import type { GlobalStorageFileListStoreDependencies } from '@/ui/screens/management/storage/global-list/global-storage-file-list-store'

export const GlobalStorageFileListTestTags = {
  BACK_BUTTON: 'GlobalStorageFileList_BackButton',
  TITLE: 'GlobalStorageFileList_Title',
  FILTER_BUTTON: 'GlobalStorageFileList_FilterButton',
  REFRESH_BUTTON: 'GlobalStorageFileList_RefreshButton',
  UPLOAD_BUTTON: 'GlobalStorageFileList_UploadButton',
  FILE_LIST: 'GlobalStorageFileList_List',
  GLOBAL_ERROR_TEXT: 'GlobalStorageFileList_GlobalErrorText',
  ACTION_ERROR_TEXT: 'GlobalStorageFileList_ActionErrorText'
}

const GlobalStorageFileListContent: React.FC<{ strings?: StorageModuleStrings }> = ({
  strings = storageStrings
}) => {
  const deps = useGlobalStorageFileListStore((s) => s.dependencies)
  const screenState = useGlobalStorageFileListStore((s) => s.screenState)
  const onRefresh = useGlobalStorageFileListStore((s) => s.onRefresh)
  const onLoadNextPage = useGlobalStorageFileListStore((s) => s.onLoadNextPage)
  const onFileClick = useGlobalStorageFileListStore((s) => s.onFileClick)
  const onDeleteFileClick = useGlobalStorageFileListStore((s) => s.onDeleteFileClick)
  const onBackClick = useGlobalStorageFileListStore((s) => s.onBackClick)
  const onUploadClick = useGlobalStorageFileListStore((s) => s.onUploadClick)
  const onToggleFilterPanel = useGlobalStorageFileListStore((s) => s.onToggleFilterPanel)
  const errorParser = useAppErrorParser()

  const initialListingStates = searchParamsToListingStates(deps.searchParams)
  const [draftSortState, setDraftSortState] = useState<ListingSortState | null>(
    initialListingStates.sortState
  )
  const [draftFilterStates, setDraftFilterStates] = useState<Record<string, ListingFilterState>>(
    initialListingStates.filterStates
  )

  useEffect(() => {
    const { sortState, filterStates } = searchParamsToListingStates(deps.searchParams)
    setDraftSortState(sortState)
    setDraftFilterStates(filterStates)
  }, [deps.searchParams])

  const handleFilterChanged = (filterId: string, filterState: ListingFilterState | null) => {
    setDraftFilterStates((prev) => {
      const next = { ...prev }
      if (filterState === null) {
        delete next[filterId]
      } else {
        next[filterId] = filterState
      }
      return next
    })
  }

  const handleApplyFilters = () => {
    const newSearchParams = listingStatesToSearchParams(draftSortState, draftFilterStates)
    deps.onSearchParamsChanged?.(newSearchParams)
    onToggleFilterPanel()
  }

  const isContent = screenState.status === GlobalStorageFileListStatus.CONTENT
  const pagingState = isContent ? screenState.paging : undefined

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onLoadMore: onLoadNextPage,
    hasMore: pagingState ? hasMorePages(pagingState) : false,
    isLoading: pagingState?.isNextPageLoading ?? false
  })

  switch (screenState.status) {
    case GlobalStorageFileListStatus.LOADING:
      return <FullscreenLoading />

    case GlobalStorageFileListStatus.ERROR:
      return (
        <FullscreenError
          data-testid={GlobalStorageFileListTestTags.GLOBAL_ERROR_TEXT}
          error={screenState.error}
          onRetry={onRefresh}
          onBack={onBackClick}
          title={strings.ui.globalStorageFilesTitle}
        />
      )

    case GlobalStorageFileListStatus.CONTENT: {
      const {
        paging,
        isFilterPanelExpanded,
        actionError
      } = screenState

      const optionsConfig = getGlobalStorageFileListOptionsConfig(commonStrings, strings, userStrings)

      return (
        <div className="w-full h-full p-6 flex flex-col relative overflow-hidden">
          <div className="w-full flex items-center justify-between relative mb-4">
            <CoreBackButton data-testid={GlobalStorageFileListTestTags.BACK_BUTTON} onClick={onBackClick} />
            <CoreScreenTitleText
              data-testid={GlobalStorageFileListTestTags.TITLE}
              text={strings.ui.globalStorageFilesTitle}
              className="absolute left-1/2 -translate-x-1/2"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                data-testid={GlobalStorageFileListTestTags.UPLOAD_BUTTON}
                aria-label={strings.ui.uploadFileAction}
                onClick={onUploadClick}
                className="p-2 rounded-lg border border-border bg-surface text-surface-foreground hover:bg-accent transition-colors flex items-center justify-center cursor-pointer"
              >
                <CoreIcon src={icons.add} size={20} className="text-surface-foreground" />
              </button>
              <button
                type="button"
                data-testid={GlobalStorageFileListTestTags.FILTER_BUTTON}
                aria-label={userStrings.ui.filter}
                onClick={onToggleFilterPanel}
                className="p-2 rounded-lg border border-border bg-surface text-surface-foreground hover:bg-accent transition-colors flex items-center justify-center cursor-pointer"
              >
                <CoreIcon src={icons.filter} size={20} className="text-surface-foreground" />
              </button>
              <button
                type="button"
                data-testid={GlobalStorageFileListTestTags.REFRESH_BUTTON}
                aria-label={commonStrings.ui.refresh}
                onClick={onRefresh}
                className="p-2 rounded-lg border border-border bg-surface text-surface-foreground hover:bg-accent transition-colors flex items-center justify-center cursor-pointer"
              >
                <CoreIcon src={icons.refresh} size={20} className="text-surface-foreground" />
              </button>
            </div>
          </div>

          <div className="w-full flex-1 overflow-y-auto flex flex-col gap-3 pr-1" data-testid={GlobalStorageFileListTestTags.FILE_LIST}>
            {actionError && (
              <CoreErrorText
                data-testid={GlobalStorageFileListTestTags.ACTION_ERROR_TEXT}
                text={errorParser.parse(actionError) ?? ''}
              />
            )}

            {isFilterPanelExpanded && (
              <div className="w-full mb-2">
                <ListingOptionsPanel
                  config={optionsConfig}
                  sortState={draftSortState}
                  filterStates={draftFilterStates}
                  onSortChanged={setDraftSortState}
                  onFilterChanged={handleFilterChanged}
                  onApplyClick={handleApplyFilters}
                />
              </div>
            )}

            {paging.items.length === 0 && !paging.isInitialLoading && !paging.isNextPageLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <ListingEmptyState />
              </div>
            ) : (
              <div className="w-full flex flex-col gap-3">
                <ListingHeaderBar
                  onRefreshClick={onRefresh}
                  onOptionsClick={onToggleFilterPanel}
                />

                {paging.items.map((file) => {
                  if (!file.fileId) {
                    return null
                  }
                  return (
                    <StorageFileItem
                      key={file.fileId}
                      file={file}
                      onFileClick={() => onFileClick(file.fileId)}
                      onDeleteClick={() => void onDeleteFileClick(file.fileId)}
                    />
                  )
                })}

                {paging.pageNumber < paging.totalPages && (
                  <div ref={sentinelRef} className="h-4 w-full flex items-center justify-center">
                    {paging.isNextPageLoading && (
                      <div role="status" className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                )}

                <PagingFooter
                  currentPage={paging.pageNumber}
                  totalPages={paging.totalPages}
                  totalCount={paging.totalCount}
                />
              </div>
            )}
          </div>
        </div>
      )
    }
  }
}

const GlobalStorageFileListController: React.FC<{ strings?: StorageModuleStrings }> = ({
  strings
}) => {
  const deps = useGlobalStorageFileListStore((s) => s.dependencies)
  const initScreen = useGlobalStorageFileListStore((s) => s.initScreen)
  const onSearchParamsUpdated = useGlobalStorageFileListStore((s) => s.onSearchParamsUpdated)
  const isMounted = React.useRef(false)

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      initScreen(deps.searchParams)
    } else {
      onSearchParamsUpdated(deps.searchParams)
    }
  }, [deps.searchParams, initScreen, onSearchParamsUpdated])

  return <GlobalStorageFileListContent strings={strings} />
}

export interface GlobalStorageFileListScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: GlobalStorageFileListStoreDependencies
  strings?: StorageModuleStrings
}

export const GlobalStorageFileListScreen = forwardRef<HTMLDivElement, GlobalStorageFileListScreenProps>(
  ({ dependencies, strings = storageStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <GlobalStorageFileListProvider dependencies={dependencies}>
          <GlobalStorageFileListController strings={strings} />
        </GlobalStorageFileListProvider>
      </div>
    )
  }
)

GlobalStorageFileListScreen.displayName = 'GlobalStorageFileListScreen'
