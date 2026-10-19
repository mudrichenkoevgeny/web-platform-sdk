import React, { createContext, useContext, useEffect, useState } from 'react'
import { createStore, useStore } from 'zustand'
import {
  AccountLockoutType,
  SecurityErrorCodes,
  UserAccountStatus,
  UserErrorCodes
} from '@mudrichenkoevgeny/shared-foundation'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  getAppErrorAccountLockoutType,
  getAppErrorMfaToken,
  getAppErrorRetryAfterSeconds,
  getAppErrorTemporaryLockoutUntil,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FieldValidator } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { LoginRepository } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { LoginByPhoneUseCase } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { SendLoginConfirmationToPhoneUseCase } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

const DEFAULT_OTP_LENGTH = 6

/** Active step in the phone authentication flow. */
export enum LoginByPhoneStep {
  /** Phone number entry step. */
  PHONE = 'phone',
  /** OTP confirmation code entry step. */
  CODE = 'code'
}

/** Discriminated union representing active screen state for {@link LoginByPhoneScreen}. */
export type LoginByPhoneScreenState =
  | {
      step: LoginByPhoneStep.PHONE
      phoneNumber: string
      isPhoneNumberValid: boolean
      actionLoading: boolean
      actionError: AppError | null
    }
  | {
      step: LoginByPhoneStep.CODE
      phoneNumber: string
      code: string
      codeLength: number
      resendTimerSeconds: number
      actionLoading: boolean
      actionError: AppError | null
    }

/** Dependencies required to construct and run {@link LoginByPhoneStore}. */
export interface LoginByPhoneStoreDependencies {
  loginRepository: Pick<LoginRepository, 'getRemainingLoginConfirmationDelayInSeconds'>
  sendLoginConfirmationToPhoneUseCase: Pick<SendLoginConfirmationToPhoneUseCase, 'execute'>
  loginByPhoneUseCase: Pick<LoginByPhoneUseCase, 'execute'>
  onNavigateToTotp: (mfaToken: string) => void
  onNavigateToPendingDeletion: () => void
  onNavigateToAccountUnlock?: (
    lockoutType?: AccountLockoutType | null,
    lockoutUntil?: number | null
  ) => void
  onBack: () => void
  onFinished: () => void
}

/** State and actions managed by {@link LoginByPhoneStore}. */
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
    step: LoginByPhoneStep.PHONE,
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
        if (current.step !== LoginByPhoneStep.CODE) {
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
        if (current.step !== LoginByPhoneStep.PHONE) {
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
                step: LoginByPhoneStep.CODE,
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
        if (current.step !== LoginByPhoneStep.CODE) {
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
        if (current.step === LoginByPhoneStep.CODE) {
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

          const sendCodeResult = await deps.sendLoginConfirmationToPhoneUseCase.execute(current.phoneNumber)
          if (isSuccess(sendCodeResult)) {
            const retrySeconds = sendCodeResult.data.retryAfterSeconds
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
                actionError: sendCodeResult.error
              }
            })
          }
          return
        }

        if (current.step !== LoginByPhoneStep.PHONE || !current.isPhoneNumberValid || current.actionLoading) {
          return
        }

        set({
          screenState: {
            ...current,
            actionLoading: true,
            actionError: null
          }
        })

        const sendCodeResult = await deps.sendLoginConfirmationToPhoneUseCase.execute(current.phoneNumber)
        if (isSuccess(sendCodeResult)) {
          const retrySeconds = sendCodeResult.data.retryAfterSeconds
          set({
            screenState: {
              step: LoginByPhoneStep.CODE,
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
          const error = sendCodeResult.error
          const retryAfterSeconds = getAppErrorRetryAfterSeconds(error)

          if (retryAfterSeconds > 0) {
            set({
              screenState: {
                step: LoginByPhoneStep.CODE,
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
            step: LoginByPhoneStep.PHONE,
            phoneNumber: phone,
            isPhoneNumberValid: FieldValidator.isValidPhone(phone),
            actionLoading: false,
            actionError: null
          }
        })
      },

      onConfirmCodeClick: async () => {
        const current = get().screenState
        if (current.step !== LoginByPhoneStep.CODE || current.code.length !== current.codeLength || current.actionLoading) {
          return
        }

        set({
          screenState: {
            ...current,
            actionLoading: true,
            actionError: null
          }
        })

        const loginResult = await deps.loginByPhoneUseCase.execute(current.phoneNumber, current.code)
        if (isSuccess(loginResult)) {
          stopTimer()
          set({
            screenState: {
              ...current,
              actionLoading: false,
              actionError: null
            }
          })

          const userPrivate = loginResult.data.userPrivate
          if (userPrivate.accountStatus === UserAccountStatus.PENDING_DELETION) {
            deps.onNavigateToPendingDeletion()
          } else {
            deps.onFinished()
          }
        } else {
          const error = loginResult.error
          if (error.code === SecurityErrorCodes.MFA_CONFIRMATION_REQUIRED) {
            const mfaToken = getAppErrorMfaToken(error)
            if (mfaToken) {
              stopTimer()
              set({
                screenState: {
                  ...current,
                  actionLoading: false,
                  actionError: null
                }
              })
              deps.onNavigateToTotp(mfaToken)
              return
            }
          }

          if (error.code === UserErrorCodes.USER_LOCKED) {
            const lockoutType = getAppErrorAccountLockoutType(error)
            const lockoutUntil = getAppErrorTemporaryLockoutUntil(error)

            stopTimer()
            set({
              screenState: {
                ...current,
                actionLoading: false,
                actionError: null
              }
            })

            if (deps.onNavigateToAccountUnlock) {
              deps.onNavigateToAccountUnlock(lockoutType, lockoutUntil)
            } else {
              set({
                screenState: {
                  ...current,
                  actionLoading: false,
                  actionError: error
                }
              })
            }
            return
          }

          set({
            screenState: {
              ...current,
              actionLoading: false,
              actionError: error
            }
          })
        }
      },

      onBackClick: () => {
        const current = get().screenState
        if (current.step === LoginByPhoneStep.CODE) {
          get().onResetPhoneClick()
        } else {
          stopTimer()
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

export const LoginByPhoneProvider: React.FC<{
  dependencies: LoginByPhoneStoreDependencies
  children: React.ReactNode
}> = ({ dependencies, children }) => {
  const [store] = useState(() => createLoginByPhoneStore(dependencies))

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
