import React, { forwardRef } from 'react'
import type { AuditEvent } from '@mudrichenkoevgeny/shared-foundation'
import { cn } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enManagementUserStrings } from '@/locales/index'
import type { FeatureManagementUserStrings } from '@/locales/index'

export interface AuditItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  event: AuditEvent
  onClick: () => void
  strings?: FeatureManagementUserStrings
}

export const AuditItem = forwardRef<HTMLButtonElement, AuditItemProps>(
  (
    {
      event,
      onClick,
      strings = enManagementUserStrings,
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        type="button"
        ref={ref}
        data-testid={`AuditItem_${event.id}`}
        onClick={onClick}
        className={cn(
          'text-left relative w-full p-4 rounded-lg border border-border bg-card text-card-foreground hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary transition-colors flex flex-col gap-2 shadow-sm cursor-pointer',
          className
        )}
        {...rest}
      >
        <div className="text-sm font-bold text-surface-foreground">
          {strings.audit_event_id}: {event.id}
        </div>
        <div className="text-xs text-muted-foreground">
          {strings.audit_event_status}: {event.status}
        </div>
      </button>
    )
  }
)

AuditItem.displayName = 'AuditItem'
