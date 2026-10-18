import React, { forwardRef, useEffect, useState } from 'react'
import { UserModuleStrings, CommonModuleStrings } from '@mudrichenkoevgeny/shared-foundation'
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
import { IdentifierItem } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { getGlobalIdentifierListingOptionsConfig } from '@/ui/screens/management/identifier/global-list/global-identifier-list-options-config'
import {
  searchParamsToListingStates,
  listingStatesToSearchParams
} from '@/ui/screens/management/identifier/global-list/globalIdentifierListSearchConverters'
import {
  GlobalIdentifierListProvider,
  useGlobalIdentifierListStore
} from '@/ui/screens/management/identifier/global-list/GlobalIdentifierListStore'
import type { GlobalIdentifierListStoreDependencies } from '@/ui/screens/management/identifier/global-list/GlobalIdentifierListStore'

const defaultUserStrings = new UserModuleStrings()
const defaultCommonStrings = new CommonModuleStrings()

export const GlobalIdentifierListTestTags = {
  BACK_BUTTON: 'GlobalIdentifierList_BackButton',
  TITLE: 'GlobalIdentifierList_Title',
  FILTER_BUTTON: 'GlobalIdentifierList_FilterButton',
  REFRESH_BUTTON: 'GlobalIdentifierList_RefreshButton',
  IDENTIFIER_LIST: 'GlobalIdentifierList_List',
  GLOBAL_ERROR_TEXT: 'GlobalIdentifierList_GlobalErrorText',
  ACTION_ERROR_TEXT: 'GlobalIdentifierList_ActionErrorText'
}

const GlobalIdentifierListContent: React.FC<{ strings?: UserModuleStrings }> = ({
  strings = defaultUserStrings
}) => {
  const deps = useGlobalIdentifierListStore((s) => s.dependencies)
  const screenState = useGlobalIdentifierListStore((s) => s.screenState)
  const onRefresh = useGlobalIdentifierListStore((s) => s.onRefresh)
  const onLoadNextPage = useGlobalIdentifierListStore((s) => s.onLoadNextPage)
  const onIdentifierClick = useGlobalIdentifierListStore((s) => s.onIdentifierClick)
  const onBackClick = useGlobalIdentifierListStore((s) => s.onBackClick)
  const onToggleFilterPanel = useGlobalIdentifierListStore((s) => s.onToggleFilterPanel)
  const errorParser = useAppErrorParser()

  const [draftSortState, setDraftSortState] = useState<ListingSortState | null>(
    () => searchParamsToListingStates(deps.searchParams).sortState
  )
  const [draftFilterStates, setDraftFilterStates] = useState<Record<string, ListingFilterState>>(
    () => searchParamsToListingStates(deps.searchParams).filterStates
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

  const isContent = screenState.status === 'content'
  const pagingState = isContent ? screenState.paging : undefined

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onLoadMore: onLoadNextPage,
    hasMore: pagingState ? hasMorePages(pagingState) : false,
    isLoading: pagingState?.isNextPageLoading ?? false
  })

  if (screenState.status === 'loading') {
    return <FullscreenLoading />
  }

  if (screenState.status === 'error') {
    return (
      <FullscreenError
        data-testid={GlobalIdentifierListTestTags.GLOBAL_ERROR_TEXT}
        error={screenState.error}
        onRetry={onRefresh}
        onBack={onBackClick}
        title={strings.ui.userIdentifiers}
      />
    )
  }

  const {
    paging,
    isFilterPanelExpanded,
    actionError
  } = screenState

  const optionsConfig = getGlobalIdentifierListingOptionsConfig(defaultCommonStrings)

  return (
    <div className="w-full h-full p-6 flex flex-col relative overflow-hidden">
      <div className="w-full flex items-center justify-between relative mb-4">
        <CoreBackButton data-testid={GlobalIdentifierListTestTags.BACK_BUTTON} onClick={onBackClick} />
        <CoreScreenTitleText
          data-testid={GlobalIdentifierListTestTags.TITLE}
          text={strings.ui.userIdentifiers}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-testid={GlobalIdentifierListTestTags.FILTER_BUTTON}
            aria-label={strings.ui.filter}
            onClick={onToggleFilterPanel}
            className="p-2 rounded-lg border border-border bg-surface text-surface-foreground hover:bg-accent transition-colors flex items-center justify-center cursor-pointer"
          >
            <CoreIcon src={icons.filter} size={20} className="text-surface-foreground" />
          </button>
          <button
            type="button"
            data-testid={GlobalIdentifierListTestTags.REFRESH_BUTTON}
            aria-label={defaultCommonStrings.ui.refresh}
            onClick={onRefresh}
            className="p-2 rounded-lg border border-border bg-surface text-surface-foreground hover:bg-accent transition-colors flex items-center justify-center cursor-pointer"
          >
            <CoreIcon src={icons.refresh} size={20} className="text-surface-foreground" />
          </button>
        </div>
      </div>

      <div className="w-full flex-1 overflow-y-auto flex flex-col gap-3 pr-1" data-testid={GlobalIdentifierListTestTags.IDENTIFIER_LIST}>
        {actionError && (
          <CoreErrorText
            data-testid={GlobalIdentifierListTestTags.ACTION_ERROR_TEXT}
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

            {paging.items.map((identifier) => (
              identifier.id ? (
                <IdentifierItem
                  key={identifier.id}
                  identifier={identifier}
                  onClick={() => onIdentifierClick(identifier.id!)}
                  isCurrentIdentifier={(deps.currentUserId != null && identifier.userId === deps.currentUserId) || (deps.currentIdentifierId != null && identifier.id === deps.currentIdentifierId)}
                />
              ) : null
            ))}

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

const GlobalIdentifierListController: React.FC<{ strings?: UserModuleStrings }> = ({
  strings
}) => {
  const deps = useGlobalIdentifierListStore((s) => s.dependencies)
  const initScreen = useGlobalIdentifierListStore((s) => s.initScreen)
  const onSearchParamsUpdated = useGlobalIdentifierListStore((s) => s.onSearchParamsUpdated)
  const isMounted = React.useRef(false)

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      initScreen(deps.searchParams)
    } else {
      onSearchParamsUpdated(deps.searchParams)
    }
  }, [deps.searchParams, initScreen, onSearchParamsUpdated])

  return <GlobalIdentifierListContent strings={strings} />
}

export interface GlobalIdentifierListScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: GlobalIdentifierListStoreDependencies
  strings?: UserModuleStrings
}

export const GlobalIdentifierListScreen = forwardRef<HTMLDivElement, GlobalIdentifierListScreenProps>(
  ({ dependencies, strings = defaultUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <GlobalIdentifierListProvider dependencies={dependencies}>
          <GlobalIdentifierListController strings={strings} />
        </GlobalIdentifierListProvider>
      </div>
    )
  }
)

GlobalIdentifierListScreen.displayName = 'GlobalIdentifierListScreen'
