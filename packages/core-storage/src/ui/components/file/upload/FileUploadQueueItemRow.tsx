import React, { useId } from 'react'
import {
  StorageCategory,
  StorageFileVisibility,
  formatByteSize,
  type UploadQueueItemId,
  type StorageFileUploadUiConfig,
  type StorageModuleStrings
} from '@mudrichenkoevgeny/shared-foundation'
import {
  CoreErrorText,
  CoreIcon,
  icons,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { isStorageCategory } from '@/ui/utils/storage-category'
import type { FileUploadQueueItem } from '@/ui/components/file/upload/storage-file-upload.types'
import { UploadQueueItemStatus } from '@/ui/components/file/upload/storage-file-upload.types'
import { StorageFilePreview } from '@/ui/components/file/preview/StorageFilePreview'

/**
 * Test tags for {@link FileUploadQueueItemRow}.
 */
export const UploadQueueItemRowTestTags = {
  QUEUE_ITEM: 'StorageFileUploadArea_QueueItem',
  REMOVE_ITEM_BUTTON: 'StorageFileUploadArea_RemoveItemButton',
  CATEGORY_SELECT: 'StorageFileUploadArea_CategorySelect',
  ERROR_TEXT: 'StorageFileUploadArea_ErrorText'
}

/**
 * Props for {@link FileUploadQueueItemRow}.
 */
export interface FileUploadQueueItemRowProps {
  item: FileUploadQueueItem
  config: StorageFileUploadUiConfig
  isUploading: boolean
  strings: StorageModuleStrings
  onSetVisibility: (id: UploadQueueItemId, visibility: StorageFileVisibility) => void
  onSetCategory: (id: UploadQueueItemId, category: StorageCategory) => void
  onRemoveItem: (id: UploadQueueItemId) => void
}

/**
 * Individual row component representing a queued file item in the upload area.
 *
 * @param props - Component properties for queue item data and action callbacks.
 * @returns React element rendering queue item row.
 */
export const FileUploadQueueItemRow: React.FC<FileUploadQueueItemRowProps> = ({
  item,
  config,
  isUploading,
  strings,
  onSetVisibility,
  onSetCategory,
  onRemoveItem
}) => {
  const visibilitySelectId = useId()
  const categorySelectId = useId()
  const errorParser = useAppErrorParser()

  return (
    <div
      data-testid={UploadQueueItemRowTestTags.QUEUE_ITEM}
      className="w-full border border-border rounded-md p-3 flex flex-col gap-2 bg-surface"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <StorageFilePreview category={item.category} file={item.file} />
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-sm font-semibold text-surface-foreground truncate">
              {item.file.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatByteSize(item.file.size, undefined, 2)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!config.visibility && (item.status === UploadQueueItemStatus.IDLE || item.status === UploadQueueItemStatus.FAILED) ? (
            <div className="flex items-center gap-1.5">
              <label htmlFor={visibilitySelectId} className="text-xs text-muted-foreground font-medium cursor-pointer">
                {strings.ui.visibility}:
              </label>
              <select
                id={visibilitySelectId}
                value={item.visibility}
                onChange={(e) => {
                  const val = e.target.value
                  if (val === StorageFileVisibility.PRIVATE || val === StorageFileVisibility.PUBLIC) {
                    onSetVisibility(item.id, val)
                  }
                }}
                disabled={isUploading}
                className="p-1 rounded-md border border-border bg-surface text-surface-foreground text-xs"
              >
                <option value={StorageFileVisibility.PRIVATE}>{strings.ui.visibilityPrivate}</option>
                <option value={StorageFileVisibility.PUBLIC}>{strings.ui.visibilityPublic}</option>
              </select>
            </div>
          ) : null}

          {config.category ? (
            <span className="text-xs text-muted-foreground capitalize">
              {item.category}
            </span>
          ) : item.status === UploadQueueItemStatus.IDLE || item.status === UploadQueueItemStatus.FAILED ? (
            <div className="flex items-center gap-1.5">
              <label htmlFor={categorySelectId} className="text-xs text-muted-foreground font-medium cursor-pointer">
                {strings.ui.category}:
              </label>
              <select
                id={categorySelectId}
                data-testid={UploadQueueItemRowTestTags.CATEGORY_SELECT}
                value={item.category}
                onChange={(e) => {
                  const val = e.target.value
                  if (isStorageCategory(val)) {
                    onSetCategory(item.id, val)
                  }
                }}
                disabled={isUploading}
                className="p-1 rounded-md border border-border bg-surface text-surface-foreground text-xs"
              >
                <option value={StorageCategory.IMAGE}>{strings.ui.categoryImage}</option>
                <option value={StorageCategory.VIDEO}>{strings.ui.categoryVideo}</option>
                <option value={StorageCategory.AUDIO}>{strings.ui.categoryAudio}</option>
                <option value={StorageCategory.DOCUMENT}>{strings.ui.categoryDocument}</option>
                <option value={StorageCategory.OTHER}>{strings.ui.categoryOther}</option>
              </select>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground capitalize">
              {item.category}
            </span>
          )}

          {item.status === UploadQueueItemStatus.COMPLETED && (
            <span className="text-green-500 font-bold">✓</span>
          )}

          {(item.status !== UploadQueueItemStatus.UPLOADING && item.status !== UploadQueueItemStatus.COMPLETED) && (
            <button
              type="button"
              data-testid={UploadQueueItemRowTestTags.REMOVE_ITEM_BUTTON}
              onClick={() => onRemoveItem(item.id)}
              disabled={isUploading}
              className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors"
            >
              <CoreIcon src={icons.delete} size={20} />
            </button>
          )}
        </div>
      </div>

      {item.status === UploadQueueItemStatus.UPLOADING && (
        <div className="w-full flex flex-col gap-1">
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${item.progressPercent ?? 0}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground text-right font-medium">
            {strings.ui.fileUploadingProgress(item.progressPercent ?? 0)}
          </span>
        </div>
      )}

      {item.status === UploadQueueItemStatus.FAILED && item.error && (
        <CoreErrorText
          data-testid={UploadQueueItemRowTestTags.ERROR_TEXT}
          text={errorParser.parse(item.error) ?? ''}
        />
      )}
    </div>
  )
}
