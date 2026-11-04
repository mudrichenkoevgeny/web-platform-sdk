import { SortOrder, UserIdentifierFilterValues } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { GlobalIdentifierListSearchParams } from '@/ui/screens/management/identifier/global-list/globalIdentifierListSearchSchema'
import { globalIdentifierListSearchSchema } from '@/ui/screens/management/identifier/global-list/globalIdentifierListSearchSchema'

/** State representation of global identifier list sorting and filtering options. */
export interface GlobalIdentifierListingOptionsState {
  /** Selected sorting option state. */
  sortState: ListingSortState | null
  /** Map of filter identifiers to their current filter states. */
  filterStates: Record<string, ListingFilterState>
}

/**
 * Converts global identifier list search parameters into listing option states.
 * Uses Zod schema parsing at the boundary to validate and normalize search parameters.
 *
 * @param params - Search parameters object in raw or validated format
 * @returns Parsed listing options state containing sort and filter states
 */
export const searchParamsToListingStates = (
  params?: unknown
): GlobalIdentifierListingOptionsState => {
  const parseResult = globalIdentifierListSearchSchema.safeParse(params)

  if (!parseResult.success) {
    return { sortState: null, filterStates: {} }
  }

  const validatedParams = parseResult.data

  const sortState: ListingSortState | null = validatedParams.sort_by
    ? {
        optionId: validatedParams.sort_by,
        isAscending: validatedParams.sort_order === 'asc'
      }
    : null

  const filterStates: Record<string, ListingFilterState> = {}

  if (validatedParams.identifier_id && validatedParams.identifier_id.length > 0) {
    filterStates[UserIdentifierFilterValues.IDENTIFIER_ID] = {
      type: 'text',
      value: validatedParams.identifier_id[0] ?? ''
    }
  }

  if (validatedParams.user_id && validatedParams.user_id.length > 0) {
    filterStates[UserIdentifierFilterValues.USER_ID] = {
      type: 'text',
      value: validatedParams.user_id[0] ?? ''
    }
  }

  if (validatedParams.user_auth_provider && validatedParams.user_auth_provider.length > 0) {
    filterStates[UserIdentifierFilterValues.USER_AUTH_PROVIDER] = {
      type: 'choice',
      selectedIds: new Set(validatedParams.user_auth_provider)
    }
  }

  if (validatedParams.exclude_user_auth_provider && validatedParams.exclude_user_auth_provider.length > 0) {
    filterStates[UserIdentifierFilterValues.EXCLUDE_USER_AUTH_PROVIDER] = {
      type: 'choice',
      selectedIds: new Set(validatedParams.exclude_user_auth_provider)
    }
  }

  if (validatedParams.identifier && validatedParams.identifier.length > 0) {
    filterStates[UserIdentifierFilterValues.IDENTIFIER] = {
      type: 'text',
      value: validatedParams.identifier[0] ?? ''
    }
  }

  if (validatedParams.display_name) {
    filterStates[UserIdentifierFilterValues.DISPLAY_NAME] = {
      type: 'text',
      value: validatedParams.display_name
    }
  }

  if (validatedParams.external_provider_email) {
    filterStates[UserIdentifierFilterValues.EXTERNAL_PROVIDER_EMAIL] = {
      type: 'text',
      value: validatedParams.external_provider_email
    }
  }

  if (typeof validatedParams.is_external_provider_email_set === 'boolean') {
    filterStates[UserIdentifierFilterValues.IS_EXTERNAL_PROVIDER_EMAIL_SET] = {
      type: 'boolean',
      value: validatedParams.is_external_provider_email_set
    }
  }

  if (validatedParams.created_at_from) {
    filterStates[UserIdentifierFilterValues.CREATED_AT_FROM] = {
      type: 'text',
      value: validatedParams.created_at_from
    }
  }

  if (validatedParams.created_at_to) {
    filterStates[UserIdentifierFilterValues.CREATED_AT_TO] = {
      type: 'text',
      value: validatedParams.created_at_to
    }
  }

  if (validatedParams.updated_at_from) {
    filterStates[UserIdentifierFilterValues.UPDATED_AT_FROM] = {
      type: 'text',
      value: validatedParams.updated_at_from
    }
  }

  if (validatedParams.updated_at_to) {
    filterStates[UserIdentifierFilterValues.UPDATED_AT_TO] = {
      type: 'text',
      value: validatedParams.updated_at_to
    }
  }

  if (typeof validatedParams.is_updated_at_set === 'boolean') {
    filterStates[UserIdentifierFilterValues.IS_UPDATED_AT_SET] = {
      type: 'boolean',
      value: validatedParams.is_updated_at_set
    }
  }

  if (validatedParams.search_query) {
    filterStates[UserIdentifierFilterValues.SEARCH_QUERY] = {
      type: 'text',
      value: validatedParams.search_query
    }
  }

  return { sortState, filterStates }
}

