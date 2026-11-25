/**
 * Encapsulates an active MFA challenge request.
 */
export interface MfaChallengeRequest {
  /** The challenge token sent by the backend. */
  readonly mfaToken: string
  /** Confirms the challenge with the user-provided verification code. */
  readonly confirm: (code: string) => void
  /** Cancels the challenge flow. */
  readonly cancel: () => void
}
