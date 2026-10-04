import { UserIdentifierId, UserSessionId } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Union representing destinations in the profile management stack router.
 */
export type ProfileDestination =
  | {
      type: 'main'
    }
  | {
      type: 'totpMain'
    }
  | {
      type: 'totpRecoveryCodes'
    }
  | {
      type: 'sessions'
    }
  | {
      type: 'sessionDetail'
      sessionId: UserSessionId
    }
  | {
      type: 'identifiers'
    }
  | {
      type: 'identifierDetail'
      identifierId: UserIdentifierId
    }
