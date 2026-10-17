import { z } from 'zod'

const numberParam = z.union([z.number(), z.string().transform((v) => Number(v))]).optional()
const stringArrayParam = z.union([z.string().transform((v) => [v]), z.array(z.string())]).optional()

export const globalSessionListSearchSchema = z.object({
  page_number: numberParam,
  page_size: numberParam,
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  user_id: stringArrayParam,
  user_ids: stringArrayParam,
  user_role: stringArrayParam,
  user_roles: stringArrayParam,
  identifier: stringArrayParam,
  identifiers: stringArrayParam,
  identifier_id: stringArrayParam,
  identifier_ids: stringArrayParam,
  user_auth_provider: stringArrayParam,
  user_auth_providers: stringArrayParam,
  client_type: stringArrayParam,
  client_types: stringArrayParam,
  user_agent: stringArrayParam,
  user_agents: stringArrayParam,
  ip_address: stringArrayParam,
  ip_addresses: stringArrayParam,
  language: stringArrayParam,
  languages: stringArrayParam,
  device_id: stringArrayParam,
  device_ids: stringArrayParam,
  device_name: stringArrayParam,
  device_names: stringArrayParam,
  app_version: stringArrayParam,
  app_versions: stringArrayParam,
  os_version: stringArrayParam,
  os_versions: stringArrayParam
})

export type GlobalSessionListSearchParams = z.infer<typeof globalSessionListSearchSchema>
