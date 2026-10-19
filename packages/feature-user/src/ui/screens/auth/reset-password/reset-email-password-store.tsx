import React, { createContext, useContext, useEffect, useState } from 'react'
import { createStore, useStore } from 'zustand'
import { getAppErrorRetryAfterSeconds, isSuccess, resendCountdown } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { ClientSecurityErrorCodes } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import type { ValidatePasswordUseCase } from "@mudrichenkoevgeny/web-platform-sdk-core-security";
import type { ResetPasswordRepository } from '@/repository/auth/reset-password/reset-password-repository'
import type { ResetEmailPasswordUseCase } from '@/usecase/auth/reset-password/reset-email-password-use-case'
import type { SendResetPasswordConfirmationToEmailUseCase } from '@/usecase/auth/reset-password/send-reset-password-confirmation-to-email-use-case'
import { FieldValidator } from '@/validator/field-validator'

/**
 * Screen status values for {@link ResetEmailPasswordScreenState}.
 */
export enum ResetEmailPasswordStatus {
  LOADING = 'loading',
  EMAIL_INPUT = 'email_input',
  RESET_INPUT = 'reset_input'
}

/**
 * Union representing the active screen state for {@link ResetEmailPasswordScreen}.
 */
export type ResetEmailPasswordScreenState =
  | {
      status: ResetEmailPasswordStatus.LOADING
    }
  | {
      status: ResetEmailPasswordStatus.EMAIL_INPUT
      email: string
      isEmailValid: boolean
      actionLoading: boolean
      actionError: AppError | null
    }
  | {
      status: ResetEmailPasswordStatus.RESET_INPUT
      email: string
      code: string
      newPassword: string
      isPasswordValid: boolean
      isPasswordVisible: boolean
      codeLength: number
      resendTimerSeconds: number
      actionLoading: boolean
      actionError: AppError | null
    }

/**
 * Dependencies required for initializing {@link ResetEmailPasswordStore}.
 */
export interface ResetEmailPasswordStoreDependencies {
  /** Password recovery repository. */
  resetPasswordRepository: Pick<ResetPasswordRepository, 'getRemainingResetPasswordConfirmationDelayInSeconds'>
  /** Use case for sending reset confirmation code to email. */
  sendResetPasswordConfirmationToEmailUseCase: Pick<SendResetPasswordConfirmationToEmailUseCase, 'execute'>
  /** Use case for resetting email password. */
  resetEmailPasswordUseCase: Pick<ResetEmailPasswordUseCase, 'execute'>
  /** Use case for validating password against active policy. */
  validatePasswordUseCase: Pick<ValidatePasswordUseCase, 'execute'>
  /** Navigation callback for back action or step pop. */
  onBack: () => void
  /** Flow completion callback. */
  onFinished: () => void
}

/**
 * State and action contract for {@link ResetEmailPasswordStore}.
 */
export interface ResetEmailPasswordStoreState {
  /** Active reactive screen state. */
  screenState: ResetEmailPasswordScreenState
  /** Updates email value and checks cooldown delay. */
  onEmailChanged: (email: string) => void
  /** Updates confirmation code value. */
  onCodeChanged: (code: string) => void
  /** Updates new password and runs validation. */
  onPasswordChanged: (password: string) => Promise<void>
  /** Toggles new password text visibility. */
  onTogglePasswordVisibility: () => void
  /** Sends reset confirmation code to email. */
  onSendCodeClick: () => Promise<void>
  /** Resets state back to email input step. */
  onResetEmailClick: () => void
  /** Confirms code and applies new password. */
  onConfirmResetClick: () => Promise<void>
  /** Handles back button navigation. */
  onBackClick: () => void
}

/**
 * Type alias for the per-instance Zustand store.
 */
export type ResetEmailPasswordStore = ReturnType<typeof createResetEmailPasswordStore>

/**
 * Instantiates a new isolated {@link ResetEmailPasswordStore} for a screen instance.
 *
 * @param deps - Screen dependencies
 * @param initialState - Optional initial state override
 * @returns Vanilla Zustand store instance
 */
