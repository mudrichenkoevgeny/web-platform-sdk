import React, { createContext, useContext, useState } from 'react'
import { createStore, useStore } from 'zustand'
import type { AccountLockoutType, UnlockMethod } from '@mudrichenkoevgeny/shared-foundation'
import type { GetUserIdentifiersUseCase } from '@/usecase/identifier/get-user-identifiers-use-case'
import type { UnlockByGoogleUseCase } from '@/usecase/auth/unlock/unlock-by-google-use-case'
import type { SendUnlockEmailConfirmationUseCase } from '@/usecase/auth/unlock/send-unlock-email-confirmation-use-case'
import type { SendUnlockPhoneConfirmationUseCase } from '@/usecase/auth/unlock/send-unlock-phone-confirmation-use-case'
import type { UnlockByEmailUseCase } from '@/usecase/auth/unlock/unlock-by-email-use-case'
import type { UnlockByPhoneUseCase } from '@/usecase/auth/unlock/unlock-by-phone-use-case'

export type UnlockDestination =
  | {
      type: 'selection'
    }
  | {
      type: 'target_input'
      method: UnlockMethod
    }
  | {
      type: 'otp'
      method: UnlockMethod
      target: string
      initialDelaySeconds: number
    }
  | {
      type: 'success'
    }

export interface UnlockRootStoreDependencies {
  lockoutType?: AccountLockoutType | null
  lockoutUntil?: number | null
  getUserIdentifiersUseCase: GetUserIdentifiersUseCase
  unlockByGoogleUseCase?: UnlockByGoogleUseCase | null
  sendUnlockEmailConfirmationUseCase: SendUnlockEmailConfirmationUseCase
  sendUnlockPhoneConfirmationUseCase: SendUnlockPhoneConfirmationUseCase
  unlockByEmailUseCase: UnlockByEmailUseCase
  unlockByPhoneUseCase: UnlockByPhoneUseCase
  onUnlockSuccess: () => void
  onBack: () => void
}

export interface UnlockRootStoreState {
  stack: UnlockDestination[]
  push: (destination: UnlockDestination) => void
  pop: () => void
  onBack: () => void
}

export type UnlockRootStore = ReturnType<typeof createUnlockRootStore>

export const createUnlockRootStore = (
  deps: UnlockRootStoreDependencies,
  initialDestination: UnlockDestination = { type: 'selection' }
) => {
  return createStore<UnlockRootStoreState>()((set, get) => ({
    stack: [initialDestination],

    push: (destination: UnlockDestination) => {
      set({ stack: [...get().stack, destination] })
    },

    pop: () => {
      const currentStack = get().stack
      if (currentStack.length > 1) {
        set({ stack: currentStack.slice(0, currentStack.length - 1) })
      } else {
        deps.onBack()
      }
    },

    onBack: () => {
      deps.onBack()
    }
  }))
}

const UnlockRootContext = createContext<UnlockRootStore | null>(null)

export interface UnlockRootProviderProps {
  dependencies: UnlockRootStoreDependencies
  initialDestination?: UnlockDestination
  children: React.ReactNode
}

export const UnlockRootProvider: React.FC<UnlockRootProviderProps> = ({
  dependencies,
  initialDestination,
  children
}) => {
  const [store] = useState(() => createUnlockRootStore(dependencies, initialDestination))

  return (
    <UnlockRootContext.Provider value={store}>
      {children}
    </UnlockRootContext.Provider>
  )
}

export const useUnlockRootStore = <T,>(
  selector: (state: UnlockRootStoreState) => T
): T => {
  const store = useContext(UnlockRootContext)
  if (!store) {
    throw new Error('useUnlockRootStore must be used within UnlockRootProvider')
  }
  return useStore(store, selector)
}
