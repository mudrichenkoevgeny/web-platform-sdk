import type { AccountLockoutType } from '@mudrichenkoevgeny/shared-foundation'

export type ManagementLoginDestination =
  | {
      type: 'welcome'
    }
  | {
      type: 'loginByEmail'
    }
  | {
      type: 'resetEmailPassword'
    }
  | {
      type: 'loginByTotp'
      mfaToken: string
    }
  | {
      type: 'pendingDeletion'
    }
  | {
      type: 'accountUnlock'
      lockoutType?: AccountLockoutType | null
      lockoutUntil?: number | null
    }
