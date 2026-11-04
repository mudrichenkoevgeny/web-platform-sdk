import {
  UserAuthProvider,
  UserIdentifierFilterValues,
  UserIdentifierSortBy,
  CommonModuleStrings,
  commonStrings as globalCommonStrings
} from '@mudrichenkoevgeny/shared-foundation'
import type { ListingOptionsConfig } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ChoiceFilterPresentationStyle } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

export const getIdentifierListOptionsConfig = (
  commonStrings: CommonModuleStrings = globalCommonStrings,
  includeOwnerFilter = false
): ListingOptionsConfig => {
  const filters: ListingOptionsConfig['filters'] = [
    {
      type: 'text',
      id: UserIdentifierFilterValues.IDENTIFIER_ID,
      title: commonStrings.ui.resourceId,
      placeholder: commonStrings.ui.searchPlaceholder
    }
  ]

  if (includeOwnerFilter) {
    filters.push({
      type: 'text',
      id: UserIdentifierFilterValues.USER_ID,
      title: commonStrings.ui.userId,
      placeholder: commonStrings.ui.searchPlaceholder
    })
  }

  filters.push(
    {
      type: 'text',
      id: UserIdentifierFilterValues.IDENTIFIER,
      title: commonStrings.ui.identifier,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'choice',
      id: UserIdentifierFilterValues.USER_AUTH_PROVIDER,
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
      type: 'text',
      id: UserIdentifierFilterValues.SEARCH_QUERY,
      title: commonStrings.ui.searchPlaceholder,
      placeholder: commonStrings.ui.searchPlaceholder
    }
  )

  return {
    sortOptions: [
      {
        id: UserIdentifierSortBy.CREATED_AT,
        title: commonStrings.ui.createdAt
      },
      {
        id: UserIdentifierSortBy.UPDATED_AT,
        title: commonStrings.ui.updatedAt
      }
    ],
    filters
  }
}
