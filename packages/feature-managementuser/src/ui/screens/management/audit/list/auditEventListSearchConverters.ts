import { AuditFilterValues, SortOrder } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuditEventListParams } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AuditEventListSearchParams } from '@/ui/screens/management/audit/list/auditEventListSearchSchema'

/** State representation of audit event list sorting and filtering options. */
export interface AuditEventListingOptionsState {
  /** Selected sorting option state. */
  sortState: ListingSortState | null
  /** Map of filter identifiers to their current filter states. */
  filterStates: Record<string, ListingFilterState>
}

/**
 * Converts audit event list search parameters into listing option states.
 *
 * @param params - Search parameters in snake_case (URL) or camelCase (internal) format
 * @returns Parsed listing options state containing sort and filter states
 */
export const searchParamsToListingStates = (
  params?: ManagementAuditEventListParams | AuditEventListSearchParams
): AuditEventListingOptionsState => {
  if (!params) {
    return { sortState: null, filterStates: {} }
  }

  const sortBy = 'sort_by' in params ? params.sort_by : ('sortBy' in params ? params.sortBy : undefined)
  const sortOrder = 'sort_order' in params ? params.sort_order : ('sortOrder' in params ? params.sortOrder : undefined)
  const actorIds = 'actor_id' in params ? params.actor_id : ('actorIds' in params ? params.actorIds : undefined)
  const actorTypes = 'actor_type' in params ? params.actor_type : ('actorTypes' in params ? params.actorTypes : undefined)
  const actorUserRoles = 'actor_user_role' in params ? params.actor_user_role : ('actorUserRoles' in params ? params.actorUserRoles : undefined)
  const actions = 'action' in params ? params.action : ('actions' in params ? params.actions : undefined)
  const resources = 'resource' in params ? params.resource : ('resources' in params ? params.resources : undefined)
  const resourceIds = 'resource_id' in params ? params.resource_id : ('resourceIds' in params ? params.resourceIds : undefined)
  const statuses = 'status' in params ? params.status : ('statuses' in params ? params.statuses : undefined)
  const messages = 'message' in params ? params.message : ('messages' in params ? params.messages : undefined)

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

/**
 * Converts listing option states back into search parameter format.
 *
 * @param sortState - Current sorting state
 * @param filterStates - Map of current filter states
 * @returns Search parameter object suitable for URL parameter validation
 */
export const listingStatesToSearchParams = (
  sortState: ListingSortState | null,
  filterStates: Record<string, ListingFilterState>
): AuditEventListSearchParams => {
  const searchParams: AuditEventListSearchParams = {
    sort_by: 'created_at',
    sort_order: SortOrder.DESC,
    actor_id: [],
    actor_type: [],
    actor_user_role: [],
    action: [],
    resource: [],
    resource_id: [],
    status: [],
    message: []
  }

  if (sortState) {
    searchParams.sort_by = sortState.optionId
    searchParams.sort_order = sortState.isAscending ? SortOrder.ASC : SortOrder.DESC
  }

  const actorIdFilter = filterStates[AuditFilterValues.AuditEventFilterValues.ACTOR_ID]
  if (actorIdFilter?.type === 'text' && actorIdFilter.value.trim()) {
    searchParams.actor_id = [actorIdFilter.value.trim()]
  }

  const actorTypeFilter = filterStates[AuditFilterValues.AuditEventFilterValues.ACTOR_TYPE]
  if (actorTypeFilter?.type === 'choice' && actorTypeFilter.selectedIds.size > 0) {
    searchParams.actor_type = Array.from(actorTypeFilter.selectedIds)
  }

  const actorRoleFilter = filterStates[AuditFilterValues.AuditEventFilterValues.ACTOR_USER_ROLE]
  if (actorRoleFilter?.type === 'choice' && actorRoleFilter.selectedIds.size > 0) {
    searchParams.actor_user_role = Array.from(actorRoleFilter.selectedIds)
  }

  const actionFilter = filterStates[AuditFilterValues.AuditEventFilterValues.ACTION]
  if (actionFilter?.type === 'text' && actionFilter.value.trim()) {
    searchParams.action = [actionFilter.value.trim()]
  }

  const resourceFilter = filterStates[AuditFilterValues.AuditEventFilterValues.RESOURCE]
  if (resourceFilter?.type === 'text' && resourceFilter.value.trim()) {
    searchParams.resource = [resourceFilter.value.trim()]
  }

  const resourceIdFilter = filterStates[AuditFilterValues.AuditEventFilterValues.RESOURCE_ID]
  if (resourceIdFilter?.type === 'text' && resourceIdFilter.value.trim()) {
    searchParams.resource_id = [resourceIdFilter.value.trim()]
  }

  const statusFilter = filterStates[AuditFilterValues.AuditEventFilterValues.STATUS]
  if (statusFilter?.type === 'choice' && statusFilter.selectedIds.size > 0) {
    searchParams.status = Array.from(statusFilter.selectedIds)
  }

  const messageFilter = filterStates[AuditFilterValues.AuditEventFilterValues.MESSAGE]
  if (messageFilter?.type === 'text' && messageFilter.value.trim()) {
    searchParams.message = [messageFilter.value.trim()]
  }

  return searchParams
}
