import { z } from 'zod'
import {
  StorageCategory,
  StorageFileVisibility,
  StorageFileStatus,
  StorageFileSortBy,
  SortOrder
} from '@mudrichenkoevgeny/shared-foundation'

/** Zod validation schema for storage file list search and URL parameters. */
export const storageFileListSearchSchema = z.object({
  pageNumber: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  sortBy: z.nativeEnum(StorageFileSortBy).optional(),
  sortOrder: z.nativeEnum(SortOrder).optional(),
  ownerUserId: z.string().optional(),
  category: z.nativeEnum(StorageCategory).optional(),
  visibility: z.nativeEnum(StorageFileVisibility).optional(),
  status: z.nativeEnum(StorageFileStatus).optional(),
  statuses: z.array(z.nativeEnum(StorageFileStatus)).optional(),
  mimeType: z.string().optional(),
  fileName: z.string().optional(),
  fileId: z.string().optional()
})

/** Inferred TypeScript type for storage file list search parameters. */
export type StorageFileListSearchParams = z.infer<typeof storageFileListSearchSchema>

/**
 * Default storage file list statuses (includes all statuses except DELETED).
 * Dynamically computed to adhere to the Single Source of Truth (SSOT) principle.
 */
export const DEFAULT_STORAGE_FILE_LIST_STATUSES: StorageFileStatus[] = Object.values(StorageFileStatus).filter(
  (status) => status !== StorageFileStatus.DELETED
)
