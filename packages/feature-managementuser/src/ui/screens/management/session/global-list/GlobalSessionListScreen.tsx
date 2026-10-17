import React, { forwardRef, useEffect, useState } from 'react'
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
import { SessionItem } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { enManagementUserStrings } from '@/locales/index'
import type { FeatureManagementUserStrings } from '@/locales/index'
import { getGlobalSessionListingOptionsConfig } from '@/ui/screens/management/session/global-list/global-session-list-options-config'
import {
  searchParamsToListingStates,
  listingStatesToSearchParams
} from '@/ui/screens/management/session/global-list/globalSessionListSearchConverters'
import {
  GlobalSessionListProvider,
  useGlobalSessionListStore
} from '@/ui/screens/management/session/global-list/GlobalSessionListStore'
import type { GlobalSessionListStoreDependencies } from '@/ui/screens/management/session/global-list/GlobalSessionListStore'

/** Automation test tags for {@link GlobalSessionListScreen}. */
export const GlobalSessionListTestTags = {
  BACK_BUTTON: 'GlobalSessionList_BackButton',
  TITLE: 'GlobalSessionList_Title',
  FILTER_BUTTON: 'GlobalSessionList_FilterButton',
  REFRESH_BUTTON: 'GlobalSessionList_RefreshButton',
  SESSION_LIST: 'GlobalSessionList_List',
  GLOBAL_ERROR_TEXT: 'GlobalSessionList_GlobalErrorText',
  ACTION_ERROR_TEXT: 'GlobalSessionList_ActionErrorText'
}

const GlobalSessionListContent: React.FC<{ strings?: FeatureManagementUserStrings }> = ({
  strings = enManagementUserStrings
}) => {
  const deps = useGlobalSessionListStore((s) => s.dependencies)
  const screenState = useGlobalSessionListStore((s) => s.screenState)
  const onRefresh = useGlobalSessionListStore((s) => s.onRefresh)
  const onLoadNextPage = useGlobalSessionListStore((s) => s.onLoadNextPage)
  const onSessionClick = useGlobalSessionListStore((s) => s.onSessionClick)
  const onDeleteSessionClick = useGlobalSessionListStore((s) => s.onDeleteSessionClick)
  const onBackClick = useGlobalSessionListStore((s) => s.onBackClick)
  const onToggleFilterPanel = useGlobalSessionListStore((s) => s.onToggleFilterPanel)
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
        data-testid={GlobalSessionListTestTags.GLOBAL_ERROR_TEXT}
        error={screenState.error}
        onRetry={onRefresh}
        onBack={onBackClick}
        title={strings.sessions}
        strings={strings}
      />
    )
  }

  const {
    paging,
    isFilterPanelExpanded,
    actionError
  } = screenState

  const optionsConfig = getGlobalSessionListingOptionsConfig(strings)

  return (
    <div className="w-full h-full p-6 flex flex-col relative overflow-hidden">
      <div className="w-full flex items-center justify-between relative mb-4">
        <CoreBackButton data-testid={GlobalSessionListTestTags.BACK_BUTTON} onClick={onBackClick} />
        <CoreScreenTitleText
          data-testid={GlobalSessionListTestTags.TITLE}
          text={strings.sessions}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-testid={GlobalSessionListTestTags.FILTER_BUTTON}
            aria-label={strings.filter}
            onClick={onToggleFilterPanel}
            className="p-2 rounded-lg border border-border bg-surface text-surface-foreground hover:bg-accent transition-colors flex items-center justify-center cursor-pointer"
          >
            <CoreIcon src={icons.filter} size={20} className="text-surface-foreground" />
          </button>
          <button
            type="button"
            data-testid={GlobalSessionListTestTags.REFRESH_BUTTON}
            aria-label={strings.refresh}
            onClick={onRefresh}
            className="p-2 rounded-lg border border-border bg-surface text-surface-foreground hover:bg-accent transition-colors flex items-center justify-center cursor-pointer"
          >
            <CoreIcon src={icons.refresh} size={20} className="text-surface-foreground" />
          </button>
        </div>
      </div>

      <div className="w-full flex-1 overflow-y-auto flex flex-col gap-3 pr-1" data-testid={GlobalSessionListTestTags.SESSION_LIST}>
        {actionError && (
          <CoreErrorText
            data-testid={GlobalSessionListTestTags.ACTION_ERROR_TEXT}
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

            {paging.items.map((session) => (
              session.id ? (
                <SessionItem
                  key={session.id}
                  session={session}
                  onSessionClick={() => onSessionClick(session)}
                  onRevokeClick={() => onDeleteSessionClick(session.userId, session.id!)}
                  isCurrentSession={(deps.currentUserId != null && session.userId === deps.currentUserId) || (deps.currentSessionId != null && session.id === deps.currentSessionId)}
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
              strings={strings}
            />
          </div>
        )}
      </div>
    </div>
  )
}

const GlobalSessionListController: React.FC<{ strings?: FeatureManagementUserStrings }> = ({
  strings
}) => {
  const deps = useGlobalSessionListStore((s) => s.dependencies)
  const initScreen = useGlobalSessionListStore((s) => s.initScreen)
  const onSearchParamsUpdated = useGlobalSessionListStore((s) => s.onSearchParamsUpdated)
  const isMounted = React.useRef(false)

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      initScreen(deps.searchParams)
    } else {
      onSearchParamsUpdated(deps.searchParams)
    }
  }, [deps.searchParams, initScreen, onSearchParamsUpdated])

  return <GlobalSessionListContent strings={strings} />
}

/** Props for {@link GlobalSessionListScreen}. */
export interface GlobalSessionListScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Dependencies injected into screen store. */
  dependencies: GlobalSessionListStoreDependencies
  /** Optional localized strings override. */
  strings?: FeatureManagementUserStrings
}

/** Screen displaying a paginated global list of user sessions across all accounts. */
export const GlobalSessionListScreen = forwardRef<HTMLDivElement, GlobalSessionListScreenProps>(
  ({ dependencies, strings = enManagementUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <GlobalSessionListProvider dependencies={dependencies}>
          <GlobalSessionListController strings={strings} />
        </GlobalSessionListProvider>
      </div>
    )
  }
)

GlobalSessionListScreen.displayName = 'GlobalSessionListScreen'
