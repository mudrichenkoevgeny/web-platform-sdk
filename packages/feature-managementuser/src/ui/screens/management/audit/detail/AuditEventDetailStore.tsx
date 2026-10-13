import React, { createContext, useContext, useState, useEffect } from 'react'
import { createStore, useStore } from 'zustand'
import {
  toUserIdentifierIdOrNull,
  toUserSessionIdOrNull,
  toUserIdOrNull
} from '@mudrichenkoevgeny/shared-foundation'
import type {
  AuditEventId,
  AuditEventPrivate,
  UserIdentifierId,
  UserSessionId,
  UserId
} from '@mudrichenkoevgeny/shared-foundation'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { GetAuditEventUseCase } from '@/usecase/audit/get-audit-event-use-case'

export type AuditEventDetailScreenState =
  | {
      status: 'loading'
    }
  | {
      status: 'error'
      error: AppError
    }
  | {
      status: 'content'
      event: AuditEventPrivate
    }

export interface AuditEventDetailStoreDependencies {
  eventId: AuditEventId
  getAuditEventUseCase: { execute: (eventId: AuditEventId) => Promise<AppResult<AuditEventPrivate, AppError>> }
  currentUserId?: UserId | null
  onNavigateToUserDetail?: (userId: UserId) => void
  onNavigateToSessionDetail?: (sessionId: UserSessionId) => void
  onNavigateToIdentifierDetail?: (identifierId: UserIdentifierId) => void
  onNavigateToProfile?: () => void
  onBack: () => void
}

export interface AuditEventDetailStoreState {
  dependencies: AuditEventDetailStoreDependencies
  screenState: AuditEventDetailScreenState
  initScreen: () => Promise<void>
  onRetry: () => Promise<void>
  onResourceClick: () => void
  onSubjectClick: () => void
  onBackClick: () => void
}

export type AuditEventDetailStore = ReturnType<typeof createAuditEventDetailStore>

export const createAuditEventDetailStore = (
  deps: AuditEventDetailStoreDependencies,
  initialState?: AuditEventDetailScreenState
) => {
  let isFetching = false

  return createStore<AuditEventDetailStoreState>()((set, get) => ({
    dependencies: deps,
    screenState: initialState ?? { status: 'loading' },

    initScreen: async () => {
      const current = get().screenState
      if (isFetching || current.status === 'content') {
        return
      }
      isFetching = true

      try {
        set({ screenState: { status: 'loading' } })
        const activeDeps = get().dependencies
        const result = await activeDeps.getAuditEventUseCase.execute(activeDeps.eventId)

        if (isSuccess(result)) {
          set({
            screenState: {
              status: 'content',
              event: result.data
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
      } finally {
        isFetching = false
      }
    },

    onRetry: async () => {
      await get().initScreen()
    },

    onResourceClick: () => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      const activeDeps = get().dependencies
      const event = current.event
      const resourceIdStr = event.resourceId
      if (!resourceIdStr) {
        return
      }

      const resourceName = String(event.resource).toLowerCase()

      if (resourceName.includes('identifier')) {
        const id = toUserIdentifierIdOrNull(resourceIdStr)
        if (id) {
          activeDeps.onNavigateToIdentifierDetail?.(id)
        }
      } else if (resourceName.includes('session')) {
        const id = toUserSessionIdOrNull(resourceIdStr)
        if (id) {
          activeDeps.onNavigateToSessionDetail?.(id)
        }
      } else if (resourceName.includes('user')) {
        const userId = toUserIdOrNull(resourceIdStr)
        if (userId) {
          if (activeDeps.currentUserId && userId === activeDeps.currentUserId) {
            activeDeps.onNavigateToProfile?.()
          } else {
            activeDeps.onNavigateToUserDetail?.(userId)
          }
        }
      }
    },

    onSubjectClick: () => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      const activeDeps = get().dependencies
      const event = current.event
      const actorIdStr = event.actorId
      if (!actorIdStr) {
        return
      }

      const actorType = String(event.actorType).toLowerCase()
      if (actorType.includes('user')) {
        const userId = toUserIdOrNull(actorIdStr)
        if (userId) {
          if (activeDeps.currentUserId && userId === activeDeps.currentUserId) {
            activeDeps.onNavigateToProfile?.()
          } else {
            activeDeps.onNavigateToUserDetail?.(userId)
          }
        }
      }
    },

    onBackClick: () => {
      get().dependencies.onBack()
    }
  }))
}

const AuditEventDetailContext = createContext<AuditEventDetailStore | null>(null)

export interface AuditEventDetailProviderProps {
  dependencies: AuditEventDetailStoreDependencies
  initialState?: AuditEventDetailScreenState
  children: React.ReactNode
}

export const AuditEventDetailProvider: React.FC<AuditEventDetailProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createAuditEventDetailStore(dependencies, initialState))

  useEffect(() => {
    store.setState((state) => ({ ...state, dependencies }))
  }, [store, dependencies])

  return (
    <AuditEventDetailContext.Provider value={store}>
      {children}
    </AuditEventDetailContext.Provider>
  )
}

export const useAuditEventDetailStore = <T,>(
  selector: (state: AuditEventDetailStoreState) => T
): T => {
  const store = useContext(AuditEventDetailContext)
  if (!store) {
    throw new Error('useAuditEventDetailStore must be used within AuditEventDetailProvider')
  }
  return useStore(store, selector)
}
