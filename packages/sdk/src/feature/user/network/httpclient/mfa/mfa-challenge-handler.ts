/**
 * Handles MFA (Multi-Factor Authentication) challenges requested by the backend
 * when performing sensitive operations (Step-Up Authentication).
 */
export interface MfaChallengeHandler {
  /**
   * Called by the networking layer when a sensitive operation is blocked,
   * requiring the user to confirm their identity.
   *
   * @param mfaToken - The temporary opaque token identifying the challenge session
   * @returns Verification code entered by the user, or null if cancelled
   */
  onRequestMfaCode(mfaToken: string): Promise<string | null>
}
