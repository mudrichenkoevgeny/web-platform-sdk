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
  PagingFooter,
  useInfiniteScroll
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { IdentifierItem } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { enManagementUserStrings } from '@/locales/index'
import type { FeatureManagementUserStrings } from '@/locales/index'
import {
  UserIdentifierListProvider,
  useUserIdentifierListStore
} from '@/ui/screens/management/identifier/user-list/UserIdentifierListStore'
import type { UserIdentifierListStoreDependencies } from '@/ui/screens/management/identifier/user-list/UserIdentifierListStore'

const UserIdentifierListContent: React.FC<{ strings?: FeatureManagementUserStrings }> = ({
  strings = enManagementUserStrings
}) => {
  const screenState = useUserIdentifierListStore((s) => s.screenState)
  const onRefresh = useUserIdentifierListStore((s) => s.onRefresh)
  const onLoadNextPage = useUserIdentifierListStore((s) => s.onLoadNextPage)
  const onIdentifierClick = useUserIdentifierListStore((s) => s.onIdentifierClick)
  const onBackClick = useUserIdentifierListStore((s) => s.onBackClick)

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

  const { paging } = screenState

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onLoadMore: onLoadNextPage,
    hasMore: paging.pageNumber < paging.totalPages,
    isLoading: paging.isNextPageLoading ?? false
  })

  return (
    <div className="w-full h-full p-6 flex flex-col relative overflow-hidden">
      <div className="w-full flex items-center justify-between relative mb-4">
        <CoreBackButton onClick={onBackClick} />
        <CoreScreenTitleText
          text={strings.user_identifiers}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <button
          type="button"
          aria-label={strings.ui_common_refresh}
          onClick={onRefresh}
          className="p-2 rounded-lg border border-border bg-surface text-surface-foreground hover:bg-accent transition-colors flex items-center justify-center cursor-pointer"
        >
          <CoreIcon src={icons.refresh} size={20} className="text-surface-foreground" />
        </button>
      </div>

      <div className="w-full flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
        {paging.items.length === 0 && !paging.isNextPageLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <ListingEmptyState />
          </div>
        ) : (
          <div className="w-full flex flex-col gap-3">
            <ListingHeaderBar
              onRefreshClick={onRefresh}
            />

            {paging.items.map((identifier) => (
              <IdentifierItem
                key={identifier.id}
                identifier={identifier}
                onClick={() => onIdentifierClick(identifier.id)}
                isCurrentIdentifier={false}
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

const UserIdentifierListController: React.FC<{ strings?: FeatureManagementUserStrings }> = ({
  strings
}) => {
  const initScreen = useUserIdentifierListStore((s) => s.initScreen)

  useEffect(() => {
    initScreen()
  }, [initScreen])

  return <UserIdentifierListContent strings={strings} />
}

export interface UserIdentifierListScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: UserIdentifierListStoreDependencies
  strings?: FeatureManagementUserStrings
}

export const UserIdentifierListScreen = forwardRef<HTMLDivElement, UserIdentifierListScreenProps>(
  ({ dependencies, strings = enManagementUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <UserIdentifierListProvider dependencies={dependencies}>
          <UserIdentifierListController strings={strings} />
        </UserIdentifierListProvider>
      </div>
    )
  }
)

UserIdentifierListScreen.displayName = 'UserIdentifierListScreen'
