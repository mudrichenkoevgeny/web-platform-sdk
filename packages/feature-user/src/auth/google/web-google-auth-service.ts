import { appResultFailure, appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import type { LoginByExternalAuthProviderRequest } from '@mudrichenkoevgeny/shared-foundation'
import type { GoogleAuthService } from '@/auth/google/google-auth-service'
import { UserError } from '@/error/model/user-error'

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

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const parseJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const parts = token.split('.')
    if (parts.length < 2 || !parts[1]) {
      return null
    }
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    )
    const parsed = JSON.parse(jsonPayload)
    if (isObjectRecord(parsed)) {
      return parsed
    }
    return null
  } catch {
    return null
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
      existingScript.addEventListener('load', () => {
        resolve()
      })
      existingScript.addEventListener('error', () => {
        reject(new Error('Failed to load Google GSI script'))
      })
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.id = 'google-gsi-script'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      resolve()
    }
    script.onerror = () => {
      reject(new Error('Failed to load Google GSI script'))
    }
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
   * Runs interactive Google sign-in and returns a backend-ready credential request payload.
   *
   * @returns AppResult containing LoginByExternalAuthProviderRequest or UserError
   */
  public async signIn(): Promise<AppResult<LoginByExternalAuthProviderRequest, AppError>> {
    try {
      await loadGsiScript()

      if (!window.google?.accounts?.id) {
        return appResultFailure(
          UserError.externalAuthFailed(new Error('Google Identity Services SDK is unavailable'))
        )
      }

      return await new Promise<AppResult<LoginByExternalAuthProviderRequest, AppError>>((resolve) => {
        let isResolved = false

        window.google?.accounts.id.initialize({
          client_id: this.webClientId,
          auto_select: false,
          callback: (response) => {
            if (isResolved) {
              return
            }
            isResolved = true

            if (response.credential && response.credential.trim().length > 0) {
              const payload = parseJwtPayload(response.credential)
              const displayName =
                payload && typeof payload.name === 'string' && payload.name.trim().length > 0
                  ? payload.name.trim()
                  : undefined

              resolve(
                appResultSuccess({
                  auth_provider: UserAuthProvider.GOOGLE,
                  external_provider_token: response.credential,
                  display_name: displayName
                })
              )
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
          if (isResolved) {
            return
          }

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
