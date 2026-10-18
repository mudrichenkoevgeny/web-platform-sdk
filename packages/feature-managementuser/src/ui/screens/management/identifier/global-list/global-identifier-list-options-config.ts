import { UserAuthProvider, UserFilterValues, UserSortValues, CommonModuleStrings } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingOptionsConfig } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ChoiceFilterPresentationStyle } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

const defaultCommonStrings = new CommonModuleStrings()

export const getGlobalIdentifierListingOptionsConfig = (
  commonStrings: CommonModuleStrings = defaultCommonStrings
): ListingOptionsConfig => ({
  sortOptions: [
    {
      id: UserSortValues.UserIdentifierSortBy.CREATED_AT,
      title: commonStrings.ui.createdAt
    },
    {
      id: UserSortValues.UserIdentifierSortBy.UPDATED_AT,
      title: commonStrings.ui.updatedAt
    }
  ],
  filters: [
    {
      type: 'choice',
      id: UserFilterValues.UserIdentifierFilterValues.USER_AUTH_PROVIDER,
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
      id: UserFilterValues.UserIdentifierFilterValues.USER_ID,
      title: commonStrings.ui.userId,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: UserFilterValues.UserIdentifierFilterValues.IDENTIFIER,
      title: commonStrings.ui.identifier,
      placeholder: commonStrings.ui.searchPlaceholder
    }
  ]
})
