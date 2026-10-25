import React, { forwardRef, useRef } from 'react'
import { StorageModuleStrings, storageStrings, commonStrings, formatByteSize } from '@mudrichenkoevgeny/shared-foundation'
import {
  cn,
  CoreBackButton,
  CoreButton,
  CoreErrorText,
  CoreIcon,
  CoreOutlinedTextField,
  CoreScreenTitleText,
  icons,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  StorageFileUploadProvider,
  useStorageFileUploadStore
} from '@/ui/screens/user/storage/upload/storage-file-upload-store'
import type { StorageFileUploadStoreDependencies } from '@/ui/screens/user/storage/upload/storage-file-upload-store'

/**
 * DOM data-testid tags for UI testing {@link StorageFileUploadScreen}.
 */
export const StorageFileUploadTestTags = {
  BACK_BUTTON: 'StorageFileUpload_BackButton',
  TITLE: 'StorageFileUpload_Title',
  DROPZONE: 'StorageFileUpload_Dropzone',
  SUBMIT_BUTTON: 'StorageFileUpload_SubmitButton',
  ERROR_TEXT: 'StorageFileUpload_ErrorText'
}

const StorageFileUploadContent: React.FC<{ strings?: StorageModuleStrings }> = ({
  strings = storageStrings
}) => {
  const file = useStorageFileUploadStore((s) => s.file)
  const category = useStorageFileUploadStore((s) => s.category)
  const visibility = useStorageFileUploadStore((s) => s.visibility)
  const targetScope = useStorageFileUploadStore((s) => s.targetScope)
  const progressPercent = useStorageFileUploadStore((s) => s.progressPercent)
  const isUploading = useStorageFileUploadStore((s) => s.isUploading)
  const error = useStorageFileUploadStore((s) => s.error)

  const setFile = useStorageFileUploadStore((s) => s.setFile)
  const setCategory = useStorageFileUploadStore((s) => s.setCategory)
  const setVisibility = useStorageFileUploadStore((s) => s.setVisibility)
  const setTargetScope = useStorageFileUploadStore((s) => s.setTargetScope)
  const upload = useStorageFileUploadStore((s) => s.upload)
  const onBackClick = useStorageFileUploadStore((s) => s.onBackClick)

  const errorParser = useAppErrorParser()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        setFile(droppedFile)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      if (selectedFile) {
        setFile(selectedFile)
      }
    }
  }

  return (
    <div className="w-full h-full p-6 flex flex-col relative overflow-y-auto">
      <div className="w-full flex items-center justify-between relative mb-6">
        <CoreBackButton
          data-testid={StorageFileUploadTestTags.BACK_BUTTON}
          onClick={onBackClick}
          disabled={isUploading}
        />
        <CoreScreenTitleText
          data-testid={StorageFileUploadTestTags.TITLE}
          text={strings.ui.fileUploadTitle}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="w-10" />
      </div>

      <div className="w-full max-w-lg mx-auto flex-1 flex flex-col gap-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />

        <div
          data-testid={StorageFileUploadTestTags.DROPZONE}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={cn(
            'w-full h-48 border-2 border-dashed border-border rounded-xl bg-surface flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-primary transition-colors',
            isUploading && 'opacity-50 cursor-not-allowed'
          )}
        >
          <CoreIcon src={icons.add} size={36} className="text-muted-foreground mb-2" />
          {file ? (
            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold text-surface-foreground break-all">{file.name}</span>
              <span className="text-xs text-muted-foreground">{formatByteSize(file.size)}</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {strings.ui.fileUploadDropzonePrompt}
            </p>
          )}
        </div>

        {isUploading && (
          <div className="w-full flex flex-col gap-2">
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground text-center font-medium">
              {strings.ui.fileUploadingProgress(progressPercent)}
            </span>
          </div>
        )}

        <div className="w-full flex flex-col gap-3">
          <CoreOutlinedTextField
            value={targetScope}
            onChange={(e) => setTargetScope(e.target.value)}
            label={strings.ui.targetScope}
            disabled={isUploading}
          />

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground font-medium">{strings.ui.category}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isUploading}
              className="p-2.5 rounded-md border border-border bg-surface text-surface-foreground text-sm"
            >
              <option value="image">{strings.ui.categoryImage}</option>
              <option value="video">{strings.ui.categoryVideo}</option>
              <option value="audio">{strings.ui.categoryAudio}</option>
              <option value="document">{strings.ui.categoryDocument}</option>
              <option value="other">{strings.ui.categoryOther}</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground font-medium">{strings.ui.visibility}</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              disabled={isUploading}
              className="p-2.5 rounded-md border border-border bg-surface text-surface-foreground text-sm"
            >
              <option value="public">{strings.ui.visibilityPublic}</option>
              <option value="private">{strings.ui.visibilityPrivate}</option>
            </select>
          </div>
        </div>

        {error && (
          <CoreErrorText
            data-testid={StorageFileUploadTestTags.ERROR_TEXT}
            text={errorParser.parse(error) ?? ''}
          />
        )}

        <CoreButton
          type="button"
          data-testid={StorageFileUploadTestTags.SUBMIT_BUTTON}
          label={isUploading ? commonStrings.ui.loading : strings.ui.uploadFileAction}
          disabled={!file || isUploading}
          onClick={upload}
        />
      </div>
    </div>
  )
}

/**
 * Props for {@link StorageFileUploadScreen}.
 */
export interface StorageFileUploadScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Dependencies required by storage file upload store. */
  dependencies: StorageFileUploadStoreDependencies
  /** Optional localized storage module strings override. */
  strings?: StorageModuleStrings
}

/**
 * Screen component providing UI for selecting and uploading storage files.
 */
export const StorageFileUploadScreen = forwardRef<HTMLDivElement, StorageFileUploadScreenProps>(
  ({ dependencies, strings = storageStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <StorageFileUploadProvider dependencies={dependencies}>
          <StorageFileUploadContent strings={strings} />
        </StorageFileUploadProvider>
      </div>
    )
  }
)

StorageFileUploadScreen.displayName = 'StorageFileUploadScreen'
