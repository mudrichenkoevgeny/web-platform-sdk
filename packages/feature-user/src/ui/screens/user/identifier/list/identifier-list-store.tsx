import React, { createContext, useContext, useState } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import {
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
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
  getNextPageNumber,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AppError,
  PaginationState
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AuthStorage } from '@/storage/auth/auth-storage'
import type { GetUserIdentifiersUseCase } from '@/usecase/identifier/get-user-identifiers-use-case'
import type { GetAvailableUserAuthProvidersUseCase } from '@/usecase/auth/settings/get-available-user-auth-providers-use-case'
import type { SendAddEmailIdentifierConfirmationUseCase } from '@/usecase/identifier/send-add-email-identifier-confirmation-use-case'
import type { AddUserIdentifierEmailUseCase } from '@/usecase/identifier/add-user-identifier-email-use-case'
import type { SendAddPhoneIdentifierConfirmationUseCase } from '@/usecase/identifier/send-add-phone-identifier-confirmation-use-case'
import type { AddUserIdentifierPhoneUseCase } from '@/usecase/identifier/add-user-identifier-phone-use-case'
import type { AddUserIdentifierGoogleUseCase } from '@/usecase/identifier/add-user-identifier-google-use-case'
import type { IdentifierListDataSource } from './identifier-list-data-source'
import { createSelfIdentifierListDataSource } from './identifier-list-data-source'



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

/** Status values for {@link IdentifierListScreenState}. */
export enum IdentifierListStatus {
  LOADING = 'loading',
  ERROR = 'error',
  CONTENT = 'content'
}

/** Discriminated union representing active screen state for {@link IdentifierListScreen}. */
export type IdentifierListScreenState =
  | {
      status: IdentifierListStatus.LOADING
    }
  | {
      status: IdentifierListStatus.ERROR
      error: AppError
    }
  | {
      status: IdentifierListStatus.CONTENT
      items: UserIdentifierSummary[]
      currentIdentifierId: UserIdentifierId | null
      availableAuthProviders: AvailableAuthProviders | null
      isAddIdentifierSupported: boolean
      addIdentifierDialogState: AddIdentifierDialogState | null
      paging: PaginationState<UserIdentifierSummary>
      isFilterPanelExpanded: boolean
      actionLoading: boolean
      actionError: AppError | null
    }

/** Dependencies required to construct and run {@link IdentifierListStore}. */
export interface IdentifierListStoreDependencies {
  /** Target user ID if viewing user-specific identifiers in management context. */
  userId?: string | null
  /** Data source wrapper handling use case execution. */
  dataSource?: IdentifierListDataSource
  /** Legacy use case for fetching user identifiers. */
  getUserIdentifiersUseCase?: GetUserIdentifiersUseCase
  /** Legacy use case for fetching available auth providers. */
  getAvailableUserAuthProvidersUseCase?: GetAvailableUserAuthProvidersUseCase
  /** Legacy use case for sending email confirmation. */
  sendAddEmailIdentifierConfirmationUseCase?: SendAddEmailIdentifierConfirmationUseCase
  /** Legacy use case for adding email identifier. */
  addUserIdentifierEmailUseCase?: AddUserIdentifierEmailUseCase
  /** Legacy use case for sending phone confirmation. */
  sendAddPhoneIdentifierConfirmationUseCase?: SendAddPhoneIdentifierConfirmationUseCase
  /** Legacy use case for adding phone identifier. */
  addUserIdentifierPhoneUseCase?: AddUserIdentifierPhoneUseCase
  /** Legacy use case for adding Google identifier. */
  addUserIdentifierGoogleUseCase?: AddUserIdentifierGoogleUseCase
  /** Optional navigation callback to identifier detail screen. */
  onNavigateToIdentifierDetail?: (identifierId: UserIdentifierId) => void
  /** Optional callback when an identifier is selected. */
  onIdentifierSelect?: (identifierId: string) => void
  /** Navigation callback invoked when user triggers back navigation. */
  onBack: () => void
  /** Optional auth storage instance to identify current identifier ID. */
  authStorage?: AuthStorage
  /** Initial parsed URL search parameters. */
  searchParams?: Record<string, unknown>
  /**
   * Callback invoked when search parameters change requiring URL update.
   * Host application navigation should apply `replace: true` when navigating to prevent polluting browser history.
   */
  onSearchParamsChanged?: (params: Record<string, unknown>) => void
}

