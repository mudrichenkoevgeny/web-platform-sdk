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
import { enManagementUserStrings } from '@/locales/index'
import type { FeatureManagementUserStrings } from '@/locales/index'
import { UserItem } from '@/ui/components/user/item/UserItem'
import { getGlobalUserListingOptionsConfig } from '@/ui/screens/management/user/global-list/global-user-list-options-config'
import {
  GlobalUserListProvider,
  useGlobalUserListStore
} from '@/ui/screens/management/user/global-list/GlobalUserListStore'
import type { GlobalUserListStoreDependencies } from '@/ui/screens/management/user/global-list/GlobalUserListStore'

const GlobalUserListContent: React.FC<{ strings?: FeatureManagementUserStrings }> = ({
  strings = enManagementUserStrings
}) => {
  const screenState = useGlobalUserListStore((s) => s.screenState)
  const onRefresh = useGlobalUserListStore((s) => s.onRefresh)
  const onLoadNextPage = useGlobalUserListStore((s) => s.onLoadNextPage)
  const onUserClick = useGlobalUserListStore((s) => s.onUserClick)
  const onCreateUserClick = useGlobalUserListStore((s) => s.onCreateUserClick)
  const onBackClick = useGlobalUserListStore((s) => s.onBackClick)
  const onToggleFilterPanel = useGlobalUserListStore((s) => s.onToggleFilterPanel)
  const onSortChanged = useGlobalUserListStore((s) => s.onSortChanged)
  const onFilterChanged = useGlobalUserListStore((s) => s.onFilterChanged)
  const onApplyFilters = useGlobalUserListStore((s) => s.onApplyFilters)
  const errorParser = useAppErrorParser()

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
    actionError
  } = screenState

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onLoadMore: onLoadNextPage,
    hasMore: paging.pageNumber < paging.totalPages,
    isLoading: paging.isNextPageLoading ?? false
  })

  const optionsConfig = getGlobalUserListingOptionsConfig(strings)

  return (
    <div className="w-full h-full p-6 flex flex-col relative overflow-hidden">
      <div className="w-full flex items-center justify-between relative mb-4">
        <CoreBackButton onClick={onBackClick} />
        <CoreScreenTitleText
          text={strings.users_management_title}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={strings.create_user}
            onClick={onCreateUserClick}
            className="p-2 rounded-lg border border-border bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center cursor-pointer"
          >
            <CoreIcon src={icons.add} size={20} className="text-primary-foreground" />
          </button>
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

        {actionError && (
          <CoreErrorText text={errorParser.parse(actionError) ?? ''} />
        )}

        {paging.items.length === 0 && !paging.isNextPageLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <ListingEmptyState />
          </div>
        ) : (
          <div className="w-full flex flex-col gap-3">
            <ListingHeaderBar
              onRefreshClick={onRefresh}
              onOptionsClick={onToggleFilterPanel}
            />

            {paging.items.map((user) => (
              <UserItem
                key={user.id}
                user={user}
                onClick={() => onUserClick(user.id)}
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

const GlobalUserListController: React.FC<{ strings?: FeatureManagementUserStrings }> = ({
  strings
}) => {
  const initScreen = useGlobalUserListStore((s) => s.initScreen)

  useEffect(() => {
    initScreen()
  }, [initScreen])

  return <GlobalUserListContent strings={strings} />
}

export interface GlobalUserListScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: GlobalUserListStoreDependencies
  strings?: FeatureManagementUserStrings
}

export const GlobalUserListScreen = forwardRef<HTMLDivElement, GlobalUserListScreenProps>(
  ({ dependencies, strings = enManagementUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <GlobalUserListProvider dependencies={dependencies}>
          <GlobalUserListController strings={strings} />
        </GlobalUserListProvider>
      </div>
    )
  }
)

GlobalUserListScreen.displayName = 'GlobalUserListScreen'
