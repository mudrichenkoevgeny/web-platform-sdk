import { AppError, AppResult, appResultFailure, appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { GoogleAuthService } from './GoogleAuthService'
import { UserError } from '@/error/model/UserError'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: { credential?: string }) => void
            auto_select?: boolean
          }) => void
          prompt: (notification?: (notification: {
            isNotDisplayed: () => boolean
            isSkippedMoment: () => boolean
            isDismissedMoment: () => boolean
            getNotDisplayedReason?: () => string
            getSkippedReason?: () => string
            getDismissedReason?: () => string
          }) => void) => void
          cancel: () => void
          disableAutoSelect: () => void
        }
      }
    }
  }
}

const loadGsiScript = (): Promise<void> => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window is undefined'))
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve()
  }

  const existingScript = document.getElementById('google-gsi-script')
  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener('load', () => resolve())
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Google GSI script')))
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.id = 'google-gsi-script'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google GSI script'))
    document.head.appendChild(script)
  })
}

/**
 * Web implementation of {@link GoogleAuthService} using the Google Identity Services (GSI) library.
 */
export class WebGoogleAuthService implements GoogleAuthService {
  /**
   * Constructs a new {@link WebGoogleAuthService}.
   *
   * @param webClientId - OAuth 2.0 Web Client ID
   */
  public constructor(private readonly webClientId: string) {}

  /**
   * Runs interactive Google sign-in and returns a backend-ready credential (ID token).
   *
   * @returns AppResult containing ID token string or UserError
   */
  public async signIn(): Promise<AppResult<string, AppError>> {
    try {
      await loadGsiScript()

      if (!window.google?.accounts?.id) {
        return appResultFailure(
          UserError.externalAuthFailed(new Error('Google Identity Services SDK is unavailable'))
        )
      }

      return await new Promise<AppResult<string, AppError>>((resolve) => {
        let isResolved = false

        window.google?.accounts.id.initialize({
          client_id: this.webClientId,
          auto_select: false,
          callback: (response) => {
            if (isResolved) return
            isResolved = true

            if (response.credential && response.credential.trim().length > 0) {
              resolve(appResultSuccess(response.credential))
            } else {
              resolve(
                appResultFailure(
                  UserError.externalAuthFailed(new Error('Google Auth: Token is empty'))
                )
              )
            }
          }
        })

        window.google?.accounts.id.prompt((notification) => {
          if (isResolved) return

          if (
            notification.isNotDisplayed() ||
            notification.isSkippedMoment() ||
            notification.isDismissedMoment()
          ) {
            isResolved = true
            const reason =
              notification.getNotDisplayedReason?.() ||
              notification.getSkippedReason?.() ||
              notification.getDismissedReason?.() ||
              'Google Prompt was dismissed, skipped, or not displayed'
            resolve(
              appResultFailure(
                UserError.externalAuthCancelled(new Error(`Google Prompt: ${reason}`))
              )
            )
          }
        })
      })
    } catch (e: unknown) {
      return appResultFailure(UserError.externalAuthFailed(e))
    }
  }

  /**
   * Clears on-device Google session state.
   *
   * @returns AppResult indicating success or failure
   */
  public async signOut(): Promise<AppResult<void, AppError>> {
    try {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect()
      }
      return appResultSuccess(undefined)
    } catch (e: unknown) {
      return appResultFailure(UserError.externalAuthFailed(e))
    }
  }
}