export const createResetEmailPasswordStore = (
  deps: ResetEmailPasswordStoreDependencies,
  initialState?: ResetEmailPasswordScreenState
) => {
  let timerController: AbortController | null = null
  let validationRequestId = 0

  const startTimer = (
    seconds: number,
    get: () => ResetEmailPasswordStoreState,
    set: (state: Partial<ResetEmailPasswordStoreState>) => void
  ) => {
    timerController?.abort()
    if (seconds <= 0) {
      return
    }

    timerController = new AbortController()
    const signal = timerController.signal

    resendCountdown(
      seconds,
      (remaining) => {
        const current = get().screenState
        if (current.status === ResetEmailPasswordStatus.RESET_INPUT) {
          set({
            screenState: {
              ...current,
              resendTimerSeconds: remaining
            }
          })
        }
      },
      1000,
      signal
    )
  }

  const moveToResetInput = (
    email: string,
    seconds: number,
    get: () => ResetEmailPasswordStoreState,
    set: (state: Partial<ResetEmailPasswordStoreState>) => void
  ) => {
    set({
      screenState: {
        status: ResetEmailPasswordStatus.RESET_INPUT,
        email,
        code: '',
        newPassword: '',
        isPasswordValid: false,
        isPasswordVisible: false,
        codeLength: 6,
        resendTimerSeconds: seconds,
        actionLoading: false,
        actionError: null
      }
    })
    startTimer(seconds, get, set)
  }

  const defaultState: ResetEmailPasswordScreenState = {
    status: ResetEmailPasswordStatus.EMAIL_INPUT,
    email: '',
    isEmailValid: false,
    actionLoading: false,
    actionError: null
  }

  return createStore<ResetEmailPasswordStoreState>()((set, get) => ({
    screenState: initialState ?? defaultState,

    onEmailChanged: (email: string) => {
      const current = get().screenState
      if (current.status !== ResetEmailPasswordStatus.EMAIL_INPUT) {
        return
      }

      const isEmailValid = FieldValidator.isValidEmail(email)
      set({
        screenState: {
          ...current,
          email,
          isEmailValid,
          actionError: null
        }
      })

      if (isEmailValid) {
        const remaining = deps.resetPasswordRepository.getRemainingResetPasswordConfirmationDelayInSeconds(email)
        if (remaining > 0) {
          moveToResetInput(email, remaining, get, set)
        }
      }
    },

    onCodeChanged: (code: string) => {
      const current = get().screenState
      if (current.status !== ResetEmailPasswordStatus.RESET_INPUT) {
        return
      }

      if (code.length <= current.codeLength) {
        set({
          screenState: {
            ...current,
            code,
            actionError: null
          }
        })
      }
    },

    onPasswordChanged: async (password: string) => {
      const current = get().screenState
      if (current.status !== ResetEmailPasswordStatus.RESET_INPUT) {
        return
      }

      set({
        screenState: {
          ...current,
          newPassword: password,
          actionError: null
        }
      })

      const currentRequestId = ++validationRequestId
      const validationResult = await deps.validatePasswordUseCase.execute(password)

      if (currentRequestId !== validationRequestId) {
        return
      }

      let isPasswordValid = false
      if (isSuccess(validationResult)) {
        isPasswordValid = true
      } else {
        const errCode = validationResult.error.code
        isPasswordValid =
          errCode !== ClientSecurityErrorCodes.PASSWORD_TOO_SHORT &&
          errCode !== ClientSecurityErrorCodes.PASSWORD_POLICY_UNAVAILABLE
      }

      const updated = get().screenState
      if (updated.status === ResetEmailPasswordStatus.RESET_INPUT) {
        set({
          screenState: {
            ...updated,
            isPasswordValid
          }
        })
      }
    },

    onTogglePasswordVisibility: () => {
      const current = get().screenState
      if (current.status !== ResetEmailPasswordStatus.RESET_INPUT) {
        return
      }

      set({
        screenState: {
          ...current,
          isPasswordVisible: !current.isPasswordVisible
        }
      })
    },

    onSendCodeClick: async () => {
      const current = get().screenState
      const email = current.status === ResetEmailPasswordStatus.EMAIL_INPUT || current.status === ResetEmailPasswordStatus.RESET_INPUT ? current.email : ''
      if (!email) {
        return
      }

      if (current.status === ResetEmailPasswordStatus.EMAIL_INPUT || current.status === ResetEmailPasswordStatus.RESET_INPUT) {
        set({
          screenState: {
            ...current,
            actionLoading: true,
            actionError: null
          }
        })
      }

      const result = await deps.sendResetPasswordConfirmationToEmailUseCase.execute(email)
      if (isSuccess(result)) {
        moveToResetInput(email, result.data.retryAfterSeconds, get, set)
      } else {
        const error = result.error
        const retryAfterSeconds = getAppErrorRetryAfterSeconds(error)
        if (retryAfterSeconds > 0) {
          moveToResetInput(email, retryAfterSeconds, get, set)
        } else {
          const updated = get().screenState
          if (updated.status === ResetEmailPasswordStatus.EMAIL_INPUT || updated.status === ResetEmailPasswordStatus.RESET_INPUT) {
            set({
              screenState: {
                ...updated,
                actionLoading: false,
                actionError: error
              }
            })
          }
        }
      }
    },

    onConfirmResetClick: async () => {
      const current = get().screenState
      if (current.status !== ResetEmailPasswordStatus.RESET_INPUT || current.actionLoading) {
        return
      }

      const isCodeFullLength = current.code.length === current.codeLength
      if (!isCodeFullLength || !current.isPasswordValid) {
        return
      }

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      const validateResult = await deps.validatePasswordUseCase.execute(current.newPassword)
      if (isSuccess(validateResult)) {
        const resetResult = await deps.resetEmailPasswordUseCase.execute(
          current.email,
          current.newPassword,
          current.code
        )

        if (isSuccess(resetResult)) {
          deps.onFinished()
          const updated = get().screenState
          if (updated.status === ResetEmailPasswordStatus.RESET_INPUT) {
            set({ screenState: { ...updated, actionLoading: false } })
          }
        } else {
          const updated = get().screenState
          if (updated.status === ResetEmailPasswordStatus.RESET_INPUT) {
            set({
              screenState: {
                ...updated,
                actionLoading: false,
                actionError: resetResult.error
              }
            })
          }
        }
      } else {
        const updated = get().screenState
        if (updated.status === ResetEmailPasswordStatus.RESET_INPUT) {
          set({
            screenState: {
              ...updated,
              actionLoading: false,
              actionError: validateResult.error
            }
          })
        }
      }
    },

    onResetEmailClick: () => {
      timerController?.abort()
      const current = get().screenState
      const email = current.status === ResetEmailPasswordStatus.RESET_INPUT ? current.email : ''

      set({
        screenState: {
          status: ResetEmailPasswordStatus.EMAIL_INPUT,
          email,
          isEmailValid: FieldValidator.isValidEmail(email),
          actionLoading: false,
          actionError: null
        }
      })
    },

    onBackClick: () => {
      const current = get().screenState
      if (current.status === ResetEmailPasswordStatus.RESET_INPUT) {
        get().onResetEmailClick()
      } else {
        deps.onBack()
      }
    }
  }))
}

