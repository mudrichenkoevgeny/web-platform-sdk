import React, { forwardRef, useEffect } from 'react'
import {
  cn,
  CoreBackButton,
  CoreScreenTitleText,
  CoreTitleText,
  formatEpochMillisToDateTime,
  FullscreenError,
  FullscreenLoading
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enManagementUserStrings } from '@/locales/index'
import type { FeatureManagementUserStrings } from '@/locales/index'
import {
  AuditEventDetailProvider,
  useAuditEventDetailStore
} from '@/ui/screens/management/audit/detail/AuditEventDetailStore'
import type { AuditEventDetailStoreDependencies } from '@/ui/screens/management/audit/detail/AuditEventDetailStore'

export const AuditEventDetailTestTags = {
  BACK_BUTTON: 'AuditEventDetail_BackButton',
  TITLE: 'AuditEventDetail_Title',
  GLOBAL_ERROR_TEXT: 'AuditEventDetail_GlobalErrorText',
  EVENT_ID_TEXT: 'AuditEventDetail_EventIdText',
  RESOURCE_ROW: 'AuditEventDetail_ResourceRow',
  SUBJECT_ROW: 'AuditEventDetail_SubjectRow'
}

const DetailRow: React.FC<{
  label: string
  value: string
  onClick?: (() => void) | null
  testTag?: string
}> = ({ label, value, onClick, testTag }) => {
  if (onClick) {
    return (
      <button
        type="button"
        data-testid={testTag}
        onClick={onClick}
        className="w-full flex justify-between items-start text-left hover:bg-accent/50 p-1.5 rounded transition-colors"
      >
        <span className="text-xs text-muted-foreground w-1/3">{label}</span>
        <span className="text-sm font-semibold text-primary w-2/3">{value}</span>
      </button>
    )
  }

  return (
    <div data-testid={testTag} className="w-full flex justify-between items-start p-1.5">
      <span className="text-xs text-muted-foreground w-1/3">{label}</span>
      <span className="text-sm text-surface-foreground w-2/3">{value}</span>
    </div>
  )
}

const AuditEventDetailContent: React.FC<{ strings?: FeatureManagementUserStrings }> = ({
  strings = enManagementUserStrings
}) => {
  const screenState = useAuditEventDetailStore((s) => s.screenState)
  const onRetry = useAuditEventDetailStore((s) => s.onRetry)
  const onResourceClick = useAuditEventDetailStore((s) => s.onResourceClick)
  const onSubjectClick = useAuditEventDetailStore((s) => s.onSubjectClick)
  const onBackClick = useAuditEventDetailStore((s) => s.onBackClick)

  if (screenState.status === 'loading') {
    return <FullscreenLoading />
  }

  if (screenState.status === 'error') {
    return (
      <FullscreenError
        data-testid={AuditEventDetailTestTags.GLOBAL_ERROR_TEXT}
        error={screenState.error}
        onRetry={onRetry}
      />
    )
  }

  const { event } = screenState

  const resourceName = String(event.resource)
  const isResourceClickable = Boolean(event.resourceId)
  const isSubjectClickable = Boolean(event.actorId)

  const resourceValue = event.resourceId ? `${resourceName}: ${event.resourceId}` : resourceName

  const subjectValue = `${event.actorType}${event.actorUserRole ? ` (${event.actorUserRole})` : ''}${event.actorId ? `: ${event.actorId}` : ''}`

  const formattedTimestamp = formatEpochMillisToDateTime(event.createdAt) ?? String(event.createdAt)

  const metadataItems = Array.from(event.metadata ?? [])

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between relative overflow-y-auto">
      <div className="w-full flex items-center justify-between relative mb-6">
        <CoreBackButton data-testid={AuditEventDetailTestTags.BACK_BUTTON} onClick={onBackClick} />
        <CoreScreenTitleText
          data-testid={AuditEventDetailTestTags.TITLE}
          text={strings.audit_event_details_title}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="w-10" />
      </div>

      <div className="w-full flex-1 flex flex-col gap-6 mb-6">
        <CoreTitleText data-testid={AuditEventDetailTestTags.EVENT_ID_TEXT} text={`${strings.audit_event_id}: ${event.id}`} />

        <div className="w-full p-4 rounded-lg border border-border bg-card flex flex-col gap-2 shadow-sm">
          <DetailRow
            label={strings.audit_event_action}
            value={String(event.action)}
          />
          <DetailRow
            label={strings.audit_event_status}
            value={String(event.status)}
          />
          <DetailRow
            label={strings.audit_event_resource}
            value={resourceValue}
            onClick={isResourceClickable ? onResourceClick : null}
            testTag={AuditEventDetailTestTags.RESOURCE_ROW}
          />
          <DetailRow
            label={strings.audit_event_resource_sensitivity}
            value={String(event.resourceValueSensitivity)}
          />
          <DetailRow
            label={strings.audit_event_actor}
            value={subjectValue}
            onClick={isSubjectClickable ? onSubjectClick : null}
            testTag={AuditEventDetailTestTags.SUBJECT_ROW}
          />
          {event.message && (
            <DetailRow
              label={strings.audit_event_message}
              value={event.message}
            />
          )}
          <DetailRow
            label={strings.audit_event_timestamp}
            value={formattedTimestamp}
          />
        </div>

        {metadataItems.length > 0 && (
          <div className="w-full p-4 rounded-lg border border-border bg-card flex flex-col gap-3 shadow-sm">
            <CoreTitleText text={strings.audit_event_metadata} />
            <div className="border-t border-border pt-2 flex flex-col gap-2">
              {metadataItems.map((item, idx) => (
                <DetailRow
                  key={idx}
                  label={String(item.key)}
                  value={item.value}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const AuditEventDetailController: React.FC<{ strings?: FeatureManagementUserStrings }> = ({
  strings
}) => {
  const initScreen = useAuditEventDetailStore((s) => s.initScreen)

  useEffect(() => {
    initScreen()
  }, [initScreen])

  return <AuditEventDetailContent strings={strings} />
}

export interface AuditEventDetailScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: AuditEventDetailStoreDependencies
  strings?: FeatureManagementUserStrings
}

export const AuditEventDetailScreen = forwardRef<HTMLDivElement, AuditEventDetailScreenProps>(
  ({ dependencies, strings = enManagementUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <AuditEventDetailProvider dependencies={dependencies}>
          <AuditEventDetailController strings={strings} />
        </AuditEventDetailProvider>
      </div>
    )
  }
)

AuditEventDetailScreen.displayName = 'AuditEventDetailScreen'
