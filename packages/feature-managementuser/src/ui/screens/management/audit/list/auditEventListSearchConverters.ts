import { AuditFilterValues } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AuditEventListSearchParams } from './auditEventListSearchSchema'

export interface ListingOptionsState {
  sortState: ListingSortState | null
  filterStates: Record<string, ListingFilterState>
}

export const searchParamsToListingStates = (
  params?: AuditEventListSearchParams
): ListingOptionsState => {
  if (!params) {
    return { sortState: null, filterStates: {} }
  }

  const sortState: ListingSortState | null = params.sortBy
    ? {
        optionId: params.sortBy,
        isAscending: params.sortOrder === 'ASC'
      }
    : null

  const filterStates: Record<string, ListingFilterState> = {}

  if (params.actorIds && params.actorIds.length > 0) {
    filterStates[AuditFilterValues.AuditEventFilterValues.ACTOR_ID] = {
      type: 'text',
      value: params.actorIds[0] ?? ''
    }
  }

  if (params.actorTypes && params.actorTypes.length > 0) {
    filterStates[AuditFilterValues.AuditEventFilterValues.ACTOR_TYPE] = {
      type: 'choice',
      selectedIds: new Set(params.actorTypes)
    }
  }

  if (params.actorUserRoles && params.actorUserRoles.length > 0) {
    filterStates[AuditFilterValues.AuditEventFilterValues.ACTOR_USER_ROLE] = {
      type: 'choice',
      selectedIds: new Set(params.actorUserRoles)
    }
  }

  if (params.actions && params.actions.length > 0) {
    filterStates[AuditFilterValues.AuditEventFilterValues.ACTION] = {
      type: 'text',
      value: params.actions[0] ?? ''
    }
  }

  if (params.resources && params.resources.length > 0) {
    filterStates[AuditFilterValues.AuditEventFilterValues.RESOURCE] = {
      type: 'text',
      value: params.resources[0] ?? ''
    }
  }

  if (params.resourceIds && params.resourceIds.length > 0) {
    filterStates[AuditFilterValues.AuditEventFilterValues.RESOURCE_ID] = {
      type: 'text',
      value: params.resourceIds[0] ?? ''
    }
  }

  if (params.statuses && params.statuses.length > 0) {
    filterStates[AuditFilterValues.AuditEventFilterValues.STATUS] = {
      type: 'choice',
      selectedIds: new Set(params.statuses)
    }
  }

  if (params.messages && params.messages.length > 0) {
    filterStates[AuditFilterValues.AuditEventFilterValues.MESSAGE] = {
      type: 'text',
      value: params.messages[0] ?? ''
    }
  }

  return { sortState, filterStates }
}

export const listingStatesToSearchParams = (
  sortState: ListingSortState | null,
  filterStates: Record<string, ListingFilterState>
): AuditEventListSearchParams => {
  const params: AuditEventListSearchParams = {}

  if (sortState) {
    params.sortBy = sortState.optionId
    params.sortOrder = sortState.isAscending ? 'ASC' : 'DESC'
  }

  const actorIdFilter = filterStates[AuditFilterValues.AuditEventFilterValues.ACTOR_ID]
  if (actorIdFilter?.type === 'text' && actorIdFilter.value.trim()) {
    params.actorIds = [actorIdFilter.value.trim()]
  }

  const actorTypeFilter = filterStates[AuditFilterValues.AuditEventFilterValues.ACTOR_TYPE]
  if (actorTypeFilter?.type === 'choice' && actorTypeFilter.selectedIds.size > 0) {
    params.actorTypes = Array.from(actorTypeFilter.selectedIds)
  }

  const actorRoleFilter = filterStates[AuditFilterValues.AuditEventFilterValues.ACTOR_USER_ROLE]
  if (actorRoleFilter?.type === 'choice' && actorRoleFilter.selectedIds.size > 0) {
    params.actorUserRoles = Array.from(actorRoleFilter.selectedIds)
  }

  const actionFilter = filterStates[AuditFilterValues.AuditEventFilterValues.ACTION]
  if (actionFilter?.type === 'text' && actionFilter.value.trim()) {
    params.actions = [actionFilter.value.trim()]
  }

  const resourceFilter = filterStates[AuditFilterValues.AuditEventFilterValues.RESOURCE]
  if (resourceFilter?.type === 'text' && resourceFilter.value.trim()) {
    params.resources = [resourceFilter.value.trim()]
  }

  const resourceIdFilter = filterStates[AuditFilterValues.AuditEventFilterValues.RESOURCE_ID]
  if (resourceIdFilter?.type === 'text' && resourceIdFilter.value.trim()) {
    params.resourceIds = [resourceIdFilter.value.trim()]
  }

  const statusFilter = filterStates[AuditFilterValues.AuditEventFilterValues.STATUS]
  if (statusFilter?.type === 'choice' && statusFilter.selectedIds.size > 0) {
    params.statuses = Array.from(statusFilter.selectedIds)
  }

  const messageFilter = filterStates[AuditFilterValues.AuditEventFilterValues.MESSAGE]
  if (messageFilter?.type === 'text' && messageFilter.value.trim()) {
    params.messages = [messageFilter.value.trim()]
  }

  return params
}
