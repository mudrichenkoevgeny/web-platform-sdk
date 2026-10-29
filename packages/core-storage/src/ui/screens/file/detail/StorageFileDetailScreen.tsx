import React, { forwardRef, useEffect } from 'react'
import type { StorageModuleStrings, CommonModuleStrings } from '@mudrichenkoevgeny/shared-foundation'
import { StorageCategory, StorageFileStatus, storageStrings, commonStrings, formatByteSize } from '@mudrichenkoevgeny/shared-foundation'
import {
  cn,
  CoreBackButton,
  CoreButton,
  CoreIcon,
  CoreErrorText,
  CoreScreenTitleText,
  CoreTextButton,
  FullscreenError,
  FullscreenLoading,
  icons,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  StorageFileDetailProvider,
  StorageFileDetailStatus,
  useStorageFileDetailStore
} from './storage-file-detail-store'
import type { StorageFileDetailStoreDependencies } from './storage-file-detail-store'

/**
 * DOM data-testid tags for UI testing {@link StorageFileDetailScreen}.
 */
export const StorageFileDetailTestTags = {
  /** Test ID for the back button. */
  BACK_BUTTON: 'StorageFileDetail_BackButton',
  /** Test ID for the screen title. */
  TITLE: 'StorageFileDetail_Title',
  /** Test ID for the owner user row. */
  USER_ROW: 'StorageFileDetail_UserRow',
  /** Test ID for the copy URL button. */
  COPY_URL_BUTTON: 'StorageFileDetail_CopyUrlButton',
  /** Test ID for the delete button. */
  DELETE_BUTTON: 'StorageFileDetail_DeleteButton',
  /** Test ID for the delete error text container. */
  DELETE_ERROR_TEXT: 'StorageFileDetail_DeleteErrorText'
}

interface StorageFileDetailContentProps {
  strings?: StorageModuleStrings
  commonModuleStrings?: CommonModuleStrings
}

