import { SessionFilterValues } from '@/ui/screens/management/session/global-list/global-session-list-options-config'
import { SortOrder } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { GlobalSessionListSearchParams } from '@/ui/screens/management/session/global-list/globalSessionListSearchSchema'
import { globalSessionListSearchSchema } from '@/ui/screens/management/session/global-list/globalSessionListSearchSchema'

/** State representation of global session list sorting and filtering options. */
export interface GlobalSessionListingOptionsState {
  /** Selected sorting option state. */
  sortState: ListingSortState | null
  /** Map of filter identifiers to their current filter states. */
  filterStates: Record<string, ListingFilterState>
}

/**
 * Converts global session list search parameters into listing option states.
 * Uses Zod schema parsing at the boundary to validate and normalize search parameters.
 *
 * @param params - Search parameters object in raw or validated format
 * @returns Parsed listing options state containing sort and filter states
 */
export const searchParamsToListingStates = (
  params?: unknown
): GlobalSessionListingOptionsState => {
  const parseResult = globalSessionListSearchSchema.safeParse(params)

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

  if (validatedParams.session_id && validatedParams.session_id.length > 0) {
    filterStates[SessionFilterValues.SESSION_ID] = {
      type: 'text',
      value: validatedParams.session_id[0] ?? ''
    }
  }

  if (validatedParams.user_id && validatedParams.user_id.length > 0) {
    filterStates[SessionFilterValues.USER_ID] = {
      type: 'text',
      value: validatedParams.user_id[0] ?? ''
    }
  }

  if (validatedParams.user_role && validatedParams.user_role.length > 0) {
    filterStates[SessionFilterValues.USER_ROLE] = {
      type: 'choice',
      selectedIds: new Set(validatedParams.user_role)
    }
  }

  if (validatedParams.exclude_user_role && validatedParams.exclude_user_role.length > 0) {
    filterStates[SessionFilterValues.EXCLUDE_USER_ROLE] = {
      type: 'choice',
      selectedIds: new Set(validatedParams.exclude_user_role)
    }
  }

  if (validatedParams.identifier_auth_provider && validatedParams.identifier_auth_provider.length > 0) {
    filterStates[SessionFilterValues.IDENTIFIER_AUTH_PROVIDER] = {
      type: 'choice',
      selectedIds: new Set(validatedParams.identifier_auth_provider)
    }
  } else if (validatedParams.user_auth_provider && validatedParams.user_auth_provider.length > 0) {
    filterStates[SessionFilterValues.IDENTIFIER_AUTH_PROVIDER] = {
      type: 'choice',
      selectedIds: new Set(validatedParams.user_auth_provider)
    }
  }

  if (validatedParams.exclude_identifier_auth_provider && validatedParams.exclude_identifier_auth_provider.length > 0) {
    filterStates[SessionFilterValues.EXCLUDE_IDENTIFIER_AUTH_PROVIDER] = {
      type: 'choice',
      selectedIds: new Set(validatedParams.exclude_identifier_auth_provider)
    }
  }

  if (validatedParams.client_type && validatedParams.client_type.length > 0) {
    filterStates[SessionFilterValues.CLIENT_TYPE] = {
      type: 'choice',
      selectedIds: new Set(validatedParams.client_type)
    }
  }

  if (validatedParams.exclude_client_type && validatedParams.exclude_client_type.length > 0) {
    filterStates[SessionFilterValues.EXCLUDE_CLIENT_TYPE] = {
      type: 'choice',
      selectedIds: new Set(validatedParams.exclude_client_type)
    }
  }

  if (typeof validatedParams.is_client_type_set === 'boolean') {
    filterStates[SessionFilterValues.IS_CLIENT_TYPE_SET] = {
      type: 'boolean',
      value: validatedParams.is_client_type_set
    }
  }

  if (validatedParams.identifier && validatedParams.identifier.length > 0) {
    filterStates[SessionFilterValues.IDENTIFIER] = {
      type: 'text',
      value: validatedParams.identifier[0] ?? ''
    }
  }

  if (validatedParams.identifier_id && validatedParams.identifier_id.length > 0) {
    filterStates[SessionFilterValues.IDENTIFIER_ID] = {
      type: 'text',
      value: validatedParams.identifier_id[0] ?? ''
    }
  }

  if (validatedParams.identifier_display_name) {
    filterStates[SessionFilterValues.IDENTIFIER_DISPLAY_NAME] = {
      type: 'text',
      value: validatedParams.identifier_display_name
    }
  }

  if (validatedParams.ip_address && validatedParams.ip_address.length > 0) {
    filterStates[SessionFilterValues.IP_ADDRESS] = {
      type: 'text',
      value: validatedParams.ip_address[0] ?? ''
    }
  }

  if (typeof validatedParams.is_ip_address_set === 'boolean') {
    filterStates[SessionFilterValues.IS_IP_ADDRESS_SET] = {
      type: 'boolean',
      value: validatedParams.is_ip_address_set
    }
  }

  if (validatedParams.user_agent && validatedParams.user_agent.length > 0) {
    filterStates[SessionFilterValues.USER_AGENT] = {
      type: 'text',
      value: validatedParams.user_agent[0] ?? ''
    }
  }

  if (typeof validatedParams.is_user_agent_set === 'boolean') {
    filterStates[SessionFilterValues.IS_USER_AGENT_SET] = {
      type: 'boolean',
      value: validatedParams.is_user_agent_set
    }
  }

  if (validatedParams.device_id && validatedParams.device_id.length > 0) {
    filterStates[SessionFilterValues.DEVICE_ID] = {
      type: 'text',
      value: validatedParams.device_id[0] ?? ''
    }
  }

  if (typeof validatedParams.is_device_id_set === 'boolean') {
    filterStates[SessionFilterValues.IS_DEVICE_ID_SET] = {
      type: 'boolean',
      value: validatedParams.is_device_id_set
    }
  }

  if (validatedParams.device_name && validatedParams.device_name.length > 0) {
    filterStates[SessionFilterValues.DEVICE_NAME] = {
      type: 'text',
      value: validatedParams.device_name[0] ?? ''
    }
  }

  if (typeof validatedParams.is_device_name_set === 'boolean') {
    filterStates[SessionFilterValues.IS_DEVICE_NAME_SET] = {
      type: 'boolean',
      value: validatedParams.is_device_name_set
    }
  }

  if (validatedParams.language && validatedParams.language.length > 0) {
    filterStates[SessionFilterValues.LANGUAGE] = {
      type: 'text',
      value: validatedParams.language[0] ?? ''
    }
  }

  if (typeof validatedParams.is_language_set === 'boolean') {
    filterStates[SessionFilterValues.IS_LANGUAGE_SET] = {
      type: 'boolean',
      value: validatedParams.is_language_set
    }
  }

  if (validatedParams.app_version && validatedParams.app_version.length > 0) {
    filterStates[SessionFilterValues.APP_VERSION] = {
      type: 'text',
      value: validatedParams.app_version[0] ?? ''
    }
  }

  if (typeof validatedParams.is_app_version_set === 'boolean') {
    filterStates[SessionFilterValues.IS_APP_VERSION_SET] = {
      type: 'boolean',
      value: validatedParams.is_app_version_set
    }
  }

  if (validatedParams.os_version && validatedParams.os_version.length > 0) {
    filterStates[SessionFilterValues.OPERATION_SYSTEM_VERSION] = {
      type: 'text',
      value: validatedParams.os_version[0] ?? ''
    }
  }

  if (typeof validatedParams.is_operation_system_version_set === 'boolean') {
    filterStates[SessionFilterValues.IS_OPERATION_SYSTEM_VERSION_SET] = {
      type: 'boolean',
      value: validatedParams.is_operation_system_version_set
    }
  }

  if (validatedParams.expires_at_from) {
    filterStates[SessionFilterValues.EXPIRES_AT_FROM] = {
      type: 'text',
      value: validatedParams.expires_at_from
    }
  }

  if (validatedParams.expires_at_to) {
    filterStates[SessionFilterValues.EXPIRES_AT_TO] = {
      type: 'text',
      value: validatedParams.expires_at_to
    }
  }

  if (validatedParams.last_accessed_at_from) {
    filterStates[SessionFilterValues.LAST_ACCESSED_AT_FROM] = {
      type: 'text',
      value: validatedParams.last_accessed_at_from
    }
  }

  if (validatedParams.last_accessed_at_to) {
    filterStates[SessionFilterValues.LAST_ACCESSED_AT_TO] = {
      type: 'text',
      value: validatedParams.last_accessed_at_to
    }
  }

  if (validatedParams.last_reauthenticated_at_from) {
    filterStates[SessionFilterValues.LAST_REAUTHENTICATED_AT_FROM] = {
      type: 'text',
      value: validatedParams.last_reauthenticated_at_from
    }
  }

  if (validatedParams.last_reauthenticated_at_to) {
    filterStates[SessionFilterValues.LAST_REAUTHENTICATED_AT_TO] = {
      type: 'text',
      value: validatedParams.last_reauthenticated_at_to
    }
  }

  if (validatedParams.created_at_from) {
    filterStates[SessionFilterValues.CREATED_AT_FROM] = {
      type: 'text',
      value: validatedParams.created_at_from
    }
  }

  if (validatedParams.created_at_to) {
    filterStates[SessionFilterValues.CREATED_AT_TO] = {
      type: 'text',
      value: validatedParams.created_at_to
    }
  }

  if (validatedParams.updated_at_from) {
    filterStates[SessionFilterValues.UPDATED_AT_FROM] = {
      type: 'text',
      value: validatedParams.updated_at_from
    }
  }

  if (validatedParams.updated_at_to) {
    filterStates[SessionFilterValues.UPDATED_AT_TO] = {
      type: 'text',
      value: validatedParams.updated_at_to
    }
  }

  if (typeof validatedParams.is_updated_at_set === 'boolean') {
    filterStates[SessionFilterValues.IS_UPDATED_AT_SET] = {
      type: 'boolean',
      value: validatedParams.is_updated_at_set
    }
  }

  if (validatedParams.search_query) {
    filterStates[SessionFilterValues.SEARCH_QUERY] = {
      type: 'text',
      value: validatedParams.search_query
    }
  }

  return { sortState, filterStates }
}

