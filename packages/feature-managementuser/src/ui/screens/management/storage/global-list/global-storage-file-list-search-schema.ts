import { z } from 'zod'

/**
 * Zod validation schema for global storage file list search and filter parameters.
 */
export const globalStorageFileListSearchSchema = z.object({
  pageNumber: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.string().optional(),
  ownerUserId: z.string().optional(),
  category: z.string().optional(),
  visibility: z.string().optional(),
  status: z.string().optional(),
  mimeType: z.string().optional(),
  fileName: z.string().optional()
})

/**
 * Inferred search parameters type from {@link globalStorageFileListSearchSchema}.
 */
export type GlobalStorageFileListSearchParams = z.infer<typeof globalStorageFileListSearchSchema>
