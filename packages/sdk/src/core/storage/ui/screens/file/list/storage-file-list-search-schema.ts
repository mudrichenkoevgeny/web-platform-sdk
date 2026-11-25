import { z } from 'zod'
import { StorageFileStatus } from '@mudrichenkoevgeny/shared-foundation'

const booleanParam = z.union([z.boolean(), z.string().transform((v) => v === 'true')]).optional()
const numberParam = z.union([z.number(), z.string().transform((v) => Number(v))]).optional()

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

  res.pageNumber = getVal('pageNumber', 'page_number')
  res.pageSize = getVal('pageSize', 'page_size')
  res.sortBy = extractString(getVal('sortBy', 'sort_by'))
  res.sortOrder = extractString(getVal('sortOrder', 'sort_order'))
  res.ownerUserId = extractString(getVal('ownerUserId', 'owner_user_id', 'ownerUserIds'))
  res.isOwnerUserIdSet = getVal('isOwnerUserIdSet', 'is_owner_user_id_set')
  res.category = extractString(getVal('category', 'categories'))
  res.excludeCategory = extractString(getVal('excludeCategory', 'exclude_category', 'excludeCategories'))
  res.visibility = extractString(getVal('visibility', 'visibilities'))
  res.excludeVisibility = extractString(getVal('excludeVisibility', 'exclude_visibility', 'excludeVisibilities'))
  res.status = extractString(getVal('status'))
  res.statuses = extractArray(getVal('statuses'))
  res.excludeStatus = extractString(getVal('excludeStatus', 'exclude_status'))
  res.excludeStatuses = extractArray(getVal('excludeStatuses', 'exclude_statuses'))
  res.mimeType = extractString(getVal('mimeType', 'mime_type', 'mimeTypes'))
  res.fileName = extractString(getVal('fileName', 'file_name'))
  res.fileId = extractString(getVal('fileId', 'file_id', 'fileIds'))
  res.fileSizeBytesFrom = getVal('fileSizeBytesFrom', 'file_size_bytes_from')
  res.fileSizeBytesTo = getVal('fileSizeBytesTo', 'file_size_bytes_to')
  res.targetScope = extractString(getVal('targetScope', 'target_scope', 'targetScopes'))
  res.isTargetScopeSet = getVal('isTargetScopeSet', 'is_target_scope_set')
  res.createdAtFrom = extractString(getVal('createdAtFrom', 'created_at_from'))
  res.createdAtTo = extractString(getVal('createdAtTo', 'created_at_to'))
  res.updatedAtFrom = extractString(getVal('updatedAtFrom', 'updated_at_from'))
  res.updatedAtTo = extractString(getVal('updatedAtTo', 'updated_at_to'))
  res.isUpdatedAtSet = getVal('isUpdatedAtSet', 'is_updated_at_set')
  res.searchQuery = extractString(getVal('searchQuery', 'search_query', 'search'))

  return res
}

/** Zod validation schema for storage file list search and URL parameters. */
export const storageFileListSearchSchema = z.preprocess(
  normalizeKeys,
  z.object({
    pageNumber: numberParam,
    pageSize: numberParam,
    sortBy: z.string().optional(),
    sortOrder: z.string().optional(),
    ownerUserId: z.string().optional(),
    isOwnerUserIdSet: booleanParam,
    category: z.string().optional(),
    excludeCategory: z.string().optional(),
    visibility: z.string().optional(),
    excludeVisibility: z.string().optional(),
    status: z.string().optional(),
    statuses: z.array(z.string()).optional(),
    excludeStatus: z.string().optional(),
    excludeStatuses: z.array(z.string()).optional(),
    mimeType: z.string().optional(),
    fileName: z.string().optional(),
    fileId: z.string().optional(),
    fileSizeBytesFrom: numberParam,
    fileSizeBytesTo: numberParam,
    targetScope: z.string().optional(),
    isTargetScopeSet: booleanParam,
    createdAtFrom: z.string().optional(),
    createdAtTo: z.string().optional(),
    updatedAtFrom: z.string().optional(),
    updatedAtTo: z.string().optional(),
    isUpdatedAtSet: booleanParam,
    searchQuery: z.string().optional()
  })
)

/** Inferred TypeScript type for storage file list search parameters. */
export type StorageFileListSearchParams = z.infer<typeof storageFileListSearchSchema>

/**
 * Default storage file list statuses (includes all statuses except DELETED).
 * Dynamically computed to adhere to the Single Source of Truth (SSOT) principle.
 */
export const DEFAULT_STORAGE_FILE_LIST_STATUSES: StorageFileStatus[] = Object.values(StorageFileStatus).filter(
  (status) => status !== StorageFileStatus.DELETED
)
