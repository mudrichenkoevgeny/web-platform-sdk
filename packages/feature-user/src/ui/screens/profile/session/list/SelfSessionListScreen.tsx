import React, { forwardRef } from 'react'
import {
  cn,
  CoreBackButton,
  CoreButton,
  CoreErrorText,
  CoreScreenTitleText,
  CoreTextButton,
  FullscreenLoading,
  useAppErrorParser,
  useInfiniteScroll
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enUserStrings } from '@/locales/index'
import type { FeatureUserStrings } from "@/locales/index";
import { SessionItem } from '@/ui/components/session/item/SessionItem'
import {
  SelfSessionListProvider,
  useSelfSessionListStore
} from '@/ui/screens/profile/session/list/SelfSessionListStore'
import type { SelfSessionListStoreDependencies } from "@/ui/screens/profile/session/list/SelfSessionListStore";

/**
 * Automation test tags for {@link SelfSessionListScreen}.
 */
export const SelfSessionListTestTags = {
  TITLE: 'SelfSessionList_Title',
  BACK_BUTTON: 'SelfSessionList_BackButton',
  REFRESH_BUTTON: 'SelfSessionList_RefreshButton',
  GLOBAL_ERROR_TEXT: 'SelfSessionList_GlobalErrorText',
  SESSION_LIST: 'SelfSessionList_List',
  REVOKE_ALL_OTHERS_BUTTON: 'SelfSessionList_RevokeAllOthersButton',
  ACTION_ERROR_TEXT: 'SelfSessionList_ActionErrorText'
}

const SelfSessionListContent: React.FC<{ strings?: FeatureUserStrings }> = ({
  strings = enUserStrings
}) => {
  const screenState = useSelfSessionListStore((s) => s.screenState)
  const onRefresh = useSelfSessionListStore((s) => s.onRefresh)
  const onSessionClick = useSelfSessionListStore((s) => s.onSessionClick)
  const onRevokeSessionClick = useSelfSessionListStore((s) => s.onRevokeSessionClick)
  const onRevokeAllOtherSessionsClick = useSelfSessionListStore((s) => s.onRevokeAllOtherSessionsClick)
  const onLoadNextPage = useSelfSessionListStore((s) => s.onLoadNextPage)
  const onBackClick = useSelfSessionListStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  if (screenState.status === 'loading') {
    return <FullscreenLoading />
  }

  if (screenState.status === 'error') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 gap-4">
        <CoreErrorText
          text={errorParser.parse(screenState.error) ?? ''}
          data-testid={SelfSessionListTestTags.GLOBAL_ERROR_TEXT}
        />
        <CoreTextButton
          type="button"
          label={strings.resend_code ? strings.resend_code : 'Retry'}
          onClick={onRefresh}
        />
      </div>
    )
  }

  const { items, currentSessionId, hasMorePages, isNextPageLoading, actionLoading, actionError } = screenState

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onLoadMore: onLoadNextPage,
    hasMore: hasMorePages,
    isLoading: isNextPageLoading
  })

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between relative overflow-hidden">
      <div className="w-full flex items-center justify-between relative mb-4">
        <CoreBackButton
          onClick={onBackClick}
          data-testid={SelfSessionListTestTags.BACK_BUTTON}
        />
        <CoreScreenTitleText
          text={strings.sessions}
          className="absolute left-1/2 -translate-x-1/2"
          data-testid={SelfSessionListTestTags.TITLE}
        />
        <CoreTextButton
          type="button"
          label={strings.resend_code ? strings.resend_code : 'Refresh'}
          onClick={onRefresh}
          disabled={actionLoading}
          data-testid={SelfSessionListTestTags.REFRESH_BUTTON}
        />
      </div>

      <div
        className="w-full flex-1 overflow-y-auto flex flex-col gap-3 my-auto max-w-md mx-auto pr-1"
        data-testid={SelfSessionListTestTags.SESSION_LIST}
      >
        {items.map((session) => (
          <SessionItem
            key={session.id}
            session={session}
            isCurrentSession={currentSessionId === session.id}
            enabled={!actionLoading}
            onRevokeClick={() => onRevokeSessionClick(session.id)}
            onSessionClick={() => onSessionClick(session)}
            strings={strings}
          />
        ))}

        {hasMorePages && <div ref={sentinelRef} className="h-4 w-full" />}

        {isNextPageLoading && (
          <div className="w-full py-2 text-center text-xs text-muted-foreground">
            Loading...
          </div>
        )}
      </div>

      <div className="w-full max-w-md mx-auto pt-4 flex flex-col gap-2">
        {items.length > 1 && (
          <CoreButton
            type="button"
            label={strings.session_revoke_all_others}
            onClick={onRevokeAllOtherSessionsClick}
            disabled={actionLoading}
            className="bg-error hover:bg-error/90 text-error-foreground"
            data-testid={SelfSessionListTestTags.REVOKE_ALL_OTHERS_BUTTON}
          />
        )}

        {actionError && (
          <CoreErrorText
            text={errorParser.parse(actionError) ?? ''}
            data-testid={SelfSessionListTestTags.ACTION_ERROR_TEXT}
          />
        )}
      </div>
    </div>
  )
}

/**
 * Props for {@link SelfSessionListScreen}.
 */
export interface SelfSessionListScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: SelfSessionListStoreDependencies
  strings?: FeatureUserStrings
}

/**
 * Screen component displaying active sessions for the current account with infinite scroll and session revoking.
 */
export const SelfSessionListScreen = forwardRef<HTMLDivElement, SelfSessionListScreenProps>(
  ({ dependencies, strings = enUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <SelfSessionListProvider dependencies={dependencies}>
          <SelfSessionListContent strings={strings} />
        </SelfSessionListProvider>
      </div>
    )
  }
)

SelfSessionListScreen.displayName = 'SelfSessionListScreen'
