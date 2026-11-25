import { z } from 'zod'

/** Available UI display modes for TOTP setup and configuration screen. */
export enum TotpMainMode {
  DISABLED = 'disabled',
  SETUP_IN_PROGRESS = 'setupInProgress',
  ENABLED = 'enabled'
}

/** Search parameter validation schema for TotpMainScreen route. */
export const totpMainSearchSchema = z.object({
  totpMode: z.nativeEnum(TotpMainMode).optional()
})

/** Inferred search parameters type for TotpMainScreen route. */
export type TotpMainSearch = z.infer<typeof totpMainSearchSchema>
