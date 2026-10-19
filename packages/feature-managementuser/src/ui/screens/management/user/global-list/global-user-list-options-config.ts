import { AccountLockoutType, UserAccountStatus, UserFilterValues, UserRole, UserSortValues, CommonModuleStrings, commonStrings as globalCommonStrings } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingOptionsConfig } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ChoiceFilterPresentationStyle } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

export const getGlobalUserListingOptionsConfig = (
  commonStrings: CommonModuleStrings = globalCommonStrings
): ListingOptionsConfig => ({
  sortOptions: [
    {
      id: UserSortValues.UserSortBy.LAST_LOGIN_AT,
      title: commonStrings.ui.lastLoginAt
    },
    {
      id: UserSortValues.UserSortBy.LAST_ACTIVE_AT,
      title: commonStrings.ui.lastActiveAt
    },
    {
      id: UserSortValues.UserSortBy.SCHEDULED_PERMANENT_DELETION_AT,
      title: commonStrings.ui.scheduledPermanentDeletionAt
    },
    {
      id: UserSortValues.UserSortBy.ACCOUNT_LOCKOUT_TYPE,
      title: commonStrings.ui.lockoutType
    },
    {
      id: UserSortValues.UserSortBy.TEMPORARY_LOCKOUT_UNTIL,
      title: commonStrings.ui.lockoutUntil
    },
    {
      id: UserSortValues.UserSortBy.CREATED_AT,
      title: commonStrings.ui.createdAt
    },
    {
      id: UserSortValues.UserSortBy.UPDATED_AT,
      title: commonStrings.ui.updatedAt
    }
  ],
  filters: [
    {
      type: 'choice',
      id: UserFilterValues.UserFilterValues.ROLE,
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
      id: UserFilterValues.UserFilterValues.ACCOUNT_STATUS,
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
      id: UserFilterValues.UserFilterValues.ACCOUNT_LOCKOUT_TYPE,
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
      type: 'boolean',
      id: UserFilterValues.UserFilterValues.IS_TOTP_ENABLED,
      title: commonStrings.ui.totpEnabled
    },
    {
      type: 'number',
      id: UserFilterValues.UserFilterValues.AUTHORITY_LEVEL_FROM,
      title: commonStrings.ui.authorityLevelFrom,
      placeholder: '0'
    },
    {
      type: 'number',
      id: UserFilterValues.UserFilterValues.AUTHORITY_LEVEL_TO,
      title: commonStrings.ui.authorityLevelTo,
      placeholder: '100'
    }
  ]
})
