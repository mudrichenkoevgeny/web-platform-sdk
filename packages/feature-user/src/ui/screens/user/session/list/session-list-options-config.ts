import {
  ClientType,
  UserAuthProvider,
  UserRole,
  UserSessionFilterValues,
  UserSessionSortBy,
  CommonModuleStrings,
  commonStrings as globalCommonStrings
} from '@mudrichenkoevgeny/shared-foundation'
import type { ListingOptionsConfig } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ChoiceFilterPresentationStyle } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

export const getSessionListOptionsConfig = (
  commonStrings: CommonModuleStrings = globalCommonStrings,
  includeOwnerFilter = false
): ListingOptionsConfig => {
  const filters: ListingOptionsConfig['filters'] = [
    {
      type: 'text',
      id: UserSessionFilterValues.SESSION_ID,
      title: commonStrings.ui.resourceId,
      placeholder: commonStrings.ui.searchPlaceholder
    }
  ]

  if (includeOwnerFilter) {
    filters.push({
      type: 'text',
      id: UserSessionFilterValues.USER_ID,
      title: commonStrings.ui.userId,
      placeholder: commonStrings.ui.searchPlaceholder
    })
  }

  filters.push(
    {
      type: 'choice',
      id: UserSessionFilterValues.USER_ROLE,
      title: commonStrings.ui.role,
      options: [
        { id: UserRole.STAFF, title: commonStrings.ui.staff },
        { id: UserRole.ADMIN, title: commonStrings.ui.admin }
      ],
      isMultiple: true,
      presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
    },
    {
      type: 'text',
      id: UserSessionFilterValues.IDENTIFIER,
      title: commonStrings.ui.identifier,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'choice',
      id: UserSessionFilterValues.IDENTIFIER_AUTH_PROVIDER,
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
      id: UserSessionFilterValues.CLIENT_TYPE,
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
      id: UserSessionFilterValues.SEARCH_QUERY,
      title: commonStrings.ui.searchPlaceholder,
      placeholder: commonStrings.ui.searchPlaceholder
    }
  )

  return {
    sortOptions: [
      {
        id: UserSessionSortBy.CREATED_AT,
        title: commonStrings.ui.createdAt
      },
      {
        id: UserSessionSortBy.LAST_ACCESSED_AT,
        title: commonStrings.ui.lastAccessedAt
      },
      {
        id: UserSessionSortBy.EXPIRES_AT,
        title: commonStrings.ui.expiresAt
      }
    ],
    filters
  }
}
