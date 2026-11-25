import { z } from 'zod'

const numberParam = z.union([z.number(), z.string().transform((v) => Number(v))]).optional()
const stringArrayParam = z.union([z.string().transform((v) => [v]), z.array(z.string())]).optional()
const booleanParam = z.union([z.boolean(), z.string().transform((v) => v === 'true')]).optional()
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
  res.user_id = extractArray(getVal('user_id', 'userIds', 'userId'))
  res.user_role = extractArray(getVal('user_role', 'userRoles', 'role'))
  res.exclude_user_role = extractArray(getVal('exclude_user_role', 'excludeUserRoles', 'exclude_role'))
  res.account_status = extractArray(getVal('account_status', 'accountStatuses'))
  res.exclude_account_status = extractArray(getVal('exclude_account_status', 'excludeAccountStatuses'))
  res.account_status_on_restore = extractArray(getVal('account_status_on_restore', 'accountStatusOnRestore'))
  res.exclude_account_status_on_restore = extractArray(getVal('exclude_account_status_on_restore', 'excludeAccountStatusOnRestore'))
  res.is_account_status_on_restore_set = getVal('is_account_status_on_restore_set', 'isAccountStatusOnRestoreSet')
  res.account_lockout_type = extractArray(getVal('account_lockout_type', 'accountLockoutTypes'))
  res.exclude_account_lockout_type = extractArray(getVal('exclude_account_lockout_type', 'excludeAccountLockoutTypes'))
  res.authority_level_from = getVal('authority_level_from', 'authorityLevelFrom')
  res.authority_level_to = getVal('authority_level_to', 'authorityLevelTo')
  res.permission_codes = extractArray(getVal('permission_codes', 'permissionCodes'))
  res.exclude_permission_codes = extractArray(getVal('exclude_permission_codes', 'excludePermissionCodes'))
  res.is_totp_enabled = getVal('is_totp_enabled', 'isTotpEnabled')
  res.temporary_lockout_until_from = extractString(getVal('temporary_lockout_until_from', 'temporaryLockoutUntilFrom'))
  res.temporary_lockout_until_to = extractString(getVal('temporary_lockout_until_to', 'temporaryLockoutUntilTo'))
  res.is_temporary_lockout_until_set = getVal('is_temporary_lockout_until_set', 'isTemporaryLockoutUntilSet')
  res.last_login_at_from = extractString(getVal('last_login_at_from', 'lastLoginAtFrom'))
  res.last_login_at_to = extractString(getVal('last_login_at_to', 'lastLoginAtTo'))
  res.is_last_login_at_set = getVal('is_last_login_at_set', 'isLastLoginAtSet')
  res.last_active_at_from = extractString(getVal('last_active_at_from', 'lastActiveAtFrom'))
  res.last_active_at_to = extractString(getVal('last_active_at_to', 'lastActiveAtTo'))
  res.is_last_active_at_set = getVal('is_last_active_at_set', 'isLastActiveAtSet')
  res.scheduled_permanent_deletion_at_from = extractString(getVal('scheduled_permanent_deletion_at_from', 'scheduledPermanentDeletionAtFrom'))
  res.scheduled_permanent_deletion_at_to = extractString(getVal('scheduled_permanent_deletion_at_to', 'scheduledPermanentDeletionAtTo'))
  res.is_scheduled_permanent_deletion_at_set = getVal('is_scheduled_permanent_deletion_at_set', 'isScheduledPermanentDeletionAtSet')
  res.storage_quota_bytes_from = getVal('storage_quota_bytes_from', 'storageQuotaBytesFrom')
  res.storage_quota_bytes_to = getVal('storage_quota_bytes_to', 'storageQuotaBytesTo')
  res.is_storage_quota_bytes_set = getVal('is_storage_quota_bytes_set', 'isStorageQuotaBytesSet')
  res.storage_max_upload_size_bytes_from = getVal('storage_max_upload_size_bytes_from', 'storageMaxUploadSizeBytesFrom')
  res.storage_max_upload_size_bytes_to = getVal('storage_max_upload_size_bytes_to', 'storageMaxUploadSizeBytesTo')
  res.is_storage_max_upload_size_bytes_set = getVal('is_storage_max_upload_size_bytes_set', 'isStorageMaxUploadSizeBytesSet')
  res.storage_max_pending_uploads_from = getVal('storage_max_pending_uploads_from', 'storageMaxPendingUploadsFrom')
  res.storage_max_pending_uploads_to = getVal('storage_max_pending_uploads_to', 'storageMaxPendingUploadsTo')
  res.is_storage_max_pending_uploads_set = getVal('is_storage_max_pending_uploads_set', 'isStorageMaxPendingUploadsSet')
  res.is_storage_configuration_set = getVal('is_storage_configuration_set', 'isStorageConfigurationSet')
  res.nickname = extractString(getVal('nickname'))
  res.is_nickname_set = getVal('is_nickname_set', 'isNicknameSet')
  res.display_name = extractString(getVal('display_name', 'displayName'))
  res.is_display_name_set = getVal('is_display_name_set', 'isDisplayNameSet')
  res.is_avatar_set = getVal('is_avatar_set', 'isAvatarSet')
  res.birthdate_from = getVal('birthdate_from', 'birthdateFrom')
  res.birthdate_to = getVal('birthdate_to', 'birthdateTo')
  res.is_birthdate_set = getVal('is_birthdate_set', 'isBirthdateSet')
  res.created_at_from = extractString(getVal('created_at_from', 'createdAtFrom'))
  res.created_at_to = extractString(getVal('created_at_to', 'createdAtTo'))
  res.updated_at_from = extractString(getVal('updated_at_from', 'updatedAtFrom'))
  res.updated_at_to = extractString(getVal('updated_at_to', 'updatedAtTo'))
  res.is_updated_at_set = getVal('is_updated_at_set', 'isUpdatedAtSet')
  res.search_query = extractString(getVal('search_query', 'searchQuery', 'search'))

  return res
}

