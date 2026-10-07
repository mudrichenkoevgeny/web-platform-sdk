import React, { createContext, useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { TotpRecoveryCodes } from '@mudrichenkoevgeny/shared-foundation'
import type { GetRecoveryCodesUseCase } from '@/usecase/user/security/get-recovery-codes-use-case'
import type { RegenerateRecoveryCodesUseCase } from '@/usecase/user/security/regenerate-recovery-codes-use-case'
/**
 * Discriminated union representing active screen state for {@link TotpRecoveryCodesScreen}.
 */
export type TotpRecoveryCodesScreenState =
  | {
      status: 'loading'
    }
  | {
      status: 'content'
      recoveryCodes: TotpRecoveryCodes
      showRegenerateConfirmation: boolean
      actionLoading: boolean
      actionError: AppError | null
    }
  | {
      status: 'error'
      error: AppError
    }

/**
 * Dependencies required to construct and run {@link TotpRecoveryCodesStore}.
 */
export interface TotpRecoveryCodesStoreDependencies {
  getRecoveryCodesUseCase: GetRecoveryCodesUseCase
  regenerateRecoveryCodesUseCase: RegenerateRecoveryCodesUseCase
  onBack: () => void
}

/**
 * State and actions managed by {@link TotpRecoveryCodesStore}.
 */
export interface TotpRecoveryCodesStoreState {
  screenState: TotpRecoveryCodesScreenState
  loadRecoveryCodes: () => Promise<void>
  onRegenerateClick: () => void
  onConfirmRegenerate: () => Promise<void>
  onDismissDialogs: () => void
  onBackClick: () => void
}

export type TotpRecoveryCodesStore = ReturnType<typeof createTotpRecoveryCodesStore>

/**
 * Factory function creating a Zustand store instance for {@link TotpRecoveryCodesScreen}.
 */
export const createTotpRecoveryCodesStore = (
  deps: TotpRecoveryCodesStoreDependencies,
  initialState?: TotpRecoveryCodesScreenState
) => {
  const store = createStore<TotpRecoveryCodesStoreState>()((set, get) => ({
    screenState: initialState ?? { status: 'loading' },

    loadRecoveryCodes: async () => {
      const result = await deps.getRecoveryCodesUseCase.execute()

      if (isSuccess(result)) {
        set({
          screenState: {
            status: 'content',
            recoveryCodes: result.data,
            showRegenerateConfirmation: false,
            actionLoading: false,
            actionError: null
          }
        })
      } else {
        set({
          screenState: {
            status: 'error',
            error: result.error
          }
        })
      }
    },

    onRegenerateClick: () => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }
      set({
        screenState: {
          ...current,
          showRegenerateConfirmation: true
        }
      })
    },

    onConfirmRegenerate: async () => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      set({
        screenState: {
          ...current,
          showRegenerateConfirmation: false,
          actionLoading: true,
          actionError: null
        }
      })

      const result = await deps.regenerateRecoveryCodesUseCase.execute()

      if (isSuccess(result)) {
        set({
          screenState: {
            status: 'content',
            recoveryCodes: result.data,
            showRegenerateConfirmation: false,
            actionLoading: false,
            actionError: null
          }
        })
      } else {
        set({
          screenState: {
            ...current,
            showRegenerateConfirmation: false,
            actionLoading: false,
            actionError: result.error
          }
        })
      }
    },

    onDismissDialogs: () => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }
      set({
        screenState: {
          ...current,
          showRegenerateConfirmation: false
        }
      })
    },

    onBackClick: () => {
      deps.onBack()
    }
  }))

  return store
}

const TotpRecoveryCodesContext = createContext<TotpRecoveryCodesStore | null>(null)

/**
 * Props for {@link TotpRecoveryCodesProvider}.
 */
export interface TotpRecoveryCodesProviderProps {
  dependencies: TotpRecoveryCodesStoreDependencies
  initialState?: TotpRecoveryCodesScreenState
  children: React.ReactNode
}

/**
 * React Context Provider for {@link TotpRecoveryCodesStore}.
 */
export const TotpRecoveryCodesProvider: React.FC<TotpRecoveryCodesProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const storeRef = useRef<TotpRecoveryCodesStore | undefined>(undefined)
  if (!storeRef.current) {
    storeRef.current = createTotpRecoveryCodesStore(dependencies, initialState)
  }

  return (
    <TotpRecoveryCodesContext.Provider value={storeRef.current}>
      {children}
    </TotpRecoveryCodesContext.Provider>
  )
}

/**
 * Custom hook to select state from {@link TotpRecoveryCodesStore}.
 */
export const useTotpRecoveryCodesStore = <T,>(
  selector: (state: TotpRecoveryCodesStoreState) => T
): T => {
  const store = useContext(TotpRecoveryCodesContext)
  if (!store) {
    throw new Error('useTotpRecoveryCodesStore must be used within TotpRecoveryCodesProvider')
  }
  return useStore(store, selector)
}
