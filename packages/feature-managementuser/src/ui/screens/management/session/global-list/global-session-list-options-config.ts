import { ClientType, UserAuthProvider, UserRole, UserSessionFilterValues, UserSessionSortBy, CommonModuleStrings, commonStrings as globalCommonStrings } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingOptionsConfig } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ChoiceFilterPresentationStyle } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

/** Extended UserSessionFilterValues keys matching shared-foundation Kotlin source. */
export const SessionFilterValues = {
  ...UserSessionFilterValues,
  EXCLUDE_CLIENT_TYPE: 'exclude_client_type',
  IS_CLIENT_TYPE_SET: 'is_client_type_set',
  LANGUAGE: 'language',
  IS_LANGUAGE_SET: 'is_language_set',
  IS_DEVICE_ID_SET: 'is_device_id_set',
  IS_DEVICE_NAME_SET: 'is_device_name_set',
  IS_APP_VERSION_SET: 'is_app_version_set',
  IS_OPERATION_SYSTEM_VERSION_SET: 'is_operation_system_version_set'
} as const

/**
 * Constructs the listing options configuration for global session lists.
 *
 * @param commonStrings - Optional localized strings dictionary override.
 * @returns Configured {@link ListingOptionsConfig} instance for sorting and filtering sessions.
 */
