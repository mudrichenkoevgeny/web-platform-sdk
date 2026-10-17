import { z } from 'zod'

const stringArrayParam = z
  .union([z.string().transform((v) => [v]), z.array(z.string())])
  .optional()

export const auditEventListSearchSchema = z.object({
  page_number: z.number().optional(),
  page_size: z.number().optional(),
  actor_id: stringArrayParam,
  actor_type: stringArrayParam,
  actor_user_role: stringArrayParam,
  action: stringArrayParam,
  resource: stringArrayParam,
  resource_id: stringArrayParam,
  status: stringArrayParam,
  message: stringArrayParam,
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).optional()
})

export type AuditEventListSearchParams = z.infer<typeof auditEventListSearchSchema>
