import { z } from 'zod'

const numberParam = z.union([z.number(), z.string().transform((v) => Number(v))]).optional()
const stringArrayParam = z.union([z.string().transform((v) => [v]), z.array(z.string())]).optional()
const booleanParam = z.union([z.boolean(), z.string().transform((v) => v === 'true')]).optional()

export const globalUserListSearchSchema = z.object({
  page_number: numberParam,
  page_size: numberParam,
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  user_roles: stringArrayParam,
  account_statuses: stringArrayParam,
  account_lockout_types: stringArrayParam,
  authority_level_from: numberParam,
  authority_level_to: numberParam,
  is_totp_enabled: booleanParam
})

export type GlobalUserListSearchParams = z.infer<typeof globalUserListSearchSchema>
