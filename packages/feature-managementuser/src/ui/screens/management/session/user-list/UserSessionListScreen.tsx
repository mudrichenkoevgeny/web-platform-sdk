import React, { forwardRef, useEffect } from 'react'
import { UserModuleStrings, userStrings, commonStrings } from '@mudrichenkoevgeny/shared-foundation'
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
  hasMorePages,
  useAppErrorParser,
  useInfiniteScroll
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SessionItem } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import {
  UserSessionListProvider,
  UserSessionListStatus,
  useUserSessionListStore
} from '@/ui/screens/management/session/user-list/UserSessionListStore'
import type { UserSessionListStoreDependencies } from '@/ui/screens/management/session/user-list/UserSessionListStore'

/** Automation test tags for {@link UserSessionListScreen}. */
export const UserSessionListTestTags = {
  BACK_BUTTON: 'UserSessionList_BackButton',
  TITLE: 'UserSessionList_Title',
  REFRESH_BUTTON: 'UserSessionList_RefreshButton',
  REVOKE_ALL_BUTTON: 'UserSessionList_RevokeAllButton',
  SESSION_LIST: 'UserSessionList_List',
  GLOBAL_ERROR_TEXT: 'UserSessionList_GlobalErrorText',
  ACTION_ERROR_TEXT: 'UserSessionList_ActionErrorText'
}

const UserSessionListContent: React.FC<{ strings?: UserModuleStrings }> = ({
  strings = userStrings
}) => {
  const deps = useUserSessionListStore((s) => s.dependencies)
  const screenState = useUserSessionListStore((s) => s.screenState)
  const onRefresh = useUserSessionListStore((s) => s.onRefresh)
  const onLoadNextPage = useUserSessionListStore((s) => s.onLoadNextPage)
  const onSessionClick = useUserSessionListStore((s) => s.onSessionClick)
  const onDeleteSessionClick = useUserSessionListStore((s) => s.onDeleteSessionClick)
  const onDeleteAllSessionsClick = useUserSessionListStore((s) => s.onDeleteAllSessionsClick)
  const onBackClick = useUserSessionListStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  const isContent = screenState.status === UserSessionListStatus.CONTENT
  const pagingState = isContent ? screenState.paging : undefined

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onLoadMore: onLoadNextPage,
    hasMore: pagingState ? hasMorePages(pagingState) : false,
    isLoading: pagingState?.isNextPageLoading ?? false
  })

  switch (screenState.status) {
    case UserSessionListStatus.LOADING:
      return <FullscreenLoading />

    case UserSessionListStatus.ERROR:
      return (
        <FullscreenError
          data-testid={UserSessionListTestTags.GLOBAL_ERROR_TEXT}
          error={screenState.error}
          onRetry={onRefresh}
          onBack={onBackClick}
          title={strings.ui.userSessions}
        />
      )

    case UserSessionListStatus.CONTENT: {
      const { paging, actionLoading, actionError } = screenState

      return (
        <div className="w-full h-full p-6 flex flex-col relative overflow-hidden">
          <div className="w-full flex items-center justify-between relative mb-4">
            <CoreBackButton data-testid={UserSessionListTestTags.BACK_BUTTON} onClick={onBackClick} />
            <CoreScreenTitleText
              data-testid={UserSessionListTestTags.TITLE}
              text={strings.ui.userSessions}
              className="absolute left-1/2 -translate-x-1/2"
            />
            <button
              type="button"
              data-testid={UserSessionListTestTags.REFRESH_BUTTON}
              aria-label={commonStrings.ui.refresh}
              onClick={onRefresh}
              className="p-2 rounded-lg border border-border bg-surface text-surface-foreground hover:bg-accent transition-colors flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
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
                  label={strings.ui.revokeAllSessions}
                  onClick={onDeleteAllSessionsClick}
                  disabled={actionLoading || (deps.currentUserId != null && deps.userId === deps.currentUserId)}
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

                {paging.items.map((session) => {
                  const sessionId = session.id
                  if (!sessionId) {
                    return null
                  }
                  return (
                    <SessionItem
                      key={sessionId}
                      session={session}
                      enabled={!actionLoading}
                      onRevokeClick={() => onDeleteSessionClick(sessionId)}
                      onSessionClick={() => onSessionClick(session)}
                      isCurrentSession={(deps.currentUserId != null && session.userId === deps.currentUserId) || (deps.currentSessionId != null && session.id === deps.currentSessionId)}
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

const UserSessionListController: React.FC<{ strings?: UserModuleStrings }> = ({
  strings
}) => {
  const initScreen = useUserSessionListStore((s) => s.initScreen)

  useEffect(() => {
    initScreen()
  }, [initScreen])

  return <UserSessionListContent strings={strings} />
}

/** Props for {@link UserSessionListScreen}. */
export interface UserSessionListScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Dependencies required by store. */
  dependencies: UserSessionListStoreDependencies
  /** Optional localized strings override. */
  strings?: UserModuleStrings
}

/** Administrative screen component displaying paginated active sessions for a target user account. */
export const UserSessionListScreen = forwardRef<HTMLDivElement, UserSessionListScreenProps>(
  ({ dependencies, strings = userStrings, className, ...rest }, ref) => {
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