const ResetEmailPasswordContext = createContext<ResetEmailPasswordStore | null>(null)

/** Props for {@link ResetEmailPasswordProvider}. */
export interface ResetEmailPasswordProviderProps {
  /** Dependencies for initializing the store. */
  dependencies: ResetEmailPasswordStoreDependencies
  /** Optional initial state override. */
  initialState?: ResetEmailPasswordScreenState
  /** React children. */
  children: React.ReactNode
}

/** Context provider isolating {@link ResetEmailPasswordStore} per component mount. */
export const ResetEmailPasswordProvider: React.FC<ResetEmailPasswordProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createResetEmailPasswordStore(dependencies, initialState))

  useEffect(() => {
    store.setState((state) => ({ ...state, dependencies }))
  }, [store, dependencies])

  return (
    <ResetEmailPasswordContext.Provider value={store}>
      {children}
    </ResetEmailPasswordContext.Provider>
  )
}

/**
 * Custom hook to consume isolated {@link ResetEmailPasswordStore} state.
 *
 * @param selector - State selector function
 * @returns Selected state slice
 */
export const useResetEmailPasswordStore = <T,>(
  selector: (state: ResetEmailPasswordStoreState) => T
): T => {
  const store = useContext(ResetEmailPasswordContext)
  if (!store) {
    throw new Error('useResetEmailPasswordStore must be used within ResetEmailPasswordProvider')
  }
  return useStore(store, selector)
}
