import React, { createContext, useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { UnlockMethod } from '@mudrichenkoevgeny/shared-foundation'
import type { SendUnlockEmailConfirmationUseCase } from '@/usecase/auth/unlock/SendUnlockEmailConfirmationUseCase'
import type { SendUnlockPhoneConfirmationUseCase } from '@/usecase/auth/unlock/SendUnlockPhoneConfirmationUseCase'
import { FieldValidator } from '@/validator/FieldValidator'
/**
 * Union representing the active screen state for {@link UnlockTargetInputScreen}.
 */
export type UnlockTargetInputScreenState =
  | {
      status: 'loading'
    }
  | {
      status: 'content'
      method: UnlockMethod
      input: string
      actionLoading: boolean
      actionError: AppError | null
    }

/**
 * Dependencies required for initializing {@link UnlockTargetInputStore}.
 */
export interface UnlockTargetInputStoreDependencies {
  /** Target unlock method (email or phone). */
  method: UnlockMethod
  /** Optional prefilled input value. */
  prefilledInput?: string
  /** Use case for sending unlock confirmation code to email. */
  sendUnlockEmailConfirmationUseCase: SendUnlockEmailConfirmationUseCase
  /** Use case for sending unlock confirmation code to phone number. */
  sendUnlockPhoneConfirmationUseCase: SendUnlockPhoneConfirmationUseCase
  /** Navigation callback to OTP confirmation screen. */
  onNavigateToOtp: (target: string, initialDelaySeconds: number) => void
  /** Navigation callback for popping screen step. */
  onBack: () => void
}

/**
 * State and action contract for {@link UnlockTargetInputStore}.
 */
export interface UnlockTargetInputStoreState {
  /** Active reactive screen state. */
  screenState: UnlockTargetInputScreenState
  /** Updates input value. */
  onInputChanged: (value: string) => void
  /** Validates target input and sends unlock code. */
  onSendCodeClick: () => Promise<void>
  /** Pops screen step. */
  onBackClick: () => void
}

/**
 * Type alias for the per-instance Zustand store.
 */
export type UnlockTargetInputStore = ReturnType<typeof createUnlockTargetInputStore>

/**
 * Instantiates a new isolated {@link UnlockTargetInputStore} for a screen instance.
 *
 * @param deps - Screen dependencies
 * @param initialState - Optional initial state override
 * @returns Vanilla Zustand store instance
 */
export const createUnlockTargetInputStore = (
  deps: UnlockTargetInputStoreDependencies,
  initialState?: UnlockTargetInputScreenState
) => {
  const defaultContentState: UnlockTargetInputScreenState = {
    status: 'content',
    method: deps.method,
    input: deps.prefilledInput ?? '',
    actionLoading: false,
    actionError: null
  }

  return createStore<UnlockTargetInputStoreState>()((set, get) => ({
    screenState: initialState ?? defaultContentState,

    onInputChanged: (value: string) => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      set({
        screenState: {
          ...current,
          input: value,
          actionError: null
        }
      })
    },

    onSendCodeClick: async () => {
      const current = get().screenState
      if (current.status !== 'content' || current.actionLoading) {
        return
      }

      const target = current.input.trim()
      const isInputValid =
        current.method === UnlockMethod.EMAIL
          ? FieldValidator.isValidEmail(target)
          : FieldValidator.isValidPhone(target)

      if (!isInputValid) {
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
          ? await deps.sendUnlockEmailConfirmationUseCase.execute(target)
          : await deps.sendUnlockPhoneConfirmationUseCase.execute(target)

      if (isSuccess(result)) {
        deps.onNavigateToOtp(target, result.data.retryAfterSeconds)
        const updated = get().screenState
        if (updated.status === 'content') {
          set({ screenState: { ...updated, actionLoading: false } })
        }
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

    onBackClick: () => {
      deps.onBack()
    }
  }))
}

const UnlockTargetInputContext = createContext<UnlockTargetInputStore | null>(null)

/** Props for {@link UnlockTargetInputProvider}. */
export interface UnlockTargetInputProviderProps {
  /** Dependencies for initializing the store. */
  dependencies: UnlockTargetInputStoreDependencies
  /** Optional initial state override. */
  initialState?: UnlockTargetInputScreenState
  /** React children. */
  children: React.ReactNode
}

/** Context provider isolating {@link UnlockTargetInputStore} per component mount. */
export const UnlockTargetInputProvider: React.FC<UnlockTargetInputProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const storeRef = useRef<UnlockTargetInputStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = createUnlockTargetInputStore(dependencies, initialState)
  }

  return (
    <UnlockTargetInputContext.Provider value={storeRef.current}>
      {children}
    </UnlockTargetInputContext.Provider>
  )
}

/**
 * Custom hook to consume isolated {@link UnlockTargetInputStore} state.
 *
 * @param selector - State selector function
 * @returns Selected state slice
 */
export const useUnlockTargetInputStore = <T,>(
  selector: (state: UnlockTargetInputStoreState) => T
): T => {
  const store = useContext(UnlockTargetInputContext)
  if (!store) {
    throw new Error('useUnlockTargetInputStore must be used within UnlockTargetInputProvider')
  }
  return useStore(store, selector)
}
