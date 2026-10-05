import { ClientType, UserAuthProvider, UserRole, UserSortValues } from '@mudrichenkoevgeny/shared-foundation'
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
      id: 'userRole',
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
      id: 'userAuthProvider',
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
      id: 'clientType',
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
      id: 'userId',
      title: strings.ui_common_user_id,
      placeholder: strings.ui_common_search_placeholder
    },
    {
      type: 'text',
      id: 'identifier',
      title: strings.ui_common_identifier,
      placeholder: strings.ui_common_search_placeholder
    },
    {
      type: 'text',
      id: 'identifierId',
      title: strings.ui_common_identifier_id,
      placeholder: strings.ui_common_search_placeholder
    },
    {
      type: 'text',
      id: 'ipAddress',
      title: strings.ui_common_ip_address,
      placeholder: strings.ui_common_search_placeholder
    },
    {
      type: 'text',
      id: 'userAgent',
      title: strings.ui_common_user_agent,
      placeholder: strings.ui_common_search_placeholder
    },
    {
      type: 'text',
      id: 'language',
      title: strings.ui_common_language,
      placeholder: strings.ui_common_search_placeholder
    },
    {
      type: 'text',
      id: 'deviceId',
      title: strings.ui_common_device_id,
      placeholder: strings.ui_common_search_placeholder
    },
    {
      type: 'text',
      id: 'deviceName',
      title: strings.ui_common_device_name,
      placeholder: strings.ui_common_search_placeholder
    },
    {
      type: 'text',
      id: 'appVersion',
      title: strings.ui_common_app_version,
      placeholder: strings.ui_common_search_placeholder
    },
    {
      type: 'text',
      id: 'operationSystemVersion',
      title: strings.ui_common_os_version,
      placeholder: strings.ui_common_search_placeholder
    }
  ]
})
