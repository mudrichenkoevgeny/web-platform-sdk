import { SortOrder, UserFilterValues } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserListParams } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { GlobalUserListSearchParams } from '@/ui/screens/management/user/global-list/globalUserListSearchSchema'

/** State representation of global user list sorting and filtering options. */
export interface GlobalUserListingOptionsState {
  /** Selected sorting option state. */
  sortState: ListingSortState | null
  /** Map of filter identifiers to their current filter states. */
  filterStates: Record<string, ListingFilterState>
}

/**
 * Converts global user list search parameters into listing option states.
 *
 * @param params - Search parameters in snake_case (URL) or camelCase (internal) format
 * @returns Parsed listing options state containing sort and filter states
 */
export const searchParamsToListingStates = (
  params?: ManagementUserListParams | GlobalUserListSearchParams
): GlobalUserListingOptionsState => {
  if (!params) {
    return { sortState: null, filterStates: {} }
  }

  const sortBy = 'sort_by' in params ? params.sort_by : ('sortBy' in params ? params.sortBy : undefined)
  const sortOrder = 'sort_order' in params ? params.sort_order : ('sortOrder' in params ? params.sortOrder : undefined)
  const userRoles = 'user_role' in params ? params.user_role : ('userRoles' in params ? params.userRoles : undefined)
  const accountStatuses = 'account_status' in params ? params.account_status : ('accountStatuses' in params ? params.accountStatuses : undefined)
  const accountLockoutTypes = 'account_lockout_type' in params ? params.account_lockout_type : ('accountLockoutTypes' in params ? params.accountLockoutTypes : undefined)
  const authorityLevelFrom = 'authority_level_from' in params ? params.authority_level_from : ('authorityLevelFrom' in params ? params.authorityLevelFrom : undefined)
  const authorityLevelTo = 'authority_level_to' in params ? params.authority_level_to : ('authorityLevelTo' in params ? params.authorityLevelTo : undefined)
  const isTotpEnabled = 'is_totp_enabled' in params ? params.is_totp_enabled : ('isTotpEnabled' in params ? params.isTotpEnabled : undefined)

  const sortState: ListingSortState | null = sortBy
    ? {
        optionId: sortBy,
        isAscending: sortOrder === SortOrder.ASC
      }
    : null

  const filterStates: Record<string, ListingFilterState> = {}

  if (Array.isArray(userRoles) && userRoles.length > 0) {
    filterStates[UserFilterValues.UserFilterValues.ROLE] = {
      type: 'choice',
      selectedIds: new Set(userRoles)
    }
  }

  if (Array.isArray(accountStatuses) && accountStatuses.length > 0) {
    filterStates[UserFilterValues.UserFilterValues.ACCOUNT_STATUS] = {
      type: 'choice',
      selectedIds: new Set(accountStatuses)
    }
  }

  if (Array.isArray(accountLockoutTypes) && accountLockoutTypes.length > 0) {
    filterStates[UserFilterValues.UserFilterValues.ACCOUNT_LOCKOUT_TYPE] = {
      type: 'choice',
      selectedIds: new Set(accountLockoutTypes)
    }
  }

  if (typeof isTotpEnabled === 'boolean') {
    filterStates[UserFilterValues.UserFilterValues.IS_TOTP_ENABLED] = {
      type: 'boolean',
      value: isTotpEnabled
    }
  }

  if (typeof authorityLevelFrom === 'number' && !isNaN(authorityLevelFrom)) {
    filterStates[UserFilterValues.UserFilterValues.AUTHORITY_LEVEL_FROM] = {
      type: 'number',
      value: authorityLevelFrom
    }
  }

  if (typeof authorityLevelTo === 'number' && !isNaN(authorityLevelTo)) {
    filterStates[UserFilterValues.UserFilterValues.AUTHORITY_LEVEL_TO] = {
      type: 'number',
      value: authorityLevelTo
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
    user_role: [],
    account_status: [],
    account_lockout_type: []
  }

  if (sortState) {
    searchParams.sort_by = sortState.optionId
    searchParams.sort_order = sortState.isAscending ? SortOrder.ASC : SortOrder.DESC
  }

  const roleFilter = filterStates[UserFilterValues.UserFilterValues.ROLE]
  if (roleFilter?.type === 'choice' && roleFilter.selectedIds.size > 0) {
    searchParams.user_role = Array.from(roleFilter.selectedIds)
  }

  const statusFilter = filterStates[UserFilterValues.UserFilterValues.ACCOUNT_STATUS]
  if (statusFilter?.type === 'choice' && statusFilter.selectedIds.size > 0) {
    searchParams.account_status = Array.from(statusFilter.selectedIds)
  }

  const lockoutFilter = filterStates[UserFilterValues.UserFilterValues.ACCOUNT_LOCKOUT_TYPE]
  if (lockoutFilter?.type === 'choice' && lockoutFilter.selectedIds.size > 0) {
    searchParams.account_lockout_type = Array.from(lockoutFilter.selectedIds)
  }

  const totpFilter = filterStates[UserFilterValues.UserFilterValues.IS_TOTP_ENABLED]
  if (totpFilter?.type === 'boolean') {
    searchParams.is_totp_enabled = totpFilter.value
  }

  const authFromFilter = filterStates[UserFilterValues.UserFilterValues.AUTHORITY_LEVEL_FROM]
  if (authFromFilter?.type === 'number' && authFromFilter.value != null) {
    searchParams.authority_level_from = authFromFilter.value
  }

  const authToFilter = filterStates[UserFilterValues.UserFilterValues.AUTHORITY_LEVEL_TO]
  if (authToFilter?.type === 'number' && authToFilter.value != null) {
    searchParams.authority_level_to = authToFilter.value
  }

  return searchParams
}
