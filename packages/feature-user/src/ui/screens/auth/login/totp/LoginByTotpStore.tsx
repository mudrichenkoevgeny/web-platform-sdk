import React, { createContext, useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'
import { UserAccountStatus } from '@mudrichenkoevgeny/shared-foundation'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { LoginByTotpRecoveryCodeUseCase } from '@/usecase/auth/login/LoginByTotpRecoveryCodeUseCase'
import type { LoginByTotpUseCase } from '@/usecase/auth/login/LoginByTotpUseCase'
import { FieldValidator } from '@/validator/FieldValidator'
/**
 * Mode determining active MFA verification method.
 */
export enum LoginByTotpMode {
  /** Time-based One-Time Password from authenticator app. */
  TOTP = 'TOTP',
  /** Static backup recovery code. */
  RECOVERY_CODE = 'RECOVERY_CODE'
}

/**
 * Union representing the active screen state for {@link LoginByTotpScreen}.
 */
export type LoginByTotpScreenState =
  | {
      status: 'loading'
    }
  | {
      status: 'content'
      mfaToken: string
      code: string
      mode: LoginByTotpMode
      actionLoading: boolean
      actionError: AppError | null
    }

/**
 * Dependencies required for initializing {@link LoginByTotpStore}.
 */
export interface LoginByTotpStoreDependencies {
  /** Opaque intermediate token required for MFA sign-in call. */
  mfaToken: string
  /** Use case for performing sign-in with TOTP code. */
  loginByTotpUseCase: LoginByTotpUseCase
  /** Use case for performing sign-in with recovery code. */
  loginByTotpRecoveryCodeUseCase: LoginByTotpRecoveryCodeUseCase
  /** Navigation callback for account pending deletion restoration screen. */
  onNavigateToPendingDeletion: () => void
  /** Navigation callback for popping current screen step. */
  onBack: () => void
  /** Flow completion callback. */
  onFinished: () => void
}

/**
 * State and action contract for {@link LoginByTotpStore}.
 */
export interface LoginByTotpStoreState {
  /** Active reactive screen state. */
  screenState: LoginByTotpScreenState
  /** Updates verification code text. */
  onCodeChanged: (code: string) => void
  /** Toggles between TOTP and Recovery Code modes. */
  onToggleModeClick: () => void
  /** Validates code and executes login request. */
  onSubmitClick: () => Promise<void>
  /** Pops screen step. */
  onBackClick: () => void
}

/**
 * Type alias for the per-instance Zustand store.
 */
export type LoginByTotpStore = ReturnType<typeof createLoginByTotpStore>

/**
 * Instantiates a new isolated {@link LoginByTotpStore} for a screen instance.
 *
 * @param deps - Screen dependencies
 * @param initialState - Optional initial state override
 * @returns Vanilla Zustand store instance
 */
export const createLoginByTotpStore = (
  deps: LoginByTotpStoreDependencies,
  initialState?: LoginByTotpScreenState
) => {
  const defaultContentState: LoginByTotpScreenState = {
    status: 'content',
    mfaToken: deps.mfaToken,
    code: '',
    mode: LoginByTotpMode.TOTP,
    actionLoading: false,
    actionError: null
  }

  return createStore<LoginByTotpStoreState>()((set, get) => ({
    screenState: initialState ?? defaultContentState,

    onCodeChanged: (code: string) => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      set({
        screenState: {
          ...current,
          code,
          actionError: null
        }
      })
    },

    onToggleModeClick: () => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      const nextMode =
        current.mode === LoginByTotpMode.TOTP
          ? LoginByTotpMode.RECOVERY_CODE
          : LoginByTotpMode.TOTP

      set({
        screenState: {
          ...current,
          mode: nextMode,
          code: '',
          actionError: null
        }
      })
    },

    onSubmitClick: async () => {
      const current = get().screenState
      if (current.status !== 'content' || current.actionLoading) {
        return
      }

      const isCodeValid =
        current.mode === LoginByTotpMode.TOTP
          ? FieldValidator.isValidTotp(current.code)
          : current.code.trim().length > 0

      if (!isCodeValid) {
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
        current.mode === LoginByTotpMode.TOTP
          ? await deps.loginByTotpUseCase.execute(current.mfaToken, current.code)
          : await deps.loginByTotpRecoveryCodeUseCase.execute(current.mfaToken, current.code)

      if (isSuccess(result)) {
        if (result.data.user.accountStatus === UserAccountStatus.PENDING_DELETION) {
          deps.onNavigateToPendingDeletion()
        } else {
          deps.onFinished()
        }
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

const LoginByTotpContext = createContext<LoginByTotpStore | null>(null)

/**
 * Props for {@link LoginByTotpProvider}.
 */
export interface LoginByTotpProviderProps {
  /** Dependencies for initializing the store. */
  dependencies: LoginByTotpStoreDependencies
  /** Optional initial state override. */
  initialState?: LoginByTotpScreenState
  /** React children. */
  children: React.ReactNode
}

/**
 * Context provider isolating {@link LoginByTotpStore} per component mount.
 */
export const LoginByTotpProvider: React.FC<LoginByTotpProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const storeRef = useRef<LoginByTotpStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = createLoginByTotpStore(dependencies, initialState)
  }

  return (
    <LoginByTotpContext.Provider value={storeRef.current}>
      {children}
    </LoginByTotpContext.Provider>
  )
}

/**
 * Custom hook to consume isolated {@link LoginByTotpStore} state.
 *
 * @param selector - State selector function
 * @returns Selected state slice
 */
export const useLoginByTotpStore = <T,>(
  selector: (state: LoginByTotpStoreState) => T
): T => {
  const store = useContext(LoginByTotpContext)
  if (!store) {
    throw new Error('useLoginByTotpStore must be used within LoginByTotpProvider')
  }
  return useStore(store, selector)
}
