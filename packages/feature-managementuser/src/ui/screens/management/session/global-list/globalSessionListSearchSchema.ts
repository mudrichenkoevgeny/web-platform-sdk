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
  res.session_id = extractArray(getVal('session_id', 'sessionIds', 'sessionId'))
  res.user_id = extractArray(getVal('user_id', 'userIds', 'userId'))
  res.user_role = extractArray(getVal('user_role', 'userRoles', 'role'))
  res.exclude_user_role = extractArray(getVal('exclude_user_role', 'excludeUserRoles', 'exclude_role'))
  res.identifier = extractArray(getVal('identifier', 'identifiers'))
  res.identifier_id = extractArray(getVal('identifier_id', 'identifierIds', 'identifierId'))
  res.identifier_display_name = extractString(getVal('identifier_display_name', 'identifierDisplayName'))
  res.identifier_auth_provider = extractArray(getVal('identifier_auth_provider', 'identifierAuthProviders', 'user_auth_provider', 'userAuthProviders'))
  res.user_auth_provider = extractArray(getVal('user_auth_provider', 'userAuthProviders', 'identifier_auth_provider', 'identifierAuthProviders'))
  res.exclude_identifier_auth_provider = extractArray(getVal('exclude_identifier_auth_provider', 'excludeIdentifierAuthProviders'))
  res.client_type = extractArray(getVal('client_type', 'clientTypes'))
  res.exclude_client_type = extractArray(getVal('exclude_client_type', 'excludeClientTypes'))
  res.is_client_type_set = getVal('is_client_type_set', 'isClientTypeSet')
  res.user_agent = extractArray(getVal('user_agent', 'userAgents'))
  res.is_user_agent_set = getVal('is_user_agent_set', 'isUserAgentSet')
  res.ip_address = extractArray(getVal('ip_address', 'ipAddresses'))
  res.is_ip_address_set = getVal('is_ip_address_set', 'isIpAddressSet')
  res.language = extractArray(getVal('language', 'languages'))
  res.is_language_set = getVal('is_language_set', 'isLanguageSet')
  res.device_id = extractArray(getVal('device_id', 'deviceIds', 'deviceId'))
  res.is_device_id_set = getVal('is_device_id_set', 'isDeviceIdSet')
  res.device_name = extractArray(getVal('device_name', 'deviceNames', 'deviceName'))
  res.is_device_name_set = getVal('is_device_name_set', 'isDeviceNameSet')
  res.app_version = extractArray(getVal('app_version', 'appVersions', 'appVersion'))
  res.is_app_version_set = getVal('is_app_version_set', 'isAppVersionSet')
  res.os_version = extractArray(getVal('os_version', 'osVersions', 'osVersion', 'operation_system_version', 'operationSystemVersion'))
  res.is_operation_system_version_set = getVal('is_operation_system_version_set', 'isOperationSystemVersionSet')
  res.expires_at_from = extractString(getVal('expires_at_from', 'expiresAtFrom'))
  res.expires_at_to = extractString(getVal('expires_at_to', 'expiresAtTo'))
  res.last_accessed_at_from = extractString(getVal('last_accessed_at_from', 'lastAccessedAtFrom'))
  res.last_accessed_at_to = extractString(getVal('last_accessed_at_to', 'lastAccessedAtTo'))
  res.last_reauthenticated_at_from = extractString(getVal('last_reauthenticated_at_from', 'lastReauthenticatedAtFrom'))
  res.last_reauthenticated_at_to = extractString(getVal('last_reauthenticated_at_to', 'lastReauthenticatedAtTo'))
  res.created_at_from = extractString(getVal('created_at_from', 'createdAtFrom'))
  res.created_at_to = extractString(getVal('created_at_to', 'createdAtTo'))
  res.updated_at_from = extractString(getVal('updated_at_from', 'updatedAtFrom'))
  res.updated_at_to = extractString(getVal('updated_at_to', 'updatedAtTo'))
  res.is_updated_at_set = getVal('is_updated_at_set', 'isUpdatedAtSet')
  res.search_query = extractString(getVal('search_query', 'searchQuery', 'search'))

  return res
}

/**
 * Zod validation and key normalization schema for parsing and validating global session list URL search parameters.
 */
export const globalSessionListSearchSchema = z.preprocess(
  normalizeKeys,
  z.object({
    page_number: numberParam,
    page_size: numberParam,
    sort_by: z.string().optional(),
    sort_order: sortOrderParam,
    session_id: stringArrayParam,
    user_id: stringArrayParam,
    user_role: stringArrayParam,
    exclude_user_role: stringArrayParam,
    identifier: stringArrayParam,
    identifier_id: stringArrayParam,
    identifier_display_name: z.string().optional(),
    user_auth_provider: stringArrayParam,
    identifier_auth_provider: stringArrayParam,
    exclude_identifier_auth_provider: stringArrayParam,
    client_type: stringArrayParam,
    exclude_client_type: stringArrayParam,
    is_client_type_set: z.union([z.boolean(), z.string().transform((v) => v === 'true')]).optional(),
    user_agent: stringArrayParam,
    is_user_agent_set: z.union([z.boolean(), z.string().transform((v) => v === 'true')]).optional(),
    ip_address: stringArrayParam,
    is_ip_address_set: z.union([z.boolean(), z.string().transform((v) => v === 'true')]).optional(),
    language: stringArrayParam,
    is_language_set: z.union([z.boolean(), z.string().transform((v) => v === 'true')]).optional(),
    device_id: stringArrayParam,
    is_device_id_set: z.union([z.boolean(), z.string().transform((v) => v === 'true')]).optional(),
    device_name: stringArrayParam,
    is_device_name_set: z.union([z.boolean(), z.string().transform((v) => v === 'true')]).optional(),
    app_version: stringArrayParam,
    is_app_version_set: z.union([z.boolean(), z.string().transform((v) => v === 'true')]).optional(),
    os_version: stringArrayParam,
    is_operation_system_version_set: z.union([z.boolean(), z.string().transform((v) => v === 'true')]).optional(),
    expires_at_from: z.string().optional(),
    expires_at_to: z.string().optional(),
    last_accessed_at_from: z.string().optional(),
    last_accessed_at_to: z.string().optional(),
    last_reauthenticated_at_from: z.string().optional(),
    last_reauthenticated_at_to: z.string().optional(),
    created_at_from: z.string().optional(),
    created_at_to: z.string().optional(),
    updated_at_from: z.string().optional(),
    updated_at_to: z.string().optional(),
    is_updated_at_set: z.union([z.boolean(), z.string().transform((v) => v === 'true')]).optional(),
    search_query: z.string().optional()
  })
)

/**
 * Inferred TypeScript type representing parsed global session list URL search parameters.
 */
export type GlobalSessionListSearchParams = z.infer<typeof globalSessionListSearchSchema>
