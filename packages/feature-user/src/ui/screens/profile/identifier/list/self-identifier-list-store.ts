import React, { createContext, useContext, useEffect, useRef } from 'react'
import { createStore, useStore } from 'zustand'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AppType, UserAuthProvider, toUserIdentifierIdOrNull } from '@mudrichenkoevgeny/shared-foundation'
import type { UserIdentifierId } from "@mudrichenkoevgeny/shared-foundation";
import type { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'
import type { AvailableAuthProviders } from '@mudrichenkoevgeny/shared-foundation'
import { FieldValidator } from '@/validator/FieldValidator'
import type { GetUserIdentifiersUseCase } from '@/usecase/identifier/GetUserIdentifiersUseCase'
import type { GetAvailableUserAuthProvidersUseCase } from '@/usecase/auth/settings/GetAvailableUserAuthProvidersUseCase'
import type { SendAddEmailIdentifierConfirmationUseCase } from '@/usecase/identifier/SendAddEmailIdentifierConfirmationUseCase'
import type { AddUserIdentifierEmailUseCase } from '@/usecase/identifier/AddUserIdentifierEmailUseCase'
import type { SendAddPhoneIdentifierConfirmationUseCase } from '@/usecase/identifier/SendAddPhoneIdentifierConfirmationUseCase'
import type { AddUserIdentifierPhoneUseCase } from '@/usecase/identifier/AddUserIdentifierPhoneUseCase'
import type { AddUserIdentifierGoogleUseCase } from '@/usecase/identifier/AddUserIdentifierGoogleUseCase'
import type { IdentifierRepository } from '@/repository/identifier/IdentifierRepository'
import type { AuthStorage } from '@/storage/auth/AuthStorage'
/**
 * State machine steps for the add-identifier modal dialog.
 */
export type AddIdentifierDialogState =
  | {
      type: 'providerSelection'
    }
  | {
      type: 'emailFlow'
      email: string
      isEmailValid: boolean
      code: string
      password: string
      isPasswordValid: boolean
      isPasswordVisible: boolean
      isConfirmationSent: boolean
      resendTimerSeconds: number
      actionLoading: boolean
      actionError: AppError | null
      canSendCode: boolean
      canSubmit: boolean
      canResendCode: boolean
    }
  | {
      type: 'phoneFlow'
      phoneNumber: string
      isPhoneNumberValid: boolean
      code: string
      isConfirmationSent: boolean
      resendTimerSeconds: number
      actionLoading: boolean
      actionError: AppError | null
      canSendCode: boolean
      canSubmit: boolean
      canResendCode: boolean
    }

/**
 * Discriminated union representing active screen state for {@link SelfIdentifierListScreen}.
 */
export type SelfIdentifierListScreenState =
  | {
      status: 'loading'
    }
  | {
      status: 'error'
      error: AppError
    }
  | {
      status: 'content'
      items: UserIdentifier[]
      currentIdentifierId: UserIdentifierId | null
      availableAuthProviders: AvailableAuthProviders | null
      isAddIdentifierSupported: boolean
      addIdentifierDialogState: AddIdentifierDialogState | null
      pageNumber: number
      hasMorePages: boolean
      isNextPageLoading: boolean
      actionLoading: boolean
      actionError: AppError | null
    }

/**
 * Dependencies required to construct and run {@link SelfIdentifierListStore}.
 */
export interface SelfIdentifierListStoreDependencies {
  appType?: AppType
  getUserIdentifiersUseCase: GetUserIdentifiersUseCase
  getAvailableUserAuthProvidersUseCase?: GetAvailableUserAuthProvidersUseCase
  sendAddEmailIdentifierConfirmationUseCase?: SendAddEmailIdentifierConfirmationUseCase
  addUserIdentifierEmailUseCase?: AddUserIdentifierEmailUseCase
  sendAddPhoneIdentifierConfirmationUseCase?: SendAddPhoneIdentifierConfirmationUseCase
  addUserIdentifierPhoneUseCase?: AddUserIdentifierPhoneUseCase
  addUserIdentifierGoogleUseCase?: AddUserIdentifierGoogleUseCase
  identifierRepository?: IdentifierRepository
  authStorage?: AuthStorage
  onIdentifierSelect?: (identifierId: UserIdentifierId) => void
  onBack: () => void
}

/**
 * State and actions managed by {@link SelfIdentifierListStore}.
 */
export interface SelfIdentifierListStoreState {
  screenState: SelfIdentifierListScreenState
  loadIdentifiers: () => Promise<void>
  onRefresh: () => Promise<void>
  onIdentifierClick: (identifierId: UserIdentifierId) => void
  onAddIdentifierClick: () => Promise<void>
  onAddIdentifierSelectProvider: (authProvider: UserAuthProvider) => Promise<void>
  onAddIdentifierEmailChanged: (email: string) => void
  onAddIdentifierPasswordChanged: (password: string) => void
  onAddIdentifierTogglePasswordVisibility: () => void
  onAddIdentifierPhoneChanged: (phone: string) => void
  onAddIdentifierCodeChanged: (code: string) => void
  onAddIdentifierSendCode: () => Promise<void>
  onAddIdentifierSubmit: () => Promise<void>
  onAddIdentifierDialogBack: () => void
  onAddIdentifierDialogDismiss: () => void
  onIdentifierDeleted: (identifierId: UserIdentifierId) => void
  onLoadNextPage: () => Promise<void>
  onBackClick: () => void
  dispose: () => void
}

export type SelfIdentifierListStore = ReturnType<typeof createSelfIdentifierListStore>

/**
 * Factory function creating a Zustand store instance for {@link SelfIdentifierListScreen}.
 */
export const createSelfIdentifierListStore = (
  deps: SelfIdentifierListStoreDependencies,
  initialState?: SelfIdentifierListScreenState
) => {
  const DEFAULT_PAGE_SIZE = 20
  const DEFAULT_OTP_LENGTH = 6
  const appType = deps.appType ?? AppType.CLIENT
  let timerInterval: ReturnType<typeof setInterval> | null = null

  const clearTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  const startResendTimer = (seconds: number) => {
    clearTimer()
    if (seconds <= 0) {
      return
    }

    timerInterval = setInterval(() => {
      const current = store.getState().screenState
      if (current.status !== 'content' || !current.addIdentifierDialogState) {
        clearTimer()
        return
      }

      const dialog = current.addIdentifierDialogState
      if (dialog.type === 'emailFlow') {
        const nextSeconds = Math.max(0, dialog.resendTimerSeconds - 1)
        if (nextSeconds === 0) {
          clearTimer()
        }
        store.setState({
          screenState: {
            ...current,
            addIdentifierDialogState: {
              ...dialog,
              resendTimerSeconds: nextSeconds,
              canResendCode: nextSeconds <= 0 && !dialog.actionLoading
            }
          }
        })
      } else if (dialog.type === 'phoneFlow') {
        const nextSeconds = Math.max(0, dialog.resendTimerSeconds - 1)
        if (nextSeconds === 0) {
          clearTimer()
        }
        store.setState({
          screenState: {
            ...current,
            addIdentifierDialogState: {
              ...dialog,
              resendTimerSeconds: nextSeconds,
              canResendCode: nextSeconds <= 0 && !dialog.actionLoading
            }
          }
        })
      }
    }, 1000)
  }

  const store = createStore<SelfIdentifierListStoreState>()((set, get) => ({
    screenState: initialState ?? { status: 'loading' },

    loadIdentifiers: async () => {
      const storedIdentifierIdRaw = deps.authStorage ? await deps.authStorage.getIdentifierId() : null
      const activeIdentifierId = storedIdentifierIdRaw ? toUserIdentifierIdOrNull(storedIdentifierIdRaw) : null

      const result = await deps.getUserIdentifiersUseCase.execute(1, DEFAULT_PAGE_SIZE)

      if (isSuccess(result)) {
        const page = result.data
        set({
          screenState: {
            status: 'content',
            items: page.items,
            currentIdentifierId: activeIdentifierId,
            availableAuthProviders: null,
            isAddIdentifierSupported: appType === AppType.CLIENT,
            addIdentifierDialogState: null,
            pageNumber: 1,
            hasMorePages: page.items.length < page.totalCount,
            isNextPageLoading: false,
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

    onRefresh: async () => {
      const current = get().screenState
      if (current.status === 'content') {
        set({
          screenState: {
            ...current,
            actionLoading: true,
            actionError: null
          }
        })
      } else {
        set({ screenState: { status: 'loading' } })
      }

      await get().loadIdentifiers()
    },

    onIdentifierClick: (identifierId: UserIdentifierId) => {
      deps.onIdentifierSelect?.(identifierId)
    },

    onAddIdentifierClick: async () => {
      if (appType !== AppType.CLIENT) {
        return
      }

      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      if (current.availableAuthProviders) {
        set({
          screenState: {
            ...current,
            addIdentifierDialogState: { type: 'providerSelection' }
          }
        })
        return
      }

      if (!deps.getAvailableUserAuthProvidersUseCase) {
        return
      }

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      const result = await deps.getAvailableUserAuthProvidersUseCase.execute()

      if (isSuccess(result)) {
        set({
          screenState: {
            ...current,
            availableAuthProviders: result.data,
            addIdentifierDialogState: { type: 'providerSelection' },
            actionLoading: false,
            actionError: null
          }
        })
      } else {
        set({
          screenState: {
            ...current,
            actionLoading: false,
            actionError: result.error
          }
        })
      }
    },

    onAddIdentifierSelectProvider: async (authProvider: UserAuthProvider) => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      if (authProvider === UserAuthProvider.EMAIL) {
        set({
          screenState: {
            ...current,
            addIdentifierDialogState: {
              type: 'emailFlow',
              email: '',
              isEmailValid: false,
              code: '',
              password: '',
              isPasswordValid: false,
              isPasswordVisible: false,
              isConfirmationSent: false,
              resendTimerSeconds: 0,
              actionLoading: false,
              actionError: null,
              canSendCode: false,
              canSubmit: false,
              canResendCode: false
            }
          }
        })
      } else if (authProvider === UserAuthProvider.PHONE) {
        set({
          screenState: {
            ...current,
            addIdentifierDialogState: {
              type: 'phoneFlow',
              phoneNumber: '',
              isPhoneNumberValid: false,
              code: '',
              isConfirmationSent: false,
              resendTimerSeconds: 0,
              actionLoading: false,
              actionError: null,
              canSendCode: false,
              canSubmit: false,
              canResendCode: false
            }
          }
        })
      } else if (authProvider === UserAuthProvider.GOOGLE && deps.addUserIdentifierGoogleUseCase) {
        set({
          screenState: {
            ...current,
            actionLoading: true,
            actionError: null
          }
        })

        const result = await deps.addUserIdentifierGoogleUseCase.execute()

        if (isSuccess(result)) {
          get().onAddIdentifierDialogDismiss()
          await get().loadIdentifiers()
        } else {
          set({
            screenState: {
              ...current,
              actionLoading: false,
              actionError: result.error
            }
          })
        }
      }
    },

    onAddIdentifierEmailChanged: (email: string) => {
      const current = get().screenState
      if (current.status !== 'content' || current.addIdentifierDialogState?.type !== 'emailFlow') {
        return
      }

      const dialog = current.addIdentifierDialogState
      const isEmailValid = FieldValidator.isValidEmail(email)

      set({
        screenState: {
          ...current,
          addIdentifierDialogState: {
            ...dialog,
            email,
            isEmailValid,
            canSendCode: isEmailValid && !dialog.actionLoading,
            actionError: null
          }
        }
      })
    },

    onAddIdentifierPasswordChanged: (password: string) => {
      const current = get().screenState
      if (current.status !== 'content' || current.addIdentifierDialogState?.type !== 'emailFlow') {
        return
      }

      const dialog = current.addIdentifierDialogState
      const isPasswordValid = password.trim().length > 0
      const canSubmit = isPasswordValid && dialog.code.length === DEFAULT_OTP_LENGTH && !dialog.actionLoading

      set({
        screenState: {
          ...current,
          addIdentifierDialogState: {
            ...dialog,
            password,
            isPasswordValid,
            canSubmit,
            actionError: null
          }
        }
      })
    },

    onAddIdentifierTogglePasswordVisibility: () => {
      const current = get().screenState
      if (current.status !== 'content' || current.addIdentifierDialogState?.type !== 'emailFlow') {
        return
      }

      const dialog = current.addIdentifierDialogState

      set({
        screenState: {
          ...current,
          addIdentifierDialogState: {
            ...dialog,
            isPasswordVisible: !dialog.isPasswordVisible
          }
        }
      })
    },

    onAddIdentifierPhoneChanged: (phoneNumber: string) => {
      const current = get().screenState
      if (current.status !== 'content' || current.addIdentifierDialogState?.type !== 'phoneFlow') {
        return
      }

      const dialog = current.addIdentifierDialogState
      const isPhoneNumberValid = FieldValidator.isValidPhone(phoneNumber)

      set({
        screenState: {
          ...current,
          addIdentifierDialogState: {
            ...dialog,
            phoneNumber,
            isPhoneNumberValid,
            canSendCode: isPhoneNumberValid && !dialog.actionLoading,
            actionError: null
          }
        }
      })
    },

    onAddIdentifierCodeChanged: (code: string) => {
      const current = get().screenState
      if (current.status !== 'content' || !current.addIdentifierDialogState) {
        return
      }

      const dialog = current.addIdentifierDialogState

      if (dialog.type === 'emailFlow') {
        if (code.length <= DEFAULT_OTP_LENGTH) {
          const canSubmit = dialog.isPasswordValid && code.length === DEFAULT_OTP_LENGTH && !dialog.actionLoading
          set({
            screenState: {
              ...current,
              addIdentifierDialogState: {
                ...dialog,
                code,
                canSubmit,
                actionError: null
              }
            }
          })
        }
      } else if (dialog.type === 'phoneFlow') {
        if (code.length <= DEFAULT_OTP_LENGTH) {
          const canSubmit = code.length === DEFAULT_OTP_LENGTH && !dialog.actionLoading
          set({
            screenState: {
              ...current,
              addIdentifierDialogState: {
                ...dialog,
                code,
                canSubmit,
                actionError: null
              }
            }
          })
        }
      }
    },

    onAddIdentifierSendCode: async () => {
      const current = get().screenState
      if (current.status !== 'content' || !current.addIdentifierDialogState) {
        return
      }

      const dialog = current.addIdentifierDialogState

      if (dialog.type === 'emailFlow' && deps.sendAddEmailIdentifierConfirmationUseCase) {
        set({
          screenState: {
            ...current,
            addIdentifierDialogState: {
              ...dialog,
              actionLoading: true,
              canSendCode: false,
              actionError: null
            }
          }
        })

        const result = await deps.sendAddEmailIdentifierConfirmationUseCase.execute(dialog.email)

        if (isSuccess(result)) {
          const seconds = Math.max(0, result.data.retryAfterSeconds)
          set({
            screenState: {
              ...current,
              addIdentifierDialogState: {
                ...dialog,
                isConfirmationSent: true,
                resendTimerSeconds: seconds,
                actionLoading: false,
                canSendCode: false,
                canResendCode: seconds <= 0
              }
            }
          })
          startResendTimer(seconds)
        } else {
          set({
            screenState: {
              ...current,
              addIdentifierDialogState: {
                ...dialog,
                actionLoading: false,
                canSendCode: dialog.isEmailValid,
                actionError: result.error
              }
            }
          })
        }
      } else if (dialog.type === 'phoneFlow' && deps.sendAddPhoneIdentifierConfirmationUseCase) {
        set({
          screenState: {
            ...current,
            addIdentifierDialogState: {
              ...dialog,
              actionLoading: true,
              canSendCode: false,
              actionError: null
            }
          }
        })

        const result = await deps.sendAddPhoneIdentifierConfirmationUseCase.execute(dialog.phoneNumber)

        if (isSuccess(result)) {
          const seconds = Math.max(0, result.data.retryAfterSeconds)
          set({
            screenState: {
              ...current,
              addIdentifierDialogState: {
                ...dialog,
                isConfirmationSent: true,
                resendTimerSeconds: seconds,
                actionLoading: false,
                canSendCode: false,
                canResendCode: seconds <= 0
              }
            }
          })
          startResendTimer(seconds)
        } else {
          set({
            screenState: {
              ...current,
              addIdentifierDialogState: {
                ...dialog,
                actionLoading: false,
                canSendCode: dialog.isPhoneNumberValid,
                actionError: result.error
              }
            }
          })
        }
      }
    },

    onAddIdentifierSubmit: async () => {
      const current = get().screenState
      if (current.status !== 'content' || !current.addIdentifierDialogState) {
        return
      }

      const dialog = current.addIdentifierDialogState

      if (dialog.type === 'emailFlow' && deps.addUserIdentifierEmailUseCase) {
        if (!dialog.canSubmit) {
          return
        }

        set({
          screenState: {
            ...current,
            addIdentifierDialogState: {
              ...dialog,
              actionLoading: true,
              canSubmit: false,
              actionError: null
            }
          }
        })

        const result = await deps.addUserIdentifierEmailUseCase.execute(dialog.email, dialog.password, dialog.code)

        if (isSuccess(result)) {
          get().onAddIdentifierDialogDismiss()
          await get().loadIdentifiers()
        } else {
          set({
            screenState: {
              ...current,
              addIdentifierDialogState: {
                ...dialog,
                actionLoading: false,
                canSubmit: dialog.isPasswordValid && dialog.code.length === DEFAULT_OTP_LENGTH,
                actionError: result.error
              }
            }
          })
        }
      } else if (dialog.type === 'phoneFlow' && deps.addUserIdentifierPhoneUseCase) {
        if (!dialog.canSubmit) {
          return
        }

        set({
          screenState: {
            ...current,
            addIdentifierDialogState: {
              ...dialog,
              actionLoading: true,
              canSubmit: false,
              actionError: null
            }
          }
        })

        const result = await deps.addUserIdentifierPhoneUseCase.execute(dialog.phoneNumber, dialog.code)

        if (isSuccess(result)) {
          get().onAddIdentifierDialogDismiss()
          await get().loadIdentifiers()
        } else {
          set({
            screenState: {
              ...current,
              addIdentifierDialogState: {
                ...dialog,
                actionLoading: false,
                canSubmit: dialog.code.length === DEFAULT_OTP_LENGTH,
                actionError: result.error
              }
            }
          })
        }
      }
    },

    onAddIdentifierDialogBack: () => {
      clearTimer()
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      set({
        screenState: {
          ...current,
          addIdentifierDialogState: { type: 'providerSelection' }
        }
      })
    },

    onAddIdentifierDialogDismiss: () => {
      clearTimer()
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      set({
        screenState: {
          ...current,
          addIdentifierDialogState: null
        }
      })
    },

    onIdentifierDeleted: (identifierId: UserIdentifierId) => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      set({
        screenState: {
          ...current,
          items: current.items.filter((item) => item.id !== identifierId)
        }
      })
    },

    onLoadNextPage: async () => {
      const current = get().screenState
      if (current.status !== 'content' || !current.hasMorePages || current.isNextPageLoading) {
        return
      }

      const nextPage = current.pageNumber + 1

      set({
        screenState: {
          ...current,
          isNextPageLoading: true
        }
      })

      const result = await deps.getUserIdentifiersUseCase.execute(nextPage, DEFAULT_PAGE_SIZE)

      if (isSuccess(result)) {
        const page = result.data
        const combined = [...current.items, ...page.items]
        set({
          screenState: {
            ...current,
            items: combined,
            pageNumber: nextPage,
            hasMorePages: combined.length < page.totalCount,
            isNextPageLoading: false
          }
        })
      } else {
        set({
          screenState: {
            ...current,
            isNextPageLoading: false
          }
        })
      }
    },

    onBackClick: () => {
      deps.onBack()
    },

    dispose: () => {
      clearTimer()
    }
  }))

  if (!initialState) {
    store.getState().loadIdentifiers()
  }

  return store
}

const SelfIdentifierListContext = createContext<SelfIdentifierListStore | null>(null)

/**
 * Props for {@link SelfIdentifierListProvider}.
 */
export interface SelfIdentifierListProviderProps {
  dependencies: SelfIdentifierListStoreDependencies
  initialState?: SelfIdentifierListScreenState
  children: React.ReactNode
}

/**
 * React Context Provider for {@link SelfIdentifierListStore}.
 */
export const SelfIdentifierListProvider: React.FC<SelfIdentifierListProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {  const storeRef = useRef<SelfIdentifierListStore | undefined>(undefined)
  if (!storeRef.current) {
    storeRef.current = createSelfIdentifierListStore(dependencies, initialState)
  }

  useEffect(() => {
    return () => {
      storeRef.current?.getState().dispose()
    }
  }, [])

  return (
    <SelfIdentifierListContext.Provider value={storeRef.current}>
      {children}
    </SelfIdentifierListContext.Provider>
  )
}

/**
 * Custom hook to select state from {@link SelfIdentifierListStore}.
 */
export const useSelfIdentifierListStore = <T,>(
  selector: (state: SelfIdentifierListStoreState) => T
): T => {
  const store = useContext(SelfIdentifierListContext)
  if (!store) {
    throw new Error('useSelfIdentifierListStore must be used within SelfIdentifierListProvider')
  }
  return useStore(store, selector)
}
