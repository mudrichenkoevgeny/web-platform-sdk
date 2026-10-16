import { z } from 'zod'

const numberParam = z.union([z.number(), z.string().transform((v) => Number(v))]).optional()
const stringArrayParam = z.union([z.string().transform((v) => [v]), z.array(z.string())]).optional()

export const globalSessionListSearchSchema = z.object({
  page_number: numberParam,
  page_size: numberParam,
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  user_ids: stringArrayParam,
  user_roles: stringArrayParam,
  identifiers: stringArrayParam,
  identifier_ids: stringArrayParam,
  user_auth_providers: stringArrayParam,
  client_types: stringArrayParam,
  user_agents: stringArrayParam,
  ip_addresses: stringArrayParam,
  languages: stringArrayParam,
  device_ids: stringArrayParam,
  device_names: stringArrayParam,
  app_versions: stringArrayParam,
  os_versions: stringArrayParam
})

export type GlobalSessionListSearchParams = z.infer<typeof globalSessionListSearchSchema>
