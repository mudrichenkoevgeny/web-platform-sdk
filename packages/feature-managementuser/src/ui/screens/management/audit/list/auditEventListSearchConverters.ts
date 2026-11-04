import { AuditEventFilterValues, SortOrder } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AuditEventListSearchParams } from '@/ui/screens/management/audit/list/auditEventListSearchSchema'
import { auditEventListSearchSchema } from '@/ui/screens/management/audit/list/auditEventListSearchSchema'

/** State representation of audit event list sorting and filtering options. */
export interface AuditEventListingOptionsState {
  /** Selected sorting option state. */
  sortState: ListingSortState | null
  /** Map of filter identifiers to their current filter states. */
  filterStates: Record<string, ListingFilterState>
}

/**
 * Converts audit event list search parameters into listing option states.
 * Uses Zod schema parsing at the boundary to validate and normalize search parameters.
 *
 * @param params - Search parameters object in raw or validated format
 * @returns Parsed listing options state containing sort and filter states
 */
export const searchParamsToListingStates = (
  params?: unknown
): AuditEventListingOptionsState => {
  const parseResult = auditEventListSearchSchema.safeParse(params)

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

  if (validatedParams.event_id && validatedParams.event_id.length > 0) {
    filterStates[AuditEventFilterValues.EVENT_ID] = {
      type: 'text',
      value: validatedParams.event_id[0] ?? ''
    }
  }

  if (validatedParams.actor_id && validatedParams.actor_id.length > 0) {
    filterStates[AuditEventFilterValues.ACTOR_ID] = {
      type: 'text',
      value: validatedParams.actor_id[0] ?? ''
    }
  }

  if (validatedParams.actor_type && validatedParams.actor_type.length > 0) {
    filterStates[AuditEventFilterValues.ACTOR_TYPE] = {
      type: 'choice',
      selectedIds: new Set(validatedParams.actor_type)
    }
  }

  if (validatedParams.exclude_actor_type && validatedParams.exclude_actor_type.length > 0) {
    filterStates[AuditEventFilterValues.EXCLUDE_ACTOR_TYPE] = {
      type: 'choice',
      selectedIds: new Set(validatedParams.exclude_actor_type)
    }
  }

  if (validatedParams.actor_user_role && validatedParams.actor_user_role.length > 0) {
    filterStates[AuditEventFilterValues.ACTOR_USER_ROLE] = {
      type: 'choice',
      selectedIds: new Set(validatedParams.actor_user_role)
    }
  }

  if (validatedParams.action && validatedParams.action.length > 0) {
    filterStates[AuditEventFilterValues.ACTION] = {
      type: 'text',
      value: validatedParams.action[0] ?? ''
    }
  }

  if (validatedParams.exclude_action && validatedParams.exclude_action.length > 0) {
    filterStates[AuditEventFilterValues.EXCLUDE_ACTION] = {
      type: 'text',
      value: validatedParams.exclude_action[0] ?? ''
    }
  }

  if (validatedParams.resource && validatedParams.resource.length > 0) {
    filterStates[AuditEventFilterValues.RESOURCE] = {
      type: 'text',
      value: validatedParams.resource[0] ?? ''
    }
  }

  if (validatedParams.resource_id && validatedParams.resource_id.length > 0) {
    filterStates[AuditEventFilterValues.RESOURCE_ID] = {
      type: 'text',
      value: validatedParams.resource_id[0] ?? ''
    }
  }

  if (validatedParams.status && validatedParams.status.length > 0) {
    filterStates[AuditEventFilterValues.STATUS] = {
      type: 'choice',
      selectedIds: new Set(validatedParams.status)
    }
  }

  if (validatedParams.exclude_status && validatedParams.exclude_status.length > 0) {
    filterStates[AuditEventFilterValues.EXCLUDE_STATUS] = {
      type: 'choice',
      selectedIds: new Set(validatedParams.exclude_status)
    }
  }

  if (validatedParams.created_at_from) {
    filterStates[AuditEventFilterValues.CREATED_AT_FROM] = {
      type: 'text',
      value: validatedParams.created_at_from
    }
  }

  if (validatedParams.created_at_to) {
    filterStates[AuditEventFilterValues.CREATED_AT_TO] = {
      type: 'text',
      value: validatedParams.created_at_to
    }
  }

  if (validatedParams.search_query) {
    filterStates[AuditEventFilterValues.SEARCH_QUERY] = {
      type: 'text',
      value: validatedParams.search_query
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
    event_id: [],
    actor_id: [],
    actor_type: [],
    exclude_actor_type: [],
    actor_user_role: [],
    action: [],
    exclude_action: [],
    resource: [],
    resource_id: [],
    status: [],
    exclude_status: [],
    created_at_from: undefined,
    created_at_to: undefined,
    search_query: undefined
  }

  if (sortState) {
    searchParams.sort_by = sortState.optionId
    searchParams.sort_order = sortState.isAscending ? SortOrder.ASC : SortOrder.DESC
  }

  const eventIdFilter = filterStates[AuditEventFilterValues.EVENT_ID]
  if (eventIdFilter?.type === 'text' && eventIdFilter.value.trim()) {
    searchParams.event_id = [eventIdFilter.value.trim()]
  }

  const actorIdFilter = filterStates[AuditEventFilterValues.ACTOR_ID]
  if (actorIdFilter?.type === 'text' && actorIdFilter.value.trim()) {
    searchParams.actor_id = [actorIdFilter.value.trim()]
  }

  const actorTypeFilter = filterStates[AuditEventFilterValues.ACTOR_TYPE]
  if (actorTypeFilter?.type === 'choice' && actorTypeFilter.selectedIds.size > 0) {
    searchParams.actor_type = Array.from(actorTypeFilter.selectedIds)
  }

  const excludeActorTypeFilter = filterStates[AuditEventFilterValues.EXCLUDE_ACTOR_TYPE]
  if (excludeActorTypeFilter?.type === 'choice' && excludeActorTypeFilter.selectedIds.size > 0) {
    searchParams.exclude_actor_type = Array.from(excludeActorTypeFilter.selectedIds)
  }

  const actorRoleFilter = filterStates[AuditEventFilterValues.ACTOR_USER_ROLE]
  if (actorRoleFilter?.type === 'choice' && actorRoleFilter.selectedIds.size > 0) {
    searchParams.actor_user_role = Array.from(actorRoleFilter.selectedIds)
  }

  const actionFilter = filterStates[AuditEventFilterValues.ACTION]
  if (actionFilter?.type === 'text' && actionFilter.value.trim()) {
    searchParams.action = [actionFilter.value.trim()]
  }

  const excludeActionFilter = filterStates[AuditEventFilterValues.EXCLUDE_ACTION]
  if (excludeActionFilter?.type === 'text' && excludeActionFilter.value.trim()) {
    searchParams.exclude_action = [excludeActionFilter.value.trim()]
  }

  const resourceFilter = filterStates[AuditEventFilterValues.RESOURCE]
  if (resourceFilter?.type === 'text' && resourceFilter.value.trim()) {
    searchParams.resource = [resourceFilter.value.trim()]
  }

  const resourceIdFilter = filterStates[AuditEventFilterValues.RESOURCE_ID]
  if (resourceIdFilter?.type === 'text' && resourceIdFilter.value.trim()) {
    searchParams.resource_id = [resourceIdFilter.value.trim()]
  }

  const statusFilter = filterStates[AuditEventFilterValues.STATUS]
  if (statusFilter?.type === 'choice' && statusFilter.selectedIds.size > 0) {
    searchParams.status = Array.from(statusFilter.selectedIds)
  }

  const excludeStatusFilter = filterStates[AuditEventFilterValues.EXCLUDE_STATUS]
  if (excludeStatusFilter?.type === 'choice' && excludeStatusFilter.selectedIds.size > 0) {
    searchParams.exclude_status = Array.from(excludeStatusFilter.selectedIds)
  }

  const createdAtFromFilter = filterStates[AuditEventFilterValues.CREATED_AT_FROM]
  if (createdAtFromFilter?.type === 'text' && createdAtFromFilter.value.trim()) {
    searchParams.created_at_from = createdAtFromFilter.value.trim()
  }

  const createdAtToFilter = filterStates[AuditEventFilterValues.CREATED_AT_TO]
  if (createdAtToFilter?.type === 'text' && createdAtToFilter.value.trim()) {
    searchParams.created_at_to = createdAtToFilter.value.trim()
  }

  const searchQueryFilter = filterStates[AuditEventFilterValues.SEARCH_QUERY]
  if (searchQueryFilter?.type === 'text' && searchQueryFilter.value.trim()) {
    searchParams.search_query = searchQueryFilter.value.trim()
  }

  return searchParams
}
