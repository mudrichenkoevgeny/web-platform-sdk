import React, { forwardRef, useEffect } from 'react'
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
  useAppErrorParser,
  useInfiniteScroll
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SessionItem } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { enManagementUserStrings } from '@/locales/index'
import type { FeatureManagementUserStrings } from '@/locales/index'
import { getGlobalSessionListingOptionsConfig } from '@/ui/screens/management/session/global-list/global-session-list-options-config'
import {
  GlobalSessionListProvider,
  useGlobalSessionListStore
} from '@/ui/screens/management/session/global-list/GlobalSessionListStore'
import type { GlobalSessionListStoreDependencies } from '@/ui/screens/management/session/global-list/GlobalSessionListStore'

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
  const screenState = useGlobalSessionListStore((s) => s.screenState)
  const onRefresh = useGlobalSessionListStore((s) => s.onRefresh)
  const onLoadNextPage = useGlobalSessionListStore((s) => s.onLoadNextPage)
  const onSessionClick = useGlobalSessionListStore((s) => s.onSessionClick)
  const onDeleteSessionClick = useGlobalSessionListStore((s) => s.onDeleteSessionClick)
  const onBackClick = useGlobalSessionListStore((s) => s.onBackClick)
  const onToggleFilterPanel = useGlobalSessionListStore((s) => s.onToggleFilterPanel)
  const onSortChanged = useGlobalSessionListStore((s) => s.onSortChanged)
  const onFilterChanged = useGlobalSessionListStore((s) => s.onFilterChanged)
  const onApplyFilters = useGlobalSessionListStore((s) => s.onApplyFilters)
  const errorParser = useAppErrorParser()

  if (screenState.status === 'loading') {
    return <FullscreenLoading />
  }

  if (screenState.status === 'error') {
    return (
      <FullscreenError
        data-testid={GlobalSessionListTestTags.GLOBAL_ERROR_TEXT}
        error={screenState.error}
        onRetry={onRefresh}
      />
    )
  }

  const {
    paging,
    sortState,
    filterStates,
    isFilterPanelExpanded,
    actionLoading,
    actionError
  } = screenState

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onLoadMore: onLoadNextPage,
    hasMore: paging.pageNumber < paging.totalPages,
    isLoading: paging.isNextPageLoading ?? false
  })

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
              sortState={sortState}
              filterStates={filterStates}
              onSortChanged={onSortChanged}
              onFilterChanged={onFilterChanged}
              onApplyClick={onApplyFilters}
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
              <SessionItem
                key={session.id}
                session={session}
                enabled={!actionLoading}
                onRevokeClick={() => onDeleteSessionClick(session.userId, String(session.id))}
                onSessionClick={() => onSessionClick(session)}
                strings={strings}
              />
            ))}

            {paging.isNextPageLoading && (
              <div ref={sentinelRef} className="h-4 w-full" />
            )}

            <PagingFooter
              currentPage={paging.pageNumber}
              totalPages={paging.totalPages}
              onPageChange={() => {}}
              totalCount={paging.totalCount}
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
  const initScreen = useGlobalSessionListStore((s) => s.initScreen)

  useEffect(() => {
    initScreen()
  }, [initScreen])

  return <GlobalSessionListContent strings={strings} />
}

export interface GlobalSessionListScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: GlobalSessionListStoreDependencies
  strings?: FeatureManagementUserStrings
}

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
