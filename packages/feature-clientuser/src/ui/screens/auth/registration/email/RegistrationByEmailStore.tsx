import React, { createContext, useContext, useEffect, useState } from 'react'
import { createStore, useStore } from 'zustand'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ClientSecurityErrorCodes } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import type { ValidatePasswordUseCase } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import { FieldValidator } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { RegistrationRepository } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { RegistrationByEmailUseCase } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { SendRegistrationConfirmationToEmailUseCase } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

export const DEFAULT_OTP_LENGTH = 6

export type RegistrationByEmailScreenState =
  | {
      step: 'email_input'
      email: string
      isEmailValid: boolean
      actionLoading: boolean
      actionError: AppError | null
    }
  | {
      step: 'registration_input'
      email: string
      code: string
      codeLength: number
      password: string
      isPasswordValid: boolean
      isPasswordVisible: boolean
      resendTimerSeconds: number
      actionLoading: boolean
      actionError: AppError | null
    }

export interface RegistrationByEmailStoreDependencies {
  registrationRepository: RegistrationRepository
  sendRegistrationConfirmationToEmailUseCase: SendRegistrationConfirmationToEmailUseCase
  registrationByEmailUseCase: RegistrationByEmailUseCase
  validatePasswordUseCase: ValidatePasswordUseCase
  onBack: () => void
  onFinished: () => void
}

export interface RegistrationByEmailStoreState {
  screenState: RegistrationByEmailScreenState
  onEmailChanged: (email: string) => void
  onSendCodeClick: () => Promise<void>
  onCodeChanged: (code: string) => void
  onPasswordChanged: (password: string) => void
  onTogglePasswordVisibility: () => void
  onRegisterClick: () => Promise<void>
  onBackClick: () => void
  destroy: () => void
}

export type RegistrationByEmailStore = ReturnType<typeof createRegistrationByEmailStore>

