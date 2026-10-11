import { z } from 'zod'

const stringArrayParam = z
  .union([z.string().transform((v) => [v]), z.array(z.string())])
  .optional()

export const auditEventListSearchSchema = z.object({
  actorIds: stringArrayParam,
  actorTypes: stringArrayParam,
  actorUserRoles: stringArrayParam,
  actions: stringArrayParam,
  resources: stringArrayParam,
  resourceIds: stringArrayParam,
  statuses: stringArrayParam,
  messages: stringArrayParam,
  sortBy: z.string().optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional()
})

export type AuditEventListSearchParams = z.infer<typeof auditEventListSearchSchema>
