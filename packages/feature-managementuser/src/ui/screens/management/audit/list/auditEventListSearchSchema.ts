import { z } from 'zod'

const stringArrayParam = z
  .union([z.string().transform((v) => [v]), z.array(z.string())])
  .optional()

export const auditEventListSearchSchema = z.object({
  page_number: z.number().optional(),
  page_size: z.number().optional(),
  actor_ids: stringArrayParam,
  actor_types: stringArrayParam,
  actor_user_roles: stringArrayParam,
  actions: stringArrayParam,
  resources: stringArrayParam,
  resource_ids: stringArrayParam,
  statuses: stringArrayParam,
  messages: stringArrayParam,
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).optional()
})

export type AuditEventListSearchParams = z.infer<typeof auditEventListSearchSchema>
