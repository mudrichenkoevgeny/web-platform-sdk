import React, { forwardRef, useEffect, useState } from 'react'
import { UserModuleStrings, userStrings, commonStrings } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  cn,
  CoreBackButton,
  CoreButton,
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
import { UserItem } from '@/ui/components/user/item/UserItem'
import { getGlobalUserListingOptionsConfig } from '@/ui/screens/management/user/global-list/global-user-list-options-config'
import {
  searchParamsToListingStates,
  listingStatesToSearchParams
} from '@/ui/screens/management/user/global-list/globalUserListSearchConverters'
import {
  GlobalUserListProvider,
  GlobalUserListStatus,
  useGlobalUserListStore
} from '@/ui/screens/management/user/global-list/GlobalUserListStore'
import type { GlobalUserListStoreDependencies } from '@/ui/screens/management/user/global-list/GlobalUserListStore'

/** Automation test selectors for {@link GlobalUserListScreen}. */
export const GlobalUserListTestTags = {
  BACK_BUTTON: 'GlobalUserList_BackButton',
  TITLE: 'GlobalUserList_Title',
  FILTER_BUTTON: 'GlobalUserList_FilterButton',
  REFRESH_BUTTON: 'GlobalUserList_RefreshButton',
  CREATE_BUTTON: 'GlobalUserList_CreateButton',
  USER_LIST: 'GlobalUserList_List',
  GLOBAL_ERROR_TEXT: 'GlobalUserList_GlobalErrorText',
  ACTION_ERROR_TEXT: 'GlobalUserList_ActionErrorText'
}

/** Internal content component rendering global user list states (loading, error, content with filtering and paging). */
const GlobalUserListContent: React.FC<{ strings?: UserModuleStrings }> = ({
  strings = userStrings
}) => {
  const deps = useGlobalUserListStore((s) => s.dependencies)
  const screenState = useGlobalUserListStore((s) => s.screenState)
  const onRefresh = useGlobalUserListStore((s) => s.onRefresh)
  const onLoadNextPage = useGlobalUserListStore((s) => s.onLoadNextPage)
  const onUserClick = useGlobalUserListStore((s) => s.onUserClick)
  const onCreateUserClick = useGlobalUserListStore((s) => s.onCreateUserClick)
  const onBackClick = useGlobalUserListStore((s) => s.onBackClick)
  const onToggleFilterPanel = useGlobalUserListStore((s) => s.onToggleFilterPanel)
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

  const isContent = screenState.status === GlobalUserListStatus.CONTENT
  const pagingState = isContent ? screenState.paging : undefined

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onLoadMore: onLoadNextPage,
    hasMore: pagingState ? hasMorePages(pagingState) : false,
    isLoading: pagingState?.isNextPageLoading ?? false
  })

  switch (screenState.status) {
    case GlobalUserListStatus.LOADING:
      return <FullscreenLoading />

    case GlobalUserListStatus.ERROR:
      return (
        <FullscreenError
          data-testid={GlobalUserListTestTags.GLOBAL_ERROR_TEXT}
          error={screenState.error}
          onRetry={onRefresh}
          onBack={onBackClick}
          title={strings.ui.usersManagementTitle}
        />
      )

    case GlobalUserListStatus.CONTENT: {
      const {
        paging,
        isFilterPanelExpanded,
        actionError
      } = screenState

      const optionsConfig = getGlobalUserListingOptionsConfig(commonStrings)

      return (
        <div className="w-full h-full p-6 flex flex-col relative overflow-hidden">
          <div className="w-full flex items-center justify-between relative mb-4">
            <CoreBackButton data-testid={GlobalUserListTestTags.BACK_BUTTON} onClick={onBackClick} />
            <CoreScreenTitleText
              data-testid={GlobalUserListTestTags.TITLE}
              text={strings.ui.usersManagementTitle}
              className="absolute left-1/2 -translate-x-1/2"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                data-testid={GlobalUserListTestTags.FILTER_BUTTON}
                aria-label={strings.ui.filter}
                onClick={onToggleFilterPanel}
                className="p-2 rounded-lg border border-border bg-surface text-surface-foreground hover:bg-accent transition-colors flex items-center justify-center cursor-pointer"
              >
                <CoreIcon src={icons.filter} size={20} className="text-surface-foreground" />
              </button>
              <button
                type="button"
                data-testid={GlobalUserListTestTags.REFRESH_BUTTON}
                aria-label={commonStrings.ui.refresh}
                onClick={onRefresh}
                className="p-2 rounded-lg border border-border bg-surface text-surface-foreground hover:bg-accent transition-colors flex items-center justify-center cursor-pointer"
              >
                <CoreIcon src={icons.refresh} size={20} className="text-surface-foreground" />
              </button>
            </div>
          </div>

          <div className="w-full flex items-center justify-end mb-4">
            <CoreButton
              data-testid={GlobalUserListTestTags.CREATE_BUTTON}
              label={strings.ui.createUser}
              onClick={onCreateUserClick}
              className="w-auto"
            />
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

                {paging.items.map((user) => {
                  const userId = user.id
                  if (!userId) {
                    return null
                  }
                  return (
                    <UserItem
                      key={userId}
                      user={user}
                      onClick={() => onUserClick(userId)}
                      strings={strings}
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

const GlobalUserListController: React.FC<{ strings?: UserModuleStrings }> = ({
  strings
}) => {
  const deps = useGlobalUserListStore((s) => s.dependencies)
  const initScreen = useGlobalUserListStore((s) => s.initScreen)
  const onSearchParamsUpdated = useGlobalUserListStore((s) => s.onSearchParamsUpdated)
  const isMounted = React.useRef(false)

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      initScreen(deps.searchParams)
    } else {
      onSearchParamsUpdated(deps.searchParams)
    }
  }, [deps.searchParams, initScreen, onSearchParamsUpdated])

  return <GlobalUserListContent strings={strings} />
}

/** Props for {@link GlobalUserListScreen}. */
export interface GlobalUserListScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Dependencies injected into screen store. */
  dependencies: GlobalUserListStoreDependencies
  /** Optional localized strings override. */
  strings?: UserModuleStrings
}

/** Administrative screen component displaying a paginated global list of user accounts with filter options. */
export const GlobalUserListScreen = forwardRef<HTMLDivElement, GlobalUserListScreenProps>(
  ({ dependencies, strings = userStrings, className, ...rest }, ref) => {
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