/** Zod validation and key normalization schema for global user list search parameters. */
export const globalUserListSearchSchema = z.preprocess(
  normalizeKeys,
  z.object({
    page_number: numberParam,
    page_size: numberParam,
    sort_by: z.string().optional(),
    sort_order: sortOrderParam,
    user_id: stringArrayParam,
    user_role: stringArrayParam,
    exclude_user_role: stringArrayParam,
    account_status: stringArrayParam,
    exclude_account_status: stringArrayParam,
    account_status_on_restore: stringArrayParam,
    exclude_account_status_on_restore: stringArrayParam,
    is_account_status_on_restore_set: booleanParam,
    account_lockout_type: stringArrayParam,
    exclude_account_lockout_type: stringArrayParam,
    authority_level_from: numberParam,
    authority_level_to: numberParam,
    permission_codes: stringArrayParam,
    exclude_permission_codes: stringArrayParam,
    is_totp_enabled: booleanParam,
    temporary_lockout_until_from: z.string().optional(),
    temporary_lockout_until_to: z.string().optional(),
    is_temporary_lockout_until_set: booleanParam,
    last_login_at_from: z.string().optional(),
    last_login_at_to: z.string().optional(),
    is_last_login_at_set: booleanParam,
    last_active_at_from: z.string().optional(),
    last_active_at_to: z.string().optional(),
    is_last_active_at_set: booleanParam,
    scheduled_permanent_deletion_at_from: z.string().optional(),
    scheduled_permanent_deletion_at_to: z.string().optional(),
    is_scheduled_permanent_deletion_at_set: booleanParam,
    storage_quota_bytes_from: numberParam,
    storage_quota_bytes_to: numberParam,
    is_storage_quota_bytes_set: booleanParam,
    storage_max_upload_size_bytes_from: numberParam,
    storage_max_upload_size_bytes_to: numberParam,
    is_storage_max_upload_size_bytes_set: booleanParam,
    storage_max_pending_uploads_from: numberParam,
    storage_max_pending_uploads_to: numberParam,
    is_storage_max_pending_uploads_set: booleanParam,
    is_storage_configuration_set: booleanParam,
    nickname: z.string().optional(),
    is_nickname_set: booleanParam,
    display_name: z.string().optional(),
    is_display_name_set: booleanParam,
    is_avatar_set: booleanParam,
    birthdate_from: numberParam,
    birthdate_to: numberParam,
    is_birthdate_set: booleanParam,
    created_at_from: z.string().optional(),
    created_at_to: z.string().optional(),
    updated_at_from: z.string().optional(),
    updated_at_to: z.string().optional(),
    is_updated_at_set: booleanParam,
    search_query: z.string().optional()
  })
)

/** Inferred TypeScript type representing parsed global user list URL search parameters. */
export type GlobalUserListSearchParams = z.infer<typeof globalUserListSearchSchema>
