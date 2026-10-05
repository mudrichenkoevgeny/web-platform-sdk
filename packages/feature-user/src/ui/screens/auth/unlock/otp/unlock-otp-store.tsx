import React, { createContext, useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'
import { isSuccess, resendCountdown } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { UnlockMethod } from '@mudrichenkoevgeny/shared-foundation'
import type { SendUnlockEmailConfirmationUseCase } from '@/usecase/auth/unlock/send-unlock-email-confirmation-use-case'
import type { SendUnlockPhoneConfirmationUseCase } from '@/usecase/auth/unlock/send-unlock-phone-confirmation-use-case'
import type { UnlockByEmailUseCase } from '@/usecase/auth/unlock/unlock-by-email-use-case'
import type { UnlockByPhoneUseCase } from '@/usecase/auth/unlock/unlock-by-phone-use-case'
/**
 * Union representing the active screen state for {@link UnlockOtpScreen}.
 */
export type UnlockOtpScreenState =
  | {
      status: 'loading'
    }
  | {
      status: 'content'
      method: UnlockMethod
      target: string
      codeInput: string
      remainingDelaySeconds: number
      actionLoading: boolean
      actionError: AppError | null
    }

/**
 * Dependencies required for initializing {@link UnlockOtpStore}.
 */
export interface UnlockOtpStoreDependencies {
  /** Target unlock method (email or phone). */
  method: UnlockMethod
  /** Target email address or phone number receiving OTP code. */
  target: string
  /** Initial resend cooldown delay in seconds. */
  initialDelaySeconds?: number
  /** Use case for unlocking account using email OTP code. */
  unlockByEmailUseCase: UnlockByEmailUseCase
  /** Use case for unlocking account using phone OTP code. */
  unlockByPhoneUseCase: UnlockByPhoneUseCase
  /** Use case for resending email unlock confirmation code. */
  sendUnlockEmailConfirmationUseCase: SendUnlockEmailConfirmationUseCase
  /** Use case for resending phone unlock confirmation code. */
  sendUnlockPhoneConfirmationUseCase: SendUnlockPhoneConfirmationUseCase
  /** Navigation callback for unlock success step. */
  onUnlockSuccess: () => void
  /** Navigation callback for popping screen step. */
  onBack: () => void
}

/**
 * State and action contract for {@link UnlockOtpStore}.
 */
export interface UnlockOtpStoreState {
  /** Active reactive screen state. */
  screenState: UnlockOtpScreenState
  /** Initializes resend countdown timer if initial delay is present. */
  initTimer: () => void
  /** Updates OTP code text. */
  onCodeChanged: (code: string) => void
  /** Submits OTP code to unlock account. */
  onUnlockClick: () => Promise<void>
  /** Resends new OTP confirmation code. */
  onResendCodeClick: () => Promise<void>
  /** Handles back button navigation. */
  onBackClick: () => void
}

/**
 * Type alias for the per-instance Zustand store.
 */
export type UnlockOtpStore = ReturnType<typeof createUnlockOtpStore>

/**
 * Instantiates a new isolated {@link UnlockOtpStore} for a screen instance.
 *
 * @param deps - Screen dependencies
 * @param initialState - Optional initial state override
 * @returns Vanilla Zustand store instance
 */
export const createUnlockOtpStore = (
  deps: UnlockOtpStoreDependencies,
  initialState?: UnlockOtpScreenState
) => {
  let timerController: AbortController | null = null

  const startTimer = (
    seconds: number,
    get: () => UnlockOtpStoreState,
    set: (state: Partial<UnlockOtpStoreState>) => void
  ) => {
    timerController?.abort()
    if (seconds <= 0) {
      return
    }

    timerController = new AbortController()
    const signal = timerController.signal

    const current = get().screenState
    if (current.status === 'content') {
      set({
        screenState: {
          ...current,
          remainingDelaySeconds: seconds
        }
      })
    }

    resendCountdown(
      seconds,
      (remaining) => {
        const active = get().screenState
        if (active.status === 'content') {
          set({
            screenState: {
              ...active,
              remainingDelaySeconds: remaining
            }
          })
        }
      },
      1000,
      signal
    )
  }

  const defaultContentState: UnlockOtpScreenState = {
    status: 'content',
    method: deps.method,
    target: deps.target,
    codeInput: '',
    remainingDelaySeconds: deps.initialDelaySeconds ?? 0,
    actionLoading: false,
    actionError: null
  }

  return createStore<UnlockOtpStoreState>()((set, get) => ({
    screenState: initialState ?? defaultContentState,

    initTimer: () => {
      if ((deps.initialDelaySeconds ?? 0) > 0) {
        startTimer(deps.initialDelaySeconds!, get, set)
      }
    },

    onCodeChanged: (code: string) => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      set({
        screenState: {
          ...current,
          codeInput: code,
          actionError: null
        }
      })
    },

    onUnlockClick: async () => {
      const current = get().screenState
      if (current.status !== 'content' || current.actionLoading) {
        return
      }

      const code = current.codeInput.trim()
      if (!code) {
        return
      }

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      const result =
        current.method === UnlockMethod.EMAIL
          ? await deps.unlockByEmailUseCase.execute(current.target, code)
          : await deps.unlockByPhoneUseCase.execute(current.target, code)

      if (isSuccess(result)) {
        const updated = get().screenState
        if (updated.status === 'content') {
          set({ screenState: { ...updated, actionLoading: false } })
        }
        deps.onUnlockSuccess()
      } else {
        const updated = get().screenState
        if (updated.status === 'content') {
          set({
            screenState: {
              ...updated,
              actionLoading: false,
              actionError: result.error
            }
          })
        }
      }
    },

    onResendCodeClick: async () => {
      const current = get().screenState
      if (current.status !== 'content' || current.actionLoading || current.remainingDelaySeconds > 0) {
        return
      }

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      const result =
        current.method === UnlockMethod.EMAIL
          ? await deps.sendUnlockEmailConfirmationUseCase.execute(current.target)
          : await deps.sendUnlockPhoneConfirmationUseCase.execute(current.target)

      if (isSuccess(result)) {
        const updated = get().screenState
        if (updated.status === 'content') {
          set({ screenState: { ...updated, actionLoading: false } })
        }
        startTimer(result.data.retryAfterSeconds, get, set)
      } else {
        const error = result.error
        const updated = get().screenState
        if (updated.status === 'content') {
          set({
            screenState: {
              ...updated,
              actionLoading: false,
              actionError: error
            }
          })
        }
        if ('retryAfterSeconds' in error && typeof error.retryAfterSeconds === 'number') {
          startTimer(error.retryAfterSeconds, get, set)
        }
      }
    },

    onBackClick: () => {
      timerController?.abort()
      deps.onBack()
    }
  }))
}

const UnlockOtpContext = createContext<UnlockOtpStore | null>(null)

/** Props for {@link UnlockOtpProvider}. */
export interface UnlockOtpProviderProps {
  dependencies: UnlockOtpStoreDependencies
  initialState?: UnlockOtpScreenState
  children: React.ReactNode
}

/** Context provider isolating {@link UnlockOtpStore} per component mount. */
export const UnlockOtpProvider: React.FC<UnlockOtpProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const storeRef = useRef<UnlockOtpStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = createUnlockOtpStore(dependencies, initialState)
  }

  return (
    <UnlockOtpContext.Provider value={storeRef.current}>
      {children}
    </UnlockOtpContext.Provider>
  )
}

/**
 * Custom hook to consume isolated {@link UnlockOtpStore} state.
 *
 * @param selector - State selector function
 * @returns Selected state slice
 */
export const useUnlockOtpStore = <T,>(
  selector: (state: UnlockOtpStoreState) => T
): T => {
  const store = useContext(UnlockOtpContext)
  if (!store) {
    throw new Error('useUnlockOtpStore must be used within UnlockOtpProvider')
  }
  return useStore(store, selector)
}
