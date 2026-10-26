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
  mimeType: z.string().optional(),
  fileName: z.string().optional()
})

/** Inferred TypeScript type for storage file list search parameters. */
export type StorageFileListSearchParams = z.infer<typeof storageFileListSearchSchema>
