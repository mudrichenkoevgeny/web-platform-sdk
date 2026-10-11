import React, { createContext, useContext, useState, useEffect } from 'react'
import { createStore, useStore } from 'zustand'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UnlockMethod } from '@mudrichenkoevgeny/shared-foundation'
import type { SendUnlockEmailConfirmationUseCase } from '@/usecase/auth/unlock/send-unlock-email-confirmation-use-case'
import type { SendUnlockPhoneConfirmationUseCase } from '@/usecase/auth/unlock/send-unlock-phone-confirmation-use-case'
import { FieldValidator } from '@/validator/field-validator'

export type UnlockTargetInputScreenState =
  | {
      status: 'loading'
    }
  | {
      status: 'content'
      input: string
      actionLoading: boolean
      actionError: AppError | null
    }

export interface UnlockTargetInputStoreDependencies {
  method: UnlockMethod
  prefilledInput?: string
  sendUnlockEmailConfirmationUseCase: SendUnlockEmailConfirmationUseCase
  sendUnlockPhoneConfirmationUseCase: SendUnlockPhoneConfirmationUseCase
  onNavigateToOtp: (target: string, initialDelaySeconds: number, method?: UnlockMethod) => void
  onBack: () => void
  onMethodChange?: (method: UnlockMethod) => void
}

export interface UnlockTargetInputStoreState {
  dependencies: UnlockTargetInputStoreDependencies
  screenState: UnlockTargetInputScreenState
  onMethodChanged: (method: UnlockMethod) => void
  onInputChanged: (value: string) => void
  onSendCodeClick: () => Promise<void>
  onBackClick: () => void
}

export type UnlockTargetInputStore = ReturnType<typeof createUnlockTargetInputStore>

export const createUnlockTargetInputStore = (
  deps: UnlockTargetInputStoreDependencies,
  initialState?: UnlockTargetInputScreenState
) => {
  const defaultContentState: UnlockTargetInputScreenState = {
    status: 'content',
    input: deps.prefilledInput ?? '',
    actionLoading: false,
    actionError: null
  }

  return createStore<UnlockTargetInputStoreState>()((set, get) => ({
    dependencies: deps,
    screenState: initialState ?? defaultContentState,

    onMethodChanged: (method: UnlockMethod) => {
      const activeDeps = get().dependencies
      activeDeps.onMethodChange?.(method)
      const current = get().screenState
      if (current.status === 'content') {
        set({
          screenState: {
            ...current,
            input: '',
            actionError: null
          }
        })
      }
    },

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

      const activeDeps = get().dependencies
      const activeMethod = activeDeps.method ?? UnlockMethod.EMAIL
      const target = current.input.trim()
      const isInputValid =
        activeMethod === UnlockMethod.EMAIL
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
        activeMethod === UnlockMethod.EMAIL
          ? await activeDeps.sendUnlockEmailConfirmationUseCase.execute(target)
          : await activeDeps.sendUnlockPhoneConfirmationUseCase.execute(target)

      if (isSuccess(result)) {
        activeDeps.onNavigateToOtp(target, result.data.retryAfterSeconds, activeMethod)
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
      get().dependencies.onBack()
    }
  }))
}

const UnlockTargetInputContext = createContext<UnlockTargetInputStore | null>(null)

export interface UnlockTargetInputProviderProps {
  dependencies: UnlockTargetInputStoreDependencies
  initialState?: UnlockTargetInputScreenState
  children: React.ReactNode
}

export const UnlockTargetInputProvider: React.FC<UnlockTargetInputProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createUnlockTargetInputStore(dependencies, initialState))

  useEffect(() => {
    store.setState((state) => ({ ...state, dependencies }))
  }, [store, dependencies])

  return (
    <UnlockTargetInputContext.Provider value={store}>
      {children}
    </UnlockTargetInputContext.Provider>
  )
}

export const useUnlockTargetInputStore = <T,>(
  selector: (state: UnlockTargetInputStoreState) => T
): T => {
  const store = useContext(UnlockTargetInputContext)
  if (!store) {
    throw new Error('useUnlockTargetInputStore must be used within UnlockTargetInputProvider')
  }
  return useStore(store, selector)
}
