import React, { createContext, useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import type { AccountLockoutType } from "@mudrichenkoevgeny/shared-foundation";
import type { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'
import { CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { UserError } from '@/error/model/user-error'
import type { UnlockByGoogleUseCase } from '@/usecase/auth/unlock/unlock-by-google-use-case'
import type { GetUserIdentifiersUseCase } from '@/usecase/identifier/get-user-identifiers-use-case'
/**
 * State contract for {@link UnlockMethodSelectionScreen}.
 */
export interface UnlockMethodSelectionScreenState {
  lockoutType: AccountLockoutType | null
  lockoutUntil: number | null
  knownIdentifiers: readonly UserIdentifier[]
  hasLoadedIdentifiers: boolean
  isEmailAvailable: boolean
  isPhoneAvailable: boolean
  isGoogleAvailable: boolean
  actionLoading: boolean
  actionError: AppError | null
}

/**
 * Store dependencies for {@link UnlockMethodSelectionStore}.
 */
export interface UnlockMethodSelectionStoreDependencies {
  lockoutType: AccountLockoutType | null
  lockoutUntil: number | null
  getUserIdentifiersUseCase: GetUserIdentifiersUseCase
  unlockByGoogleUseCase?: UnlockByGoogleUseCase | null
  onNavigateToEmailInput: () => void
  onNavigateToPhoneInput: () => void
  onUnlockSuccess: () => void
  onBack: () => void
}

/**
 * Actions contract for {@link UnlockMethodSelectionStore}.
 */
export interface UnlockMethodSelectionStoreActions {
  loadIdentifiers: () => Promise<void>
  onSelectEmailUnlock: () => void
  onSelectPhoneUnlock: () => void
  onSelectGoogleUnlock: () => Promise<void>
  onSelectAppleUnlock: () => void
  onBackClick: () => void
}

/**
 * Store type alias.
 */
export type UnlockMethodSelectionStoreState = UnlockMethodSelectionScreenState & UnlockMethodSelectionStoreActions
export type UnlockMethodSelectionStore = ReturnType<typeof createUnlockMethodSelectionStore>

/**
 * Instantiates Zustand store for unlock method selection.
 */
export const createUnlockMethodSelectionStore = (
  deps: UnlockMethodSelectionStoreDependencies,
  initialState?: Partial<UnlockMethodSelectionScreenState>
) => {
  return createStore<UnlockMethodSelectionStoreState>()((set, get) => ({
    lockoutType: deps.lockoutType,
    lockoutUntil: deps.lockoutUntil,
    knownIdentifiers: [],
    hasLoadedIdentifiers: false,
    isEmailAvailable: true,
    isPhoneAvailable: true,
    isGoogleAvailable: Boolean(deps.unlockByGoogleUseCase),
    actionLoading: false,
    actionError: null,
    ...initialState,

    loadIdentifiers: async () => {
      if (get().hasLoadedIdentifiers) {
        return
      }

      set({ actionLoading: true, actionError: null })
      const result = await deps.getUserIdentifiersUseCase.execute()

      if (isSuccess(result)) {
        const identifiers = result.data.items
        const hasEmail = identifiers.some((i) => i.userAuthProvider === UserAuthProvider.EMAIL)
        const hasPhone = identifiers.some((i) => i.userAuthProvider === UserAuthProvider.PHONE)

        set({
          knownIdentifiers: identifiers,
          hasLoadedIdentifiers: true,
          isEmailAvailable: identifiers.length === 0 || hasEmail,
          isPhoneAvailable: identifiers.length === 0 || hasPhone,
          actionLoading: false
        })
      } else {
        set({
          hasLoadedIdentifiers: true,
          actionLoading: false
        })
      }
    },

    onSelectEmailUnlock: () => {
      deps.onNavigateToEmailInput()
    },

    onSelectPhoneUnlock: () => {
      deps.onNavigateToPhoneInput()
    },

    onSelectGoogleUnlock: async () => {
      if (!deps.unlockByGoogleUseCase) {
        set({
          actionError: CommonError.contractViolation(
            new Error('Unlock by Google is not supported.')
          )
        })
        return
      }

      set({
        actionLoading: true,
        actionError: null
      })

      const result = await deps.unlockByGoogleUseCase.execute()
      if (isSuccess(result)) {
        set({ actionLoading: false })
        deps.onUnlockSuccess()
      } else {
        set({
          actionLoading: false,
          actionError: result.error
        })
      }
    },

    onSelectAppleUnlock: () => {
      set({
        actionError: UserError.externalAuthFailed(new Error('Apple auth not supported'))
      })
    },

    onBackClick: () => {
      deps.onBack()
    }
  }))
}

const UnlockMethodSelectionContext = createContext<UnlockMethodSelectionStore | null>(null)

/** Props for {@link UnlockMethodSelectionProvider}. */
export interface UnlockMethodSelectionProviderProps {
  dependencies: UnlockMethodSelectionStoreDependencies
  initialState?: Partial<UnlockMethodSelectionScreenState>
  children: React.ReactNode
}

/** Context provider isolating {@link UnlockMethodSelectionStore} per component mount. */
export const UnlockMethodSelectionProvider: React.FC<UnlockMethodSelectionProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const storeRef = useRef<UnlockMethodSelectionStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = createUnlockMethodSelectionStore(dependencies, initialState)
  }

  return (
    <UnlockMethodSelectionContext.Provider value={storeRef.current}>
      {children}
    </UnlockMethodSelectionContext.Provider>
  )
}

/** Custom hook consuming {@link UnlockMethodSelectionStore}. */
export const useUnlockMethodSelectionStore = <T,>(
  selector: (state: UnlockMethodSelectionStoreState) => T
): T => {
  const store = useContext(UnlockMethodSelectionContext)
  if (!store) {
    throw new Error('useUnlockMethodSelectionStore must be used within UnlockMethodSelectionProvider')
  }
  return useStore(store, selector)
}
