import type { AccountLockoutType } from '@mudrichenkoevgeny/shared-foundation'

export type ClientLoginDestination =
  | {
      type: 'welcome'
    }
  | {
      type: 'loginByEmail'
    }
  | {
      type: 'loginByPhone'
    }
  | {
      type: 'registrationByEmail'
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
