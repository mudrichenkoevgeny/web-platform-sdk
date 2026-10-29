import React, { forwardRef } from 'react'
import { StorageModuleStrings, storageStrings } from '@mudrichenkoevgeny/shared-foundation'
import type { StorageFileUploadUiConfig } from '@mudrichenkoevgeny/shared-foundation'
import {
  cn,
  CoreBackButton,
  CoreScreenTitleText
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { StorageFileUploadArea } from '@/ui/components/file/upload/StorageFileUploadArea'
import type { StorageFileUploadStoreDependencies } from '@/ui/components/file/upload/storage-file-upload-store'

/**
 * DOM data-testid tags for UI testing {@link StorageFileUploadScreen}.
 */
export const StorageFileUploadTestTags = {
  /** Test ID for the screen back button. */
  BACK_BUTTON: 'StorageFileUpload_BackButton',
  /** Test ID for the screen title element. */
  TITLE: 'StorageFileUpload_Title'
}

/**
 * Props for {@link StorageFileUploadScreen}.
 */
export interface StorageFileUploadScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Dependencies required by storage file upload store. */
  dependencies: StorageFileUploadStoreDependencies
  /** Configuration constraints for the upload area. */
  config: StorageFileUploadUiConfig
  /** Optional localized storage module strings override. */
  strings?: StorageModuleStrings
}

/**
 * Screen component providing UI wrapper for selecting and uploading storage files.
 *
 * @param props - Component properties for configuring dependencies, strings, and configuration.
 * @param ref - Optional forwarding ref bound to root container element.
 * @returns React node rendering storage file upload screen wrapper.
 */
export const StorageFileUploadScreen = forwardRef<HTMLDivElement, StorageFileUploadScreenProps>(
  ({ dependencies, config, strings = storageStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full p-6 flex flex-col relative overflow-y-auto', className)} {...rest}>
        <div className="w-full flex items-center justify-between relative mb-6">
          <CoreBackButton
            data-testid={StorageFileUploadTestTags.BACK_BUTTON}
            onClick={() => dependencies.onBack?.()}
          />
          <CoreScreenTitleText
            data-testid={StorageFileUploadTestTags.TITLE}
            text={strings.ui.fileUploadTitle}
            className="absolute left-1/2 -translate-x-1/2"
          />
          <div className="w-10" />
        </div>

        <div className="w-full max-w-lg mx-auto flex-1 flex flex-col gap-6">
          <StorageFileUploadArea
            dependencies={dependencies}
            config={config}
            strings={strings}
          />
        </div>
      </div>
    )
  }
)

StorageFileUploadScreen.displayName = 'StorageFileUploadScreen'
