import React, { forwardRef, useEffect } from 'react'
import type { UserModuleStrings, CommonModuleStrings } from '@mudrichenkoevgeny/shared-foundation'
import { userStrings, commonStrings } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  cn,
  CoreBackButton,
  CoreButton,
  CoreErrorText,
  CoreScreenTitleText,
  FullscreenError,
  FullscreenLoading,
  ListingHeaderBar,
  ListingOptionsPanel,
  hasMorePages,
  useAppErrorParser,
  useInfiniteScroll
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SessionItem } from '@/ui/components/session/item/SessionItem'
import { getSessionListOptionsConfig } from './session-list-options-config'
import {
  searchParamsToListingStates,
  listingStatesToSearchParams
} from './session-list-search-converters'
import {
  SessionListProvider,
  SessionListStatus,
  useSessionListStore
} from './session-list-store'
import type {
  SessionListStoreDependencies,
  SessionListScreenState
} from './session-list-store'

/** Automation test tags for {@link SessionListScreen}. */
export const SessionListTestTags = {
  TITLE: 'SessionList_Title',
  BACK_BUTTON: 'SessionList_BackButton',
  REFRESH_BUTTON: 'SessionList_RefreshButton',
  FILTER_BUTTON: 'SessionList_FilterButton',
  GLOBAL_ERROR_TEXT: 'SessionList_GlobalErrorText',
  SESSION_LIST: 'SessionList_List',
  REVOKE_ALL_OTHERS_BUTTON: 'SessionList_RevokeAllOthersButton',
  ACTION_ERROR_TEXT: 'SessionList_ActionErrorText'
}

interface SessionListContentProps {
  strings?: UserModuleStrings
  commonModuleStrings?: CommonModuleStrings
  includeFilters?: boolean
  includeOwnerFilter?: boolean
  searchParams?: Record<string, unknown>
}

