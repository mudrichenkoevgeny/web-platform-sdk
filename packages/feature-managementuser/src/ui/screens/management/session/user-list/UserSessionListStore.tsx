import React, { createContext, useContext, useEffect, useState } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import type { UserSession, UserSessionId, UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, PaginationState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  appendResultToPaginationState,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementDeleteAllUserSessionsUseCase } from '@/usecase/session/ManagementDeleteAllUserSessionsUseCase'
import type { ManagementDeleteSessionUseCase } from '@/usecase/session/ManagementDeleteSessionUseCase'
import type { ManagementGetSessionsUseCase } from '@/usecase/session/ManagementGetSessionsUseCase'

export type UserSessionListScreenState =
  | {
      status: 'loading'
    }
  | {
      status: 'error'
      error: AppError
    }
  | {
      status: 'content'
      paging: PaginationState<UserSession>
      actionLoading: boolean
      actionError: AppError | null
    }

export interface UserSessionListStoreDependencies {
  userId?: UserId | null
  managementGetSessionsUseCase: ManagementGetSessionsUseCase
  managementDeleteSessionUseCase: ManagementDeleteSessionUseCase
  managementDeleteAllUserSessionsUseCase: ManagementDeleteAllUserSessionsUseCase
  onNavigateToSessionDetail?: (session: UserSession) => void
  onBack: () => void
}

export interface UserSessionListStoreState {
  screenState: UserSessionListScreenState
  initScreen: () => Promise<void>
  onLoadNextPage: () => Promise<void>
  onRefresh: () => Promise<void>
  onSessionClick: (session: UserSession) => void
  onDeleteSessionClick: (sessionId: string) => Promise<void>
  onDeleteAllSessionsClick: () => Promise<void>
  onSessionRevoked: (sessionId: UserSessionId) => void
  onBackClick: () => void
}

export type UserSessionListStore = ReturnType<typeof createUserSessionListStore>

type SetState = StoreApi<UserSessionListStoreState>['setState']
type GetState = StoreApi<UserSessionListStoreState>['getState']

export const createUserSessionListStore = (
  deps: UserSessionListStoreDependencies,
  initialState?: UserSessionListScreenState
) => {
  const fetchPage = async (set: SetState, get: GetState, pageNumber: number) => {
    const userIds = deps.userId ? [deps.userId] : undefined
    const result = await deps.managementGetSessionsUseCase.execute({
      pageNumber,
      pageSize: 20,
      userIds,
      sortOrder: 'DESC'
    })

    if (isSuccess(result)) {
      const current = get().screenState
      const currentPaging = current.status === 'content' ? current.paging : createInitialPaginationState<UserSession>()
      const nextPaging = appendResultToPaginationState(currentPaging, result.data)

      if (current.status === 'content') {
        set({
          screenState: {
            ...current,
            paging: nextPaging,
            actionLoading: false
          }
        })
      } else {
        set({
          screenState: {
            status: 'content',
            paging: nextPaging,
            actionLoading: false,
            actionError: null
          }
        })
      }
    } else {
      const current = get().screenState
      if (current.status === 'content') {
        set({
          screenState: {
            ...current,
            actionLoading: false,
            actionError: result.error
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
    }
  }

  return createStore<UserSessionListStoreState>()((set, get) => ({
    screenState: initialState ?? { status: 'loading' },

    initScreen: async () => {
      set({ screenState: { status: 'loading' } })
      await fetchPage(set, get, 1)
    },

    onLoadNextPage: async () => {
      const current = get().screenState
      if (current.status !== 'content' || !current.paging.canLoadMore) {
        return
      }

      const nextPaging = createNextPageLoadingPaginationState(current.paging)
      set({ screenState: { ...current, paging: nextPaging } })

      await fetchPage(set, get, nextPaging.nextPageNumber)
    },

    onRefresh: async () => {
      set({ screenState: { status: 'loading' } })
      await fetchPage(set, get, 1)
    },

    onSessionClick: (session: UserSession) => {
      deps.onNavigateToSessionDetail?.(session)
    },

    onDeleteSessionClick: async (sessionId: string) => {
      const current = get().screenState
      if (current.status !== 'content' || !deps.userId || current.actionLoading) {
        return
      }

      set({ screenState: { ...current, actionLoading: true, actionError: null } })

      const result = await deps.managementDeleteSessionUseCase.execute(deps.userId, sessionId)
      if (isSuccess(result)) {
        await fetchPage(set, get, 1)
      } else {
        const updated = get().screenState
        if (updated.status === 'content') {
          set({ screenState: { ...updated, actionLoading: false, actionError: result.error } })
        }
      }
    },

    onDeleteAllSessionsClick: async () => {
      const current = get().screenState
      if (current.status !== 'content' || !deps.userId || current.actionLoading) {
        return
      }

      set({ screenState: { ...current, actionLoading: true, actionError: null } })

      const result = await deps.managementDeleteAllUserSessionsUseCase.execute(deps.userId)
      if (isSuccess(result)) {
        await fetchPage(set, get, 1)
      } else {
        const updated = get().screenState
        if (updated.status === 'content') {
          set({ screenState: { ...updated, actionLoading: false, actionError: result.error } })
        }
      }
    },

    onSessionRevoked: (sessionId: UserSessionId) => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      const filteredItems = current.paging.items.filter((item) => item.id !== sessionId)
      set({
        screenState: {
          ...current,
          paging: {
            ...current.paging,
            items: filteredItems,
            totalItems: Math.max(0, current.paging.totalItems - 1)
          }
        }
      })
    },

    onBackClick: () => {
      deps.onBack()
    }
  }))
}

const UserSessionListContext = createContext<UserSessionListStore | null>(null)

export interface UserSessionListProviderProps {
  dependencies: UserSessionListStoreDependencies
  initialState?: UserSessionListScreenState
  children: React.ReactNode
}

export const UserSessionListProvider: React.FC<UserSessionListProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createUserSessionListStore(dependencies, initialState))

  return (
    <UserSessionListContext.Provider value={store}>
      {children}
    </UserSessionListContext.Provider>
  )
}

export const useUserSessionListStore = <T,>(
  selector: (state: UserSessionListStoreState) => T
): T => {
  const store = useContext(UserSessionListContext)
  if (!store) {
    throw new Error('useUserSessionListStore must be used within UserSessionListProvider')
  }
  return useStore(store, selector)
}
