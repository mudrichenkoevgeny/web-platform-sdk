import React, { createContext, useContext, useState, useEffect } from 'react'
import { createStore, useStore } from 'zustand'
import { isSuccess, resendCountdown } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UnlockMethod } from '@mudrichenkoevgeny/shared-foundation'
import type { SendUnlockEmailConfirmationUseCase } from '@/usecase/auth/unlock/send-unlock-email-confirmation-use-case'
import type { SendUnlockPhoneConfirmationUseCase } from '@/usecase/auth/unlock/send-unlock-phone-confirmation-use-case'
import type { UnlockByEmailUseCase } from '@/usecase/auth/unlock/unlock-by-email-use-case'
import type { UnlockByPhoneUseCase } from '@/usecase/auth/unlock/unlock-by-phone-use-case'

export enum UnlockOtpStatus {
  LOADING = 'loading',
  CONTENT = 'content'
}

export type UnlockOtpScreenState =
  | {
      status: UnlockOtpStatus.LOADING
    }
  | {
      status: UnlockOtpStatus.CONTENT
      codeInput: string
      remainingDelaySeconds: number
      actionLoading: boolean
      actionError: AppError | null
    }

export interface UnlockOtpStoreDependencies {
  method: UnlockMethod
  target: string
  initialDelaySeconds?: number
  unlockByEmailUseCase: UnlockByEmailUseCase
  unlockByPhoneUseCase: UnlockByPhoneUseCase
  sendUnlockEmailConfirmationUseCase: SendUnlockEmailConfirmationUseCase
  sendUnlockPhoneConfirmationUseCase: SendUnlockPhoneConfirmationUseCase
  onUnlockSuccess: () => void
  onBack: () => void
}

export interface UnlockOtpStoreState {
  dependencies: UnlockOtpStoreDependencies
  screenState: UnlockOtpScreenState
  initTimer: () => void
  onCodeChanged: (code: string) => void
  onUnlockClick: () => Promise<void>
  onResendCodeClick: () => Promise<void>
  onBackClick: () => void
}

export type UnlockOtpStore = ReturnType<typeof createUnlockOtpStore>

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
    if (current.status === UnlockOtpStatus.CONTENT) {
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
        if (active.status === UnlockOtpStatus.CONTENT) {
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
    status: UnlockOtpStatus.CONTENT,
    codeInput: '',
    remainingDelaySeconds: deps.initialDelaySeconds ?? 0,
    actionLoading: false,
    actionError: null
  }

  return createStore<UnlockOtpStoreState>()((set, get) => ({
    dependencies: deps,
    screenState: initialState ?? defaultContentState,

    initTimer: () => {
      const activeDeps = get().dependencies
      if ((activeDeps.initialDelaySeconds ?? 0) > 0) {
        startTimer(activeDeps.initialDelaySeconds!, get, set)
      }
    },

    onCodeChanged: (code: string) => {
      const current = get().screenState
      if (current.status !== UnlockOtpStatus.CONTENT) {
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
      if (current.status !== UnlockOtpStatus.CONTENT || current.actionLoading) {
        return
      }

      const activeDeps = get().dependencies
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

      const targetToUse = activeDeps.target
      const activeMethod = activeDeps.method ?? UnlockMethod.EMAIL

      const result =
        activeMethod === UnlockMethod.EMAIL
          ? await activeDeps.unlockByEmailUseCase.execute(targetToUse, code)
          : await activeDeps.unlockByPhoneUseCase.execute(targetToUse, code)

      if (isSuccess(result)) {
        const updated = get().screenState
        if (updated.status === UnlockOtpStatus.CONTENT) {
          set({ screenState: { ...updated, actionLoading: false } })
        }
        activeDeps.onUnlockSuccess()
      } else {
        const updated = get().screenState
        if (updated.status === UnlockOtpStatus.CONTENT) {
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
      if (current.status !== UnlockOtpStatus.CONTENT || current.actionLoading || current.remainingDelaySeconds > 0) {
        return
      }

      const activeDeps = get().dependencies
      const targetToUse = activeDeps.target
      const activeMethod = activeDeps.method ?? UnlockMethod.EMAIL

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      const result =
        activeMethod === UnlockMethod.EMAIL
          ? await activeDeps.sendUnlockEmailConfirmationUseCase.execute(targetToUse)
          : await activeDeps.sendUnlockPhoneConfirmationUseCase.execute(targetToUse)

      if (isSuccess(result)) {
        const updated = get().screenState
        if (updated.status === UnlockOtpStatus.CONTENT) {
          set({ screenState: { ...updated, actionLoading: false } })
        }
        startTimer(result.data.retryAfterSeconds, get, set)
      } else {
        const error = result.error
        const updated = get().screenState
        if (updated.status === UnlockOtpStatus.CONTENT) {
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
      get().dependencies.onBack()
    }
  }))
}

const UnlockOtpContext = createContext<UnlockOtpStore | null>(null)

export interface UnlockOtpProviderProps {
  dependencies: UnlockOtpStoreDependencies
  initialState?: UnlockOtpScreenState
  children: React.ReactNode
}

export const UnlockOtpProvider: React.FC<UnlockOtpProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createUnlockOtpStore(dependencies, initialState))

  useEffect(() => {
    store.setState((state) => ({ ...state, dependencies }))
  }, [store, dependencies])

  return (
    <UnlockOtpContext.Provider value={store}>
      {children}
    </UnlockOtpContext.Provider>
  )
}

export const useUnlockOtpStore = <T,>(
  selector: (state: UnlockOtpStoreState) => T
): T => {
  const store = useContext(UnlockOtpContext)
  if (!store) {
    throw new Error('useUnlockOtpStore must be used within UnlockOtpProvider')
  }
  return useStore(store, selector)
}
