import React, { createContext, useContext, useState } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import {
  AppType,
  selfIdentifierListParamsSchema,
  SortOrder,
  toUserIdentifierIdOrNull,
  UserAuthProvider
} from '@mudrichenkoevgeny/shared-foundation'
import type {
  AvailableAuthProviders,
  UserIdentifierId,
  UserIdentifierSummary
} from '@mudrichenkoevgeny/shared-foundation'
import {
  appendResultToPaginationState,
  canLoadMorePages,
  CommonError,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
  getNextPageNumber,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AppError,
  PaginationState
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { GetUserIdentifiersUseCase } from '@/usecase/identifier/get-user-identifiers-use-case'
import type { GetAvailableUserAuthProvidersUseCase } from '@/usecase/auth/settings/get-available-user-auth-providers-use-case'
import type { SendAddEmailIdentifierConfirmationUseCase } from '@/usecase/identifier/send-add-email-identifier-confirmation-use-case'
import type { AddUserIdentifierEmailUseCase } from '@/usecase/identifier/add-user-identifier-email-use-case'
import type { SendAddPhoneIdentifierConfirmationUseCase } from '@/usecase/identifier/send-add-phone-identifier-confirmation-use-case'
import type { AddUserIdentifierPhoneUseCase } from '@/usecase/identifier/add-user-identifier-phone-use-case'
import type { AddUserIdentifierGoogleUseCase } from '@/usecase/identifier/add-user-identifier-google-use-case'
import type { AuthStorage } from '@/storage/auth/auth-storage'

const DEFAULT_PAGE_SIZE = 20

/** Dialog type discriminators for adding new user identifiers. */
export enum AddIdentifierDialogType {
  PROVIDER_SELECTION = 'provider_selection',
  EMAIL_FLOW = 'email_flow',
  PHONE_FLOW = 'phone_flow'
}

/** Discriminated union for add identifier modal dialog state. */
export type AddIdentifierDialogState =
  | {
      type: AddIdentifierDialogType.PROVIDER_SELECTION
    }
  | {
      type: AddIdentifierDialogType.EMAIL_FLOW
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
      type: AddIdentifierDialogType.PHONE_FLOW
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

/** Status values for {@link SelfIdentifierListScreenState}. */
export enum SelfIdentifierListStatus {
  LOADING = 'loading',
  ERROR = 'error',
  CONTENT = 'content'
}

/** Discriminated union representing active screen state for {@link SelfIdentifierListScreen}. */
export type SelfIdentifierListScreenState =
  | {
      status: SelfIdentifierListStatus.LOADING
    }
  | {
      status: SelfIdentifierListStatus.ERROR
      error: AppError
    }
  | {
      status: SelfIdentifierListStatus.CONTENT
      items: UserIdentifierSummary[]
      currentIdentifierId: UserIdentifierId | null
      availableAuthProviders: AvailableAuthProviders | null
      isAddIdentifierSupported: boolean
      addIdentifierDialogState: AddIdentifierDialogState | null
      paging: PaginationState<UserIdentifierSummary>
      actionLoading: boolean
      actionError: AppError | null
    }

/** Dependencies required to construct and run {@link SelfIdentifierListStore}. */
export interface SelfIdentifierListStoreDependencies {
  appType?: AppType
  getUserIdentifiersUseCase: GetUserIdentifiersUseCase
  getAvailableUserAuthProvidersUseCase?: GetAvailableUserAuthProvidersUseCase
  sendAddEmailIdentifierConfirmationUseCase?: SendAddEmailIdentifierConfirmationUseCase
  addUserIdentifierEmailUseCase?: AddUserIdentifierEmailUseCase
  sendAddPhoneIdentifierConfirmationUseCase?: SendAddPhoneIdentifierConfirmationUseCase
  addUserIdentifierPhoneUseCase?: AddUserIdentifierPhoneUseCase
  addUserIdentifierGoogleUseCase?: AddUserIdentifierGoogleUseCase
  onNavigateToIdentifierDetail?: (identifierId: UserIdentifierId) => void
  onIdentifierSelect?: (identifierId: string) => void
  identifierRepository?: unknown
  onBack: () => void
  authStorage?: AuthStorage
}

/** State and actions contract managed by {@link SelfIdentifierListStore}. */
export interface SelfIdentifierListStoreState {
  dependencies: SelfIdentifierListStoreDependencies
  screenState: SelfIdentifierListScreenState
  loadIdentifiers: () => Promise<void>
  onRefresh: () => Promise<void>
  onIdentifierClick: (identifierId: UserIdentifierId) => void
  onAddIdentifierClick: () => Promise<void>
  onAddIdentifierSelectProvider: (provider: UserAuthProvider) => void
  onAddIdentifierEmailChanged: (email: string) => void
  onAddIdentifierPasswordChanged: (password: string) => void
  onAddIdentifierTogglePasswordVisibility: () => void
  onAddIdentifierPhoneChanged: (phone: string) => void
  onAddIdentifierCodeChanged: (code: string) => void
  onAddIdentifierSendCode: () => Promise<void>
  onAddIdentifierSubmit: () => Promise<void>
  onAddIdentifierDialogBack: () => void
  onAddIdentifierDialogDismiss: () => void
  onLoadNextPage: () => Promise<void>
  onBackClick: () => void
}

export type SelfIdentifierListStore = ReturnType<typeof createSelfIdentifierListStore>

export const createSelfIdentifierListStore = (
  deps: SelfIdentifierListStoreDependencies,
  initialState?: SelfIdentifierListScreenState
) => {
  let isFetching = false

  const loadIdentifiersInternal = async (
    set: StoreApi<SelfIdentifierListStoreState>['setState'],
    get: StoreApi<SelfIdentifierListStoreState>['getState'],
    isRefresh = false
  ) => {
    if (isFetching) {
      return
    }
    const current = get().screenState
    if (!isRefresh && current.status === SelfIdentifierListStatus.CONTENT) {
      return
    }
    isFetching = true

    try {
      const storedIdentifierIdRaw = deps.authStorage ? await deps.authStorage.getIdentifierId() : null
      const currentIdentifierId = storedIdentifierIdRaw ? toUserIdentifierIdOrNull(storedIdentifierIdRaw) : null

      const identifiersResult = await deps.getUserIdentifiersUseCase.execute(
        selfIdentifierListParamsSchema.parse({
          pageNumber: 1,
          pageSize: DEFAULT_PAGE_SIZE,
          sortBy: 'created_at',
          sortOrder: SortOrder.DESC,
          userAuthProviders: [],
          identifiers: []
        })
      )

      if (isSuccess(identifiersResult)) {
        let availableAuthProviders: AvailableAuthProviders | null = null
        let isAddIdentifierSupported = false

        if (deps.getAvailableUserAuthProvidersUseCase) {
          const providersResult = await deps.getAvailableUserAuthProvidersUseCase.execute()
          if (isSuccess(providersResult)) {
            availableAuthProviders = providersResult.data
            isAddIdentifierSupported =
              providersResult.data.primary.length > 0 || providersResult.data.secondary.length > 0
          }
        }

        const currentPaging = current.status === SelfIdentifierListStatus.CONTENT ? current.paging : createInitialPaginationState<UserIdentifierSummary>()
        const nextPaging = appendResultToPaginationState(currentPaging, identifiersResult.data)

        set({
          screenState: {
            status: SelfIdentifierListStatus.CONTENT,
            items: nextPaging.items,
            currentIdentifierId,
            availableAuthProviders,
            isAddIdentifierSupported,
            addIdentifierDialogState: null,
            paging: nextPaging,
            actionLoading: false,
            actionError: null
          }
        })
      } else {
        set({
          screenState: {
            status: SelfIdentifierListStatus.ERROR,
            error: identifiersResult.error
          }
        })
      }
    } finally {
      isFetching = false
    }
  }

  return createStore<SelfIdentifierListStoreState>()((set, get) => ({
    dependencies: deps,
    screenState: initialState ?? { status: SelfIdentifierListStatus.LOADING },

    loadIdentifiers: async () => {
      if (get().screenState.status !== SelfIdentifierListStatus.CONTENT) {
        set({ screenState: { status: SelfIdentifierListStatus.LOADING } })
      }
      await loadIdentifiersInternal(set, get, false)
    },

    onRefresh: async () => {
      const current = get().screenState
      if (current.status === SelfIdentifierListStatus.CONTENT) {
        set({
          screenState: {
            ...current,
            actionLoading: true,
            actionError: null
          }
        })
      } else {
        set({ screenState: { status: SelfIdentifierListStatus.LOADING } })
      }
      await loadIdentifiersInternal(set, get, true)
    },

    onLoadNextPage: async () => {
      const current = get().screenState
      if (
        current.status !== SelfIdentifierListStatus.CONTENT ||
        !canLoadMorePages(current.paging) ||
        isFetching
      ) {
        return
      }

      set({
        screenState: {
          ...current,
          paging: createNextPageLoadingPaginationState(current.paging)
        }
      })

      const nextPageNumber = getNextPageNumber(current.paging)
      isFetching = true

      try {
        const identifiersResult = await deps.getUserIdentifiersUseCase.execute(
          selfIdentifierListParamsSchema.parse({
            pageNumber: nextPageNumber,
            pageSize: DEFAULT_PAGE_SIZE,
            sortBy: 'created_at',
            sortOrder: SortOrder.DESC,
            userAuthProviders: [],
            identifiers: []
          })
        )

        if (isSuccess(identifiersResult)) {
          const nextPaging = appendResultToPaginationState(current.paging, identifiersResult.data)
          set({
            screenState: {
              ...current,
              items: nextPaging.items,
              paging: nextPaging
            }
          })
        } else {
          set({
            screenState: {
              ...current,
              paging: { ...current.paging, isNextPageLoading: false }
            }
          })
        }
      } finally {
        isFetching = false
      }
    },

    onIdentifierClick: (identifierId: UserIdentifierId) => {
      deps.onNavigateToIdentifierDetail?.(identifierId)
      deps.onIdentifierSelect?.(identifierId)
    },

    onAddIdentifierClick: async () => {
      const current = get().screenState
      if (current.status !== SelfIdentifierListStatus.CONTENT) {
        return
      }

      set({
        screenState: {
          ...current,
          addIdentifierDialogState: { type: AddIdentifierDialogType.PROVIDER_SELECTION }
        }
      })
    },

    onAddIdentifierSelectProvider: async (provider: UserAuthProvider) => {
      const current = get().screenState
      if (current.status !== SelfIdentifierListStatus.CONTENT) {
        return
      }

      switch (provider) {
        case UserAuthProvider.EMAIL:
          set({
            screenState: {
              ...current,
              addIdentifierDialogState: {
                type: AddIdentifierDialogType.EMAIL_FLOW,
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
          break
        case UserAuthProvider.PHONE:
          set({
            screenState: {
              ...current,
              addIdentifierDialogState: {
                type: AddIdentifierDialogType.PHONE_FLOW,
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
          break
        case UserAuthProvider.GOOGLE:
          if (deps.addUserIdentifierGoogleUseCase) {
            set({
              screenState: {
                ...current,
                actionLoading: true,
                actionError: null
              }
            })

            const googleResult = await deps.addUserIdentifierGoogleUseCase.execute()
            if (isSuccess(googleResult)) {
              await loadIdentifiersInternal(set, get, true)
            } else {
              set({
                screenState: {
                  ...current,
                  actionLoading: false,
                  actionError: googleResult.error,
                  addIdentifierDialogState: null
                }
              })
            }
          } else {
            set({
              screenState: {
                ...current,
                actionLoading: false,
                actionError: CommonError.contractViolation(
                  new Error('Google authentication provider is not configured')
                )
              }
            })
          }
          break
        case UserAuthProvider.APPLE:
          set({
            screenState: {
              ...current,
              actionLoading: false,
              actionError: CommonError.contractViolation(
                new Error('Apple authentication provider is not supported')
              )
            }
          })
          break
      }
    },

    onAddIdentifierEmailChanged: (email: string) => {
      const current = get().screenState
      if (
        current.status !== SelfIdentifierListStatus.CONTENT ||
        current.addIdentifierDialogState?.type !== AddIdentifierDialogType.EMAIL_FLOW
      ) {
        return
      }

      const isEmailValid = email.trim().length > 0 && email.includes('@')
      set({
        screenState: {
          ...current,
          addIdentifierDialogState: {
            ...current.addIdentifierDialogState,
            email,
            isEmailValid,
            canSendCode: isEmailValid,
            actionError: null
          }
        }
      })
    },

    onAddIdentifierPasswordChanged: (password: string) => {
      const current = get().screenState
      if (
        current.status !== SelfIdentifierListStatus.CONTENT ||
        current.addIdentifierDialogState?.type !== AddIdentifierDialogType.EMAIL_FLOW
      ) {
        return
      }

      const isPasswordValid = password.trim().length >= 8
      const canSubmit = current.addIdentifierDialogState.code.length === 6 && isPasswordValid

      set({
        screenState: {
          ...current,
          addIdentifierDialogState: {
            ...current.addIdentifierDialogState,
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
      if (
        current.status !== SelfIdentifierListStatus.CONTENT ||
        current.addIdentifierDialogState?.type !== AddIdentifierDialogType.EMAIL_FLOW
      ) {
        return
      }

      set({
        screenState: {
          ...current,
          addIdentifierDialogState: {
            ...current.addIdentifierDialogState,
            isPasswordVisible: !current.addIdentifierDialogState.isPasswordVisible
          }
        }
      })
    },

    onAddIdentifierPhoneChanged: (phoneNumber: string) => {
      const current = get().screenState
      if (
        current.status !== SelfIdentifierListStatus.CONTENT ||
        current.addIdentifierDialogState?.type !== AddIdentifierDialogType.PHONE_FLOW
      ) {
        return
      }

      const isPhoneNumberValid = phoneNumber.trim().length > 5
      set({
        screenState: {
          ...current,
          addIdentifierDialogState: {
            ...current.addIdentifierDialogState,
            phoneNumber,
            isPhoneNumberValid,
            canSendCode: isPhoneNumberValid,
            actionError: null
          }
        }
      })
    },

    onAddIdentifierCodeChanged: (code: string) => {
      const current = get().screenState
      if (current.status !== SelfIdentifierListStatus.CONTENT) {
        return
      }

      const dialog = current.addIdentifierDialogState
      if (!dialog) {
        return
      }

      switch (dialog.type) {
        case AddIdentifierDialogType.EMAIL_FLOW: {
          const canSubmit = code.length === 6 && dialog.isPasswordValid
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
          break
        }
        case AddIdentifierDialogType.PHONE_FLOW: {
          const canSubmit = code.length === 6
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
          break
        }
      }
    },

    onAddIdentifierSendCode: async () => {
      const current = get().screenState
      if (current.status !== SelfIdentifierListStatus.CONTENT) {
        return
      }

      const dialog = current.addIdentifierDialogState
      if (!dialog) {
        return
      }

      switch (dialog.type) {
        case AddIdentifierDialogType.EMAIL_FLOW: {
          if (!deps.sendAddEmailIdentifierConfirmationUseCase) {
            set({
              screenState: {
                ...current,
                addIdentifierDialogState: {
                  ...dialog,
                  actionError: CommonError.contractViolation(
                    new Error('Send email confirmation use case is not configured')
                  )
                }
              }
            })
            return
          }

          set({
            screenState: {
              ...current,
              addIdentifierDialogState: { ...dialog, actionLoading: true, actionError: null }
            }
          })

          const sendCodeResult = await deps.sendAddEmailIdentifierConfirmationUseCase.execute(dialog.email)
          if (isSuccess(sendCodeResult)) {
            set({
              screenState: {
                ...current,
                addIdentifierDialogState: {
                  ...dialog,
                  isConfirmationSent: true,
                  resendTimerSeconds: sendCodeResult.data.retryAfterSeconds,
                  actionLoading: false,
                  canResendCode: false
                }
              }
            })
          } else {
            set({
              screenState: {
                ...current,
                addIdentifierDialogState: {
                  ...dialog,
                  actionLoading: false,
                  actionError: sendCodeResult.error
                }
              }
            })
          }
          break
        }
        case AddIdentifierDialogType.PHONE_FLOW: {
          if (!deps.sendAddPhoneIdentifierConfirmationUseCase) {
            set({
              screenState: {
                ...current,
                addIdentifierDialogState: {
                  ...dialog,
                  actionError: CommonError.contractViolation(
                    new Error('Send phone confirmation use case is not configured')
                  )
                }
              }
            })
            return
          }

          set({
            screenState: {
              ...current,
              addIdentifierDialogState: { ...dialog, actionLoading: true, actionError: null }
            }
          })

          const sendCodeResult = await deps.sendAddPhoneIdentifierConfirmationUseCase.execute(dialog.phoneNumber)
          if (isSuccess(sendCodeResult)) {
            set({
              screenState: {
                ...current,
                addIdentifierDialogState: {
                  ...dialog,
                  isConfirmationSent: true,
                  resendTimerSeconds: sendCodeResult.data.retryAfterSeconds,
                  actionLoading: false,
                  canResendCode: false
                }
              }
            })
          } else {
            set({
              screenState: {
                ...current,
                addIdentifierDialogState: {
                  ...dialog,
                  actionLoading: false,
                  actionError: sendCodeResult.error
                }
              }
            })
          }
          break
        }
      }
    },

    onAddIdentifierSubmit: async () => {
      const current = get().screenState
      if (current.status !== SelfIdentifierListStatus.CONTENT) {
        return
      }

      const dialog = current.addIdentifierDialogState
      if (!dialog) {
        return
      }

      switch (dialog.type) {
        case AddIdentifierDialogType.EMAIL_FLOW: {
          if (!deps.addUserIdentifierEmailUseCase) {
            set({
              screenState: {
                ...current,
                addIdentifierDialogState: {
                  ...dialog,
                  actionError: CommonError.contractViolation(
                    new Error('Add email identifier use case is not configured')
                  )
                }
              }
            })
            return
          }

          set({
            screenState: {
              ...current,
              addIdentifierDialogState: { ...dialog, actionLoading: true, actionError: null }
            }
          })

          const addIdentifierResult = await deps.addUserIdentifierEmailUseCase.execute(dialog.email, dialog.password, dialog.code)
          if (isSuccess(addIdentifierResult)) {
            await loadIdentifiersInternal(set, get, true)
          } else {
            set({
              screenState: {
                ...current,
                addIdentifierDialogState: {
                  ...dialog,
                  actionLoading: false,
                  actionError: addIdentifierResult.error
                }
              }
            })
          }
          break
        }
        case AddIdentifierDialogType.PHONE_FLOW: {
          if (!deps.addUserIdentifierPhoneUseCase) {
            set({
              screenState: {
                ...current,
                addIdentifierDialogState: {
                  ...dialog,
                  actionError: CommonError.contractViolation(
                    new Error('Add phone identifier use case is not configured')
                  )
                }
              }
            })
            return
          }

          set({
            screenState: {
              ...current,
              addIdentifierDialogState: { ...dialog, actionLoading: true, actionError: null }
            }
          })

          const addIdentifierResult = await deps.addUserIdentifierPhoneUseCase.execute(dialog.phoneNumber, dialog.code)
          if (isSuccess(addIdentifierResult)) {
            await loadIdentifiersInternal(set, get, true)
          } else {
            set({
              screenState: {
                ...current,
                addIdentifierDialogState: {
                  ...dialog,
                  actionLoading: false,
                  actionError: addIdentifierResult.error
                }
              }
            })
          }
          break
        }
      }
    },

    onAddIdentifierDialogBack: () => {
      const current = get().screenState
      if (current.status !== SelfIdentifierListStatus.CONTENT) {
        return
      }

      set({
        screenState: {
          ...current,
          addIdentifierDialogState: { type: AddIdentifierDialogType.PROVIDER_SELECTION }
        }
      })
    },

    onAddIdentifierDialogDismiss: () => {
      const current = get().screenState
      if (current.status !== SelfIdentifierListStatus.CONTENT) {
        return
      }

      set({
        screenState: {
          ...current,
          addIdentifierDialogState: null
        }
      })
    },

    onBackClick: () => {
      deps.onBack()
    }
  }))
}

const SelfIdentifierListContext = createContext<SelfIdentifierListStore | null>(null)

export interface SelfIdentifierListProviderProps {
  dependencies: SelfIdentifierListStoreDependencies
  initialState?: SelfIdentifierListScreenState
  children: React.ReactNode
}

export const SelfIdentifierListProvider: React.FC<SelfIdentifierListProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createSelfIdentifierListStore(dependencies, initialState))

  return (
    <SelfIdentifierListContext.Provider value={store}>
      {children}
    </SelfIdentifierListContext.Provider>
  )
}

export const useSelfIdentifierListStore = <T,>(
  selector: (state: SelfIdentifierListStoreState) => T
): T => {
  const store = useContext(SelfIdentifierListContext)
  if (!store) {
    throw new Error('useSelfIdentifierListStore must be used within SelfIdentifierListProvider')
  }
  return useStore(store, selector)
}
