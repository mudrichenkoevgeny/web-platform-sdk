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
import { AuditItem } from '@/ui/components/audit/item/AuditItem'
import { getAuditEventListingOptionsConfig } from '@/ui/screens/management/audit/list/audit-event-list-options-config'
import {
  AuditEventListProvider,
  useAuditEventListStore
} from '@/ui/screens/management/audit/list/AuditEventListStore'
import type { AuditEventListStoreDependencies } from '@/ui/screens/management/audit/list/AuditEventListStore'

export const AuditEventListTestTags = {
  BACK_BUTTON: 'AuditEventList_BackButton',
  TITLE: 'AuditEventList_Title',
  FILTER_BUTTON: 'AuditEventList_FilterButton',
  REFRESH_BUTTON: 'AuditEventList_RefreshButton',
  AUDIT_LIST: 'AuditEventList_List',
  GLOBAL_ERROR_TEXT: 'AuditEventList_GlobalErrorText',
  ACTION_ERROR_TEXT: 'AuditEventList_ActionErrorText'
}

const AuditEventListContent: React.FC<{ strings?: FeatureManagementUserStrings }> = ({
  strings = enManagementUserStrings
}) => {
  const screenState = useAuditEventListStore((s) => s.screenState)
  const onRefresh = useAuditEventListStore((s) => s.onRefresh)
  const onLoadNextPage = useAuditEventListStore((s) => s.onLoadNextPage)
  const onEventClick = useAuditEventListStore((s) => s.onEventClick)
  const onBackClick = useAuditEventListStore((s) => s.onBackClick)
  const onToggleFilterPanel = useAuditEventListStore((s) => s.onToggleFilterPanel)
  const onSortChanged = useAuditEventListStore((s) => s.onSortChanged)
  const onFilterChanged = useAuditEventListStore((s) => s.onFilterChanged)
  const onApplyFilters = useAuditEventListStore((s) => s.onApplyFilters)
  const errorParser = useAppErrorParser()

  const isSuccess = screenState.status === 'success'
  const pagingState = isSuccess ? screenState.paging : undefined

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
        data-testid={AuditEventListTestTags.GLOBAL_ERROR_TEXT}
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

  const optionsConfig = getAuditEventListingOptionsConfig(strings)

  return (
    <div className="w-full h-full p-6 flex flex-col relative overflow-hidden">
      <div className="w-full flex items-center justify-between relative mb-4">
        <CoreBackButton data-testid={AuditEventListTestTags.BACK_BUTTON} onClick={onBackClick} />
        <CoreScreenTitleText
          data-testid={AuditEventListTestTags.TITLE}
          text={strings.audit_logs_title}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-testid={AuditEventListTestTags.FILTER_BUTTON}
            aria-label={strings.filter}
            onClick={onToggleFilterPanel}
            className="p-2 rounded-lg border border-border bg-surface text-surface-foreground hover:bg-accent transition-colors flex items-center justify-center cursor-pointer"
          >
            <CoreIcon src={icons.filter} size={20} className="text-surface-foreground" />
          </button>
          <button
            type="button"
            data-testid={AuditEventListTestTags.REFRESH_BUTTON}
            aria-label={strings.refresh}
            onClick={onRefresh}
            className="p-2 rounded-lg border border-border bg-surface text-surface-foreground hover:bg-accent transition-colors flex items-center justify-center cursor-pointer"
          >
            <CoreIcon src={icons.refresh} size={20} className="text-surface-foreground" />
          </button>
        </div>
      </div>

      <div className="w-full flex-1 overflow-y-auto flex flex-col gap-3 pr-1" data-testid={AuditEventListTestTags.AUDIT_LIST}>
        {actionError && (
          <CoreErrorText
            data-testid={AuditEventListTestTags.ACTION_ERROR_TEXT}
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

            {paging.items.map((event) => (
              <AuditItem
                key={event.id}
                event={event}
                onClick={() => onEventClick(event.id)}
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

const AuditEventListController: React.FC<{ strings?: FeatureManagementUserStrings }> = ({
  strings
}) => {
  const initScreen = useAuditEventListStore((s) => s.initScreen)

  useEffect(() => {
    initScreen()
  }, [initScreen])

  return <AuditEventListContent strings={strings} />
}

export interface AuditEventListScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: AuditEventListStoreDependencies
  strings?: FeatureManagementUserStrings
}

export const AuditEventListScreen = forwardRef<HTMLDivElement, AuditEventListScreenProps>(
  ({ dependencies, strings = enManagementUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <AuditEventListProvider dependencies={dependencies}>
          <AuditEventListController strings={strings} />
        </AuditEventListProvider>
      </div>
    )
  }
)

AuditEventListScreen.displayName = 'AuditEventListScreen'
