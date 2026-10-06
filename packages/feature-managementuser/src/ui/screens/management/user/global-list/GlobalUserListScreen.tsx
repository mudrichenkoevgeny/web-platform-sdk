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

export const GlobalUserListTestTags = {
  BACK_BUTTON: 'GlobalUserList_BackButton',
  CREATE_USER_BUTTON: 'GlobalUserList_CreateUserButton',
  TITLE: 'GlobalUserList_Title',
  FILTER_BUTTON: 'GlobalUserList_FilterButton',
  REFRESH_BUTTON: 'GlobalUserList_RefreshButton',
  USER_LIST: 'GlobalUserList_List',
  GLOBAL_ERROR_TEXT: 'GlobalUserList_GlobalErrorText',
  ACTION_ERROR_TEXT: 'GlobalUserList_ActionErrorText'
}

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

  const isContent = screenState.status === 'content'
  const pagingState = isContent ? screenState.paging : undefined

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onLoadMore: onLoadNextPage,
    hasMore: pagingState ? pagingState.pageNumber < pagingState.totalPages : false,
    isLoading: pagingState?.isNextPageLoading ?? false
  })

  if (screenState.status === 'loading') {
    return <FullscreenLoading />
  }

  if (screenState.status === 'error') {
    return (
      <FullscreenError
        data-testid={GlobalUserListTestTags.GLOBAL_ERROR_TEXT}
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

  const optionsConfig = getGlobalUserListingOptionsConfig(strings)

  return (
    <div className="w-full h-full p-6 flex flex-col relative overflow-hidden">
      <div className="w-full flex items-center justify-between relative mb-4">
        <CoreBackButton data-testid={GlobalUserListTestTags.BACK_BUTTON} onClick={onBackClick} />
        <CoreScreenTitleText
          data-testid={GlobalUserListTestTags.TITLE}
          text={strings.users_management_title}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-testid={GlobalUserListTestTags.CREATE_USER_BUTTON}
            aria-label={strings.create_user}
            onClick={onCreateUserClick}
            className="p-2 rounded-lg border border-border bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center cursor-pointer"
          >
            <CoreIcon src={icons.add} size={20} className="text-primary-foreground" />
          </button>
          <button
            type="button"
            data-testid={GlobalUserListTestTags.FILTER_BUTTON}
            aria-label={strings.filter}
            onClick={onToggleFilterPanel}
            className="p-2 rounded-lg border border-border bg-surface text-surface-foreground hover:bg-accent transition-colors flex items-center justify-center cursor-pointer"
          >
            <CoreIcon src={icons.filter} size={20} className="text-surface-foreground" />
          </button>
          <button
            type="button"
            data-testid={GlobalUserListTestTags.REFRESH_BUTTON}
            aria-label={strings.refresh}
            onClick={onRefresh}
            className="p-2 rounded-lg border border-border bg-surface text-surface-foreground hover:bg-accent transition-colors flex items-center justify-center cursor-pointer"
          >
            <CoreIcon src={icons.refresh} size={20} className="text-surface-foreground" />
          </button>
        </div>
      </div>

      <div className="w-full flex-1 overflow-y-auto flex flex-col gap-3 pr-1" data-testid={GlobalUserListTestTags.USER_LIST}>
        {actionError && (
          <CoreErrorText
            data-testid={GlobalUserListTestTags.ACTION_ERROR_TEXT}
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

            {paging.items.map((user) => (
              <UserItem
                key={user.id}
                user={user}
                onClick={() => onUserClick(user.id)}
                strings={strings}
              />
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