/**
 * Converts listing option states back into global session search parameter format.
 *
 * @param sortState - Current sorting state
 * @param filterStates - Map of current filter states
 * @returns Search parameter object suitable for URL parameter validation
 */
export const listingStatesToSearchParams = (
  sortState: ListingSortState | null,
  filterStates: Record<string, ListingFilterState>
): GlobalSessionListSearchParams => {
  const searchParams: GlobalSessionListSearchParams = {
    sort_by: 'created_at',
    sort_order: SortOrder.DESC,
    session_id: [],
    user_id: [],
    user_role: [],
    exclude_user_role: [],
    identifier: [],
    identifier_id: [],
    identifier_auth_provider: [],
    exclude_identifier_auth_provider: [],
    ip_address: []
  }

  if (sortState) {
    searchParams.sort_by = sortState.optionId
    searchParams.sort_order = sortState.isAscending ? SortOrder.ASC : SortOrder.DESC
  }

  const sessionIdFilter = filterStates[SessionFilterValues.SESSION_ID]
  if (sessionIdFilter?.type === 'text' && sessionIdFilter.value.trim()) {
    searchParams.session_id = [sessionIdFilter.value.trim()]
  }

  const userIdFilter = filterStates[SessionFilterValues.USER_ID]
  if (userIdFilter?.type === 'text' && userIdFilter.value.trim()) {
    searchParams.user_id = [userIdFilter.value.trim()]
  }

  const userRoleFilter = filterStates[SessionFilterValues.USER_ROLE]
  if (userRoleFilter?.type === 'choice' && userRoleFilter.selectedIds.size > 0) {
    searchParams.user_role = Array.from(userRoleFilter.selectedIds)
  }

  const excludeUserRoleFilter = filterStates[SessionFilterValues.EXCLUDE_USER_ROLE]
  if (excludeUserRoleFilter?.type === 'choice' && excludeUserRoleFilter.selectedIds.size > 0) {
    searchParams.exclude_user_role = Array.from(excludeUserRoleFilter.selectedIds)
  }

  const identifierAuthProviderFilter = filterStates[SessionFilterValues.IDENTIFIER_AUTH_PROVIDER]
  if (identifierAuthProviderFilter?.type === 'choice' && identifierAuthProviderFilter.selectedIds.size > 0) {
    searchParams.identifier_auth_provider = Array.from(identifierAuthProviderFilter.selectedIds)
  }

  const excludeIdentifierAuthProviderFilter = filterStates[SessionFilterValues.EXCLUDE_IDENTIFIER_AUTH_PROVIDER]
  if (excludeIdentifierAuthProviderFilter?.type === 'choice' && excludeIdentifierAuthProviderFilter.selectedIds.size > 0) {
    searchParams.exclude_identifier_auth_provider = Array.from(excludeIdentifierAuthProviderFilter.selectedIds)
  }

  const clientTypeFilter = filterStates[SessionFilterValues.CLIENT_TYPE]
  if (clientTypeFilter?.type === 'choice' && clientTypeFilter.selectedIds.size > 0) {
    searchParams.client_type = Array.from(clientTypeFilter.selectedIds)
  }

  const excludeClientTypeFilter = filterStates[SessionFilterValues.EXCLUDE_CLIENT_TYPE]
  if (excludeClientTypeFilter?.type === 'choice' && excludeClientTypeFilter.selectedIds.size > 0) {
    searchParams.exclude_client_type = Array.from(excludeClientTypeFilter.selectedIds)
  }

  const isClientTypeSetFilter = filterStates[SessionFilterValues.IS_CLIENT_TYPE_SET]
  if (isClientTypeSetFilter?.type === 'boolean') {
    searchParams.is_client_type_set = isClientTypeSetFilter.value
  }

  const identifierFilter = filterStates[SessionFilterValues.IDENTIFIER]
  if (identifierFilter?.type === 'text' && identifierFilter.value.trim()) {
    searchParams.identifier = [identifierFilter.value.trim()]
  }

  const identifierIdFilter = filterStates[SessionFilterValues.IDENTIFIER_ID]
  if (identifierIdFilter?.type === 'text' && identifierIdFilter.value.trim()) {
    searchParams.identifier_id = [identifierIdFilter.value.trim()]
  }

  const identifierDisplayNameFilter = filterStates[SessionFilterValues.IDENTIFIER_DISPLAY_NAME]
  if (identifierDisplayNameFilter?.type === 'text' && identifierDisplayNameFilter.value.trim()) {
    searchParams.identifier_display_name = identifierDisplayNameFilter.value.trim()
  }

  const ipFilter = filterStates[SessionFilterValues.IP_ADDRESS]
  if (ipFilter?.type === 'text' && ipFilter.value.trim()) {
    searchParams.ip_address = [ipFilter.value.trim()]
  }

  const isIpAddressSetFilter = filterStates[SessionFilterValues.IS_IP_ADDRESS_SET]
  if (isIpAddressSetFilter?.type === 'boolean') {
    searchParams.is_ip_address_set = isIpAddressSetFilter.value
  }

  const userAgentFilter = filterStates[SessionFilterValues.USER_AGENT]
  if (userAgentFilter?.type === 'text' && userAgentFilter.value.trim()) {
    searchParams.user_agent = [userAgentFilter.value.trim()]
  }

  const isUserAgentSetFilter = filterStates[SessionFilterValues.IS_USER_AGENT_SET]
  if (isUserAgentSetFilter?.type === 'boolean') {
    searchParams.is_user_agent_set = isUserAgentSetFilter.value
  }

  const deviceIdFilter = filterStates[SessionFilterValues.DEVICE_ID]
  if (deviceIdFilter?.type === 'text' && deviceIdFilter.value.trim()) {
    searchParams.device_id = [deviceIdFilter.value.trim()]
  }

  const isDeviceIdSetFilter = filterStates[SessionFilterValues.IS_DEVICE_ID_SET]
  if (isDeviceIdSetFilter?.type === 'boolean') {
    searchParams.is_device_id_set = isDeviceIdSetFilter.value
  }

  const deviceNameFilter = filterStates[SessionFilterValues.DEVICE_NAME]
  if (deviceNameFilter?.type === 'text' && deviceNameFilter.value.trim()) {
    searchParams.device_name = [deviceNameFilter.value.trim()]
  }

  const isDeviceNameSetFilter = filterStates[SessionFilterValues.IS_DEVICE_NAME_SET]
  if (isDeviceNameSetFilter?.type === 'boolean') {
    searchParams.is_device_name_set = isDeviceNameSetFilter.value
  }

  const languageFilter = filterStates[SessionFilterValues.LANGUAGE]
  if (languageFilter?.type === 'text' && languageFilter.value.trim()) {
    searchParams.language = [languageFilter.value.trim()]
  }

  const isLanguageSetFilter = filterStates[SessionFilterValues.IS_LANGUAGE_SET]
  if (isLanguageSetFilter?.type === 'boolean') {
    searchParams.is_language_set = isLanguageSetFilter.value
  }

  const appVersionFilter = filterStates[SessionFilterValues.APP_VERSION]
  if (appVersionFilter?.type === 'text' && appVersionFilter.value.trim()) {
    searchParams.app_version = [appVersionFilter.value.trim()]
  }

  const isAppVersionSetFilter = filterStates[SessionFilterValues.IS_APP_VERSION_SET]
  if (isAppVersionSetFilter?.type === 'boolean') {
    searchParams.is_app_version_set = isAppVersionSetFilter.value
  }

  const osVersionFilter = filterStates[SessionFilterValues.OPERATION_SYSTEM_VERSION]
  if (osVersionFilter?.type === 'text' && osVersionFilter.value.trim()) {
    searchParams.os_version = [osVersionFilter.value.trim()]
  }

  const isOsVersionSetFilter = filterStates[SessionFilterValues.IS_OPERATION_SYSTEM_VERSION_SET]
  if (isOsVersionSetFilter?.type === 'boolean') {
    searchParams.is_operation_system_version_set = isOsVersionSetFilter.value
  }

  const expiresAtFromFilter = filterStates[SessionFilterValues.EXPIRES_AT_FROM]
  if (expiresAtFromFilter?.type === 'text' && expiresAtFromFilter.value.trim()) {
    searchParams.expires_at_from = expiresAtFromFilter.value.trim()
  }

  const expiresAtToFilter = filterStates[SessionFilterValues.EXPIRES_AT_TO]
  if (expiresAtToFilter?.type === 'text' && expiresAtToFilter.value.trim()) {
    searchParams.expires_at_to = expiresAtToFilter.value.trim()
  }

  const lastAccessedAtFromFilter = filterStates[SessionFilterValues.LAST_ACCESSED_AT_FROM]
  if (lastAccessedAtFromFilter?.type === 'text' && lastAccessedAtFromFilter.value.trim()) {
    searchParams.last_accessed_at_from = lastAccessedAtFromFilter.value.trim()
  }

  const lastAccessedAtToFilter = filterStates[SessionFilterValues.LAST_ACCESSED_AT_TO]
  if (lastAccessedAtToFilter?.type === 'text' && lastAccessedAtToFilter.value.trim()) {
    searchParams.last_accessed_at_to = lastAccessedAtToFilter.value.trim()
  }

  const lastReauthenticatedAtFromFilter = filterStates[SessionFilterValues.LAST_REAUTHENTICATED_AT_FROM]
  if (lastReauthenticatedAtFromFilter?.type === 'text' && lastReauthenticatedAtFromFilter.value.trim()) {
    searchParams.last_reauthenticated_at_from = lastReauthenticatedAtFromFilter.value.trim()
  }

  const lastReauthenticatedAtToFilter = filterStates[SessionFilterValues.LAST_REAUTHENTICATED_AT_TO]
  if (lastReauthenticatedAtToFilter?.type === 'text' && lastReauthenticatedAtToFilter.value.trim()) {
    searchParams.last_reauthenticated_at_to = lastReauthenticatedAtToFilter.value.trim()
  }

  const createdAtFromFilter = filterStates[SessionFilterValues.CREATED_AT_FROM]
  if (createdAtFromFilter?.type === 'text' && createdAtFromFilter.value.trim()) {
    searchParams.created_at_from = createdAtFromFilter.value.trim()
  }

  const createdAtToFilter = filterStates[SessionFilterValues.CREATED_AT_TO]
  if (createdAtToFilter?.type === 'text' && createdAtToFilter.value.trim()) {
    searchParams.created_at_to = createdAtToFilter.value.trim()
  }

  const updatedAtFromFilter = filterStates[SessionFilterValues.UPDATED_AT_FROM]
  if (updatedAtFromFilter?.type === 'text' && updatedAtFromFilter.value.trim()) {
    searchParams.updated_at_from = updatedAtFromFilter.value.trim()
  }

  const updatedAtToFilter = filterStates[SessionFilterValues.UPDATED_AT_TO]
  if (updatedAtToFilter?.type === 'text' && updatedAtToFilter.value.trim()) {
    searchParams.updated_at_to = updatedAtToFilter.value.trim()
  }

  const isUpdatedAtSetFilter = filterStates[SessionFilterValues.IS_UPDATED_AT_SET]
  if (isUpdatedAtSetFilter?.type === 'boolean') {
    searchParams.is_updated_at_set = isUpdatedAtSetFilter.value
  }

  const searchQueryFilter = filterStates[SessionFilterValues.SEARCH_QUERY]
  if (searchQueryFilter?.type === 'text' && searchQueryFilter.value.trim()) {
    searchParams.search_query = searchQueryFilter.value.trim()
  }

  return searchParams
}