const StorageFileDetailContent: React.FC<StorageFileDetailContentProps> = ({
  strings = storageStrings,
  commonModuleStrings = commonStrings
}) => {
  const screenState = useStorageFileDetailStore((s) => s.screenState)
  const onCopyUrlClick = useStorageFileDetailStore((s) => s.onCopyUrlClick)
  const onDeleteClick = useStorageFileDetailStore((s) => s.onDeleteClick)
  const onDismissDeleteDialog = useStorageFileDetailStore((s) => s.onDismissDeleteDialog)
  const onConfirmDelete = useStorageFileDetailStore((s) => s.onConfirmDelete)
  const onUserClick = useStorageFileDetailStore((s) => s.onUserClick)
  const onBackClick = useStorageFileDetailStore((s) => s.onBackClick)
  const initScreen = useStorageFileDetailStore((s) => s.initScreen)
  const errorParser = useAppErrorParser()

  useEffect(() => {
    void initScreen()
  }, [initScreen])

  switch (screenState.status) {
    case StorageFileDetailStatus.LOADING:
      return <FullscreenLoading />

    case StorageFileDetailStatus.ERROR:
      return (
        <FullscreenError
          error={screenState.error}
          onRetry={initScreen}
          onBack={onBackClick}
          title={strings.ui.fileDetailTitle}
        />
      )

    case StorageFileDetailStatus.CONTENT: {
      const { file, copiedUrl, isDeleting, deleteError, showDeleteConfirmation } = screenState

      return (
        <div className="w-full h-full p-6 flex flex-col relative overflow-y-auto">
          <div className="w-full flex items-center justify-between relative mb-6">
            <CoreBackButton data-testid={StorageFileDetailTestTags.BACK_BUTTON} onClick={onBackClick} />
            <CoreScreenTitleText
              data-testid={StorageFileDetailTestTags.TITLE}
              text={strings.ui.fileDetailTitle}
              className="absolute left-1/2 -translate-x-1/2"
            />
            <div className="w-10" />
          </div>

          <div className="w-full max-w-lg mx-auto flex-1 flex flex-col gap-6">
            <div className="w-full h-64 rounded-xl bg-muted border border-border overflow-hidden flex items-center justify-center relative">
              {file.category === StorageCategory.IMAGE ? (
                <img src={file.fileUrl} alt={file.fileName} className="w-full h-full object-contain" />
              ) : file.category === StorageCategory.VIDEO ? (
                <video src={file.fileUrl} controls className="w-full h-full object-contain" />
              ) : (
                <CoreIcon src={icons.warning} size={64} className="text-muted-foreground" />
              )}
            </div>

            <div className="w-full flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">{strings.ui.fileName}</span>
                <span className="text-sm font-medium text-surface-foreground break-all">{file.fileName}</span>
              </div>

              {file.ownerUserId && (
                <div
                  onClick={onUserClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onUserClick()
                    }
                  }}
                  className="flex justify-between items-center text-sm p-2 rounded bg-muted/50 hover:bg-accent/40 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  data-testid={StorageFileDetailTestTags.USER_ROW}
                >
                  <span className="text-muted-foreground">{strings.ui.ownerUserId}</span>
                  <span className="font-medium text-surface-foreground">{file.ownerUserId}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{strings.ui.fileSize}</span>
                <span className="font-medium text-surface-foreground">{formatByteSize(file.fileSizeBytes, undefined, 2)}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{strings.ui.mimeType}</span>
                <span className="font-medium text-surface-foreground">{file.mimeType}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{strings.ui.category}</span>
                <span className="font-medium text-surface-foreground capitalize">{file.category}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{strings.ui.visibility}</span>
                <span className="font-medium text-surface-foreground capitalize">{file.visibility}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{commonStrings.ui.status}</span>
                <span className="font-medium text-surface-foreground capitalize">{file.status}</span>
              </div>
            </div>

            {deleteError && (
              <CoreErrorText
                data-testid={StorageFileDetailTestTags.DELETE_ERROR_TEXT}
                text={errorParser.parse(deleteError) ?? ''}
              />
            )}

            <div className="w-full flex flex-col gap-3">
              <CoreButton
                type="button"
                data-testid={StorageFileDetailTestTags.COPY_URL_BUTTON}
                label={copiedUrl ? strings.ui.urlCopied : strings.ui.copyFileUrl}
                onClick={onCopyUrlClick}
              />
              {file.status !== StorageFileStatus.DELETED && (
                <button
                  type="button"
                  data-testid={StorageFileDetailTestTags.DELETE_BUTTON}
                  disabled={isDeleting}
                  onClick={onDeleteClick}
                  className="w-full p-3 rounded-lg border border-error/30 bg-error/10 text-error font-semibold hover:bg-error/20 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {strings.ui.deleteFileAction}
                </button>
              )}
            </div>
          </div>

          {showDeleteConfirmation && (
            <div role="alertdialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
              <button
                type="button"
                tabIndex={-1}
                aria-label={commonModuleStrings.ui.no}
                onClick={onDismissDeleteDialog}
                className="absolute inset-0 bg-transparent cursor-default border-none outline-none"
              />
              <div className="relative z-10 bg-surface border border-border p-6 rounded-xl shadow-lg max-w-md w-full flex flex-col gap-4">
                <h3 className="text-lg font-bold text-surface-foreground">{strings.ui.deleteFile}</h3>
                <p className="text-sm text-muted-foreground">{strings.ui.deleteFileConfirm}</p>
                <div className="flex justify-end gap-2 pt-2">
                  <CoreTextButton label={commonModuleStrings.ui.no} onClick={onDismissDeleteDialog} />
                  <CoreTextButton label={strings.ui.deleteFile} onClick={() => void onConfirmDelete()} />
                </div>
              </div>
            </div>
          )}
        </div>
      )
    }
  }
}

/**
 * Props for {@link StorageFileDetailScreen}.
 */
export interface StorageFileDetailScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Dependencies required by storage file detail store. */
  dependencies: StorageFileDetailStoreDependencies
  /** Optional localized storage module strings override. */
  strings?: StorageModuleStrings
}

/**
 * Screen component displaying detailed information about a single storage file,
 * with actions for copying file URL and deleting the file.
 *
 * @param props - Component properties configuring dependencies and strings.
 * @param ref - Optional forwarding ref bound to root container element.
 * @returns React node rendering storage file detail screen.
 */
export const StorageFileDetailScreen = forwardRef<HTMLDivElement, StorageFileDetailScreenProps>(
  ({ dependencies, strings = storageStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <StorageFileDetailProvider dependencies={dependencies}>
          <StorageFileDetailContent strings={strings} />
        </StorageFileDetailProvider>
      </div>
    )
  }
)

StorageFileDetailScreen.displayName = 'StorageFileDetailScreen'