/** State and actions contract managed by {@link IdentifierListStore}. */
export interface IdentifierListStoreState {
  dependencies: IdentifierListStoreDependencies
  dataSource: IdentifierListDataSource
  screenState: IdentifierListScreenState
  loadIdentifiers: (searchParams?: Record<string, unknown>) => Promise<void>
  onSearchParamsUpdated: (searchParams?: Record<string, unknown>) => Promise<void>
  onRefresh: (searchParams?: Record<string, unknown>) => Promise<void>
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
  onToggleFilterPanel: () => void
}

export type IdentifierListStore = ReturnType<typeof createIdentifierListStore>

function isValidEmail(email: string): boolean {
  return Boolean(email && email.includes('@') && email.includes('.'))
}

function isValidPhone(phone: string): boolean {
  return Boolean(phone && phone.trim().length >= 6)
}

/**
 * Factory function creating a Zustand store instance for the identifier list screen.
 *
 * @param deps - Injected store dependencies
 * @param initialState - Optional initial screen state override
 * @returns Initialized store instance
 */
export const createIdentifierListStore = (
  deps: IdentifierListStoreDependencies,
  initialState?: IdentifierListScreenState
) => {
  let isFetching = false

  const resolvedDataSource =
    deps.dataSource ??
    createSelfIdentifierListDataSource({
      getIdentifiersUseCase: deps.getUserIdentifiersUseCase!,
      getAvailableUserAuthProvidersUseCase: deps.getAvailableUserAuthProvidersUseCase,
      sendAddEmailIdentifierConfirmationUseCase: deps.sendAddEmailIdentifierConfirmationUseCase,
      addEmailIdentifierUseCase: deps.addUserIdentifierEmailUseCase,
      sendAddPhoneIdentifierConfirmationUseCase: deps.sendAddPhoneIdentifierConfirmationUseCase,
      addPhoneIdentifierUseCase: deps.addUserIdentifierPhoneUseCase,
      addGoogleIdentifierUseCase: deps.addUserIdentifierGoogleUseCase
    })

  const loadIdentifiersInternal = async (
    set: StoreApi<IdentifierListStoreState>['setState'],
    get: StoreApi<IdentifierListStoreState>['getState'],
    isRefresh = false,
    searchParams?: Record<string, unknown>
  ) => {
    if (isFetching) {
      return
    }
    const current = get().screenState
    if (!isRefresh && current.status === IdentifierListStatus.CONTENT) {
      return
    }
    isFetching = true

    try {
      const storedIdentifierIdRaw = deps.authStorage ? await deps.authStorage.getIdentifierId() : null
      const currentIdentifierId = storedIdentifierIdRaw ? toUserIdentifierIdOrNull(storedIdentifierIdRaw) : null

      const currentPaging =
        current.status === IdentifierListStatus.CONTENT
          ? current.paging
          : createInitialPaginationState<UserIdentifierSummary>()
      const activeParams = searchParams ?? deps.searchParams
      const pageNumber = activeParams?.pageNumber ? Number(activeParams.pageNumber) : getNextPageNumber(currentPaging)

      const identifiersResult = await resolvedDataSource.getIdentifiers({
        pageNumber,
        userId: deps.userId
      })

      if (isSuccess(identifiersResult)) {
        let availableAuthProviders: AvailableAuthProviders | null = null
        let isAddIdentifierSupported = false

        if (resolvedDataSource.isAddIdentifierAvailable && resolvedDataSource.getAvailableAuthProviders) {
          const providersResult = await resolvedDataSource.getAvailableAuthProviders()
          if (isSuccess(providersResult)) {
            availableAuthProviders = providersResult.data
            isAddIdentifierSupported =
              providersResult.data.primary.length > 0 || providersResult.data.secondary.length > 0
          }
        }

        const currentPaging =
          current.status === IdentifierListStatus.CONTENT
            ? current.paging
            : createInitialPaginationState<UserIdentifierSummary>()
        const nextPaging = appendResultToPaginationState(currentPaging, identifiersResult.data)

        set({
          screenState: {
            status: IdentifierListStatus.CONTENT,
            items: nextPaging.items,
            currentIdentifierId,
            availableAuthProviders,
            isAddIdentifierSupported,
            addIdentifierDialogState: null,
            paging: nextPaging,
            isFilterPanelExpanded: current.status === IdentifierListStatus.CONTENT ? current.isFilterPanelExpanded : false,
            actionLoading: false,
            actionError: null
          }
        })
      } else {
        set({
          screenState: {
            status: IdentifierListStatus.ERROR,
            error: identifiersResult.error
          }
        })
      }
    } finally {
      isFetching = false
    }
  }

  return createStore<IdentifierListStoreState>()((set, get) => ({
    dependencies: deps,
    dataSource: resolvedDataSource,
    screenState: initialState ?? { status: IdentifierListStatus.LOADING },

    loadIdentifiers: async (searchParams) => {
      if (get().screenState.status !== IdentifierListStatus.CONTENT) {
        set({ screenState: { status: IdentifierListStatus.LOADING } })
      }
      await loadIdentifiersInternal(set, get, false, searchParams)
    },

    onSearchParamsUpdated: async (searchParams) => {
      set({ screenState: { status: IdentifierListStatus.LOADING } })
      await loadIdentifiersInternal(set, get, true, searchParams)
    },

    onRefresh: async (searchParams) => {
      const current = get().screenState
      if (current.status === IdentifierListStatus.CONTENT) {
        set({
          screenState: {
            ...current,
            actionLoading: true,
            actionError: null
          }
        })
      } else {
        set({ screenState: { status: IdentifierListStatus.LOADING } })
      }
      await loadIdentifiersInternal(set, get, true, searchParams)
    },

    onToggleFilterPanel: () => {
      const current = get().screenState
      if (current.status !== IdentifierListStatus.CONTENT) {
        return
      }

      set({
        screenState: {
          ...current,
          isFilterPanelExpanded: !current.isFilterPanelExpanded
        }
      })
    },

    onLoadNextPage: async () => {
      const current = get().screenState
      if (
        current.status !== IdentifierListStatus.CONTENT ||
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
        const identifiersResult = await resolvedDataSource.getIdentifiers({
          pageNumber: nextPageNumber,
          userId: deps.userId
        })

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
              paging: {
                ...current.paging,
                isNextPageLoading: false
              }
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
      if (current.status !== IdentifierListStatus.CONTENT || !current.isAddIdentifierSupported) {
        return
      }

      set({
        screenState: {
          ...current,
          addIdentifierDialogState: {
            type: AddIdentifierDialogType.PROVIDER_SELECTION
          }
        }
      })
    },

    onAddIdentifierSelectProvider: (provider: UserAuthProvider) => {
      const current = get().screenState
      if (current.status !== IdentifierListStatus.CONTENT) {
        return
      }

      if (provider === UserAuthProvider.EMAIL) {
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
      } else if (provider === UserAuthProvider.PHONE) {
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
      } else if (provider === UserAuthProvider.GOOGLE) {
        if (resolvedDataSource.addGoogleIdentifier) {
          void resolvedDataSource.addGoogleIdentifier()
        }
      }
    },

    onAddIdentifierEmailChanged: (email: string) => {
      const current = get().screenState
      if (
        current.status !== IdentifierListStatus.CONTENT ||
        current.addIdentifierDialogState?.type !== AddIdentifierDialogType.EMAIL_FLOW
      ) {
        return
      }

      const isEmailValid = isValidEmail(email)
      set({
        screenState: {
          ...current,
          addIdentifierDialogState: {
            ...current.addIdentifierDialogState,
            email,
            isEmailValid,
            canSendCode: isEmailValid && !current.addIdentifierDialogState.actionLoading
          }
        }
      })
    },

    onAddIdentifierPasswordChanged: (password: string) => {
      const current = get().screenState
      if (
        current.status !== IdentifierListStatus.CONTENT ||
        current.addIdentifierDialogState?.type !== AddIdentifierDialogType.EMAIL_FLOW
      ) {
        return
      }

      const isPasswordValid = password.length >= 6
      const dlg = current.addIdentifierDialogState
      set({
        screenState: {
          ...current,
          addIdentifierDialogState: {
            ...dlg,
            password,
            isPasswordValid,
            canSubmit:
              dlg.code.length === 6 && isPasswordValid && !dlg.actionLoading
          }
        }
      })
    },

    onAddIdentifierTogglePasswordVisibility: () => {
      const current = get().screenState
      if (
        current.status !== IdentifierListStatus.CONTENT ||
        current.addIdentifierDialogState?.type !== AddIdentifierDialogType.EMAIL_FLOW
      ) {
        return
      }

      const dlg = current.addIdentifierDialogState
      set({
        screenState: {
          ...current,
          addIdentifierDialogState: {
            ...dlg,
            isPasswordVisible: !dlg.isPasswordVisible
          }
        }
      })
    },

    onAddIdentifierPhoneChanged: (phoneNumber: string) => {
      const current = get().screenState
      if (
        current.status !== IdentifierListStatus.CONTENT ||
        current.addIdentifierDialogState?.type !== AddIdentifierDialogType.PHONE_FLOW
      ) {
        return
      }

      const isPhoneNumberValid = isValidPhone(phoneNumber)
      set({
        screenState: {
          ...current,
          addIdentifierDialogState: {
            ...current.addIdentifierDialogState,
            phoneNumber,
            isPhoneNumberValid,
            canSendCode: isPhoneNumberValid && !current.addIdentifierDialogState.actionLoading
          }
        }
      })
    },

    onAddIdentifierCodeChanged: (code: string) => {
      const current = get().screenState
      if (current.status !== IdentifierListStatus.CONTENT) {
        return
      }

      const dlg = current.addIdentifierDialogState
      if (!dlg) {
        return
      }

      if (dlg.type === AddIdentifierDialogType.EMAIL_FLOW) {
        set({
          screenState: {
            ...current,
            addIdentifierDialogState: {
              ...dlg,
              code,
              canSubmit: code.length === 6 && dlg.isPasswordValid && !dlg.actionLoading
            }
          }
        })
      } else if (dlg.type === AddIdentifierDialogType.PHONE_FLOW) {
        set({
          screenState: {
            ...current,
            addIdentifierDialogState: {
              ...dlg,
              code,
              canSubmit: code.length === 6 && !dlg.actionLoading
            }
          }
        })
      }
    },

    onAddIdentifierSendCode: async () => {
      const current = get().screenState
      if (current.status !== IdentifierListStatus.CONTENT || !current.addIdentifierDialogState) {
        return
      }

      const dlg = current.addIdentifierDialogState

      if (dlg.type === AddIdentifierDialogType.EMAIL_FLOW && resolvedDataSource.sendAddEmailConfirmation) {
        set({
          screenState: {
            ...current,
            addIdentifierDialogState: {
              ...dlg,
              actionLoading: true,
              actionError: null
            }
          }
        })

        const emailConfirmationResult = await resolvedDataSource.sendAddEmailConfirmation(dlg.email)

        if (isSuccess(emailConfirmationResult)) {
          set({
            screenState: {
              ...current,
              addIdentifierDialogState: {
                ...dlg,
                isConfirmationSent: true,
                actionLoading: false,
                actionError: null
              }
            }
          })
        } else {
          set({
            screenState: {
              ...current,
              addIdentifierDialogState: {
                ...dlg,
                actionLoading: false,
                actionError: emailConfirmationResult.error
              }
            }
          })
        }
      } else if (dlg.type === AddIdentifierDialogType.PHONE_FLOW && resolvedDataSource.sendAddPhoneConfirmation) {
        set({
          screenState: {
            ...current,
            addIdentifierDialogState: {
              ...dlg,
              actionLoading: true,
              actionError: null
            }
          }
        })

        const phoneConfirmationResult = await resolvedDataSource.sendAddPhoneConfirmation(dlg.phoneNumber)

        if (isSuccess(phoneConfirmationResult)) {
          set({
            screenState: {
              ...current,
              addIdentifierDialogState: {
                ...dlg,
                isConfirmationSent: true,
                actionLoading: false,
                actionError: null
              }
            }
          })
        } else {
          set({
            screenState: {
              ...current,
              addIdentifierDialogState: {
                ...dlg,
                actionLoading: false,
                actionError: phoneConfirmationResult.error
              }
            }
          })
        }
      }
    },

    onAddIdentifierSubmit: async () => {
      const current = get().screenState
      if (current.status !== IdentifierListStatus.CONTENT || !current.addIdentifierDialogState) {
        return
      }

      const dlg = current.addIdentifierDialogState

      if (dlg.type === AddIdentifierDialogType.EMAIL_FLOW && resolvedDataSource.addEmailIdentifier) {
        set({
          screenState: {
            ...current,
            addIdentifierDialogState: {
              ...dlg,
              actionLoading: true,
              actionError: null
            }
          }
        })

        const emailSubmitResult = await resolvedDataSource.addEmailIdentifier({
          email: dlg.email,
          code: dlg.code,
          password: dlg.password
        })

        if (isSuccess(emailSubmitResult)) {
          set({
            screenState: {
              ...current,
              addIdentifierDialogState: null
            }
          })
          await get().onRefresh()
        } else {
          set({
            screenState: {
              ...current,
              addIdentifierDialogState: {
                ...dlg,
                actionLoading: false,
                actionError: emailSubmitResult.error
              }
            }
          })
        }
      } else if (dlg.type === AddIdentifierDialogType.PHONE_FLOW && resolvedDataSource.addPhoneIdentifier) {
        set({
          screenState: {
            ...current,
            addIdentifierDialogState: {
              ...dlg,
              actionLoading: true,
              actionError: null
            }
          }
        })

        const phoneSubmitResult = await resolvedDataSource.addPhoneIdentifier({
          phoneNumber: dlg.phoneNumber,
          code: dlg.code
        })

        if (isSuccess(phoneSubmitResult)) {
          set({
            screenState: {
              ...current,
              addIdentifierDialogState: null
            }
          })
          await get().onRefresh()
        } else {
          set({
            screenState: {
              ...current,
              addIdentifierDialogState: {
                ...dlg,
                actionLoading: false,
                actionError: phoneSubmitResult.error
              }
            }
          })
        }
      }
    },

    onAddIdentifierDialogBack: () => {
      const current = get().screenState
      if (current.status !== IdentifierListStatus.CONTENT) {
        return
      }

      set({
        screenState: {
          ...current,
          addIdentifierDialogState: {
            type: AddIdentifierDialogType.PROVIDER_SELECTION
          }
        }
      })
    },

    onAddIdentifierDialogDismiss: () => {
      const current = get().screenState
      if (current.status !== IdentifierListStatus.CONTENT) {
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

const IdentifierListContext = createContext<IdentifierListStore | null>(null)

export interface IdentifierListProviderProps {
  dependencies: IdentifierListStoreDependencies
  initialState?: IdentifierListScreenState
  children: React.ReactNode
}

export const IdentifierListProvider: React.FC<IdentifierListProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createIdentifierListStore(dependencies, initialState))

  return (
    <IdentifierListContext.Provider value={store}>
      {children}
    </IdentifierListContext.Provider>
  )
}

export const useIdentifierListStore = <T,>(
  selector: (state: IdentifierListStoreState) => T
): T => {
  const store = useContext(IdentifierListContext)
  if (!store) {
    throw new Error('useIdentifierListStore must be used within IdentifierListProvider')
  }
  return useStore(store, selector)
}
