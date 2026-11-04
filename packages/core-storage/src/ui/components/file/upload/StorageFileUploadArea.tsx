import React, { useId } from 'react'
import {
  StorageModuleStrings,
  storageStrings,
  commonStrings
} from '@mudrichenkoevgeny/shared-foundation'
import type { StorageFileUploadUiConfig } from '@mudrichenkoevgeny/shared-foundation'
import {
  cn,
  CoreButton,
  CoreIcon,
  icons
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  StorageFileUploadProvider,
  useStorageFileUploadStore
} from './storage-file-upload-context'
import type { StorageFileUploadStoreDependencies } from './storage-file-upload.types'
import { UploadQueueItemStatus } from './storage-file-upload.types'
import { FileUploadQueueItemRow, UploadQueueItemRowTestTags } from './FileUploadQueueItemRow'

/**
 * DOM data-testid tags for UI testing {@link StorageFileUploadArea}.
 */
export const StorageFileUploadAreaTestTags = {
  /** Test ID for the dropzone container element. */
  DROPZONE: 'StorageFileUploadArea_Dropzone',
  /** Test ID for the submit button element. */
  SUBMIT_BUTTON: 'StorageFileUploadArea_SubmitButton',
  /** Test ID for the error message text container. */
  ERROR_TEXT: UploadQueueItemRowTestTags.ERROR_TEXT,
  /** Test ID for an individual queue item element. */
  QUEUE_ITEM: UploadQueueItemRowTestTags.QUEUE_ITEM,
  /** Test ID for the remove item button element. */
  REMOVE_ITEM_BUTTON: UploadQueueItemRowTestTags.REMOVE_ITEM_BUTTON,
  /** Test ID for the category dropdown selector element. */
  CATEGORY_SELECT: UploadQueueItemRowTestTags.CATEGORY_SELECT
}

/**
 * Inner content component rendering upload dropzone, queue list, and submit action.
 */
export const StorageFileUploadAreaContent: React.FC<{ strings?: StorageModuleStrings }> = ({
  strings = storageStrings
}) => {
  const items = useStorageFileUploadStore((s) => s.items)
  const config = useStorageFileUploadStore((s) => s.config)
  const isUploading = useStorageFileUploadStore((s) => s.isUploading)

  const addFiles = useStorageFileUploadStore((s) => s.addFiles)
  const removeItem = useStorageFileUploadStore((s) => s.removeItem)
  const setItemCategory = useStorageFileUploadStore((s) => s.setItemCategory)
  const setItemVisibility = useStorageFileUploadStore((s) => s.setItemVisibility)
  const upload = useStorageFileUploadStore((s) => s.upload)

  const inputId = useId()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files)
    }
    e.target.value = ''
  }

  const acceptAttr = config.acceptedFileTypes && config.acceptedFileTypes.length > 0
    ? config.acceptedFileTypes.join(',')
    : undefined
  const hasPendingItems = items.some(
    (i) => i.status === UploadQueueItemStatus.IDLE || i.status === UploadQueueItemStatus.FAILED
  )
  const showSubmitButton = !config.autoSubmit && hasPendingItems

  return (
    <div className="w-full flex flex-col gap-6">
      <input
        id={inputId}
        type="file"
        multiple
        accept={acceptAttr}
        onChange={handleFileChange}
        className="sr-only"
        disabled={isUploading}
      />

      <label
        htmlFor={inputId}
        tabIndex={isUploading ? -1 : 0}
        data-testid={StorageFileUploadAreaTestTags.DROPZONE}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'w-full min-h-[8rem] border-2 border-dashed border-border rounded-xl bg-surface flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary',
          isUploading && 'opacity-50 cursor-not-allowed'
        )}
      >
        <CoreIcon src={icons.add} size={36} className="text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          {strings.ui.fileUploadDropzonePrompt}
        </p>
      </label>

      {items.length > 0 && (
        <div className="w-full flex flex-col gap-3">
          {items.map((item) => (
            <FileUploadQueueItemRow
              key={item.id}
              item={item}
              config={config}
              isUploading={isUploading}
              strings={strings}
              onSetVisibility={setItemVisibility}
              onSetCategory={setItemCategory}
              onRemoveItem={removeItem}
            />
          ))}
        </div>
      )}

      {showSubmitButton && (
        <CoreButton
          type="button"
          data-testid={StorageFileUploadAreaTestTags.SUBMIT_BUTTON}
          label={isUploading ? commonStrings.ui.loading : strings.ui.uploadFileAction}
          disabled={isUploading}
          onClick={upload}
        />
      )}
    </div>
  )
}

/**
 * Props for {@link StorageFileUploadArea}.
 */
export interface StorageFileUploadAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Dependencies required by storage file upload store. */
  dependencies: StorageFileUploadStoreDependencies
  /** Configuration constraints for the upload queue. */
  config: StorageFileUploadUiConfig
  /** Optional localized storage module strings override. */
  strings?: StorageModuleStrings
}

/**
 * Embedded component providing a dropzone and queue list for multi-file upload.
 * Internally wraps itself in {@link StorageFileUploadProvider} for store isolation.
 *
 * @param props - Component properties for configuring dependencies, config, and strings.
 * @param ref - Optional forwarding ref bound to root element.
 * @returns React node rendering embedded storage file upload area.
 */
export const StorageFileUploadArea = React.forwardRef<HTMLDivElement, StorageFileUploadAreaProps>(
  ({ dependencies, config, strings = storageStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full', className)} {...rest}>
        <StorageFileUploadProvider dependencies={dependencies} config={config}>
          <StorageFileUploadAreaContent strings={strings} />
        </StorageFileUploadProvider>
      </div>
    )
  }
)

StorageFileUploadArea.displayName = 'StorageFileUploadArea'
