import React, { forwardRef, useEffect } from 'react'
import {
  cn,
  CoreBackButton,
  CoreIcon,
  CoreScreenTitleText,
  FullscreenError,
  FullscreenLoading,
  icons,
  ListingEmptyState,
  ListingHeaderBar,
  ListingOptionsPanel,
  PagingFooter,
  useInfiniteScroll
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SessionItem } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { enManagementUserStrings } from '@/locales/index'
import type { FeatureManagementUserStrings } from '@/locales/index'
import { getGlobalSessionListingOptionsConfig } from '@/ui/screens/management/session/globallist/GlobalSessionListOptionsConfig'
import {
  GlobalSessionListProvider,
  useGlobalSessionListStore
} from '@/ui/screens/management/session/globallist/GlobalSessionListStore'
import type { GlobalSessionListStoreDependencies } from '@/ui/screens/management/session/globallist/GlobalSessionListStore'

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

  if (screenState.status === 'loading') {
    return <FullscreenLoading />
  }

  if (screenState.status === 'error') {
    return (
      <FullscreenError
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
    actionLoading
  } = screenState

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onLoadMore: onLoadNextPage,
    hasMore: paging.canLoadMore,
    isLoading: paging.isNextPageLoading
  })

  const optionsConfig = getGlobalSessionListingOptionsConfig(strings)

  return (
    <div className="w-full h-full p-6 flex flex-col relative overflow-hidden">
      <div className="w-full flex items-center justify-between relative mb-4">
        <CoreBackButton onClick={onBackClick} />
        <CoreScreenTitleText
          text={strings.sessions}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={strings.edit_auth_settings}
            onClick={onToggleFilterPanel}
            className="p-2 rounded-lg border border-border bg-surface text-surface-foreground hover:bg-accent transition-colors flex items-center justify-center cursor-pointer"
          >
            <CoreIcon src={icons.filter} size={20} className="text-surface-foreground" />
          </button>
          <button
            type="button"
            aria-label={strings.retry}
            onClick={onRefresh}
            className="p-2 rounded-lg border border-border bg-surface text-surface-foreground hover:bg-accent transition-colors flex items-center justify-center cursor-pointer"
          >
            <CoreIcon src={icons.refresh} size={20} className="text-surface-foreground" />
          </button>
        </div>
      </div>

      <div className="w-full flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
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

        {paging.items.length === 0 && !paging.isInitialLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <ListingEmptyState />
          </div>
        ) : (
          <div className="w-full flex flex-col gap-3">
            <ListingHeaderBar state={paging} />

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

            {paging.canLoadMore && (
              <div ref={sentinelRef} className="h-4 w-full" />
            )}

            <PagingFooter
              state={paging}
              onRetry={onLoadNextPage}
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
