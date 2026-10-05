import React, { forwardRef, useEffect } from 'react'
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
  PagingFooter,
  useAppErrorParser,
  useInfiniteScroll
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SessionItem } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { enManagementUserStrings } from '@/locales/index'
import type { FeatureManagementUserStrings } from '@/locales/index'
import {
  UserSessionListProvider,
  useUserSessionListStore
} from '@/ui/screens/management/session/user-list/UserSessionListStore'
import type { UserSessionListStoreDependencies } from '@/ui/screens/management/session/user-list/UserSessionListStore'

export const UserSessionListTestTags = {
  BACK_BUTTON: 'UserSessionList_BackButton',
  TITLE: 'UserSessionList_Title',
  REFRESH_BUTTON: 'UserSessionList_RefreshButton',
  REVOKE_ALL_BUTTON: 'UserSessionList_RevokeAllButton',
  SESSION_LIST: 'UserSessionList_List',
  GLOBAL_ERROR_TEXT: 'UserSessionList_GlobalErrorText',
  ACTION_ERROR_TEXT: 'UserSessionList_ActionErrorText'
}

const UserSessionListContent: React.FC<{ strings?: FeatureManagementUserStrings }> = ({
  strings = enManagementUserStrings
}) => {
  const screenState = useUserSessionListStore((s) => s.screenState)
  const onRefresh = useUserSessionListStore((s) => s.onRefresh)
  const onLoadNextPage = useUserSessionListStore((s) => s.onLoadNextPage)
  const onSessionClick = useUserSessionListStore((s) => s.onSessionClick)
  const onDeleteSessionClick = useUserSessionListStore((s) => s.onDeleteSessionClick)
  const onDeleteAllSessionsClick = useUserSessionListStore((s) => s.onDeleteAllSessionsClick)
  const onBackClick = useUserSessionListStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  if (screenState.status === 'loading') {
    return <FullscreenLoading />
  }

  if (screenState.status === 'error') {
    return (
      <FullscreenError
        data-testid={UserSessionListTestTags.GLOBAL_ERROR_TEXT}
        error={screenState.error}
        onRetry={onRefresh}
      />
    )
  }

  const { paging, actionLoading, actionError } = screenState

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onLoadMore: onLoadNextPage,
    hasMore: paging.pageNumber < paging.totalPages,
    isLoading: paging.isNextPageLoading ?? false
  })

  return (
    <div className="w-full h-full p-6 flex flex-col relative overflow-hidden">
      <div className="w-full flex items-center justify-between relative mb-4">
        <CoreBackButton data-testid={UserSessionListTestTags.BACK_BUTTON} onClick={onBackClick} />
        <CoreScreenTitleText
          data-testid={UserSessionListTestTags.TITLE}
          text={strings.user_sessions}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <button
          type="button"
          data-testid={UserSessionListTestTags.REFRESH_BUTTON}
          aria-label={strings.refresh}
          onClick={onRefresh}
          className="p-2 rounded-lg border border-border bg-surface text-surface-foreground hover:bg-accent transition-colors flex items-center justify-center cursor-pointer"
        >
          <CoreIcon src={icons.refresh} size={20} className="text-surface-foreground" />
        </button>
      </div>

      <div className="w-full flex-1 overflow-y-auto flex flex-col gap-3 pr-1" data-testid={UserSessionListTestTags.SESSION_LIST}>
        {actionError && (
          <CoreErrorText
            data-testid={UserSessionListTestTags.ACTION_ERROR_TEXT}
            text={errorParser.parse(actionError) ?? ''}
          />
        )}

        {paging.items.length > 1 && (
          <div className="w-full mb-2">
            <CoreButton
              type="button"
              data-testid={UserSessionListTestTags.REVOKE_ALL_BUTTON}
              label={strings.revoke_all_sessions}
              onClick={onDeleteAllSessionsClick}
              disabled={actionLoading}
              className="bg-error hover:bg-error/90 text-error-foreground"
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
            />

            {paging.items.map((session) => (
              <SessionItem
                key={session.id}
                session={session}
                enabled={!actionLoading}
                onRevokeClick={() => onDeleteSessionClick(session.id)}
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

const UserSessionListController: React.FC<{ strings?: FeatureManagementUserStrings }> = ({
  strings
}) => {
  const initScreen = useUserSessionListStore((s) => s.initScreen)

  useEffect(() => {
    initScreen()
  }, [initScreen])

  return <UserSessionListContent strings={strings} />
}

export interface UserSessionListScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: UserSessionListStoreDependencies
  strings?: FeatureManagementUserStrings
}

export const UserSessionListScreen = forwardRef<HTMLDivElement, UserSessionListScreenProps>(
  ({ dependencies, strings = enManagementUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <UserSessionListProvider dependencies={dependencies}>
          <UserSessionListController strings={strings} />
        </UserSessionListProvider>
      </div>
    )
  }
)

UserSessionListScreen.displayName = 'UserSessionListScreen'