/**
 * Converts listing option states back into global identifier search parameter format.
 *
 * @param sortState - Current sorting state
 * @param filterStates - Map of current filter states
 * @returns Search parameter object suitable for URL parameter validation
 */
export const listingStatesToSearchParams = (
  sortState: ListingSortState | null,
  filterStates: Record<string, ListingFilterState>
): GlobalIdentifierListSearchParams => {
  const searchParams: GlobalIdentifierListSearchParams = {
    sort_by: 'created_at',
    sort_order: SortOrder.DESC,
    identifier_id: [],
    user_id: [],
    user_auth_provider: [],
    exclude_user_auth_provider: [],
    identifier: []
  }

  if (sortState) {
    searchParams.sort_by = sortState.optionId
    searchParams.sort_order = sortState.isAscending ? SortOrder.ASC : SortOrder.DESC
  }

  const identifierIdFilter = filterStates[UserIdentifierFilterValues.IDENTIFIER_ID]
  if (identifierIdFilter?.type === 'text' && identifierIdFilter.value.trim()) {
    searchParams.identifier_id = [identifierIdFilter.value.trim()]
  }

  const userIdFilter = filterStates[UserIdentifierFilterValues.USER_ID]
  if (userIdFilter?.type === 'text' && userIdFilter.value.trim()) {
    searchParams.user_id = [userIdFilter.value.trim()]
  }

  const providerFilter = filterStates[UserIdentifierFilterValues.USER_AUTH_PROVIDER]
  if (providerFilter?.type === 'choice' && providerFilter.selectedIds.size > 0) {
    searchParams.user_auth_provider = Array.from(providerFilter.selectedIds)
  }

  const excludeProviderFilter = filterStates[UserIdentifierFilterValues.EXCLUDE_USER_AUTH_PROVIDER]
  if (excludeProviderFilter?.type === 'choice' && excludeProviderFilter.selectedIds.size > 0) {
    searchParams.exclude_user_auth_provider = Array.from(excludeProviderFilter.selectedIds)
  }

  const identifierFilter = filterStates[UserIdentifierFilterValues.IDENTIFIER]
  if (identifierFilter?.type === 'text' && identifierFilter.value.trim()) {
    searchParams.identifier = [identifierFilter.value.trim()]
  }

  const displayNameFilter = filterStates[UserIdentifierFilterValues.DISPLAY_NAME]
  if (displayNameFilter?.type === 'text' && displayNameFilter.value.trim()) {
    searchParams.display_name = displayNameFilter.value.trim()
  }

  const externalEmailFilter = filterStates[UserIdentifierFilterValues.EXTERNAL_PROVIDER_EMAIL]
  if (externalEmailFilter?.type === 'text' && externalEmailFilter.value.trim()) {
    searchParams.external_provider_email = externalEmailFilter.value.trim()
  }

  const isExternalEmailSetFilter = filterStates[UserIdentifierFilterValues.IS_EXTERNAL_PROVIDER_EMAIL_SET]
  if (isExternalEmailSetFilter?.type === 'boolean') {
    searchParams.is_external_provider_email_set = isExternalEmailSetFilter.value
  }

  const createdAtFromFilter = filterStates[UserIdentifierFilterValues.CREATED_AT_FROM]
  if (createdAtFromFilter?.type === 'text' && createdAtFromFilter.value.trim()) {
    searchParams.created_at_from = createdAtFromFilter.value.trim()
  }

  const createdAtToFilter = filterStates[UserIdentifierFilterValues.CREATED_AT_TO]
  if (createdAtToFilter?.type === 'text' && createdAtToFilter.value.trim()) {
    searchParams.created_at_to = createdAtToFilter.value.trim()
  }

  const updatedAtFromFilter = filterStates[UserIdentifierFilterValues.UPDATED_AT_FROM]
  if (updatedAtFromFilter?.type === 'text' && updatedAtFromFilter.value.trim()) {
    searchParams.updated_at_from = updatedAtFromFilter.value.trim()
  }

  const updatedAtToFilter = filterStates[UserIdentifierFilterValues.UPDATED_AT_TO]
  if (updatedAtToFilter?.type === 'text' && updatedAtToFilter.value.trim()) {
    searchParams.updated_at_to = updatedAtToFilter.value.trim()
  }

  const isUpdatedAtSetFilter = filterStates[UserIdentifierFilterValues.IS_UPDATED_AT_SET]
  if (isUpdatedAtSetFilter?.type === 'boolean') {
    searchParams.is_updated_at_set = isUpdatedAtSetFilter.value
  }

  const searchQueryFilter = filterStates[UserIdentifierFilterValues.SEARCH_QUERY]
  if (searchQueryFilter?.type === 'text' && searchQueryFilter.value.trim()) {
    searchParams.search_query = searchQueryFilter.value.trim()
  }

  return searchParams
}
