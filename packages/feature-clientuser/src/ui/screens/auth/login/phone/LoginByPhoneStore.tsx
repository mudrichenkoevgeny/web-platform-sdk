import React, { createContext, useContext, useEffect, useState } from 'react'
import { createStore, useStore } from 'zustand'
import {
  accountLockoutTypeSchema,
  SecurityErrorArgs,
  SecurityErrorCodes,
  UserAccountStatus,
  UserErrorArgs,
  UserErrorCodes
} from '@mudrichenkoevgeny/shared-foundation'
import type { AccountLockoutType } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FieldValidator } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { LoginRepository } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { LoginByPhoneUseCase } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { SendLoginConfirmationToPhoneUseCase } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

export const DEFAULT_OTP_LENGTH = 6

export type LoginByPhoneScreenState =
  | {
      step: 'phone'
      phoneNumber: string
      isPhoneNumberValid: boolean
      actionLoading: boolean
      actionError: AppError | null
    }
  | {
      step: 'code'
      phoneNumber: string
      code: string
      codeLength: number
      resendTimerSeconds: number
      actionLoading: boolean
      actionError: AppError | null
    }

export interface LoginByPhoneStoreDependencies {
  loginRepository: LoginRepository
  sendLoginConfirmationToPhoneUseCase: SendLoginConfirmationToPhoneUseCase
  loginByPhoneUseCase: LoginByPhoneUseCase
  onNavigateToTotp: (mfaToken: string) => void
  onNavigateToPendingDeletion: () => void
  onNavigateToAccountUnlock?: (
    lockoutType?: AccountLockoutType | null,
    lockoutUntil?: number | null
  ) => void
  onBack: () => void
  onFinished: () => void
}

export interface LoginByPhoneStoreState {
  screenState: LoginByPhoneScreenState
  onPhoneChanged: (phone: string) => void
  onCodeChanged: (code: string) => void
  onSendCodeClick: () => Promise<void>
  onResetPhoneClick: () => void
  onConfirmCodeClick: () => Promise<void>
  onBackClick: () => void
  destroy: () => void
}

export type LoginByPhoneStore = ReturnType<typeof createLoginByPhoneStore>

