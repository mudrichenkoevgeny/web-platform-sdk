import { UserAuthProvider, UserSortValues } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingOptionsConfig } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ChoiceFilterPresentationStyle } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enManagementUserStrings } from '@/locales/index'
import type { FeatureManagementUserStrings } from '@/locales/index'

export const getGlobalIdentifierListingOptionsConfig = (
  strings: FeatureManagementUserStrings = enManagementUserStrings
): ListingOptionsConfig => ({
  sortOptions: [
    {
      id: UserSortValues.UserIdentifierSortBy.CREATED_AT,
      title: strings.ui_common_created_at
    },
    {
      id: UserSortValues.UserIdentifierSortBy.UPDATED_AT,
      title: strings.ui_common_updated_at
    }
  ],
  filters: [
    {
      type: 'choice',
      id: 'userAuthProvider',
      title: strings.ui_common_auth_provider,
      options: [
        { id: UserAuthProvider.EMAIL, label: strings.ui_common_email },
        { id: UserAuthProvider.PHONE, label: strings.ui_common_phone },
        { id: UserAuthProvider.GOOGLE, label: strings.ui_common_google },
        { id: UserAuthProvider.APPLE, label: strings.ui_common_apple }
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
    }
  ]
})
