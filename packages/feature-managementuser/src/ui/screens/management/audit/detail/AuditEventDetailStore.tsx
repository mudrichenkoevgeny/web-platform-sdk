import React, { createContext, useContext, useState, useEffect } from 'react'
import { createStore, useStore } from 'zustand'
import {
  toAuditEventIdOrNull,
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
import { CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

/** Discriminated union representing screen states for the audit event detail view. */
export type AuditEventDetailScreenState =
  | {
      /** Loading state while audit event details are being fetched. */
      status: 'loading'
    }
  | {
      /** Error state when loading audit event details failed. */
      status: 'error'
      /** Error instance describing the failure. */
      error: AppError
    }
  | {
      /** Content state containing successfully loaded audit event details. */
      status: 'content'
      /** Loaded private audit event details. */
      event: AuditEventPrivate
    }

/** External dependencies required by {@link createAuditEventDetailStore}. */
export interface AuditEventDetailStoreDependencies {
  /** Identifier of the audit event to display. */
  eventId: AuditEventId
  /** Use case for loading audit event details. */
  getAuditEventUseCase: { execute: (eventId: AuditEventId) => Promise<AppResult<AuditEventPrivate, AppError>> }
  /** Optional currently logged in user ID. */
  currentUserId?: UserId | null
  /** Optional navigation callback to user detail screen. */
  onNavigateToUserDetail?: (userId: UserId) => void
  /** Optional navigation callback to session detail screen. */
  onNavigateToSessionDetail?: (sessionId: UserSessionId) => void
  /** Optional navigation callback to identifier detail screen. */
  onNavigateToIdentifierDetail?: (identifierId: UserIdentifierId) => void
  /** Optional navigation callback to current user profile. */
  onNavigateToProfile?: () => void
  /** Navigation callback to return to previous screen. */
  onBack: () => void
}

/** Reactive store state and action interface for audit event detail screen. */
export interface AuditEventDetailStoreState {
  /** Dependencies injected into store. */
  dependencies: AuditEventDetailStoreDependencies
  /** Current screen UI state. */
  screenState: AuditEventDetailScreenState
  /** Initializes screen state by loading audit event details. */
  initScreen: () => Promise<void>
  /** Retries loading audit event details after failure. */
  onRetry: () => Promise<void>
  /** Handles click on audit event target resource. */
  onResourceClick: () => void
  /** Handles click on audit event actor subject. */
  onSubjectClick: () => void
  /** Handles back navigation button click. */
  onBackClick: () => void
}

/** Type alias for Zustand store instance returned by {@link createAuditEventDetailStore}. */
export type AuditEventDetailStore = ReturnType<typeof createAuditEventDetailStore>

/**
 * Creates a reactive Zustand store instance for audit event detail screen.
 *
 * @param deps - Injected store dependencies
 * @param initialState - Optional initial screen state override
 * @returns Initialized store instance
 */
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
        const activeDeps = get().dependencies
        const validEventId = toAuditEventIdOrNull(activeDeps.eventId)
        if (!validEventId) {
          set({
            screenState: {
              status: 'error',
              error: CommonError.unknown()
            }
          })
          return
        }

        set({ screenState: { status: 'loading' } })
        const auditEventResult = await activeDeps.getAuditEventUseCase.execute(validEventId)

        if (isSuccess(auditEventResult)) {
          set({
            screenState: {
              status: 'content',
              event: auditEventResult.data
            }
          })
        } else {
          set({
            screenState: {
              status: 'error',
              error: auditEventResult.error
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
          activeDeps.onNavigateToUserDetail?.(userId)
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
          activeDeps.onNavigateToUserDetail?.(userId)
        }
      }
    },

    onBackClick: () => {
      get().dependencies.onBack()
    }
  }))
}

const AuditEventDetailContext = createContext<AuditEventDetailStore | null>(null)

/** Props for {@link AuditEventDetailProvider}. */
export interface AuditEventDetailProviderProps {
  /** Injected dependencies. */
  dependencies: AuditEventDetailStoreDependencies
  /** Optional initial state override. */
  initialState?: AuditEventDetailScreenState
  /** React child nodes. */
  children: React.ReactNode
}

/** Context provider wrapping React components with audit event detail store state. */
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

/**
 * Custom React hook for selecting reactive state from {@link AuditEventDetailStore}.
 *
 * @param selector - Selector function transforming store state
 * @returns Selected slice of store state
 */
export const useAuditEventDetailStore = <T,>(
  selector: (state: AuditEventDetailStoreState) => T
): T => {
  const store = useContext(AuditEventDetailContext)
  if (!store) {
    throw new Error('useAuditEventDetailStore must be used within AuditEventDetailProvider')
  }
  return useStore(store, selector)
}