const SessionListContent: React.FC<SessionListContentProps> = ({
  strings = userStrings,
  commonModuleStrings = commonStrings,
  includeFilters = false,
  includeOwnerFilter = false,
  searchParams
}) => {
  const screenState = useSessionListStore((s) => s.screenState)
  const dataSource = useSessionListStore((s) => s.dataSource)
  const deps = useSessionListStore((s) => s.dependencies)
  const loadSessions = useSessionListStore((s) => s.loadSessions)
  const onSearchParamsUpdated = useSessionListStore((s) => s.onSearchParamsUpdated)
  const onRefresh = useSessionListStore((s) => s.onRefresh)
  const onSessionClick = useSessionListStore((s) => s.onSessionClick)
  const onRevokeSessionClick = useSessionListStore((s) => s.onRevokeSessionClick)
  const onRevokeAllOtherSessionsClick = useSessionListStore((s) => s.onRevokeAllOtherSessionsClick)
  const onLoadNextPage = useSessionListStore((s) => s.onLoadNextPage)
  const onBackClick = useSessionListStore((s) => s.onBackClick)
  const onToggleFilterPanel = useSessionListStore((s) => s.onToggleFilterPanel)
  const errorParser = useAppErrorParser()

  const { sortState: activeSortState, filterStates: activeFilterStates } =
    searchParamsToListingStates(searchParams)

  useEffect(() => {
    void loadSessions(searchParams)
  }, [loadSessions, searchParams])

  const showFilters = includeFilters || includeOwnerFilter
  const optionsConfig = getSessionListOptionsConfig(commonModuleStrings, includeOwnerFilter)

  const handleSortChange = (newSort: ListingSortState | null) => {
    const listingSearchParameters = listingStatesToSearchParams(newSort, activeFilterStates)
    deps.onSearchParamsChanged?.(listingSearchParameters)
    void onSearchParamsUpdated(listingSearchParameters)
  }

  const handleFilterChange = (newFilters: Record<string, ListingFilterState>) => {
    const listingSearchParameters = listingStatesToSearchParams(activeSortState, newFilters)
    deps.onSearchParamsChanged?.(listingSearchParameters)
    void onSearchParamsUpdated(listingSearchParameters)
  }

  const isContent = screenState.status === SessionListStatus.CONTENT
  const hasMore = isContent ? hasMorePages(screenState.paging) : false
  const isNextPageLoading = isContent ? Boolean(screenState.paging.isNextPageLoading) : false

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onLoadMore: onLoadNextPage,
    hasMore,
    isLoading: isNextPageLoading
  })

  switch (screenState.status) {
    case SessionListStatus.LOADING:
      return <FullscreenLoading />

    case SessionListStatus.ERROR:
      return (
        <FullscreenError
          data-testid={SessionListTestTags.GLOBAL_ERROR_TEXT}
          error={screenState.error}
          onRetry={() => void onRefresh(searchParams)}
          onBack={onBackClick}
          title={strings.ui.sessions}
        />
      )

    case SessionListStatus.CONTENT: {
      const { items, currentSessionId, isFilterPanelExpanded, actionLoading, actionError } = screenState
      const isRevokeAvailable = dataSource.isRevokeAvailable !== false
      const isRevokeAllOthersAvailable = dataSource.isRevokeAllOthersAvailable !== false

      return (
        <div className="w-full h-full p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="w-full flex items-center justify-between relative mb-4">
            <CoreBackButton
              onClick={onBackClick}
              data-testid={SessionListTestTags.BACK_BUTTON}
            />
            <CoreScreenTitleText
              text={strings.ui.sessions}
              className="absolute left-1/2 -translate-x-1/2"
              data-testid={SessionListTestTags.TITLE}
            />
            <div className="w-10" />
          </div>

          <div className="w-full p-4 border-b border-border bg-surface">
            <ListingHeaderBar
              hasActiveFilters={Object.keys(activeFilterStates).length > 0}
              onOptionsClick={showFilters ? onToggleFilterPanel : undefined}
              onRefreshClick={() => void onRefresh(searchParams)}
            />

            {showFilters && isFilterPanelExpanded && (
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

          <div
            className="w-full flex-1 overflow-y-auto flex flex-col gap-3 my-auto max-w-md mx-auto pr-1"
            data-testid={SessionListTestTags.SESSION_LIST}
          >
            {items.map((session) => {
              const sessionId = session.id
              if (!sessionId) {
                return null
              }
              return (
                <SessionItem
                  key={sessionId}
                  session={session}
                  isCurrentSession={currentSessionId === sessionId}
                  enabled={!actionLoading}
                  onRevokeClick={isRevokeAvailable ? () => onRevokeSessionClick(sessionId) : undefined}
                  onSessionClick={() => onSessionClick(session)}
                  strings={strings}
                />
              )
            })}

            {hasMore && <div ref={sentinelRef} className="h-4 w-full" />}

            {isNextPageLoading && (
              <div className="w-full py-2 text-center text-xs text-muted-foreground">
                {commonStrings.ui.loading}
              </div>
            )}
          </div>

          <div className="w-full max-w-md mx-auto pt-4 flex flex-col gap-2">
            {isRevokeAllOthersAvailable && items.length > 1 && (
              <CoreButton
                type="button"
                label={strings.ui.sessionRevokeAllOthers}
                onClick={onRevokeAllOtherSessionsClick}
                disabled={actionLoading}
                className="bg-error hover:bg-error/90 text-error-foreground"
                data-testid={SessionListTestTags.REVOKE_ALL_OTHERS_BUTTON}
              />
            )}

            {actionError && (
              <CoreErrorText
                text={errorParser.parse(actionError) ?? ''}
                data-testid={SessionListTestTags.ACTION_ERROR_TEXT}
              />
            )}
          </div>
        </div>
      )
    }
  }
}

export interface SessionListProps extends React.HTMLAttributes<HTMLDivElement> {
  searchParams?: Record<string, unknown>
  dependencies: SessionListStoreDependencies
  initialState?: SessionListScreenState
  strings?: UserModuleStrings
  commonModuleStrings?: CommonModuleStrings
  includeFilters?: boolean
  includeOwnerFilter?: boolean
}

export const SessionListScreen = forwardRef<HTMLDivElement, SessionListProps>(
  (
    {
      dependencies,
      initialState,
      strings = userStrings,
      commonModuleStrings = commonStrings,
      includeFilters,
      includeOwnerFilter,
      searchParams,
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <SessionListProvider dependencies={dependencies} initialState={initialState}>
          <SessionListContent
            commonModuleStrings={commonModuleStrings}
            includeFilters={includeFilters}
            includeOwnerFilter={includeOwnerFilter}
            searchParams={searchParams}
            strings={strings}
          />
        </SessionListProvider>
      </div>
    )
  }
)

SessionListScreen.displayName = 'SessionListScreen'