export const getGlobalSessionListingOptionsConfig = (
  commonStrings: CommonModuleStrings = globalCommonStrings
): ListingOptionsConfig => ({
  sortOptions: [
    {
      id: UserSessionSortBy.LAST_ACCESSED_AT,
      title: commonStrings.ui.lastAccessedAt
    },
    {
      id: UserSessionSortBy.LAST_REAUTHENTICATED_AT,
      title: commonStrings.ui.lastReauthenticatedAt
    },
    {
      id: UserSessionSortBy.EXPIRES_AT,
      title: commonStrings.ui.expiresAt
    },
    {
      id: UserSessionSortBy.CREATED_AT,
      title: commonStrings.ui.createdAt
    },
    {
      id: UserSessionSortBy.UPDATED_AT,
      title: commonStrings.ui.updatedAt
    }
  ],
  filters: [
    {
      type: 'text',
      id: SessionFilterValues.SESSION_ID,
      title: commonStrings.ui.resourceId,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: SessionFilterValues.USER_ID,
      title: commonStrings.ui.userId,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'choice',
      id: SessionFilterValues.USER_ROLE,
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
      id: SessionFilterValues.EXCLUDE_USER_ROLE,
      title: `${commonStrings.ui.role} (${commonStrings.ui.exclude})`,
      options: [
        { id: UserRole.STAFF, title: commonStrings.ui.staff },
        { id: UserRole.ADMIN, title: commonStrings.ui.admin }
      ],
      isMultiple: true,
      presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
    },
    {
      type: 'text',
      id: SessionFilterValues.IDENTIFIER,
      title: commonStrings.ui.identifier,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: SessionFilterValues.IDENTIFIER_ID,
      title: commonStrings.ui.identifierId,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: SessionFilterValues.IDENTIFIER_DISPLAY_NAME,
      title: commonStrings.ui.identifier,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'choice',
      id: SessionFilterValues.IDENTIFIER_AUTH_PROVIDER,
      title: commonStrings.ui.authProvider,
      options: [
        { id: UserAuthProvider.EMAIL, title: commonStrings.ui.email },
        { id: UserAuthProvider.PHONE, title: commonStrings.ui.phone },
        { id: UserAuthProvider.GOOGLE, title: commonStrings.ui.google },
        { id: UserAuthProvider.APPLE, title: commonStrings.ui.apple }
      ],
      isMultiple: true,
      presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
    },
    {
      type: 'choice',
      id: SessionFilterValues.EXCLUDE_IDENTIFIER_AUTH_PROVIDER,
      title: `${commonStrings.ui.authProvider} (${commonStrings.ui.exclude})`,
      options: [
        { id: UserAuthProvider.EMAIL, title: commonStrings.ui.email },
        { id: UserAuthProvider.PHONE, title: commonStrings.ui.phone },
        { id: UserAuthProvider.GOOGLE, title: commonStrings.ui.google },
        { id: UserAuthProvider.APPLE, title: commonStrings.ui.apple }
      ],
      isMultiple: true,
      presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
    },
    {
      type: 'text',
      id: SessionFilterValues.DEVICE_ID,
      title: commonStrings.ui.deviceId,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'boolean',
      id: SessionFilterValues.IS_DEVICE_ID_SET,
      title: commonStrings.ui.isSet
    },
    {
      type: 'text',
      id: SessionFilterValues.DEVICE_NAME,
      title: commonStrings.ui.deviceName,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'boolean',
      id: SessionFilterValues.IS_DEVICE_NAME_SET,
      title: commonStrings.ui.isSet
    },
    {
      type: 'choice',
      id: SessionFilterValues.CLIENT_TYPE,
      title: commonStrings.ui.clientType,
      options: [
        { id: ClientType.ANDROID, title: commonStrings.ui.android },
        { id: ClientType.IOS, title: commonStrings.ui.ios },
        { id: ClientType.WEB, title: commonStrings.ui.web },
        { id: ClientType.DESKTOP, title: commonStrings.ui.desktop }
      ],
      isMultiple: true,
      presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
    },
    {
      type: 'choice',
      id: SessionFilterValues.EXCLUDE_CLIENT_TYPE,
      title: `${commonStrings.ui.clientType} (${commonStrings.ui.exclude})`,
      options: [
        { id: ClientType.ANDROID, title: commonStrings.ui.android },
        { id: ClientType.IOS, title: commonStrings.ui.ios },
        { id: ClientType.WEB, title: commonStrings.ui.web },
        { id: ClientType.DESKTOP, title: commonStrings.ui.desktop }
      ],
      isMultiple: true,
      presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
    },
    {
      type: 'boolean',
      id: SessionFilterValues.IS_CLIENT_TYPE_SET,
      title: commonStrings.ui.isSet
    },
    {
      type: 'text',
      id: SessionFilterValues.LANGUAGE,
      title: commonStrings.ui.language,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'boolean',
      id: SessionFilterValues.IS_LANGUAGE_SET,
      title: commonStrings.ui.isSet
    },
    {
      type: 'text',
      id: SessionFilterValues.APP_VERSION,
      title: commonStrings.ui.appVersion,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'boolean',
      id: SessionFilterValues.IS_APP_VERSION_SET,
      title: commonStrings.ui.isSet
    },
    {
      type: 'text',
      id: SessionFilterValues.OPERATION_SYSTEM_VERSION,
      title: commonStrings.ui.osVersion,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'boolean',
      id: SessionFilterValues.IS_OPERATION_SYSTEM_VERSION_SET,
      title: commonStrings.ui.isSet
    },
    {
      type: 'text',
      id: SessionFilterValues.USER_AGENT,
      title: commonStrings.ui.userAgent,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'boolean',
      id: SessionFilterValues.IS_USER_AGENT_SET,
      title: commonStrings.ui.isSet
    },
    {
      type: 'text',
      id: SessionFilterValues.IP_ADDRESS,
      title: commonStrings.ui.ipAddress,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'boolean',
      id: SessionFilterValues.IS_IP_ADDRESS_SET,
      title: commonStrings.ui.isSet
    },
    {
      type: 'text',
      id: SessionFilterValues.EXPIRES_AT_FROM,
      title: `${commonStrings.ui.expiresAt} (${commonStrings.ui.from})`,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: SessionFilterValues.EXPIRES_AT_TO,
      title: `${commonStrings.ui.expiresAt} (${commonStrings.ui.to})`,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: SessionFilterValues.LAST_ACCESSED_AT_FROM,
      title: `${commonStrings.ui.lastAccessedAt} (${commonStrings.ui.from})`,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: SessionFilterValues.LAST_ACCESSED_AT_TO,
      title: `${commonStrings.ui.lastAccessedAt} (${commonStrings.ui.to})`,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: SessionFilterValues.LAST_REAUTHENTICATED_AT_FROM,
      title: `${commonStrings.ui.lastReauthenticatedAt} (${commonStrings.ui.from})`,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: SessionFilterValues.LAST_REAUTHENTICATED_AT_TO,
      title: `${commonStrings.ui.lastReauthenticatedAt} (${commonStrings.ui.to})`,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: SessionFilterValues.CREATED_AT_FROM,
      title: `${commonStrings.ui.createdAt} (${commonStrings.ui.from})`,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: SessionFilterValues.CREATED_AT_TO,
      title: `${commonStrings.ui.createdAt} (${commonStrings.ui.to})`,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: SessionFilterValues.UPDATED_AT_FROM,
      title: `${commonStrings.ui.updatedAt} (${commonStrings.ui.from})`,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: SessionFilterValues.UPDATED_AT_TO,
      title: `${commonStrings.ui.updatedAt} (${commonStrings.ui.to})`,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'boolean',
      id: SessionFilterValues.IS_UPDATED_AT_SET,
      title: commonStrings.ui.isSet
    },
    {
      type: 'text',
      id: SessionFilterValues.SEARCH_QUERY,
      title: commonStrings.ui.searchPlaceholder,
      placeholder: commonStrings.ui.searchPlaceholder
    }
  ]
})
