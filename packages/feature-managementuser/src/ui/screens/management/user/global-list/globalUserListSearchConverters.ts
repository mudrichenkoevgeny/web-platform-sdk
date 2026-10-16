import { SortOrder, UserFilterValues } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserListParams } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

export interface GlobalUserListingOptionsState {
  sortState: ListingSortState | null
  filterStates: Record<string, ListingFilterState>
}

export const searchParamsToListingStates = (
  params?: ManagementUserListParams
): GlobalUserListingOptionsState => {
  if (!params) {
    return { sortState: null, filterStates: {} }
  }

  const sortState: ListingSortState | null = params.sortBy
    ? {
        optionId: params.sortBy,
        isAscending: params.sortOrder === SortOrder.ASC
      }
    : null

  const filterStates: Record<string, ListingFilterState> = {}

  if (params.userRoles && params.userRoles.length > 0) {
    filterStates[UserFilterValues.UserFilterValues.ROLE] = {
      type: 'choice',
      selectedIds: new Set(params.userRoles)
    }
  }

  if (params.accountStatuses && params.accountStatuses.length > 0) {
    filterStates[UserFilterValues.UserFilterValues.ACCOUNT_STATUS] = {
      type: 'choice',
      selectedIds: new Set(params.accountStatuses)
    }
  }

  if (params.accountLockoutTypes && params.accountLockoutTypes.length > 0) {
    filterStates[UserFilterValues.UserFilterValues.ACCOUNT_LOCKOUT_TYPE] = {
      type: 'choice',
      selectedIds: new Set(params.accountLockoutTypes)
    }
  }

  if (params.isTotpEnabled != null) {
    filterStates[UserFilterValues.UserFilterValues.IS_TOTP_ENABLED] = {
      type: 'boolean',
      value: params.isTotpEnabled
    }
  }

  if (params.authorityLevelFrom != null) {
    filterStates[UserFilterValues.UserFilterValues.AUTHORITY_LEVEL_FROM] = {
      type: 'number',
      value: params.authorityLevelFrom
    }
  }

  if (params.authorityLevelTo != null) {
    filterStates[UserFilterValues.UserFilterValues.AUTHORITY_LEVEL_TO] = {
      type: 'number',
      value: params.authorityLevelTo
    }
  }

  return { sortState, filterStates }
}

export const listingStatesToSearchParams = (
  sortState: ListingSortState | null,
  filterStates: Record<string, ListingFilterState>
): ManagementUserListParams => {
  const params: ManagementUserListParams = {
    pageNumber: 1,
    pageSize: 20,
    sortBy: 'created_at',
    sortOrder: SortOrder.DESC,
    userRoles: [],
    accountStatuses: [],
    accountLockoutTypes: []
  }

  if (sortState) {
    params.sortBy = sortState.optionId as NonNullable<ManagementUserListParams['sortBy']>
    params.sortOrder = sortState.isAscending ? SortOrder.ASC : SortOrder.DESC
  }

  const roleFilter = filterStates[UserFilterValues.UserFilterValues.ROLE]
  if (roleFilter?.type === 'choice' && roleFilter.selectedIds.size > 0) {
    params.userRoles = Array.from(roleFilter.selectedIds) as NonNullable<ManagementUserListParams['userRoles']>
  }

  const statusFilter = filterStates[UserFilterValues.UserFilterValues.ACCOUNT_STATUS]
  if (statusFilter?.type === 'choice' && statusFilter.selectedIds.size > 0) {
    params.accountStatuses = Array.from(statusFilter.selectedIds) as NonNullable<ManagementUserListParams['accountStatuses']>
  }

  const lockoutFilter = filterStates[UserFilterValues.UserFilterValues.ACCOUNT_LOCKOUT_TYPE]
  if (lockoutFilter?.type === 'choice' && lockoutFilter.selectedIds.size > 0) {
    params.accountLockoutTypes = Array.from(lockoutFilter.selectedIds) as NonNullable<ManagementUserListParams['accountLockoutTypes']>
  }

  const totpFilter = filterStates[UserFilterValues.UserFilterValues.IS_TOTP_ENABLED]
  if (totpFilter?.type === 'boolean') {
    params.isTotpEnabled = totpFilter.value
  }

  const authFromFilter = filterStates[UserFilterValues.UserFilterValues.AUTHORITY_LEVEL_FROM]
  if (authFromFilter?.type === 'number' && authFromFilter.value != null) {
    params.authorityLevelFrom = authFromFilter.value
  }

  const authToFilter = filterStates[UserFilterValues.UserFilterValues.AUTHORITY_LEVEL_TO]
  if (authToFilter?.type === 'number' && authToFilter.value != null) {
    params.authorityLevelTo = authToFilter.value
  }

  return params
}
