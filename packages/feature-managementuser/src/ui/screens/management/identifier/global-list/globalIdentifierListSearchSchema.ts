import { z } from 'zod'

const numberParam = z.union([z.number(), z.string().transform((v) => Number(v))]).optional()
const stringArrayParam = z.union([z.string().transform((v) => [v]), z.array(z.string())]).optional()

export const globalIdentifierListSearchSchema = z.object({
  page_number: numberParam,
  page_size: numberParam,
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  user_auth_provider: stringArrayParam,
  user_id: stringArrayParam,
  identifier: stringArrayParam
})

export type GlobalIdentifierListSearchParams = z.infer<typeof globalIdentifierListSearchSchema>
