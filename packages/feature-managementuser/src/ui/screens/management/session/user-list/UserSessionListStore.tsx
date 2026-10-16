import React, { createContext, useContext, useState, useEffect } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import { managementUserSessionListParamsSchema } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserSessionListParams, UserSessionSummary, UserSessionId, UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, PaginationState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  appendResultToPaginationState,
  canLoadMorePages,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
  getNextPageNumber,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementDeleteAllUserSessionsUseCase } from '@/usecase/session/management-delete-all-user-sessions-use-case'
import type { ManagementDeleteSessionUseCase } from '@/usecase/session/management-delete-session-use-case'
import type { ManagementGetSessionsUseCase } from '@/usecase/session/management-get-sessions-use-case'

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
      paging: PaginationState<UserSessionSummary>
      actionLoading: boolean
      actionError: AppError | null
    }

export interface UserSessionListStoreDependencies {
  userId?: UserId | null
  managementGetSessionsUseCase: ManagementGetSessionsUseCase
  managementDeleteSessionUseCase: ManagementDeleteSessionUseCase
  managementDeleteAllUserSessionsUseCase: ManagementDeleteAllUserSessionsUseCase
  onNavigateToSessionDetail?: (session: UserSessionSummary) => void
  onBack: () => void
  searchParams?: ManagementUserSessionListParams
  onSearchParamsChanged?: (params: ManagementUserSessionListParams) => void
}

export interface UserSessionListStoreState {
  dependencies: UserSessionListStoreDependencies
  screenState: UserSessionListScreenState
  initScreen: (searchParams?: ManagementUserSessionListParams) => Promise<void>
  onSearchParamsUpdated: (searchParams?: ManagementUserSessionListParams) => Promise<void>
  onLoadNextPage: () => Promise<void>
  onRefresh: () => Promise<void>
  onSessionClick: (session: UserSessionSummary) => void
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
  let isFetching = false

  const fetchPage = async (
    set: SetState,
    get: GetState,
    pageNumber: number,
    overrideParams?: ManagementUserSessionListParams
  ) => {
    if (isFetching) {
      return
    }
    isFetching = true

    try {
      const activeDeps = get().dependencies
      const searchParams = overrideParams ?? activeDeps.searchParams
      const userIds = activeDeps.userId ? [activeDeps.userId] : []
      const result = await activeDeps.managementGetSessionsUseCase.execute(
        managementUserSessionListParamsSchema.parse({
          userIds,
          ...searchParams,
          pageNumber
        })
      )

      if (isSuccess(result)) {
        const current = get().screenState
        const currentPaging = current.status === 'content' ? current.paging : createInitialPaginationState<UserSessionSummary>()
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
    } finally {
      isFetching = false
    }
  }

  return createStore<UserSessionListStoreState>()((set, get) => ({
    dependencies: deps,
    screenState: initialState ?? { status: 'loading' },

    initScreen: async (searchParams?: ManagementUserSessionListParams) => {
      const current = get().screenState
      if (isFetching || current.status === 'content') {
        return
      }
      set({ screenState: { status: 'loading' } })
      await fetchPage(set, get, 1, searchParams)
    },

    onSearchParamsUpdated: async (searchParams?: ManagementUserSessionListParams) => {
      set({
        screenState: {
          status: 'content',
          paging: createInitialPaginationState<UserSessionSummary>(),
          actionLoading: false,
          actionError: null
        }
      })
      await fetchPage(set, get, 1, searchParams)
    },

    onLoadNextPage: async () => {
      const current = get().screenState
      if (current.status !== 'content' || !canLoadMorePages(current.paging)) {
        return
      }

      const nextPaging = createNextPageLoadingPaginationState(current.paging)
      set({ screenState: { ...current, paging: nextPaging } })

      await fetchPage(set, get, getNextPageNumber(current.paging))
    },

    onRefresh: async () => {
      set({ screenState: { status: 'loading' } })
      await fetchPage(set, get, 1)
    },

    onSessionClick: (session: UserSessionSummary) => {
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
            totalCount: Math.max(0, current.paging.totalCount - 1)
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

  useEffect(() => {
    store.setState((state) => ({ ...state, dependencies }))
  }, [store, dependencies])

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
