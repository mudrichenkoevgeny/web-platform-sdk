import {
  UserAuthProvider,
  UserIdentifierFilterValues,
  UserIdentifierSortBy,
  CommonModuleStrings,
  UserModuleStrings,
  commonStrings as globalCommonStrings,
  userStrings as globalUserStrings
} from '@mudrichenkoevgeny/shared-foundation'
import type { ListingOptionsConfig } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ChoiceFilterPresentationStyle } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

function getStringProperty(target: object, propertyName: string, fallback: string): string {
  if (propertyName in target) {
    const val = Reflect.get(target, propertyName)
    if (typeof val === 'string') {
      return val
    }
  }
  return fallback
}

/**
 * Constructs the listing options configuration for global identifier lists.
 *
 * @param commonStrings - Optional localized common module strings dictionary override.
 * @param userStrings - Optional localized user module strings dictionary override.
 * @returns Configured {@link ListingOptionsConfig} instance for sorting and filtering identifiers.
 */
export const getGlobalIdentifierListingOptionsConfig = (
  commonStrings: CommonModuleStrings = globalCommonStrings,
  userStrings: UserModuleStrings = globalUserStrings
): ListingOptionsConfig => {
  const displayNameTitle = getStringProperty(userStrings.ui, 'displayName', 'Display Name')
  const externalEmailTitle = `${commonStrings.ui.externalProvider} ${commonStrings.ui.email}`

  return {
    sortOptions: [
      {
        id: UserIdentifierSortBy.CREATED_AT,
        title: commonStrings.ui.createdAt
      },
      {
        id: UserIdentifierSortBy.UPDATED_AT,
        title: commonStrings.ui.updatedAt
      },
      {
        id: UserIdentifierSortBy.IDENTIFIER,
        title: commonStrings.ui.identifier
      },
      {
        id: UserIdentifierSortBy.DISPLAY_NAME,
        title: displayNameTitle
      }
    ],
    filters: [
      {
        type: 'text',
        id: UserIdentifierFilterValues.IDENTIFIER_ID,
        title: commonStrings.ui.identifierId,
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
        type: 'choice',
        id: UserIdentifierFilterValues.EXCLUDE_USER_AUTH_PROVIDER,
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
        id: UserIdentifierFilterValues.USER_ID,
        title: commonStrings.ui.userId,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'text',
        id: UserIdentifierFilterValues.IDENTIFIER,
        title: commonStrings.ui.identifier,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'text',
        id: UserIdentifierFilterValues.DISPLAY_NAME,
        title: displayNameTitle,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'text',
        id: UserIdentifierFilterValues.EXTERNAL_PROVIDER_EMAIL,
        title: externalEmailTitle,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'boolean',
        id: UserIdentifierFilterValues.IS_EXTERNAL_PROVIDER_EMAIL_SET,
        title: commonStrings.ui.isSet
      },
      {
        type: 'text',
        id: UserIdentifierFilterValues.CREATED_AT_FROM,
        title: `${commonStrings.ui.createdAt} (${commonStrings.ui.from})`,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'text',
        id: UserIdentifierFilterValues.CREATED_AT_TO,
        title: `${commonStrings.ui.createdAt} (${commonStrings.ui.to})`,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'text',
        id: UserIdentifierFilterValues.UPDATED_AT_FROM,
        title: `${commonStrings.ui.updatedAt} (${commonStrings.ui.from})`,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'text',
        id: UserIdentifierFilterValues.UPDATED_AT_TO,
        title: `${commonStrings.ui.updatedAt} (${commonStrings.ui.to})`,
        placeholder: commonStrings.ui.searchPlaceholder
      },
      {
        type: 'boolean',
        id: UserIdentifierFilterValues.IS_UPDATED_AT_SET,
        title: commonStrings.ui.isSet
      },
      {
        type: 'text',
        id: UserIdentifierFilterValues.SEARCH_QUERY,
        title: commonStrings.ui.searchPlaceholder,
        placeholder: commonStrings.ui.searchPlaceholder
      }
    ]
  }
}
