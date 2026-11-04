import { SortOrder, UserFilterValues } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { GlobalUserListSearchParams } from '@/ui/screens/management/user/global-list/globalUserListSearchSchema'
import { globalUserListSearchSchema } from '@/ui/screens/management/user/global-list/globalUserListSearchSchema'

/** State representation of global user list sorting and filtering options. */
export interface GlobalUserListingOptionsState {
  /** Selected sorting option state. */
  sortState: ListingSortState | null
  /** Map of filter identifiers to their current filter states. */
  filterStates: Record<string, ListingFilterState>
}

/**
 * Converts global user list search parameters into listing option states.
 * Uses Zod schema parsing at the boundary to validate and normalize search parameters.
 *
 * @param params - Search parameters object in raw or validated format
 * @returns Parsed listing options state containing sort and filter states
 */
export const searchParamsToListingStates = (
  params?: unknown
): GlobalUserListingOptionsState => {
  const parseResult = globalUserListSearchSchema.safeParse(params)

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

  if (validatedParams.user_id && validatedParams.user_id.length > 0) {
    filterStates[UserFilterValues.USER_ID] = {
      type: 'text',
      value: validatedParams.user_id[0] ?? ''
    }
  }

  if (validatedParams.nickname) {
    filterStates[UserFilterValues.NICKNAME] = {
      type: 'text',
      value: validatedParams.nickname
    }
  }

  if (typeof validatedParams.is_nickname_set === 'boolean') {
    filterStates[UserFilterValues.IS_NICKNAME_SET] = {
      type: 'boolean',
      value: validatedParams.is_nickname_set
    }
  }

  if (validatedParams.display_name) {
    filterStates[UserFilterValues.DISPLAY_NAME] = {
      type: 'text',
      value: validatedParams.display_name
    }
  }

  if (typeof validatedParams.is_display_name_set === 'boolean') {
    filterStates[UserFilterValues.IS_DISPLAY_NAME_SET] = {
      type: 'boolean',
      value: validatedParams.is_display_name_set
    }
  }

  if (typeof validatedParams.is_avatar_set === 'boolean') {
    filterStates[UserFilterValues.IS_AVATAR_SET] = {
      type: 'boolean',
      value: validatedParams.is_avatar_set
    }
  }

  if (validatedParams.search_query) {
    filterStates[UserFilterValues.SEARCH_QUERY] = {
      type: 'text',
      value: validatedParams.search_query
    }
  }

  if (validatedParams.user_role && validatedParams.user_role.length > 0) {
    filterStates[UserFilterValues.ROLE] = {
      type: 'choice',
      selectedIds: new Set(validatedParams.user_role)
    }
  }

  if (validatedParams.exclude_user_role && validatedParams.exclude_user_role.length > 0) {
    filterStates[UserFilterValues.EXCLUDE_ROLE] = {
      type: 'choice',
      selectedIds: new Set(validatedParams.exclude_user_role)
    }
  }

  if (validatedParams.account_status && validatedParams.account_status.length > 0) {
    filterStates[UserFilterValues.ACCOUNT_STATUS] = {
      type: 'choice',
      selectedIds: new Set(validatedParams.account_status)
    }
  }

  if (validatedParams.exclude_account_status && validatedParams.exclude_account_status.length > 0) {
    filterStates[UserFilterValues.EXCLUDE_ACCOUNT_STATUS] = {
      type: 'choice',
      selectedIds: new Set(validatedParams.exclude_account_status)
    }
  }

  if (validatedParams.account_status_on_restore && validatedParams.account_status_on_restore.length > 0) {
    filterStates[UserFilterValues.ACCOUNT_STATUS_ON_RESTORE] = {
      type: 'choice',
      selectedIds: new Set(validatedParams.account_status_on_restore)
    }
  }

  if (validatedParams.exclude_account_status_on_restore && validatedParams.exclude_account_status_on_restore.length > 0) {
    filterStates[UserFilterValues.EXCLUDE_ACCOUNT_STATUS_ON_RESTORE] = {
      type: 'choice',
      selectedIds: new Set(validatedParams.exclude_account_status_on_restore)
    }
  }

  if (typeof validatedParams.is_account_status_on_restore_set === 'boolean') {
    filterStates[UserFilterValues.IS_ACCOUNT_STATUS_ON_RESTORE_SET] = {
      type: 'boolean',
      value: validatedParams.is_account_status_on_restore_set
    }
  }

  if (validatedParams.account_lockout_type && validatedParams.account_lockout_type.length > 0) {
    filterStates[UserFilterValues.ACCOUNT_LOCKOUT_TYPE] = {
      type: 'choice',
      selectedIds: new Set(validatedParams.account_lockout_type)
    }
  }

  if (validatedParams.exclude_account_lockout_type && validatedParams.exclude_account_lockout_type.length > 0) {
    filterStates[UserFilterValues.EXCLUDE_ACCOUNT_LOCKOUT_TYPE] = {
      type: 'choice',
      selectedIds: new Set(validatedParams.exclude_account_lockout_type)
    }
  }

  if (typeof validatedParams.is_totp_enabled === 'boolean') {
    filterStates[UserFilterValues.IS_TOTP_ENABLED] = {
      type: 'boolean',
      value: validatedParams.is_totp_enabled
    }
  }

  if (typeof validatedParams.authority_level_from === 'number' && !isNaN(validatedParams.authority_level_from)) {
    filterStates[UserFilterValues.AUTHORITY_LEVEL_FROM] = {
      type: 'number',
      value: validatedParams.authority_level_from
    }
  }

  if (typeof validatedParams.authority_level_to === 'number' && !isNaN(validatedParams.authority_level_to)) {
    filterStates[UserFilterValues.AUTHORITY_LEVEL_TO] = {
      type: 'number',
      value: validatedParams.authority_level_to
    }
  }

  if (validatedParams.permission_codes && validatedParams.permission_codes.length > 0) {
    filterStates[UserFilterValues.PERMISSION_CODES] = {
      type: 'text',
      value: validatedParams.permission_codes[0] ?? ''
    }
  }

  if (validatedParams.exclude_permission_codes && validatedParams.exclude_permission_codes.length > 0) {
    filterStates[UserFilterValues.EXCLUDE_PERMISSION_CODES] = {
      type: 'text',
      value: validatedParams.exclude_permission_codes[0] ?? ''
    }
  }

  if (validatedParams.temporary_lockout_until_from) {
    filterStates[UserFilterValues.TEMPORARY_LOCKOUT_UNTIL_FROM] = {
      type: 'text',
      value: validatedParams.temporary_lockout_until_from
    }
  }

  if (validatedParams.temporary_lockout_until_to) {
    filterStates[UserFilterValues.TEMPORARY_LOCKOUT_UNTIL_TO] = {
      type: 'text',
      value: validatedParams.temporary_lockout_until_to
    }
  }

  if (typeof validatedParams.is_temporary_lockout_until_set === 'boolean') {
    filterStates[UserFilterValues.IS_TEMPORARY_LOCKOUT_UNTIL_SET] = {
      type: 'boolean',
      value: validatedParams.is_temporary_lockout_until_set
    }
  }

  if (validatedParams.last_login_at_from) {
    filterStates[UserFilterValues.LAST_LOGIN_AT_FROM] = {
      type: 'text',
      value: validatedParams.last_login_at_from
    }
  }

  if (validatedParams.last_login_at_to) {
    filterStates[UserFilterValues.LAST_LOGIN_AT_TO] = {
      type: 'text',
      value: validatedParams.last_login_at_to
    }
  }

  if (typeof validatedParams.is_last_login_at_set === 'boolean') {
    filterStates[UserFilterValues.IS_LAST_LOGIN_AT_SET] = {
      type: 'boolean',
      value: validatedParams.is_last_login_at_set
    }
  }

  if (validatedParams.last_active_at_from) {
    filterStates[UserFilterValues.LAST_ACTIVE_AT_FROM] = {
      type: 'text',
      value: validatedParams.last_active_at_from
    }
  }

  if (validatedParams.last_active_at_to) {
    filterStates[UserFilterValues.LAST_ACTIVE_AT_TO] = {
      type: 'text',
      value: validatedParams.last_active_at_to
    }
  }

  if (typeof validatedParams.is_last_active_at_set === 'boolean') {
    filterStates[UserFilterValues.IS_LAST_ACTIVE_AT_SET] = {
      type: 'boolean',
      value: validatedParams.is_last_active_at_set
    }
  }

  if (validatedParams.scheduled_permanent_deletion_at_from) {
    filterStates[UserFilterValues.SCHEDULED_PERMANENT_DELETION_AT_FROM] = {
      type: 'text',
      value: validatedParams.scheduled_permanent_deletion_at_from
    }
  }

  if (validatedParams.scheduled_permanent_deletion_at_to) {
    filterStates[UserFilterValues.SCHEDULED_PERMANENT_DELETION_AT_TO] = {
      type: 'text',
      value: validatedParams.scheduled_permanent_deletion_at_to
    }
  }

  if (typeof validatedParams.is_scheduled_permanent_deletion_at_set === 'boolean') {
    filterStates[UserFilterValues.IS_SCHEDULED_PERMANENT_DELETION_AT_SET] = {
      type: 'boolean',
      value: validatedParams.is_scheduled_permanent_deletion_at_set
    }
  }

  if (typeof validatedParams.storage_quota_bytes_from === 'number' && !isNaN(validatedParams.storage_quota_bytes_from)) {
    filterStates[UserFilterValues.STORAGE_QUOTA_BYTES_FROM] = {
      type: 'number',
      value: validatedParams.storage_quota_bytes_from
    }
  }

  if (typeof validatedParams.storage_quota_bytes_to === 'number' && !isNaN(validatedParams.storage_quota_bytes_to)) {
    filterStates[UserFilterValues.STORAGE_QUOTA_BYTES_TO] = {
      type: 'number',
      value: validatedParams.storage_quota_bytes_to
    }
  }

  if (typeof validatedParams.is_storage_quota_bytes_set === 'boolean') {
    filterStates[UserFilterValues.IS_STORAGE_QUOTA_BYTES_SET] = {
      type: 'boolean',
      value: validatedParams.is_storage_quota_bytes_set
    }
  }

  if (typeof validatedParams.storage_max_upload_size_bytes_from === 'number' && !isNaN(validatedParams.storage_max_upload_size_bytes_from)) {
    filterStates[UserFilterValues.STORAGE_MAX_UPLOAD_SIZE_BYTES_FROM] = {
      type: 'number',
      value: validatedParams.storage_max_upload_size_bytes_from
    }
  }

  if (typeof validatedParams.storage_max_upload_size_bytes_to === 'number' && !isNaN(validatedParams.storage_max_upload_size_bytes_to)) {
    filterStates[UserFilterValues.STORAGE_MAX_UPLOAD_SIZE_BYTES_TO] = {
      type: 'number',
      value: validatedParams.storage_max_upload_size_bytes_to
    }
  }

  if (typeof validatedParams.is_storage_max_upload_size_bytes_set === 'boolean') {
    filterStates[UserFilterValues.IS_STORAGE_MAX_UPLOAD_SIZE_BYTES_SET] = {
      type: 'boolean',
      value: validatedParams.is_storage_max_upload_size_bytes_set
    }
  }

  if (typeof validatedParams.storage_max_pending_uploads_from === 'number' && !isNaN(validatedParams.storage_max_pending_uploads_from)) {
    filterStates[UserFilterValues.STORAGE_MAX_PENDING_UPLOADS_FROM] = {
      type: 'number',
      value: validatedParams.storage_max_pending_uploads_from
    }
  }

  if (typeof validatedParams.storage_max_pending_uploads_to === 'number' && !isNaN(validatedParams.storage_max_pending_uploads_to)) {
    filterStates[UserFilterValues.STORAGE_MAX_PENDING_UPLOADS_TO] = {
      type: 'number',
      value: validatedParams.storage_max_pending_uploads_to
    }
  }

  if (typeof validatedParams.is_storage_max_pending_uploads_set === 'boolean') {
    filterStates[UserFilterValues.IS_STORAGE_MAX_PENDING_UPLOADS_SET] = {
      type: 'boolean',
      value: validatedParams.is_storage_max_pending_uploads_set
    }
  }

  if (typeof validatedParams.is_storage_configuration_set === 'boolean') {
    filterStates[UserFilterValues.IS_STORAGE_CONFIGURATION_SET] = {
      type: 'boolean',
      value: validatedParams.is_storage_configuration_set
    }
  }

  if (typeof validatedParams.birthdate_from === 'number' && !isNaN(validatedParams.birthdate_from)) {
    filterStates[UserFilterValues.BIRTHDATE_FROM] = {
      type: 'number',
      value: validatedParams.birthdate_from
    }
  }

  if (typeof validatedParams.birthdate_to === 'number' && !isNaN(validatedParams.birthdate_to)) {
    filterStates[UserFilterValues.BIRTHDATE_TO] = {
      type: 'number',
      value: validatedParams.birthdate_to
    }
  }

  if (typeof validatedParams.is_birthdate_set === 'boolean') {
    filterStates[UserFilterValues.IS_BIRTHDATE_SET] = {
      type: 'boolean',
      value: validatedParams.is_birthdate_set
    }
  }

  if (validatedParams.created_at_from) {
    filterStates[UserFilterValues.CREATED_AT_FROM] = {
      type: 'text',
      value: validatedParams.created_at_from
    }
  }

  if (validatedParams.created_at_to) {
    filterStates[UserFilterValues.CREATED_AT_TO] = {
      type: 'text',
      value: validatedParams.created_at_to
    }
  }

  if (validatedParams.updated_at_from) {
    filterStates[UserFilterValues.UPDATED_AT_FROM] = {
      type: 'text',
      value: validatedParams.updated_at_from
    }
  }

  if (validatedParams.updated_at_to) {
    filterStates[UserFilterValues.UPDATED_AT_TO] = {
      type: 'text',
      value: validatedParams.updated_at_to
    }
  }

  if (typeof validatedParams.is_updated_at_set === 'boolean') {
    filterStates[UserFilterValues.IS_UPDATED_AT_SET] = {
      type: 'boolean',
      value: validatedParams.is_updated_at_set
    }
  }

  return { sortState, filterStates }
}

