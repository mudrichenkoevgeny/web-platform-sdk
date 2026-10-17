import { z } from 'zod'

const numberParam = z.union([z.number(), z.string().transform((v) => Number(v))]).optional()
const stringArrayParam = z.union([z.string().transform((v) => [v]), z.array(z.string())]).optional()

/**
 * Zod validation schema for parsing and validating global session list URL search parameters.
 */
export const globalSessionListSearchSchema = z.object({
  page_number: numberParam,
  page_size: numberParam,
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  user_id: stringArrayParam,
  user_role: stringArrayParam,
  identifier: stringArrayParam,
  identifier_id: stringArrayParam,
  user_auth_provider: stringArrayParam,
  client_type: stringArrayParam,
  user_agent: stringArrayParam,
  ip_address: stringArrayParam,
  language: stringArrayParam,
  device_id: stringArrayParam,
  device_name: stringArrayParam,
  app_version: stringArrayParam,
  os_version: stringArrayParam
})

/**
 * Inferred TypeScript type representing parsed global session list URL search parameters.
 */
export type GlobalSessionListSearchParams = z.infer<typeof globalSessionListSearchSchema>
