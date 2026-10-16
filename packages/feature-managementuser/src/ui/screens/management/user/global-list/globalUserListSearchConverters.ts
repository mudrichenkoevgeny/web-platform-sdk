import { SortOrder, UserFilterValues } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserListParams } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { GlobalUserListSearchParams } from '@/ui/screens/management/user/global-list/globalUserListSearchSchema'

export interface GlobalUserListingOptionsState {
  sortState: ListingSortState | null
  filterStates: Record<string, ListingFilterState>
}

export const searchParamsToListingStates = (
  params?: ManagementUserListParams | GlobalUserListSearchParams
): GlobalUserListingOptionsState => {
  if (!params) {
    return { sortState: null, filterStates: {} }
  }

  const p = params as ManagementUserListParams & GlobalUserListSearchParams
  const sortBy = 'sort_by' in params ? params.sort_by : p.sortBy
  const sortOrder = 'sort_order' in params ? params.sort_order : p.sortOrder
  const userRoles = 'user_roles' in params ? params.user_roles : p.userRoles
  const accountStatuses = 'account_statuses' in params ? params.account_statuses : p.accountStatuses
  const accountLockoutTypes = 'account_lockout_types' in params ? params.account_lockout_types : p.accountLockoutTypes
  const authorityLevelFrom = 'authority_level_from' in params ? params.authority_level_from : p.authorityLevelFrom
  const authorityLevelTo = 'authority_level_to' in params ? params.authority_level_to : p.authorityLevelTo
  const isTotpEnabled = 'is_totp_enabled' in params ? params.is_totp_enabled : p.isTotpEnabled

  const sortState: ListingSortState | null = sortBy
    ? {
        optionId: sortBy,
        isAscending: sortOrder === SortOrder.ASC
      }
    : null

  const filterStates: Record<string, ListingFilterState> = {}

  if (userRoles && userRoles.length > 0) {
    filterStates[UserFilterValues.UserFilterValues.ROLE] = {
      type: 'choice',
      selectedIds: new Set(userRoles)
    }
  }

  if (accountStatuses && accountStatuses.length > 0) {
    filterStates[UserFilterValues.UserFilterValues.ACCOUNT_STATUS] = {
      type: 'choice',
      selectedIds: new Set(accountStatuses)
    }
  }

  if (accountLockoutTypes && accountLockoutTypes.length > 0) {
    filterStates[UserFilterValues.UserFilterValues.ACCOUNT_LOCKOUT_TYPE] = {
      type: 'choice',
      selectedIds: new Set(accountLockoutTypes)
    }
  }

  if (isTotpEnabled != null) {
    filterStates[UserFilterValues.UserFilterValues.IS_TOTP_ENABLED] = {
      type: 'boolean',
      value: isTotpEnabled
    }
  }

  if (authorityLevelFrom != null) {
    filterStates[UserFilterValues.UserFilterValues.AUTHORITY_LEVEL_FROM] = {
      type: 'number',
      value: authorityLevelFrom
    }
  }

  if (authorityLevelTo != null) {
    filterStates[UserFilterValues.UserFilterValues.AUTHORITY_LEVEL_TO] = {
      type: 'number',
      value: authorityLevelTo
    }
  }

  return { sortState, filterStates }
}

export const listingStatesToSearchParams = (
  sortState: ListingSortState | null,
  filterStates: Record<string, ListingFilterState>
): GlobalUserListSearchParams => {
  const params: GlobalUserListSearchParams = {
    sort_by: 'created_at',
    sort_order: SortOrder.DESC,
    user_roles: [],
    account_statuses: [],
    account_lockout_types: []
  }

  if (sortState) {
    params.sort_by = sortState.optionId
    params.sort_order = sortState.isAscending ? SortOrder.ASC : SortOrder.DESC
  }

  const roleFilter = filterStates[UserFilterValues.UserFilterValues.ROLE]
  if (roleFilter?.type === 'choice' && roleFilter.selectedIds.size > 0) {
    params.user_roles = Array.from(roleFilter.selectedIds)
  }

  const statusFilter = filterStates[UserFilterValues.UserFilterValues.ACCOUNT_STATUS]
  if (statusFilter?.type === 'choice' && statusFilter.selectedIds.size > 0) {
    params.account_statuses = Array.from(statusFilter.selectedIds)
  }

  const lockoutFilter = filterStates[UserFilterValues.UserFilterValues.ACCOUNT_LOCKOUT_TYPE]
  if (lockoutFilter?.type === 'choice' && lockoutFilter.selectedIds.size > 0) {
    params.account_lockout_types = Array.from(lockoutFilter.selectedIds)
  }

  const totpFilter = filterStates[UserFilterValues.UserFilterValues.IS_TOTP_ENABLED]
  if (totpFilter?.type === 'boolean') {
    params.is_totp_enabled = totpFilter.value
  }

  const authFromFilter = filterStates[UserFilterValues.UserFilterValues.AUTHORITY_LEVEL_FROM]
  if (authFromFilter?.type === 'number' && authFromFilter.value != null) {
    params.authority_level_from = authFromFilter.value
  }

  const authToFilter = filterStates[UserFilterValues.UserFilterValues.AUTHORITY_LEVEL_TO]
  if (authToFilter?.type === 'number' && authToFilter.value != null) {
    params.authority_level_to = authToFilter.value
  }

  return params
}