export const createRegistrationByEmailStore = (
  deps: RegistrationByEmailStoreDependencies,
  initialState?: RegistrationByEmailScreenState
) => {
  let timerInterval: ReturnType<typeof setInterval> | null = null

  const stopTimer = () => {
    if (timerInterval !== null) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  const startTimer = (set: any, get: any, seconds: number) => {
    stopTimer()
    if (seconds <= 0) {
      return
    }

    timerInterval = setInterval(() => {
      const current = get().screenState
      if (current.step !== 'registration_input') {
        stopTimer()
        return
      }

      const nextSeconds = current.resendTimerSeconds - 1
      if (nextSeconds <= 0) {
        stopTimer()
        set({
          screenState: {
            ...current,
            resendTimerSeconds: 0
          }
        })
      } else {
        set({
          screenState: {
            ...current,
            resendTimerSeconds: nextSeconds
          }
        })
      }
    }, 1000)
  }

  const defaultState: RegistrationByEmailScreenState = {
    step: 'email_input',
    email: '',
    isEmailValid: false,
    actionLoading: false,
    actionError: null
  }

  return createStore<RegistrationByEmailStoreState>()((set, get) => ({
    screenState: initialState ?? defaultState,

    onEmailChanged: (email: string) => {
      const current = get().screenState
      if (current.step !== 'email_input') {
        return
      }

      const isValid = FieldValidator.isValidEmail(email)
      set({
        screenState: {
          ...current,
          email,
          isEmailValid: isValid,
          actionError: null
        }
      })

      if (isValid) {
        const remaining = deps.registrationRepository.getRemainingRegistrationConfirmationDelayInSeconds(email)
        if (remaining > 0) {
          set({
            screenState: {
              step: 'registration_input',
              email,
              code: '',
              codeLength: DEFAULT_OTP_LENGTH,
              password: '',
              isPasswordValid: true,
              isPasswordVisible: false,
              resendTimerSeconds: remaining,
              actionLoading: false,
              actionError: null
            }
          })
          startTimer(set, get, remaining)
        }
      }
    },

    onSendCodeClick: async () => {
      const current = get().screenState
      if (current.step === 'registration_input') {
        if (current.actionLoading || current.resendTimerSeconds > 0) {
          return
        }

        set({
          screenState: {
            ...current,
            actionLoading: true,
            actionError: null
          }
        })

        const result = await deps.sendRegistrationConfirmationToEmailUseCase.execute(current.email)
        if (isSuccess(result)) {
          const retrySeconds = result.data.retryAfterSeconds
          set({
            screenState: {
              ...current,
              actionLoading: false,
              resendTimerSeconds: retrySeconds
            }
          })
          startTimer(set, get, retrySeconds)
        } else {
          set({
            screenState: {
              ...current,
              actionLoading: false,
              actionError: result.error
            }
          })
        }
        return
      }

      if (current.step !== 'email_input' || !current.isEmailValid || current.actionLoading) {
        return
      }

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      const result = await deps.sendRegistrationConfirmationToEmailUseCase.execute(current.email)
      if (isSuccess(result)) {
        const retrySeconds = result.data.retryAfterSeconds
        set({
          screenState: {
            step: 'registration_input',
            email: current.email,
            code: '',
            codeLength: DEFAULT_OTP_LENGTH,
            password: '',
            isPasswordValid: true,
            isPasswordVisible: false,
            resendTimerSeconds: retrySeconds,
            actionLoading: false,
            actionError: null
          }
        })
        startTimer(set, get, retrySeconds)
      } else {
        const error = result.error
        const retryAfterSecondsArg = error.args?.retryAfterSeconds ?? error.args?.['retry_after_seconds']
        const retryAfterSeconds = retryAfterSecondsArg ? Number(retryAfterSecondsArg) : 0

        if (retryAfterSeconds > 0) {
          set({
            screenState: {
              step: 'registration_input',
              email: current.email,
              code: '',
              codeLength: DEFAULT_OTP_LENGTH,
              password: '',
              isPasswordValid: true,
              isPasswordVisible: false,
              resendTimerSeconds: retryAfterSeconds,
              actionLoading: false,
              actionError: null
            }
          })
          startTimer(set, get, retryAfterSeconds)
        } else {
          set({
            screenState: {
              ...current,
              actionLoading: false,
              actionError: error
            }
          })
        }
      }
    },

    onCodeChanged: (code: string) => {
      const current = get().screenState
      if (current.step !== 'registration_input') {
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
      if (current.step !== 'registration_input') {
        return
      }

      const passResult = await deps.validatePasswordUseCase.execute(password)
      const isPasswordValid =
        isSuccess(passResult) ||
        (!isSuccess(passResult) &&
          (passResult.error.code === ClientSecurityErrorCodes.PASSWORD_TOO_SHORT ||
            passResult.error.code === ClientSecurityErrorCodes.PASSWORD_POLICY_UNAVAILABLE))

      set({
        screenState: {
          ...current,
          password,
          isPasswordValid,
          actionError: null
        }
      })
    },

    onTogglePasswordVisibility: () => {
      const current = get().screenState
      if (current.step !== 'registration_input') {
        return
      }

      set({
        screenState: {
          ...current,
          isPasswordVisible: !current.isPasswordVisible
        }
      })
    },

    onRegisterClick: async () => {
      const current = get().screenState
      if (
        current.step !== 'registration_input' ||
        current.code.length !== current.codeLength ||
        !current.isPasswordValid ||
        current.password.length === 0 ||
        current.actionLoading
      ) {
        return
      }

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      const passResult = await deps.validatePasswordUseCase.execute(current.password)
      if (!isSuccess(passResult)) {
        set({
          screenState: {
            ...current,
            actionLoading: false,
            isPasswordValid: false
          }
        })
        return
      }

      const result = await deps.registrationByEmailUseCase.execute(
        current.email,
        current.password,
        current.code
      )

      if (isSuccess(result)) {
        stopTimer()
        deps.onFinished()
      } else {
        const updated = get().screenState
        if (updated.step === 'registration_input') {
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
      const current = get().screenState
      if (current.step === 'registration_input') {
        stopTimer()
        set({
          screenState: {
            step: 'email_input',
            email: current.email,
            isEmailValid: FieldValidator.isValidEmail(current.email),
            actionLoading: false,
            actionError: null
          }
        })
      } else {
        deps.onBack()
      }
    },

    destroy: () => {
      stopTimer()
    }
  }))
}

const RegistrationByEmailContext = createContext<RegistrationByEmailStore | null>(null)

export interface RegistrationByEmailProviderProps {
  dependencies: RegistrationByEmailStoreDependencies
  initialState?: RegistrationByEmailScreenState
  children: React.ReactNode
}

export const RegistrationByEmailProvider: React.FC<RegistrationByEmailProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createRegistrationByEmailStore(dependencies, initialState))

  useEffect(() => {
    return () => {
      store.getState().destroy()
    }
  }, [store])

  return (
    <RegistrationByEmailContext.Provider value={store}>
      {children}
    </RegistrationByEmailContext.Provider>
  )
}

export const useRegistrationByEmailStore = <T,>(
  selector: (state: RegistrationByEmailStoreState) => T
): T => {
  const store = useContext(RegistrationByEmailContext)
  if (!store) {
    throw new Error('useRegistrationByEmailStore must be used within RegistrationByEmailProvider')
  }
  return useStore(store, selector)
}
