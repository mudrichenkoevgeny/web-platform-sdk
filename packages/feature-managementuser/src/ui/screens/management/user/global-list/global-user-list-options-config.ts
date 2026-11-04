import {
  AccountLockoutType,
  UserAccountStatus,
  UserFilterValues,
  UserRole,
  UserSortBy,
  CommonModuleStrings,
  UserModuleStrings,
  StorageModuleStrings,
  commonStrings as globalCommonStrings,
  userStrings as globalUserStrings,
  storageStrings as globalStorageStrings
} from '@mudrichenkoevgeny/shared-foundation'
import type { ListingOptionsConfig } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ChoiceFilterPresentationStyle } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

function getStringProperty(target: object, propertyName: string, fallback: string): string {
  if (propertyName in target) {
    const val = Reflect.get(target, propertyName)
    if (typeof val === 'string') {
      return val
    }
  }
  return fallback
}

/**
 * Constructs the listing options configuration (sort options and filter definitions)
 * for global user lists.
 *
 * @param commonStrings - Optional localized common module strings dictionary override.
 * @param userStrings - Optional localized user module strings dictionary override.
 * @param storageStrings - Optional localized storage module strings dictionary override.
 * @returns Configured {@link ListingOptionsConfig} instance for sorting and filtering users.
 */
