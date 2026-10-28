import React, { forwardRef } from 'react'
import {
  formatByteSize,
  storageStrings,
  StorageModuleStrings,
  StorageCategory,
  StorageFileStatus
} from '@mudrichenkoevgeny/shared-foundation'
import { cn, CoreIcon } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { StorageFileSummary } from '@mudrichenkoevgeny/shared-foundation'
import { storageIcons } from '@/assets/icons'

/**
 * Test tags dictionary for {@link StorageFileItem}.
 */
export const StorageFileItemTestTags = {
  /** Test ID prefix for file item container. */
  ITEM: 'StorageFileItem'
}

const isStorageCategory = (value: string): value is StorageCategory => {
  return Object.values(StorageCategory).some((v) => v === value)
}

const isStorageStatus = (value: string): value is StorageFileStatus => {
  return Object.values(StorageFileStatus).some((v) => v === value)
}

const getCategoryIcon = (category: StorageCategory) => {
  switch (category) {
    case StorageCategory.IMAGE:
      return storageIcons.fileImage
    case StorageCategory.VIDEO:
      return storageIcons.fileVideo
    case StorageCategory.AUDIO:
      return storageIcons.fileAudio
    case StorageCategory.DOCUMENT:
      return storageIcons.fileDocument
    case StorageCategory.OTHER:
      return storageIcons.fileOther
  }
}

const getStatusIcon = (status: StorageFileStatus) => {
  switch (status) {
    case StorageFileStatus.PENDING_UPLOAD:
      return storageIcons.fileStatusPendingUpload
    case StorageFileStatus.PROCESSING:
      return storageIcons.fileStatusProcessing
    case StorageFileStatus.READY:
      return storageIcons.fileStatusReady
    case StorageFileStatus.DELETED:
      return storageIcons.fileStatusDeleted
  }
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
 *
 * @param props - Component properties configuring file summary data and action handlers.
 * @param ref - Optional forwarding ref bound to root container element.
 * @returns React node rendering storage file item card.
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
    const formattedSize = formatByteSize(file.fileSizeBytes, undefined, 2)
    const category: StorageCategory = isStorageCategory(file.category) ? file.category : StorageCategory.OTHER
    const status: StorageFileStatus = isStorageStatus(file.status) ? file.status : StorageFileStatus.READY

    return (
      <div
        ref={ref}
        data-testid={`${StorageFileItemTestTags.ITEM}_${file.id}`}
        tabIndex={isClickable ? 0 : undefined}
        role={isClickable ? 'button' : undefined}
        onClick={onFileClick}
        onKeyDown={(e) => {
          if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            onFileClick?.()
          }
        }}
        className={cn(
          'w-full p-4 rounded-lg border border-border bg-card transition-colors flex flex-col gap-3 shadow-sm',
          isClickable ? 'hover:bg-accent/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary' : '',
          className
        )}
        {...rest}
      >
        <div className="flex items-center gap-3">
          <CoreIcon src={getCategoryIcon(category)} size={24} className="text-muted-foreground flex-shrink-0" />
          <span className="text-base font-bold text-surface-foreground truncate flex-1">
            {file.fileName}
          </span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-muted text-muted-foreground">
            <CoreIcon src={getStatusIcon(status)} size={14} className="flex-shrink-0" />
            <span className="capitalize">{file.status}</span>
          </div>
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-muted text-muted-foreground uppercase">
            {file.category}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formattedSize}</span>
          <span>{file.mimeType}</span>
        </div>

        {onDeleteClick && file.status !== StorageFileStatus.DELETED && (
          <div className="pt-2 border-t border-border flex justify-end">
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
