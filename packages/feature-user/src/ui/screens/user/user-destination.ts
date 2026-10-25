import type { UserIdentifierId, UserSessionId } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Union representing destinations in the user management stack router.
 */
export type UserDestination =
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
  | {
      type: 'storageFileList'
    }
  | {
      type: 'storageFileDetail'
      fileId: string
    }
  | {
      type: 'storageFileUpload'
    }
