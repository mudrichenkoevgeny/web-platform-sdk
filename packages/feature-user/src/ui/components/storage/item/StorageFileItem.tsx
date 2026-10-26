import React, { forwardRef } from 'react'
import { formatByteSize, storageStrings, StorageModuleStrings } from '@mudrichenkoevgeny/shared-foundation'
import { cn } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { StorageFileSummary } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Test tags dictionary for {@link StorageFileItem}.
 */
export const StorageFileItemTestTags = {
  ITEM: 'StorageFileItem'
}

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
  strings?: StorageModuleStrings
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
      strings = storageStrings,
      className,
      ...rest
    },
    ref
  ) => {
    const isClickable = Boolean(onFileClick)
    const formattedSize = formatByteSize(file.fileSizeBytes)

    return (
      <div
        ref={ref}
        data-testid={`${StorageFileItemTestTags.ITEM}_${file.id}`}
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

        <div className="flex items-center justify-between text-xs text-muted-foreground relative z-10 pointer-events-none">
          <span>{formattedSize}</span>
          <span>{file.mimeType}</span>
        </div>

        {onDeleteClick && (
          <div className="pt-2 border-t border-border flex justify-end relative z-10">
            <button
              type="button"
              aria-label={strings.ui.deleteFile}
              disabled={!enabled}
              onClick={(e) => {
                e.stopPropagation()
                onDeleteClick()
              }}
              className="px-3 py-1.5 rounded-md text-xs font-semibold bg-error/10 text-error hover:bg-error/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {strings.ui.deleteFile}
            </button>
          </div>
        )}
      </div>
    )
  }
)

StorageFileItem.displayName = 'StorageFileItem'