export const getGlobalUserListingOptionsConfig = (
  commonStrings: CommonModuleStrings = globalCommonStrings,
  userStrings: UserModuleStrings = globalUserStrings,
  storageStrings: StorageModuleStrings = globalStorageStrings
): ListingOptionsConfig => {
  const nicknameTitle = getStringProperty(userStrings.ui, 'nickname', 'Nickname')
  const displayNameTitle = getStringProperty(userStrings.ui, 'displayName', 'Display Name')
  const permissionsTitle = 'Permissions'

  return {
    sortOptions: [
      {
        id: UserSortBy.AUTHORITY_LEVEL,
        title: commonStrings.ui.authorityLevelFrom
      },
      {
        id: UserSortBy.LAST_LOGIN_AT,
        title: commonStrings.ui.lastLoginAt
      },
      {
        id: UserSortBy.LAST_ACTIVE_AT,
        title: commonStrings.ui.lastActiveAt
      },
      {
        id: UserSortBy.SCHEDULED_PERMANENT_DELETION_AT,
        title: commonStrings.ui.scheduledPermanentDeletionAt
      },
      {
        id: UserSortBy.TEMPORARY_LOCKOUT_UNTIL,
        title: commonStrings.ui.lockoutUntil
      },
      {
        id: UserSortBy.NICKNAME,
        title: nicknameTitle
      },
      {
        id: UserSortBy.DISPLAY_NAME,
        title: displayNameTitle
      },
      {
        id: UserSortBy.BIRTHDATE,
        title: userStrings.ui.birthdate
      },
      {
        id: UserSortBy.CREATED_AT,
        title: commonStrings.ui.createdAt
      },
      {
        id: UserSortBy.UPDATED_AT,
        title: commonStrings.ui.updatedAt
      }
    ],
    filters: [
      {
        type: 'text',
        id: UserFilterValues.USER_ID,
        title: commonStrings.ui.userId,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'text',
        id: UserFilterValues.NICKNAME,
        title: nicknameTitle,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'boolean',
        id: UserFilterValues.IS_NICKNAME_SET,
        title: commonStrings.ui.isSet
      },
      {
        type: 'text',
        id: UserFilterValues.DISPLAY_NAME,
        title: displayNameTitle,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'boolean',
        id: UserFilterValues.IS_DISPLAY_NAME_SET,
        title: commonStrings.ui.isSet
      },
      {
        type: 'boolean',
        id: UserFilterValues.IS_AVATAR_SET,
        title: commonStrings.ui.isSet
      },
      {
        type: 'text',
        id: UserFilterValues.SEARCH_QUERY,
        title: commonStrings.ui.searchPlaceholder,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'choice',
        id: UserFilterValues.ROLE,
        title: commonStrings.ui.role,
        options: [
          { id: UserRole.STAFF, title: commonStrings.ui.staff },
          { id: UserRole.ADMIN, title: commonStrings.ui.admin }
        ],
        isMultiple: true,
        presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
      },
      {
        type: 'choice',
        id: UserFilterValues.EXCLUDE_ROLE,
        title: `${commonStrings.ui.role} (${commonStrings.ui.exclude})`,
        options: [
          { id: UserRole.STAFF, title: commonStrings.ui.staff },
          { id: UserRole.ADMIN, title: commonStrings.ui.admin }
        ],
        isMultiple: true,
        presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
      },
      {
        type: 'choice',
        id: UserFilterValues.ACCOUNT_STATUS,
        title: commonStrings.ui.status,
        options: [
          { id: UserAccountStatus.ACTIVE, title: commonStrings.ui.active },
          { id: UserAccountStatus.READ_ONLY, title: commonStrings.ui.readOnly },
          { id: UserAccountStatus.BANNED, title: commonStrings.ui.banned },
          { id: UserAccountStatus.SECURITY_HOLD, title: commonStrings.ui.securityHold },
          { id: UserAccountStatus.PENDING_DELETION, title: commonStrings.ui.pendingDeletion }
        ],
        isMultiple: true,
        presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
      },
      {
        type: 'choice',
        id: UserFilterValues.EXCLUDE_ACCOUNT_STATUS,
        title: `${commonStrings.ui.status} (${commonStrings.ui.exclude})`,
        options: [
          { id: UserAccountStatus.ACTIVE, title: commonStrings.ui.active },
          { id: UserAccountStatus.READ_ONLY, title: commonStrings.ui.readOnly },
          { id: UserAccountStatus.BANNED, title: commonStrings.ui.banned },
          { id: UserAccountStatus.SECURITY_HOLD, title: commonStrings.ui.securityHold },
          { id: UserAccountStatus.PENDING_DELETION, title: commonStrings.ui.pendingDeletion }
        ],
        isMultiple: true,
        presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
      },
      {
        type: 'choice',
        id: UserFilterValues.ACCOUNT_STATUS_ON_RESTORE,
        title: commonStrings.ui.status,
        options: [
          { id: UserAccountStatus.ACTIVE, title: commonStrings.ui.active },
          { id: UserAccountStatus.READ_ONLY, title: commonStrings.ui.readOnly }
        ],
        isMultiple: true,
        presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
      },
      {
        type: 'choice',
        id: UserFilterValues.EXCLUDE_ACCOUNT_STATUS_ON_RESTORE,
        title: `${commonStrings.ui.status} (${commonStrings.ui.exclude})`,
        options: [
          { id: UserAccountStatus.ACTIVE, title: commonStrings.ui.active },
          { id: UserAccountStatus.READ_ONLY, title: commonStrings.ui.readOnly }
        ],
        isMultiple: true,
        presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
      },
      {
        type: 'boolean',
        id: UserFilterValues.IS_ACCOUNT_STATUS_ON_RESTORE_SET,
        title: commonStrings.ui.isSet
      },
      {
        type: 'choice',
        id: UserFilterValues.ACCOUNT_LOCKOUT_TYPE,
        title: commonStrings.ui.lockoutType,
        options: [
          { id: AccountLockoutType.NONE, title: commonStrings.ui.lockoutNone },
          { id: AccountLockoutType.INDEFINITE, title: commonStrings.ui.lockoutIndefinite },
          { id: AccountLockoutType.TEMPORARY, title: commonStrings.ui.lockoutTemporary }
        ],
        isMultiple: true,
        presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
      },
      {
        type: 'choice',
        id: UserFilterValues.EXCLUDE_ACCOUNT_LOCKOUT_TYPE,
        title: `${commonStrings.ui.lockoutType} (${commonStrings.ui.exclude})`,
        options: [
          { id: AccountLockoutType.NONE, title: commonStrings.ui.lockoutNone },
          { id: AccountLockoutType.INDEFINITE, title: commonStrings.ui.lockoutIndefinite },
          { id: AccountLockoutType.TEMPORARY, title: commonStrings.ui.lockoutTemporary }
        ],
        isMultiple: true,
        presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
      },
      {
        type: 'boolean',
        id: UserFilterValues.IS_TOTP_ENABLED,
        title: commonStrings.ui.totpEnabled
      },
      {
        type: 'number',
        id: UserFilterValues.AUTHORITY_LEVEL_FROM,
        title: commonStrings.ui.authorityLevelFrom,
        placeholder: '0'
      },
      {
        type: 'number',
        id: UserFilterValues.AUTHORITY_LEVEL_TO,
        title: commonStrings.ui.authorityLevelTo,
        placeholder: '100'
      },
      {
        type: 'text',
        id: UserFilterValues.PERMISSION_CODES,
        title: permissionsTitle,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'text',
        id: UserFilterValues.EXCLUDE_PERMISSION_CODES,
        title: `${permissionsTitle} (${commonStrings.ui.exclude})`,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'text',
        id: UserFilterValues.TEMPORARY_LOCKOUT_UNTIL_FROM,
        title: `${commonStrings.ui.lockoutUntil} (${commonStrings.ui.from})`,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'text',
        id: UserFilterValues.TEMPORARY_LOCKOUT_UNTIL_TO,
        title: `${commonStrings.ui.lockoutUntil} (${commonStrings.ui.to})`,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'boolean',
        id: UserFilterValues.IS_TEMPORARY_LOCKOUT_UNTIL_SET,
        title: commonStrings.ui.isSet
      },
      {
        type: 'text',
        id: UserFilterValues.LAST_LOGIN_AT_FROM,
        title: `${commonStrings.ui.lastLoginAt} (${commonStrings.ui.from})`,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'text',
        id: UserFilterValues.LAST_LOGIN_AT_TO,
        title: `${commonStrings.ui.lastLoginAt} (${commonStrings.ui.to})`,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'boolean',
        id: UserFilterValues.IS_LAST_LOGIN_AT_SET,
        title: commonStrings.ui.isSet
      },
      {
        type: 'text',
        id: UserFilterValues.LAST_ACTIVE_AT_FROM,
        title: `${commonStrings.ui.lastActiveAt} (${commonStrings.ui.from})`,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'text',
        id: UserFilterValues.LAST_ACTIVE_AT_TO,
        title: `${commonStrings.ui.lastActiveAt} (${commonStrings.ui.to})`,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'boolean',
        id: UserFilterValues.IS_LAST_ACTIVE_AT_SET,
        title: commonStrings.ui.isSet
      },
      {
        type: 'text',
        id: UserFilterValues.SCHEDULED_PERMANENT_DELETION_AT_FROM,
        title: `${commonStrings.ui.scheduledPermanentDeletionAt} (${commonStrings.ui.from})`,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'text',
        id: UserFilterValues.SCHEDULED_PERMANENT_DELETION_AT_TO,
        title: `${commonStrings.ui.scheduledPermanentDeletionAt} (${commonStrings.ui.to})`,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'boolean',
        id: UserFilterValues.IS_SCHEDULED_PERMANENT_DELETION_AT_SET,
        title: commonStrings.ui.isSet
      },
      {
        type: 'number',
        id: UserFilterValues.STORAGE_QUOTA_BYTES_FROM,
        title: `${storageStrings.ui.storageQuotaBytes} (${commonStrings.ui.from})`,
        placeholder: '0'
      },
      {
        type: 'number',
        id: UserFilterValues.STORAGE_QUOTA_BYTES_TO,
        title: `${storageStrings.ui.storageQuotaBytes} (${commonStrings.ui.to})`,
        placeholder: '0'
      },
      {
        type: 'boolean',
        id: UserFilterValues.IS_STORAGE_QUOTA_BYTES_SET,
        title: commonStrings.ui.isSet
      },
      {
        type: 'number',
        id: UserFilterValues.STORAGE_MAX_UPLOAD_SIZE_BYTES_FROM,
        title: `${storageStrings.ui.storageMaxUploadSizeBytes} (${commonStrings.ui.from})`,
        placeholder: '0'
      },
      {
        type: 'number',
        id: UserFilterValues.STORAGE_MAX_UPLOAD_SIZE_BYTES_TO,
        title: `${storageStrings.ui.storageMaxUploadSizeBytes} (${commonStrings.ui.to})`,
        placeholder: '0'
      },
      {
        type: 'boolean',
        id: UserFilterValues.IS_STORAGE_MAX_UPLOAD_SIZE_BYTES_SET,
        title: commonStrings.ui.isSet
      },
      {
        type: 'number',
        id: UserFilterValues.STORAGE_MAX_PENDING_UPLOADS_FROM,
        title: `${storageStrings.ui.storageMaxPendingUploads} (${commonStrings.ui.from})`,
        placeholder: '0'
      },
      {
        type: 'number',
        id: UserFilterValues.STORAGE_MAX_PENDING_UPLOADS_TO,
        title: `${storageStrings.ui.storageMaxPendingUploads} (${commonStrings.ui.to})`,
        placeholder: '0'
      },
      {
        type: 'boolean',
        id: UserFilterValues.IS_STORAGE_MAX_PENDING_UPLOADS_SET,
        title: commonStrings.ui.isSet
      },
      {
        type: 'boolean',
        id: UserFilterValues.IS_STORAGE_CONFIGURATION_SET,
        title: commonStrings.ui.isSet
      },
      {
        type: 'number',
        id: UserFilterValues.BIRTHDATE_FROM,
        title: `${userStrings.ui.birthdate} (${commonStrings.ui.from})`,
        placeholder: '0'
      },
      {
        type: 'number',
        id: UserFilterValues.BIRTHDATE_TO,
        title: `${userStrings.ui.birthdate} (${commonStrings.ui.to})`,
        placeholder: '0'
      },
      {
        type: 'boolean',
        id: UserFilterValues.IS_BIRTHDATE_SET,
        title: commonStrings.ui.isSet
      },
      {
        type: 'text',
        id: UserFilterValues.CREATED_AT_FROM,
        title: `${commonStrings.ui.createdAt} (${commonStrings.ui.from})`,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'text',
        id: UserFilterValues.CREATED_AT_TO,
        title: `${commonStrings.ui.createdAt} (${commonStrings.ui.to})`,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'text',
        id: UserFilterValues.UPDATED_AT_FROM,
        title: `${commonStrings.ui.updatedAt} (${commonStrings.ui.from})`,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'text',
        id: UserFilterValues.UPDATED_AT_TO,
        title: `${commonStrings.ui.updatedAt} (${commonStrings.ui.to})`,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'boolean',
        id: UserFilterValues.IS_UPDATED_AT_SET,
        title: commonStrings.ui.isSet
      }
    ]
  }
}
