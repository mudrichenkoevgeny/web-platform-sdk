import { ClientType, UserAuthProvider, UserFilterValues, UserRole, UserSortValues, CommonModuleStrings } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingOptionsConfig } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ChoiceFilterPresentationStyle } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

const defaultCommonStrings = new CommonModuleStrings()

export const getGlobalSessionListingOptionsConfig = (
  commonStrings: CommonModuleStrings = defaultCommonStrings
): ListingOptionsConfig => ({
  sortOptions: [
    {
      id: UserSortValues.UserSessionSortBy.LAST_ACCESSED_AT,
      title: commonStrings.ui.lastAccessedAt
    },
    {
      id: UserSortValues.UserSessionSortBy.LAST_REAUTHENTICATED_AT,
      title: commonStrings.ui.lastReauthenticatedAt
    },
    {
      id: UserSortValues.UserSessionSortBy.EXPIRES_AT,
      title: commonStrings.ui.expiresAt
    },
    {
      id: UserSortValues.UserSessionSortBy.CREATED_AT,
      title: commonStrings.ui.createdAt
    },
    {
      id: UserSortValues.UserSessionSortBy.UPDATED_AT,
      title: commonStrings.ui.updatedAt
    }
  ],
  filters: [
    {
      type: 'choice',
      id: UserFilterValues.UserSessionFilterValues.USER_ROLE,
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
      id: UserFilterValues.UserSessionFilterValues.USER_AUTH_PROVIDER,
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
      id: UserFilterValues.UserSessionFilterValues.CLIENT_TYPE,
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
      type: 'text',
      id: UserFilterValues.UserSessionFilterValues.USER_ID,
      title: commonStrings.ui.userId,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: UserFilterValues.UserSessionFilterValues.IDENTIFIER,
      title: commonStrings.ui.identifier,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: UserFilterValues.UserSessionFilterValues.IDENTIFIER_ID,
      title: commonStrings.ui.identifierId,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: UserFilterValues.UserSessionFilterValues.IP_ADDRESS,
      title: commonStrings.ui.ipAddress,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: UserFilterValues.UserSessionFilterValues.USER_AGENT,
      title: commonStrings.ui.userAgent,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: UserFilterValues.UserSessionFilterValues.LANGUAGE,
      title: commonStrings.ui.language,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: UserFilterValues.UserSessionFilterValues.DEVICE_ID,
      title: commonStrings.ui.deviceId,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: UserFilterValues.UserSessionFilterValues.DEVICE_NAME,
      title: commonStrings.ui.deviceName,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: UserFilterValues.UserSessionFilterValues.APP_VERSION,
      title: commonStrings.ui.appVersion,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: UserFilterValues.UserSessionFilterValues.OPERATION_SYSTEM_VERSION,
      title: commonStrings.ui.osVersion,
      placeholder: commonStrings.ui.searchPlaceholder
    }
  ]
})
