import { ClientType, UserAuthProvider, UserFilterValues, UserRole, UserSortValues } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingOptionsConfig } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ChoiceFilterPresentationStyle } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enManagementUserStrings } from '@/locales/index'
import type { FeatureManagementUserStrings } from '@/locales/index'

export const getGlobalSessionListingOptionsConfig = (
  strings: FeatureManagementUserStrings = enManagementUserStrings
): ListingOptionsConfig => ({
  sortOptions: [
    {
      id: UserSortValues.UserSessionSortBy.LAST_ACCESSED_AT,
      title: strings.ui_common_last_accessed_at
    },
    {
      id: UserSortValues.UserSessionSortBy.LAST_REAUTHENTICATED_AT,
      title: strings.ui_common_last_reauthenticated_at
    },
    {
      id: UserSortValues.UserSessionSortBy.EXPIRES_AT,
      title: strings.ui_common_expires_at
    },
    {
      id: UserSortValues.UserSessionSortBy.CREATED_AT,
      title: strings.ui_common_created_at
    },
    {
      id: UserSortValues.UserSessionSortBy.UPDATED_AT,
      title: strings.ui_common_updated_at
    }
  ],
  filters: [
    {
      type: 'choice',
      id: UserFilterValues.UserSessionFilterValues.USER_ROLE,
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
      id: UserFilterValues.UserSessionFilterValues.USER_AUTH_PROVIDER,
      title: strings.ui_common_auth_provider,
      options: [
        { id: UserAuthProvider.EMAIL, title: strings.ui_common_email },
        { id: UserAuthProvider.PHONE, title: strings.ui_common_phone },
        { id: UserAuthProvider.GOOGLE, title: strings.ui_common_google },
        { id: UserAuthProvider.APPLE, title: strings.ui_common_apple }
      ],
      isMultiple: true,
      presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
    },
    {
      type: 'choice',
      id: UserFilterValues.UserSessionFilterValues.CLIENT_TYPE,
      title: strings.ui_common_client_type,
      options: [
        { id: ClientType.ANDROID, title: strings.ui_common_android },
        { id: ClientType.IOS, title: strings.ui_common_ios },
        { id: ClientType.WEB, title: strings.ui_common_web },
        { id: ClientType.DESKTOP, title: strings.ui_common_desktop }
      ],
      isMultiple: true,
      presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
    },
    {
      type: 'text',
      id: UserFilterValues.UserSessionFilterValues.USER_ID,
      title: strings.ui_common_user_id,
      placeholder: strings.ui_common_search_placeholder
    },
    {
      type: 'text',
      id: UserFilterValues.UserSessionFilterValues.IDENTIFIER,
      title: strings.ui_common_identifier,
      placeholder: strings.ui_common_search_placeholder
    },
    {
      type: 'text',
      id: UserFilterValues.UserSessionFilterValues.IDENTIFIER_ID,
      title: strings.ui_common_identifier_id,
      placeholder: strings.ui_common_search_placeholder
    },
    {
      type: 'text',
      id: UserFilterValues.UserSessionFilterValues.IP_ADDRESS,
      title: strings.ui_common_ip_address,
      placeholder: strings.ui_common_search_placeholder
    },
    {
      type: 'text',
      id: UserFilterValues.UserSessionFilterValues.USER_AGENT,
      title: strings.ui_common_user_agent,
      placeholder: strings.ui_common_search_placeholder
    },
    {
      type: 'text',
      id: UserFilterValues.UserSessionFilterValues.LANGUAGE,
      title: strings.ui_common_language,
      placeholder: strings.ui_common_search_placeholder
    },
    {
      type: 'text',
      id: UserFilterValues.UserSessionFilterValues.DEVICE_ID,
      title: strings.ui_common_device_id,
      placeholder: strings.ui_common_search_placeholder
    },
    {
      type: 'text',
      id: UserFilterValues.UserSessionFilterValues.DEVICE_NAME,
      title: strings.ui_common_device_name,
      placeholder: strings.ui_common_search_placeholder
    },
    {
      type: 'text',
      id: UserFilterValues.UserSessionFilterValues.APP_VERSION,
      title: strings.ui_common_app_version,
      placeholder: strings.ui_common_search_placeholder
    },
    {
      type: 'text',
      id: UserFilterValues.UserSessionFilterValues.OPERATION_SYSTEM_VERSION,
      title: strings.ui_common_os_version,
      placeholder: strings.ui_common_search_placeholder
    }
  ]
})
