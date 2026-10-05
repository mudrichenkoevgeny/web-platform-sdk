import { AccountLockoutType, UserAccountStatus, UserRole, UserSortValues } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingOptionsConfig } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ChoiceFilterPresentationStyle } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enManagementUserStrings } from '@/locales/index'
import type { FeatureManagementUserStrings } from '@/locales/index'

export const getGlobalUserListingOptionsConfig = (
  strings: FeatureManagementUserStrings = enManagementUserStrings
): ListingOptionsConfig => ({
  sortOptions: [
    {
      id: UserSortValues.UserSortBy.LAST_LOGIN_AT,
      title: strings.ui_common_last_login_at
    },
    {
      id: UserSortValues.UserSortBy.LAST_ACTIVE_AT,
      title: strings.ui_common_last_active_at
    },
    {
      id: UserSortValues.UserSortBy.SCHEDULED_PERMANENT_DELETION_AT,
      title: strings.ui_common_scheduled_permanent_deletion_at
    },
    {
      id: UserSortValues.UserSortBy.ACCOUNT_LOCKOUT_TYPE,
      title: strings.ui_common_lockout_type
    },
    {
      id: UserSortValues.UserSortBy.TEMPORARY_LOCKOUT_UNTIL,
      title: strings.ui_common_lockout_until
    },
    {
      id: UserSortValues.UserSortBy.CREATED_AT,
      title: strings.ui_common_created_at
    },
    {
      id: UserSortValues.UserSortBy.UPDATED_AT,
      title: strings.ui_common_updated_at
    }
  ],
  filters: [
    {
      type: 'choice',
      id: 'role',
      title: strings.ui_common_role,
      options: [
        { id: UserRole.STAFF, title: strings.ui_common_staff },
        { id: UserRole.ADMIN, title: strings.ui_common_admin }
      ],
      isMultiple: true,
      presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
    },
    {
      type: 'choice',
      id: 'accountStatus',
      title: strings.ui_common_status,
      options: [
        { id: UserAccountStatus.ACTIVE, title: strings.ui_common_active },
        { id: UserAccountStatus.READ_ONLY, title: strings.ui_common_read_only },
        { id: UserAccountStatus.BANNED, title: strings.ui_common_banned },
        { id: UserAccountStatus.SECURITY_HOLD, title: strings.ui_common_security_hold },
        { id: UserAccountStatus.PENDING_DELETION, title: strings.ui_common_pending_deletion }
      ],
      isMultiple: true,
      presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
    },
    {
      type: 'choice',
      id: 'accountLockoutType',
      title: strings.ui_common_lockout_type,
      options: [
        { id: AccountLockoutType.NONE, title: strings.ui_common_lockout_none },
        { id: AccountLockoutType.INDEFINITE, title: strings.ui_common_lockout_indefinite },
        { id: AccountLockoutType.TEMPORARY, title: strings.ui_common_lockout_temporary }
      ],
      isMultiple: true,
      presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
    },
    {
      type: 'boolean',
      id: 'isTotpEnabled',
      title: strings.ui_common_totp_enabled
    },
    {
      type: 'number',
      id: 'authorityLevelFrom',
      title: strings.ui_common_authority_level_from,
      placeholder: '0'
    },
    {
      type: 'number',
      id: 'authorityLevelTo',
      title: strings.ui_common_authority_level_to,
      placeholder: '100'
    }
  ]
})