/**
 * Converts listing option states back into global user search parameter format.
 *
 * @param sortState - Current sorting state
 * @param filterStates - Map of current filter states
 * @returns Search parameter object suitable for URL parameter validation
 */
export const listingStatesToSearchParams = (
  sortState: ListingSortState | null,
  filterStates: Record<string, ListingFilterState>
): GlobalUserListSearchParams => {
  const searchParams: GlobalUserListSearchParams = {
    sort_by: 'created_at',
    sort_order: SortOrder.DESC,
    user_id: [],
    user_role: [],
    exclude_user_role: [],
    account_status: [],
    exclude_account_status: [],
    account_status_on_restore: [],
    exclude_account_status_on_restore: [],
    account_lockout_type: [],
    exclude_account_lockout_type: [],
    permission_codes: [],
    exclude_permission_codes: []
  }

  if (sortState) {
    searchParams.sort_by = sortState.optionId
    searchParams.sort_order = sortState.isAscending ? SortOrder.ASC : SortOrder.DESC
  }

  const userIdFilter = filterStates[UserFilterValues.USER_ID]
  if (userIdFilter?.type === 'text' && userIdFilter.value.trim()) {
    searchParams.user_id = [userIdFilter.value.trim()]
  }

  const roleFilter = filterStates[UserFilterValues.ROLE]
  if (roleFilter?.type === 'choice' && roleFilter.selectedIds.size > 0) {
    searchParams.user_role = Array.from(roleFilter.selectedIds)
  }

  const excludeRoleFilter = filterStates[UserFilterValues.EXCLUDE_ROLE]
  if (excludeRoleFilter?.type === 'choice' && excludeRoleFilter.selectedIds.size > 0) {
    searchParams.exclude_user_role = Array.from(excludeRoleFilter.selectedIds)
  }

  const statusFilter = filterStates[UserFilterValues.ACCOUNT_STATUS]
  if (statusFilter?.type === 'choice' && statusFilter.selectedIds.size > 0) {
    searchParams.account_status = Array.from(statusFilter.selectedIds)
  }

  const excludeStatusFilter = filterStates[UserFilterValues.EXCLUDE_ACCOUNT_STATUS]
  if (excludeStatusFilter?.type === 'choice' && excludeStatusFilter.selectedIds.size > 0) {
    searchParams.exclude_account_status = Array.from(excludeStatusFilter.selectedIds)
  }

  const statusOnRestoreFilter = filterStates[UserFilterValues.ACCOUNT_STATUS_ON_RESTORE]
  if (statusOnRestoreFilter?.type === 'choice' && statusOnRestoreFilter.selectedIds.size > 0) {
    searchParams.account_status_on_restore = Array.from(statusOnRestoreFilter.selectedIds)
  }

  const excludeStatusOnRestoreFilter = filterStates[UserFilterValues.EXCLUDE_ACCOUNT_STATUS_ON_RESTORE]
  if (excludeStatusOnRestoreFilter?.type === 'choice' && excludeStatusOnRestoreFilter.selectedIds.size > 0) {
    searchParams.exclude_account_status_on_restore = Array.from(excludeStatusOnRestoreFilter.selectedIds)
  }

  const isStatusOnRestoreSetFilter = filterStates[UserFilterValues.IS_ACCOUNT_STATUS_ON_RESTORE_SET]
  if (isStatusOnRestoreSetFilter?.type === 'boolean') {
    searchParams.is_account_status_on_restore_set = isStatusOnRestoreSetFilter.value
  }

  const lockoutFilter = filterStates[UserFilterValues.ACCOUNT_LOCKOUT_TYPE]
  if (lockoutFilter?.type === 'choice' && lockoutFilter.selectedIds.size > 0) {
    searchParams.account_lockout_type = Array.from(lockoutFilter.selectedIds)
  }

  const excludeLockoutFilter = filterStates[UserFilterValues.EXCLUDE_ACCOUNT_LOCKOUT_TYPE]
  if (excludeLockoutFilter?.type === 'choice' && excludeLockoutFilter.selectedIds.size > 0) {
    searchParams.exclude_account_lockout_type = Array.from(excludeLockoutFilter.selectedIds)
  }

  const totpFilter = filterStates[UserFilterValues.IS_TOTP_ENABLED]
  if (totpFilter?.type === 'boolean') {
    searchParams.is_totp_enabled = totpFilter.value
  }

  const authFromFilter = filterStates[UserFilterValues.AUTHORITY_LEVEL_FROM]
  if (authFromFilter?.type === 'number' && authFromFilter.value != null) {
    searchParams.authority_level_from = authFromFilter.value
  }

  const authToFilter = filterStates[UserFilterValues.AUTHORITY_LEVEL_TO]
  if (authToFilter?.type === 'number' && authToFilter.value != null) {
    searchParams.authority_level_to = authToFilter.value
  }

  const permsFilter = filterStates[UserFilterValues.PERMISSION_CODES]
  if (permsFilter?.type === 'text' && permsFilter.value.trim()) {
    searchParams.permission_codes = [permsFilter.value.trim()]
  }

  const excludePermsFilter = filterStates[UserFilterValues.EXCLUDE_PERMISSION_CODES]
  if (excludePermsFilter?.type === 'text' && excludePermsFilter.value.trim()) {
    searchParams.exclude_permission_codes = [excludePermsFilter.value.trim()]
  }

  const tempLockoutFromFilter = filterStates[UserFilterValues.TEMPORARY_LOCKOUT_UNTIL_FROM]
  if (tempLockoutFromFilter?.type === 'text' && tempLockoutFromFilter.value.trim()) {
    searchParams.temporary_lockout_until_from = tempLockoutFromFilter.value.trim()
  }

  const tempLockoutToFilter = filterStates[UserFilterValues.TEMPORARY_LOCKOUT_UNTIL_TO]
  if (tempLockoutToFilter?.type === 'text' && tempLockoutToFilter.value.trim()) {
    searchParams.temporary_lockout_until_to = tempLockoutToFilter.value.trim()
  }

  const isTempLockoutSetFilter = filterStates[UserFilterValues.IS_TEMPORARY_LOCKOUT_UNTIL_SET]
  if (isTempLockoutSetFilter?.type === 'boolean') {
    searchParams.is_temporary_lockout_until_set = isTempLockoutSetFilter.value
  }

  const lastLoginFromFilter = filterStates[UserFilterValues.LAST_LOGIN_AT_FROM]
  if (lastLoginFromFilter?.type === 'text' && lastLoginFromFilter.value.trim()) {
    searchParams.last_login_at_from = lastLoginFromFilter.value.trim()
  }

  const lastLoginToFilter = filterStates[UserFilterValues.LAST_LOGIN_AT_TO]
  if (lastLoginToFilter?.type === 'text' && lastLoginToFilter.value.trim()) {
    searchParams.last_login_at_to = lastLoginToFilter.value.trim()
  }

  const isLastLoginSetFilter = filterStates[UserFilterValues.IS_LAST_LOGIN_AT_SET]
  if (isLastLoginSetFilter?.type === 'boolean') {
    searchParams.is_last_login_at_set = isLastLoginSetFilter.value
  }

  const lastActiveFromFilter = filterStates[UserFilterValues.LAST_ACTIVE_AT_FROM]
  if (lastActiveFromFilter?.type === 'text' && lastActiveFromFilter.value.trim()) {
    searchParams.last_active_at_from = lastActiveFromFilter.value.trim()
  }

  const lastActiveToFilter = filterStates[UserFilterValues.LAST_ACTIVE_AT_TO]
  if (lastActiveToFilter?.type === 'text' && lastActiveToFilter.value.trim()) {
    searchParams.last_active_at_to = lastActiveToFilter.value.trim()
  }

  const isLastActiveSetFilter = filterStates[UserFilterValues.IS_LAST_ACTIVE_AT_SET]
  if (isLastActiveSetFilter?.type === 'boolean') {
    searchParams.is_last_active_at_set = isLastActiveSetFilter.value
  }

  const scheduledDelFromFilter = filterStates[UserFilterValues.SCHEDULED_PERMANENT_DELETION_AT_FROM]
  if (scheduledDelFromFilter?.type === 'text' && scheduledDelFromFilter.value.trim()) {
    searchParams.scheduled_permanent_deletion_at_from = scheduledDelFromFilter.value.trim()
  }

  const scheduledDelToFilter = filterStates[UserFilterValues.SCHEDULED_PERMANENT_DELETION_AT_TO]
  if (scheduledDelToFilter?.type === 'text' && scheduledDelToFilter.value.trim()) {
    searchParams.scheduled_permanent_deletion_at_to = scheduledDelToFilter.value.trim()
  }

  const isScheduledDelSetFilter = filterStates[UserFilterValues.IS_SCHEDULED_PERMANENT_DELETION_AT_SET]
  if (isScheduledDelSetFilter?.type === 'boolean') {
    searchParams.is_scheduled_permanent_deletion_at_set = isScheduledDelSetFilter.value
  }

  const quotaFromFilter = filterStates[UserFilterValues.STORAGE_QUOTA_BYTES_FROM]
  if (quotaFromFilter?.type === 'number' && quotaFromFilter.value != null) {
    searchParams.storage_quota_bytes_from = quotaFromFilter.value
  }

  const quotaToFilter = filterStates[UserFilterValues.STORAGE_QUOTA_BYTES_TO]
  if (quotaToFilter?.type === 'number' && quotaToFilter.value != null) {
    searchParams.storage_quota_bytes_to = quotaToFilter.value
  }

  const isQuotaSetFilter = filterStates[UserFilterValues.IS_STORAGE_QUOTA_BYTES_SET]
  if (isQuotaSetFilter?.type === 'boolean') {
    searchParams.is_storage_quota_bytes_set = isQuotaSetFilter.value
  }

  const maxUploadFromFilter = filterStates[UserFilterValues.STORAGE_MAX_UPLOAD_SIZE_BYTES_FROM]
  if (maxUploadFromFilter?.type === 'number' && maxUploadFromFilter.value != null) {
    searchParams.storage_max_upload_size_bytes_from = maxUploadFromFilter.value
  }

  const maxUploadToFilter = filterStates[UserFilterValues.STORAGE_MAX_UPLOAD_SIZE_BYTES_TO]
  if (maxUploadToFilter?.type === 'number' && maxUploadToFilter.value != null) {
    searchParams.storage_max_upload_size_bytes_to = maxUploadToFilter.value
  }

  const isMaxUploadSetFilter = filterStates[UserFilterValues.IS_STORAGE_MAX_UPLOAD_SIZE_BYTES_SET]
  if (isMaxUploadSetFilter?.type === 'boolean') {
    searchParams.is_storage_max_upload_size_bytes_set = isMaxUploadSetFilter.value
  }

  const maxPendingFromFilter = filterStates[UserFilterValues.STORAGE_MAX_PENDING_UPLOADS_FROM]
  if (maxPendingFromFilter?.type === 'number' && maxPendingFromFilter.value != null) {
    searchParams.storage_max_pending_uploads_from = maxPendingFromFilter.value
  }

  const maxPendingToFilter = filterStates[UserFilterValues.STORAGE_MAX_PENDING_UPLOADS_TO]
  if (maxPendingToFilter?.type === 'number' && maxPendingToFilter.value != null) {
    searchParams.storage_max_pending_uploads_to = maxPendingToFilter.value
  }

  const isMaxPendingSetFilter = filterStates[UserFilterValues.IS_STORAGE_MAX_PENDING_UPLOADS_SET]
  if (isMaxPendingSetFilter?.type === 'boolean') {
    searchParams.is_storage_max_pending_uploads_set = isMaxPendingSetFilter.value
  }

  const isStorageConfigSetFilter = filterStates[UserFilterValues.IS_STORAGE_CONFIGURATION_SET]
  if (isStorageConfigSetFilter?.type === 'boolean') {
    searchParams.is_storage_configuration_set = isStorageConfigSetFilter.value
  }

  const nicknameFilter = filterStates[UserFilterValues.NICKNAME]
  if (nicknameFilter?.type === 'text' && nicknameFilter.value.trim()) {
    searchParams.nickname = nicknameFilter.value.trim()
  }

  const isNicknameSetFilter = filterStates[UserFilterValues.IS_NICKNAME_SET]
  if (isNicknameSetFilter?.type === 'boolean') {
    searchParams.is_nickname_set = isNicknameSetFilter.value
  }

  const displayNameFilter = filterStates[UserFilterValues.DISPLAY_NAME]
  if (displayNameFilter?.type === 'text' && displayNameFilter.value.trim()) {
    searchParams.display_name = displayNameFilter.value.trim()
  }

  const isDisplayNameSetFilter = filterStates[UserFilterValues.IS_DISPLAY_NAME_SET]
  if (isDisplayNameSetFilter?.type === 'boolean') {
    searchParams.is_display_name_set = isDisplayNameSetFilter.value
  }

  const isAvatarSetFilter = filterStates[UserFilterValues.IS_AVATAR_SET]
  if (isAvatarSetFilter?.type === 'boolean') {
    searchParams.is_avatar_set = isAvatarSetFilter.value
  }

  const birthdateFromFilter = filterStates[UserFilterValues.BIRTHDATE_FROM]
  if (birthdateFromFilter?.type === 'number' && birthdateFromFilter.value != null) {
    searchParams.birthdate_from = birthdateFromFilter.value
  }

  const birthdateToFilter = filterStates[UserFilterValues.BIRTHDATE_TO]
  if (birthdateToFilter?.type === 'number' && birthdateToFilter.value != null) {
    searchParams.birthdate_to = birthdateToFilter.value
  }

  const isBirthdateSetFilter = filterStates[UserFilterValues.IS_BIRTHDATE_SET]
  if (isBirthdateSetFilter?.type === 'boolean') {
    searchParams.is_birthdate_set = isBirthdateSetFilter.value
  }

  const createdAtFromFilter = filterStates[UserFilterValues.CREATED_AT_FROM]
  if (createdAtFromFilter?.type === 'text' && createdAtFromFilter.value.trim()) {
    searchParams.created_at_from = createdAtFromFilter.value.trim()
  }

  const createdAtToFilter = filterStates[UserFilterValues.CREATED_AT_TO]
  if (createdAtToFilter?.type === 'text' && createdAtToFilter.value.trim()) {
    searchParams.created_at_to = createdAtToFilter.value.trim()
  }

  const updatedAtFromFilter = filterStates[UserFilterValues.UPDATED_AT_FROM]
  if (updatedAtFromFilter?.type === 'text' && updatedAtFromFilter.value.trim()) {
    searchParams.updated_at_from = updatedAtFromFilter.value.trim()
  }

  const updatedAtToFilter = filterStates[UserFilterValues.UPDATED_AT_TO]
  if (updatedAtToFilter?.type === 'text' && updatedAtToFilter.value.trim()) {
    searchParams.updated_at_to = updatedAtToFilter.value.trim()
  }

  const isUpdatedAtSetFilter = filterStates[UserFilterValues.IS_UPDATED_AT_SET]
  if (isUpdatedAtSetFilter?.type === 'boolean') {
    searchParams.is_updated_at_set = isUpdatedAtSetFilter.value
  }

  const searchQueryFilter = filterStates[UserFilterValues.SEARCH_QUERY]
  if (searchQueryFilter?.type === 'text' && searchQueryFilter.value.trim()) {
    searchParams.search_query = searchQueryFilter.value.trim()
  }

  return searchParams
}
