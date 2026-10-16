import { AuditFilterValues, SortOrder } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuditEventListParams } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AuditEventListSearchParams } from '@/ui/screens/management/audit/list/auditEventListSearchSchema'

export interface AuditEventListingOptionsState {
  sortState: ListingSortState | null
  filterStates: Record<string, ListingFilterState>
}

export const searchParamsToListingStates = (
  params?: ManagementAuditEventListParams | AuditEventListSearchParams
): AuditEventListingOptionsState => {
  if (!params) {
    return { sortState: null, filterStates: {} }
  }

  // Handle both snake_case (URL) and camelCase (internal)
  const p = params as ManagementAuditEventListParams & AuditEventListSearchParams
  const sortBy = 'sort_by' in params ? params.sort_by : p.sortBy
  const sortOrder = 'sort_order' in params ? params.sort_order : p.sortOrder
  const actorIds = 'actor_ids' in params ? params.actor_ids : p.actorIds
  const actorTypes = 'actor_types' in params ? params.actor_types : p.actorTypes
  const actorUserRoles = 'actor_user_roles' in params ? params.actor_user_roles : p.actorUserRoles
  const actions = 'actions' in params ? params.actions : p.actions
  const resources = 'resources' in params ? params.resources : p.resources
  const resourceIds = 'resource_ids' in params ? params.resource_ids : p.resourceIds
  const statuses = 'statuses' in params ? params.statuses : p.statuses
  const messages = 'messages' in params ? params.messages : p.messages

  const sortState: ListingSortState | null = sortBy
    ? {
        optionId: sortBy,
        isAscending: sortOrder === SortOrder.ASC
      }
    : null

  const filterStates: Record<string, ListingFilterState> = {}

  if (actorIds && actorIds.length > 0) {
    filterStates[AuditFilterValues.AuditEventFilterValues.ACTOR_ID] = {
      type: 'text',
      value: actorIds[0] ?? ''
    }
  }

  if (actorTypes && actorTypes.length > 0) {
    filterStates[AuditFilterValues.AuditEventFilterValues.ACTOR_TYPE] = {
      type: 'choice',
      selectedIds: new Set(actorTypes)
    }
  }

  if (actorUserRoles && actorUserRoles.length > 0) {
    filterStates[AuditFilterValues.AuditEventFilterValues.ACTOR_USER_ROLE] = {
      type: 'choice',
      selectedIds: new Set(actorUserRoles)
    }
  }

  if (actions && actions.length > 0) {
    filterStates[AuditFilterValues.AuditEventFilterValues.ACTION] = {
      type: 'text',
      value: actions[0] ?? ''
    }
  }

  if (resources && resources.length > 0) {
    filterStates[AuditFilterValues.AuditEventFilterValues.RESOURCE] = {
      type: 'text',
      value: resources[0] ?? ''
    }
  }

  if (resourceIds && resourceIds.length > 0) {
    filterStates[AuditFilterValues.AuditEventFilterValues.RESOURCE_ID] = {
      type: 'text',
      value: resourceIds[0] ?? ''
    }
  }

  if (statuses && statuses.length > 0) {
    filterStates[AuditFilterValues.AuditEventFilterValues.STATUS] = {
      type: 'choice',
      selectedIds: new Set(statuses)
    }
  }

  if (messages && messages.length > 0) {
    filterStates[AuditFilterValues.AuditEventFilterValues.MESSAGE] = {
      type: 'text',
      value: messages[0] ?? ''
    }
  }

  return { sortState, filterStates }
}

export const listingStatesToSearchParams = (
  sortState: ListingSortState | null,
  filterStates: Record<string, ListingFilterState>
): AuditEventListSearchParams => {
  const params: AuditEventListSearchParams = {
    sort_by: 'created_at',
    sort_order: SortOrder.DESC,
    actor_ids: [],
    actor_types: [],
    actor_user_roles: [],
    actions: [],
    resources: [],
    resource_ids: [],
    statuses: [],
    messages: []
  }

  if (sortState) {
    params.sort_by = sortState.optionId
    params.sort_order = sortState.isAscending ? SortOrder.ASC : SortOrder.DESC
  }

  const actorIdFilter = filterStates[AuditFilterValues.AuditEventFilterValues.ACTOR_ID]
  if (actorIdFilter?.type === 'text' && actorIdFilter.value.trim()) {
    params.actor_ids = [actorIdFilter.value.trim()]
  }

  const actorTypeFilter = filterStates[AuditFilterValues.AuditEventFilterValues.ACTOR_TYPE]
  if (actorTypeFilter?.type === 'choice' && actorTypeFilter.selectedIds.size > 0) {
    params.actor_types = Array.from(actorTypeFilter.selectedIds)
  }

  const actorRoleFilter = filterStates[AuditFilterValues.AuditEventFilterValues.ACTOR_USER_ROLE]
  if (actorRoleFilter?.type === 'choice' && actorRoleFilter.selectedIds.size > 0) {
    params.actor_user_roles = Array.from(actorRoleFilter.selectedIds)
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
    params.resource_ids = [resourceIdFilter.value.trim()]
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
