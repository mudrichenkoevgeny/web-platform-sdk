import React, { forwardRef } from 'react'
import { formatByteSize, userStrings, UserModuleStrings } from '@mudrichenkoevgeny/shared-foundation'
import { cn, formatEpochMillisToDateTime } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { StorageFileSummary } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Props for the {@link StorageFileItem} component.
 */
export interface StorageFileItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /**
   * Storage file summary domain object to display.
   */
  file: StorageFileSummary
  /**
   * Optional callback invoked when the delete button is clicked.
   */
  onDeleteClick?: () => void
  /**
   * Controls whether interactions are permitted.
   */
  enabled?: boolean
  /**
   * Optional callback invoked when the item card is clicked.
   */
  onFileClick?: () => void
  /**
   * Localized strings dictionary override.
   */
  strings?: UserModuleStrings
}

/**
 * List item component representing a user storage file summary card.
 */
export const StorageFileItem = forwardRef<HTMLDivElement, StorageFileItemProps>(
  (
    {
      file,
      onDeleteClick,
      enabled = true,
      onFileClick,
      strings = userStrings,
      className,
      ...rest
    },
    ref
  ) => {
    const isClickable = Boolean(onFileClick)
    const formattedSize = formatByteSize(file.fileSizeBytes)
    const formattedDate = formatEpochMillisToDateTime(file.createdAtMillis) ?? String(file.createdAtMillis)

    return (
      <div
        ref={ref}
        data-testid={`StorageFileItem_${file.fileId}`}
        tabIndex={isClickable ? -1 : undefined}
        className={cn(
          'relative w-full p-4 rounded-lg border border-border bg-card transition-colors flex flex-col gap-3 shadow-sm',
          isClickable ? 'hover:bg-accent/50 cursor-pointer' : '',
          className
        )}
        {...rest}
      >
        {isClickable && (
          <button
            type="button"
            aria-label={file.fileName}
            onClick={onFileClick}
            className="absolute inset-0 w-full h-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary z-0 cursor-pointer"
          />
        )}

        <div className="flex items-center justify-between gap-2 relative z-10 pointer-events-none">
          <span className="text-base font-bold text-surface-foreground truncate">
            {file.fileName}
          </span>
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-muted text-muted-foreground uppercase">
            {file.category}
          </span>
        </div>

        {file.ownerUserId && (
          <div className="text-xs text-muted-foreground relative z-10 pointer-events-none">
            <span>{strings.ui.ownerUserId}: {file.ownerUserId}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground relative z-10 pointer-events-none">
          <span>{formattedSize}</span>
          <span>{formattedDate}</span>
        </div>

        {onDeleteClick && (
          <div className="pt-2 border-t border-border flex justify-end relative z-10">
            <button
              type="button"
              aria-label={strings.ui.deleteFileAction}
              disabled={!enabled}
              onClick={(e) => {
                e.stopPropagation()
                onDeleteClick()
              }}
              className="px-3 py-1.5 rounded-md text-xs font-semibold bg-error/10 text-error hover:bg-error/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {strings.ui.deleteFileAction}
            </button>
          </div>
        )}
      </div>
    )
  }
)

StorageFileItem.displayName = 'StorageFileItem'
