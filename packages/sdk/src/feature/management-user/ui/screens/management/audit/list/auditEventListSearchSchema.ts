import { z } from 'zod'

const numberParam = z.union([z.number(), z.string().transform((v) => Number(v))]).optional()

const stringArrayParam = z
  .union([z.string().transform((v) => [v]), z.array(z.string())])
  .optional()

const sortOrderParam = z.string().transform((v) => v.toLowerCase()).optional()

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const extractString = (val: unknown): string | undefined => {
  if (val === null || val === undefined) {
    return undefined
  }
  if (typeof val === 'string') {
    return val
  }
  if (isObjectRecord(val)) {
    if (typeof val.value === 'string') {
      return val.value
    }
    if (typeof val.name === 'string') {
      return val.name
    }
  }
  return String(val)
}

const extractArray = (val: unknown): string[] | undefined => {
  if (val === null || val === undefined) {
    return undefined
  }
  if (Array.isArray(val)) {
    return val
      .map((item) => extractString(item))
      .filter((item): item is string => item !== undefined)
  }
  const str = extractString(val)
  if (str !== undefined) {
    return [str]
  }
  return undefined
}

const normalizeKeys = (obj: unknown) => {
  if (!isObjectRecord(obj)) {
    return obj
  }

  const res: Record<string, unknown> = {}

  const getVal = (...keys: string[]) => {
    for (const k of keys) {
      if (k in obj && obj[k] !== undefined) {
        return obj[k]
      }
    }
    return undefined
  }

  res.page_number = getVal('page_number', 'pageNumber')
  res.page_size = getVal('page_size', 'pageSize')
  res.sort_by = extractString(getVal('sort_by', 'sortBy'))
  res.sort_order = extractString(getVal('sort_order', 'sortOrder'))
  res.event_id = extractArray(getVal('event_id', 'eventIds', 'eventId'))
  res.actor_id = extractArray(getVal('actor_id', 'actorIds', 'actorId'))
  res.actor_type = extractArray(getVal('actor_type', 'actorTypes', 'actorType'))
  res.exclude_actor_type = extractArray(getVal('exclude_actor_type', 'excludeActorTypes', 'excludeActorType'))
  res.actor_user_role = extractArray(getVal('actor_user_role', 'actorUserRoles', 'actorUserRole'))
  res.action = extractArray(getVal('action', 'actions'))
  res.exclude_action = extractArray(getVal('exclude_action', 'excludeActions'))
  res.resource = extractArray(getVal('resource', 'resources'))
  res.resource_id = extractArray(getVal('resource_id', 'resourceIds', 'resourceId'))
  res.status = extractArray(getVal('status', 'statuses'))
  res.exclude_status = extractArray(getVal('exclude_status', 'excludeStatuses'))
  res.created_at_from = extractString(getVal('created_at_from', 'createdAtFrom'))
  res.created_at_to = extractString(getVal('created_at_to', 'createdAtTo'))
  res.search_query = extractString(getVal('search_query', 'searchQuery'))

  return res
}

/** Zod validation and key normalization schema for audit event list search parameters. */
export const auditEventListSearchSchema = z.preprocess(
  normalizeKeys,
  z.object({
    page_number: numberParam,
    page_size: numberParam,
    event_id: stringArrayParam,
    actor_id: stringArrayParam,
    actor_type: stringArrayParam,
    exclude_actor_type: stringArrayParam,
    actor_user_role: stringArrayParam,
    action: stringArrayParam,
    exclude_action: stringArrayParam,
    resource: stringArrayParam,
    resource_id: stringArrayParam,
    status: stringArrayParam,
    exclude_status: stringArrayParam,
    created_at_from: z.string().optional(),
    created_at_to: z.string().optional(),
    search_query: z.string().optional(),
    sort_by: z.string().optional(),
    sort_order: sortOrderParam
  })
)

/** Inferred TypeScript type representing parsed audit event list URL search parameters. */
export type AuditEventListSearchParams = z.infer<typeof auditEventListSearchSchema>
