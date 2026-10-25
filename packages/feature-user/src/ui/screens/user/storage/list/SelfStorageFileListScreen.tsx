import React, { forwardRef, useEffect } from 'react'
import { StorageModuleStrings, storageStrings, commonStrings } from '@mudrichenkoevgeny/shared-foundation'
import {
  cn,
  CoreBackButton,
  CoreButton,
  CoreErrorText,
  CoreScreenTitleText,
  CoreTextButton,
  FullscreenError,
  FullscreenLoading,
  hasMorePages,
  ListingEmptyState,
  useAppErrorParser,
  useInfiniteScroll
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { StorageFileItem } from '@/ui/components/storage/item/StorageFileItem'
import {
  SelfStorageFileListProvider,
  SelfStorageFileListStatus,
  useSelfStorageFileListStore
} from '@/ui/screens/user/storage/list/self-storage-file-list-store'
import type { SelfStorageFileListStoreDependencies } from '@/ui/screens/user/storage/list/self-storage-file-list-store'

/**
 * DOM data-testid tags for UI testing {@link SelfStorageFileListScreen}.
 */
export const SelfStorageFileListTestTags = {
  TITLE: 'SelfStorageFileList_Title',
  BACK_BUTTON: 'SelfStorageFileList_BackButton',
  REFRESH_BUTTON: 'SelfStorageFileList_RefreshButton',
  UPLOAD_BUTTON: 'SelfStorageFileList_UploadButton',
  GLOBAL_ERROR_TEXT: 'SelfStorageFileList_GlobalErrorText',
  FILE_LIST: 'SelfStorageFileList_List',
  ACTION_ERROR_TEXT: 'SelfStorageFileList_ActionErrorText'
}

const SelfStorageFileListContent: React.FC<{ strings?: StorageModuleStrings }> = ({
  strings = storageStrings
}) => {
  const screenState = useSelfStorageFileListStore((s) => s.screenState)
  const onRefresh = useSelfStorageFileListStore((s) => s.onRefresh)
  const onFileClick = useSelfStorageFileListStore((s) => s.onFileClick)
  const onDeleteFileClick = useSelfStorageFileListStore((s) => s.onDeleteFileClick)
  const onLoadNextPage = useSelfStorageFileListStore((s) => s.onLoadNextPage)
  const onUploadClick = useSelfStorageFileListStore((s) => s.onUploadClick)
  const onBackClick = useSelfStorageFileListStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  const isContent = screenState.status === SelfStorageFileListStatus.CONTENT
  const hasMore = isContent ? hasMorePages(screenState.paging) : false
  const isNextPageLoading = isContent ? Boolean(screenState.paging.isNextPageLoading) : false

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onLoadMore: onLoadNextPage,
    hasMore,
    isLoading: isNextPageLoading
  })

  switch (screenState.status) {
    case SelfStorageFileListStatus.LOADING:
      return <FullscreenLoading />

    case SelfStorageFileListStatus.ERROR:
      return (
        <FullscreenError
          data-testid={SelfStorageFileListTestTags.GLOBAL_ERROR_TEXT}
          error={screenState.error}
          onRetry={onRefresh}
          onBack={onBackClick}
          title={strings.ui.files}
        />
      )

    case SelfStorageFileListStatus.CONTENT: {
      const { items, actionLoading, actionError } = screenState

      return (
        <div className="w-full h-full p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="w-full flex items-center justify-between relative mb-4">
            <CoreBackButton
              onClick={onBackClick}
              data-testid={SelfStorageFileListTestTags.BACK_BUTTON}
            />
            <CoreScreenTitleText
              text={strings.ui.files}
              className="absolute left-1/2 -translate-x-1/2"
              data-testid={SelfStorageFileListTestTags.TITLE}
            />
            <CoreTextButton
              type="button"
              label={commonStrings.ui.refresh}
              onClick={onRefresh}
              disabled={actionLoading}
              data-testid={SelfStorageFileListTestTags.REFRESH_BUTTON}
            />
          </div>

          <div
            className="w-full flex-1 overflow-y-auto flex flex-col gap-3 my-auto max-w-md mx-auto pr-1"
            data-testid={SelfStorageFileListTestTags.FILE_LIST}
          >
            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <ListingEmptyState />
              </div>
            ) : (
              items.map((file) => {
                const fileId = file.fileId
                return (
                  <StorageFileItem
                    key={fileId}
                    file={file}
                    enabled={!actionLoading}
                    onFileClick={() => onFileClick(fileId)}
                    onDeleteClick={() => onDeleteFileClick(fileId)}
                  />
                )
              })
            )}

            {hasMore && <div ref={sentinelRef} className="h-4 w-full" />}

            {isNextPageLoading && (
              <div className="w-full py-2 text-center text-xs text-muted-foreground">
                {commonStrings.ui.loading}
              </div>
            )}
          </div>

          <div className="w-full max-w-md mx-auto pt-4 flex flex-col gap-2">
            <CoreButton
              type="button"
              label={strings.ui.uploadFileAction}
              onClick={onUploadClick}
              disabled={actionLoading}
              data-testid={SelfStorageFileListTestTags.UPLOAD_BUTTON}
            />

            {actionError && (
              <CoreErrorText
                text={errorParser.parse(actionError) ?? ''}
                data-testid={SelfStorageFileListTestTags.ACTION_ERROR_TEXT}
              />
            )}
          </div>
        </div>
      )
    }
  }
}

const SelfStorageFileListController: React.FC<{ strings?: StorageModuleStrings }> = ({
  strings
}) => {
  const loadFiles = useSelfStorageFileListStore((s) => s.loadFiles)

  useEffect(() => {
    loadFiles()
  }, [loadFiles])

  return <SelfStorageFileListContent strings={strings} />
}

/**
 * Props for {@link SelfStorageFileListScreen}.
 */
export interface SelfStorageFileListScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Injected store dependencies. */
  dependencies: SelfStorageFileListStoreDependencies
  /** Optional localized strings override. */
  strings?: StorageModuleStrings
}

/**
 * Personal storage file list screen component.
 */
export const SelfStorageFileListScreen = forwardRef<HTMLDivElement, SelfStorageFileListScreenProps>(
  ({ dependencies, strings = storageStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <SelfStorageFileListProvider dependencies={dependencies}>
          <SelfStorageFileListController strings={strings} />
        </SelfStorageFileListProvider>
      </div>
    )
  }
)

SelfStorageFileListScreen.displayName = 'SelfStorageFileListScreen'
