import { MfaChallengeHandler } from '@/network/httpclient/mfa/mfa-challenge-handler'
import { MfaChallengeRequest } from '@/network/httpclient/mfa/mfa-challenge-request'

/** Listener callback signature for MFA request updates. */
export type MfaRequestListener = (request: MfaChallengeRequest | null) => void

/**
 * Default implementation of {@link MfaChallengeHandler}.
 * Exposes active {@link MfaChallengeRequest} to subscribers (e.g. UI dialogs).
 */
export class DefaultMfaChallengeHandler implements MfaChallengeHandler {
  private currentRequest: MfaChallengeRequest | null = null
  private readonly listeners = new Set<MfaRequestListener>()

  /**
   * Retrieves current active challenge request.
   *
   * @returns Active challenge request or null
   */
  public getChallengeRequest(): MfaChallengeRequest | null {
    return this.currentRequest
  }

  /**
   * Subscribes to MFA challenge request state updates.
   *
   * @param listener - Callback function triggered on challenge state change
   * @returns Unsubscribe cleanup function
   */
  public subscribe(listener: MfaRequestListener): () => void {
    this.listeners.add(listener)
    listener(this.currentRequest)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * Requests MFA code from user.
   *
   * @param mfaToken - Challenge token from server
   * @returns Code string or null if cancelled
   */
  public onRequestMfaCode(mfaToken: string): Promise<string | null> {
    return new Promise((resolve) => {
      const request: MfaChallengeRequest = {
        mfaToken,
        confirm: (code: string) => {
          this.currentRequest = null
          this.notifyListeners()
          resolve(code)
        },
        cancel: () => {
          this.currentRequest = null
          this.notifyListeners()
          resolve(null)
        }
      }

      this.currentRequest = request
      this.notifyListeners()
    })
  }

  /**
   * Resolves the current challenge with user-provided code.
   *
   * @param code - Verification secret
   */
  public onConfirm(code: string): void {
    if (this.currentRequest) {
      this.currentRequest.confirm(code)
    }
  }

  /**
   * Cancels active challenge.
   */
  public onCancel(): void {
    if (this.currentRequest) {
      this.currentRequest.cancel()
    }
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.currentRequest)
    }
  }
}