export const createLoginByPhoneStore = (
  deps: LoginByPhoneStoreDependencies,
  initialState?: LoginByPhoneScreenState
) => {
  let timerInterval: ReturnType<typeof setInterval> | null = null

  const stopTimer = () => {
    if (timerInterval !== null) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  const defaultState: LoginByPhoneScreenState = {
    step: 'phone',
    phoneNumber: '',
    isPhoneNumberValid: false,
    actionLoading: false,
    actionError: null
  }

  return createStore<LoginByPhoneStoreState>()((set, get) => {
    const startTimer = (seconds: number) => {
      stopTimer()
      if (seconds <= 0) {
        return
      }

      timerInterval = setInterval(() => {
        const current = get().screenState
        if (current.step !== 'code') {
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

    return {
      screenState: initialState ?? defaultState,

      onPhoneChanged: (phone: string) => {
        const current = get().screenState
        if (current.step !== 'phone') {
          return
        }

        const isValid = FieldValidator.isValidPhone(phone)
        set({
          screenState: {
            ...current,
            phoneNumber: phone,
            isPhoneNumberValid: isValid,
            actionError: null
          }
        })

        if (isValid) {
          const remaining = deps.loginRepository.getRemainingLoginConfirmationDelayInSeconds(phone)
          if (remaining > 0) {
            set({
              screenState: {
                step: 'code',
                phoneNumber: phone,
                code: '',
                codeLength: DEFAULT_OTP_LENGTH,
                resendTimerSeconds: remaining,
                actionLoading: false,
                actionError: null
              }
            })
            startTimer(remaining)
          }
        }
      },

      onCodeChanged: (code: string) => {
        const current = get().screenState
        if (current.step !== 'code') {
          return
        }

        if (code.length <= current.codeLength) {
          const updatedState: LoginByPhoneScreenState = {
            ...current,
            code,
            actionError: null
          }

          set({ screenState: updatedState })

          if (code.length === current.codeLength) {
            get().onConfirmCodeClick()
          }
        }
      },

      onSendCodeClick: async () => {
        const current = get().screenState
        if (current.step === 'code') {
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

          const result = await deps.sendLoginConfirmationToPhoneUseCase.execute(current.phoneNumber)
          if (isSuccess(result)) {
            const retrySeconds = result.data.retryAfterSeconds
            set({
              screenState: {
                ...current,
                actionLoading: false,
                resendTimerSeconds: retrySeconds
              }
            })
            startTimer(retrySeconds)
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

        if (current.step !== 'phone' || !current.isPhoneNumberValid || current.actionLoading) {
          return
        }

        set({
          screenState: {
            ...current,
            actionLoading: true,
            actionError: null
          }
        })

        const result = await deps.sendLoginConfirmationToPhoneUseCase.execute(current.phoneNumber)
        if (isSuccess(result)) {
          const retrySeconds = result.data.retryAfterSeconds
          set({
            screenState: {
              step: 'code',
              phoneNumber: current.phoneNumber,
              code: '',
              codeLength: DEFAULT_OTP_LENGTH,
              resendTimerSeconds: retrySeconds,
              actionLoading: false,
              actionError: null
            }
          })
          startTimer(retrySeconds)
        } else {
          const error = result.error
          const retryAfterSecondsArg = error.args?.retryAfterSeconds ?? error.args?.['retry_after_seconds']
          const retryAfterSeconds = retryAfterSecondsArg ? Number(retryAfterSecondsArg) : 0

          if (retryAfterSeconds > 0) {
            set({
              screenState: {
                step: 'code',
                phoneNumber: current.phoneNumber,
                code: '',
                codeLength: DEFAULT_OTP_LENGTH,
                resendTimerSeconds: retryAfterSeconds,
                actionLoading: false,
                actionError: null
              }
            })
            startTimer(retryAfterSeconds)
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

      onResetPhoneClick: () => {
        stopTimer()
        const current = get().screenState
        const phone = current.phoneNumber
        set({
          screenState: {
            step: 'phone',
            phoneNumber: phone,
            isPhoneNumberValid: FieldValidator.isValidPhone(phone),
            actionLoading: false,
            actionError: null
          }
        })
      },

      onConfirmCodeClick: async () => {
        const current = get().screenState
        if (
          current.step !== 'code' ||
          current.code.length !== current.codeLength ||
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

        const result = await deps.loginByPhoneUseCase.execute(current.phoneNumber, current.code)
        if (isSuccess(result)) {
          stopTimer()
          if (result.data.userDetails.accountStatus === UserAccountStatus.PENDING_DELETION) {
            deps.onNavigateToPendingDeletion()
          } else {
            deps.onFinished()
          }
          const updated = get().screenState
          if (updated.step === 'code') {
            set({ screenState: { ...updated, actionLoading: false } })
          }
        } else {
          const error = result.error

          if (error.code === SecurityErrorCodes.MFA_CONFIRMATION_REQUIRED) {
            const mfaToken = error.args?.[SecurityErrorArgs.MFA_TOKEN] as string | undefined
            if (mfaToken) {
              stopTimer()
              deps.onNavigateToTotp(mfaToken)
              const updated = get().screenState
              if (updated.step === 'code') {
                set({ screenState: { ...updated, actionLoading: false } })
              }
              return
            }
          }

          if (error.code === UserErrorCodes.USER_LOCKED) {
            const lockoutTypeRaw = error.args?.[UserErrorArgs.ACCOUNT_LOCKOUT_TYPE] as string | undefined
            const lockoutTypeParsed = accountLockoutTypeSchema.safeParse(lockoutTypeRaw)
            const lockoutType = lockoutTypeParsed.success ? lockoutTypeParsed.data : null
            const lockoutUntilRaw = error.args?.[UserErrorArgs.TEMPORARY_LOCKOUT_UNTIL]
            const lockoutUntil = lockoutUntilRaw ? Number(lockoutUntilRaw) : null

            stopTimer()
            deps.onNavigateToAccountUnlock?.(lockoutType, lockoutUntil)
            const updated = get().screenState
            if (updated.step === 'code') {
              set({ screenState: { ...updated, actionLoading: false } })
            }
            return
          }

          const updated = get().screenState
          if (updated.step === 'code') {
            set({
              screenState: {
                ...updated,
                actionLoading: false,
                actionError: error
              }
            })
          }
        }
      },

      onBackClick: () => {
        const current = get().screenState
        if (current.step === 'code') {
          get().onResetPhoneClick()
        } else {
          deps.onBack()
        }
      },

      destroy: () => {
        stopTimer()
      }
    }
  })
}

const LoginByPhoneContext = createContext<LoginByPhoneStore | null>(null)

export interface LoginByPhoneProviderProps {
  dependencies: LoginByPhoneStoreDependencies
  initialState?: LoginByPhoneScreenState
  children: React.ReactNode
}

export const LoginByPhoneProvider: React.FC<LoginByPhoneProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createLoginByPhoneStore(dependencies, initialState))

  useEffect(() => {
    return () => {
      store.getState().destroy()
    }
  }, [store])

  return (
    <LoginByPhoneContext.Provider value={store}>
      {children}
    </LoginByPhoneContext.Provider>
  )
}

export const useLoginByPhoneStore = <T,>(
  selector: (state: LoginByPhoneStoreState) => T
): T => {
  const store = useContext(LoginByPhoneContext)
  if (!store) {
    throw new Error('useLoginByPhoneStore must be used within LoginByPhoneProvider')
  }
  return useStore(store, selector)
}
