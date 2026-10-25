import {
  ListingOptionsPanelConfig,
  CommonModuleStrings
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  StorageFilterValues,
  StorageCategory,
  StorageFileVisibility,
  StorageFileStatus,
  StorageFileSortBy,
  StorageModuleStrings,
  UserModuleStrings,
  userStrings as globalUserStrings
} from '@mudrichenkoevgeny/shared-foundation'

/**
 * Constructs the listing options panel configuration (sort options and filter sections)
 * for administrative global storage file lists.
 *
 * @param commonStrings - Localized common module strings dictionary.
 * @param storageStrings - Localized storage module strings dictionary.
 * @param userStrings - Optional localized user module strings dictionary override.
 * @returns Configured {@link ListingOptionsPanelConfig} instance for sorting and filtering global storage files.
 */
export const getGlobalStorageFileListOptionsConfig = (
  commonStrings: CommonModuleStrings,
  storageStrings: StorageModuleStrings,
  userStrings: UserModuleStrings = globalUserStrings
): ListingOptionsPanelConfig => {
  return {
    sortConfig: {
      options: [
        { id: StorageFileSortBy.CREATED_AT, label: storageStrings.ui.sortByCreatedAt },
        { id: StorageFileSortBy.UPDATED_AT, label: storageStrings.ui.sortByUpdatedAt },
        { id: StorageFileSortBy.FILE_NAME, label: storageStrings.ui.sortByFileName },
        { id: StorageFileSortBy.FILE_SIZE_BYTES, label: storageStrings.ui.sortByFileSizeBytes }
      ]
    },
    filterConfig: {
      sections: [
        {
          id: StorageFilterValues.StorageFileFilterValues.OWNER_USER_ID,
          title: storageStrings.ui.ownerUserId,
          options: [],
          type: 'text'
        },
        {
          id: StorageFilterValues.StorageFileFilterValues.CATEGORY,
          title: storageStrings.ui.category,
          options: [
            { id: StorageCategory.IMAGE, label: storageStrings.ui.categoryImage },
            { id: StorageCategory.VIDEO, label: storageStrings.ui.categoryVideo },
            { id: StorageCategory.AUDIO, label: storageStrings.ui.categoryAudio },
            { id: StorageCategory.DOCUMENT, label: storageStrings.ui.categoryDocument },
            { id: StorageCategory.OTHER, label: storageStrings.ui.categoryOther }
          ],
          type: 'radio'
        },
        {
          id: StorageFilterValues.StorageFileFilterValues.VISIBILITY,
          title: storageStrings.ui.visibility,
          options: [
            { id: StorageFileVisibility.PUBLIC, label: storageStrings.ui.visibilityPublic },
            { id: StorageFileVisibility.PRIVATE, label: storageStrings.ui.visibilityPrivate }
          ],
          type: 'radio'
        },
        {
          id: StorageFilterValues.StorageFileFilterValues.STATUS,
          title: commonStrings.ui.status,
          options: [
            { id: StorageFileStatus.PENDING_UPLOAD, label: storageStrings.ui.statusPendingUpload },
            { id: StorageFileStatus.READY, label: storageStrings.ui.statusReady },
            { id: StorageFileStatus.DELETED, label: storageStrings.ui.statusDeleted },
            { id: StorageFileStatus.PROCESSING, label: storageStrings.ui.statusProcessing }
          ],
          type: 'radio'
        },
        {
          id: StorageFilterValues.StorageFileFilterValues.MIME_TYPE,
          title: storageStrings.ui.mimeType,
          options: [],
          type: 'text'
        },
        {
          id: StorageFilterValues.StorageFileFilterValues.FILE_NAME,
          title: storageStrings.ui.fileName,
          options: [],
          type: 'text'
        }
      ]
    },
    strings: {
      title: userStrings.ui.filter,
      apply: commonStrings.ui.apply,
      sortSectionTitle: commonStrings.ui.sortBy,
      filterSectionTitle: commonStrings.ui.filters
    }
  }
}
