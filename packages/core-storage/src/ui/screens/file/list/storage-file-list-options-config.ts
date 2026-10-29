import type { ListingOptionsConfig } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ChoiceFilterPresentationStyle } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { CommonModuleStrings, StorageModuleStrings } from '@mudrichenkoevgeny/shared-foundation'
import {
  StorageFilterValues,
  StorageCategory,
  StorageFileVisibility,
  StorageFileStatus,
  StorageFileSortBy,
  commonStrings as globalCommonStrings,
  storageStrings as globalStorageStrings
} from '@mudrichenkoevgeny/shared-foundation'

/**
 * Constructs the listing options configuration (sort options and filter definitions)
 * for storage file lists.
 *
 * @param commonStrings - Optional localized common module strings dictionary override.
 * @param storageStrings - Optional localized storage module strings dictionary override.
 * @param includeOwnerFilter - Whether to include the ownerUserId text filter.
 * @returns Configured {@link ListingOptionsConfig} instance for sorting and filtering storage files.
 */
export const getStorageFileListOptionsConfig = (
  commonStrings: CommonModuleStrings = globalCommonStrings,
  storageStrings: StorageModuleStrings = globalStorageStrings,
  includeOwnerFilter = false
): ListingOptionsConfig => {
  const filters: ListingOptionsConfig['filters'] = []

  if (includeOwnerFilter) {
    filters.push({
      type: 'text',
      id: StorageFilterValues.StorageFileFilterValues.OWNER_USER_ID,
      title: storageStrings.ui.ownerUserId,
      placeholder: commonStrings.ui.searchPlaceholder
    })
  }

  filters.push(
    {
      type: 'text',
      id: StorageFilterValues.StorageFileFilterValues.FILE_NAME,
      title: storageStrings.ui.fileName,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: StorageFilterValues.StorageFileFilterValues.MIME_TYPE,
      title: storageStrings.ui.mimeType,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'choice',
      id: StorageFilterValues.StorageFileFilterValues.CATEGORY,
      title: storageStrings.ui.category,
      options: [
        { id: StorageCategory.IMAGE, title: storageStrings.ui.categoryImage },
        { id: StorageCategory.VIDEO, title: storageStrings.ui.categoryVideo },
        { id: StorageCategory.AUDIO, title: storageStrings.ui.categoryAudio },
        { id: StorageCategory.DOCUMENT, title: storageStrings.ui.categoryDocument },
        { id: StorageCategory.OTHER, title: storageStrings.ui.categoryOther }
      ],
      isMultiple: false,
      presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
    },
    {
      type: 'choice',
      id: StorageFilterValues.StorageFileFilterValues.VISIBILITY,
      title: storageStrings.ui.visibility,
      options: [
        { id: StorageFileVisibility.PUBLIC, title: storageStrings.ui.visibilityPublic },
        { id: StorageFileVisibility.PRIVATE, title: storageStrings.ui.visibilityPrivate }
      ],
      isMultiple: false,
      presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
    },
    {
      type: 'choice',
      id: StorageFilterValues.StorageFileFilterValues.STATUS,
      title: commonStrings.ui.status,
      options: [
        { id: StorageFileStatus.PENDING_UPLOAD, title: storageStrings.ui.statusPendingUpload },
        { id: StorageFileStatus.READY, title: storageStrings.ui.statusReady },
        { id: StorageFileStatus.DELETED, title: storageStrings.ui.statusDeleted },
        { id: StorageFileStatus.PROCESSING, title: storageStrings.ui.statusProcessing }
      ],
      isMultiple: true,
      presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
    }
  )

  return {
    sortOptions: [
      { id: StorageFileSortBy.CREATED_AT, title: commonStrings.ui.createdAt },
      { id: StorageFileSortBy.UPDATED_AT, title: commonStrings.ui.updatedAt },
      { id: StorageFileSortBy.FILE_NAME, title: storageStrings.ui.fileName },
      { id: StorageFileSortBy.FILE_SIZE_BYTES, title: storageStrings.ui.fileSize }
    ],
    filters
  }
}
