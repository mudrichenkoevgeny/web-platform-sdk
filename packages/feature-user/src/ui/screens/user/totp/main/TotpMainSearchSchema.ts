import { z } from 'zod'

export enum TotpMainMode {
  DISABLED = 'disabled',
  SETUP_IN_PROGRESS = 'setupInProgress',
  ENABLED = 'enabled'
}

export const totpMainSearchSchema = z.object({
  totpMode: z.nativeEnum(TotpMainMode).optional()
})

export type TotpMainSearch = z.infer<typeof totpMainSearchSchema>
