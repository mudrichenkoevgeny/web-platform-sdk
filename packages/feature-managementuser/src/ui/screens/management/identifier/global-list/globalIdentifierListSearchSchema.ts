import { z } from 'zod'

const numberParam = z.union([z.number(), z.string().transform((v) => Number(v))]).optional()
const stringArrayParam = z.union([z.string().transform((v) => [v]), z.array(z.string())]).optional()
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
  res.identifier_id = extractArray(getVal('identifier_id', 'identifierIds', 'identifierId'))
  res.user_id = extractArray(getVal('user_id', 'userIds', 'userId'))
  res.user_auth_provider = extractArray(getVal('user_auth_provider', 'userAuthProviders'))
  res.exclude_user_auth_provider = extractArray(getVal('exclude_user_auth_provider', 'excludeUserAuthProviders'))
  res.identifier = extractArray(getVal('identifier', 'identifiers'))
  res.display_name = extractString(getVal('display_name', 'displayName'))
  res.external_provider_email = extractString(getVal('external_provider_email', 'externalProviderEmail'))
  res.is_external_provider_email_set = getVal('is_external_provider_email_set', 'isExternalProviderEmailSet')
  res.created_at_from = extractString(getVal('created_at_from', 'createdAtFrom'))
  res.created_at_to = extractString(getVal('created_at_to', 'createdAtTo'))
  res.updated_at_from = extractString(getVal('updated_at_from', 'updatedAtFrom'))
  res.updated_at_to = extractString(getVal('updated_at_to', 'updatedAtTo'))
  res.is_updated_at_set = getVal('is_updated_at_set', 'isUpdatedAtSet')
  res.search_query = extractString(getVal('search_query', 'searchQuery'))

  return res
}

/** Zod validation and key normalization schema for global identifier list search parameters. */
export const globalIdentifierListSearchSchema = z.preprocess(
  normalizeKeys,
  z.object({
    page_number: numberParam,
    page_size: numberParam,
    sort_by: z.string().optional(),
    sort_order: sortOrderParam,
    identifier_id: stringArrayParam,
    user_auth_provider: stringArrayParam,
    exclude_user_auth_provider: stringArrayParam,
    user_id: stringArrayParam,
    identifier: stringArrayParam,
    display_name: z.string().optional(),
    external_provider_email: z.string().optional(),
    is_external_provider_email_set: z.union([z.boolean(), z.string().transform((v) => v === 'true')]).optional(),
    created_at_from: z.string().optional(),
    created_at_to: z.string().optional(),
    updated_at_from: z.string().optional(),
    updated_at_to: z.string().optional(),
    is_updated_at_set: z.union([z.boolean(), z.string().transform((v) => v === 'true')]).optional(),
    search_query: z.string().optional()
  })
)

/** Inferred TypeScript type representing parsed global identifier list URL search parameters. */
export type GlobalIdentifierListSearchParams = z.infer<typeof globalIdentifierListSearchSchema>
