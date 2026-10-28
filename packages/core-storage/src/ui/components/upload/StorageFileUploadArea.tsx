import React, { useRef, useId } from 'react'
import {
  StorageModuleStrings,
  storageStrings,
  commonStrings,
  formatByteSize,
  StorageCategory,
  StorageFileVisibility
} from '@mudrichenkoevgeny/shared-foundation'
import type { StorageFileUploadUiConfig } from '@mudrichenkoevgeny/shared-foundation'
import {
  cn,
  CoreButton,
  CoreErrorText,
  CoreIcon,
  icons,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  StorageFileUploadProvider,
  UploadQueueItemStatus,
  useStorageFileUploadStore
} from './storage-file-upload-store'
import type { StorageFileUploadStoreDependencies, FileUploadQueueItem } from './storage-file-upload-store'

/**
 * DOM data-testid tags for UI testing {@link StorageFileUploadArea}.
 */
export const StorageFileUploadAreaTestTags = {
  /** Test ID for the dropzone container element. */
  DROPZONE: 'StorageFileUploadArea_Dropzone',
  /** Test ID for the submit button element. */
  SUBMIT_BUTTON: 'StorageFileUploadArea_SubmitButton',
  /** Test ID for the error message text container. */
  ERROR_TEXT: 'StorageFileUploadArea_ErrorText',
  /** Test ID for an individual queue item element. */
  QUEUE_ITEM: 'StorageFileUploadArea_QueueItem',
  /** Test ID for the remove item button element. */
  REMOVE_ITEM_BUTTON: 'StorageFileUploadArea_RemoveItemButton',
  /** Test ID for the category dropdown selector element. */
  CATEGORY_SELECT: 'StorageFileUploadArea_CategorySelect'
}

import { storageIcons } from '@/assets/icons'

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

const isStorageCategory = (value: string): value is StorageCategory => {
  return Object.values(StorageCategory).some((v) => v === value)
}

/**
 * Component rendering image/video thumbnail preview or fallback category icon.
 */
const FilePreview: React.FC<{ file: File; category: StorageCategory }> = ({ file, category }) => {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (category !== StorageCategory.IMAGE && category !== StorageCategory.VIDEO) {
      return
    }

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file, category])

  if (previewUrl && category === StorageCategory.IMAGE) {
    return (
      <div className="w-12 h-12 rounded-md bg-muted border border-border flex items-center justify-center shrink-0 overflow-hidden">
        <img src={previewUrl} alt={file.name} className="w-full h-full object-cover" />
      </div>
    )
  }

  if (previewUrl && category === StorageCategory.VIDEO) {
    return (
      <div className="w-12 h-12 rounded-md bg-muted border border-border flex items-center justify-center shrink-0 overflow-hidden">
        <video src={previewUrl} preload="metadata" muted playsInline className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    <div className="w-12 h-12 rounded-md bg-muted border border-border flex items-center justify-center shrink-0">
      <CoreIcon src={getCategoryIcon(category)} size={24} className="text-muted-foreground" />
    </div>
  )
}

interface UploadQueueItemRowProps {
  item: FileUploadQueueItem
  config: StorageFileUploadUiConfig
  isUploading: boolean
  strings: StorageModuleStrings
  onSetVisibility: (localId: string, visibility: StorageFileVisibility) => void
  onSetCategory: (localId: string, category: StorageCategory) => void
  onRemoveItem: (localId: string) => void
}

const UploadQueueItemRow: React.FC<UploadQueueItemRowProps> = ({
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
      data-testid={StorageFileUploadAreaTestTags.QUEUE_ITEM}
      className="w-full border border-border rounded-md p-3 flex flex-col gap-2 bg-surface"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <FilePreview category={item.category} file={item.file} />
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
                    onSetVisibility(item.localId, val)
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
                data-testid={StorageFileUploadAreaTestTags.CATEGORY_SELECT}
                value={item.category}
                onChange={(e) => {
                  const val = e.target.value
                  if (isStorageCategory(val)) {
                    onSetCategory(item.localId, val)
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
              data-testid={StorageFileUploadAreaTestTags.REMOVE_ITEM_BUTTON}
              onClick={() => onRemoveItem(item.localId)}
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
              style={{ width: `${item.progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground text-right font-medium">
            {strings.ui.fileUploadingProgress(item.progressPercent)}
          </span>
        </div>
      )}

      {item.status === UploadQueueItemStatus.FAILED && item.error && (
        <CoreErrorText
          data-testid={StorageFileUploadAreaTestTags.ERROR_TEXT}
          text={errorParser.parse(item.error) ?? ''}
        />
      )}
    </div>
  )
}

const StorageFileUploadAreaContent: React.FC<{ strings?: StorageModuleStrings }> = ({
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

  const fileInputRef = useRef<HTMLInputElement | null>(null)

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

  const handleDropzoneKeyDown = (e: React.KeyboardEvent) => {
    if (!isUploading && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      fileInputRef.current?.click()
    }
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
        type="file"
        multiple
        accept={acceptAttr}
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      <div
        role="button"
        tabIndex={isUploading ? -1 : 0}
        data-testid={StorageFileUploadAreaTestTags.DROPZONE}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onKeyDown={handleDropzoneKeyDown}
        className={cn(
          'w-full min-h-[8rem] border-2 border-dashed border-border rounded-xl bg-surface flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary',
          isUploading && 'opacity-50 cursor-not-allowed'
        )}
      >
        <CoreIcon src={icons.add} size={36} className="text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          {strings.ui.fileUploadDropzonePrompt}
        </p>
      </div>

      {items.length > 0 && (
        <div className="w-full flex flex-col gap-3">
          {items.map((item) => (
            <UploadQueueItemRow
              key={item.localId}
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
