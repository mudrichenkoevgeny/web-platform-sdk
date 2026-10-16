import React, { createContext, useContext, useState, useEffect } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import { managementGlobalSessionListParamsSchema } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalSessionListParams, UserSessionSummary, UserSessionId, UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, PaginationState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  appendResultToPaginationState,
  canLoadMorePages,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
  getNextPageNumber,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementDeleteSessionUseCase } from '@/usecase/session/management-delete-session-use-case'
import type { ManagementGetSessionsUseCase } from '@/usecase/session/management-get-sessions-use-case'

export type GlobalSessionListScreenState =
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
      isFilterPanelExpanded: boolean
      actionLoading: boolean
      actionError: AppError | null
    }

export interface GlobalSessionListStoreDependencies {
  managementGetSessionsUseCase: ManagementGetSessionsUseCase
  managementDeleteSessionUseCase: ManagementDeleteSessionUseCase
  onNavigateToSessionDetail: (session: UserSessionSummary) => void
  onNavigateToUserDetail: (userId: UserId) => void
  onBack: () => void
  searchParams?: ManagementGlobalSessionListParams
  onSearchParamsChanged?: (params: ManagementGlobalSessionListParams) => void
}

export interface GlobalSessionListStoreState {
  dependencies: GlobalSessionListStoreDependencies
  screenState: GlobalSessionListScreenState
  initScreen: (searchParams?: ManagementGlobalSessionListParams) => Promise<void>
  onSearchParamsUpdated: (searchParams?: ManagementGlobalSessionListParams) => Promise<void>
  onLoadNextPage: () => Promise<void>
  onRefresh: () => Promise<void>
  onToggleFilterPanel: () => void
  onSessionClick: (session: UserSessionSummary) => void
  onUserClick: (userId: UserId) => void
  onDeleteSessionClick: (userId: UserId, sessionId: UserSessionId) => Promise<void>
  onBackClick: () => void
}

export type GlobalSessionListStore = ReturnType<typeof createGlobalSessionListStore>

type SetState = StoreApi<GlobalSessionListStoreState>['setState']
type GetState = StoreApi<GlobalSessionListStoreState>['getState']

export const createGlobalSessionListStore = (
  deps: GlobalSessionListStoreDependencies,
  initialState?: GlobalSessionListScreenState
) => {
  let isFetching = false

  const fetchPage = async (
    set: SetState,
    get: GetState,
    pageNumber: number,
    overrideParams?: ManagementGlobalSessionListParams
  ) => {
    if (isFetching) {
      return
    }
    isFetching = true

    try {
      const activeDeps = get().dependencies
      const searchParams = overrideParams ?? activeDeps.searchParams
      const result = await activeDeps.managementGetSessionsUseCase.execute(
        managementGlobalSessionListParamsSchema.parse({
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
              paging: nextPaging
            }
          })
        } else {
          set({
            screenState: {
              status: 'content',
              paging: nextPaging,
              isFilterPanelExpanded: false,
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

  return createStore<GlobalSessionListStoreState>()((set, get) => ({
    dependencies: deps,
    screenState: initialState ?? { status: 'loading' },

    initScreen: async (searchParams?: ManagementGlobalSessionListParams) => {
      const current = get().screenState
      if (isFetching || current.status === 'content') {
        return
      }
      set({ screenState: { status: 'loading' } })
      await fetchPage(set, get, 1, searchParams)
    },

    onSearchParamsUpdated: async (searchParams?: ManagementGlobalSessionListParams) => {
      set({
        screenState: {
          status: 'content',
          paging: createInitialPaginationState<UserSessionSummary>(),
          isFilterPanelExpanded: false,
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

    onToggleFilterPanel: () => {
      const current = get().screenState
      if (current.status === 'content') {
        set({
          screenState: {
            ...current,
            isFilterPanelExpanded: !current.isFilterPanelExpanded
          }
        })
      }
    },

    onSessionClick: (session: UserSessionSummary) => {
      deps.onNavigateToSessionDetail(session)
    },

    onUserClick: (userId: UserId) => {
      deps.onNavigateToUserDetail(userId)
    },

    onDeleteSessionClick: async (userId: UserId, sessionId: UserSessionId) => {
      const current = get().screenState
      if (current.status !== 'content' || current.actionLoading) {
        return
      }

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      const result = await deps.managementDeleteSessionUseCase.execute(userId, sessionId)

      if (isSuccess(result)) {
        const updated = get().screenState
        if (updated.status === 'content') {
          set({
            screenState: {
              ...updated,
              paging: {
                ...updated.paging,
                items: updated.paging.items.filter((item) => item.id !== sessionId),
                totalCount: Math.max(0, updated.paging.totalCount - 1)
              },
              actionLoading: false
            }
          })
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
      deps.onBack()
    }
  }))
}

const GlobalSessionListContext = createContext<GlobalSessionListStore | null>(null)

export interface GlobalSessionListProviderProps {
  dependencies: GlobalSessionListStoreDependencies
  initialState?: GlobalSessionListScreenState
  children: React.ReactNode
}

export const GlobalSessionListProvider: React.FC<GlobalSessionListProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createGlobalSessionListStore(dependencies, initialState))

  useEffect(() => {
    store.setState((state) => ({ ...state, dependencies }))
  }, [store, dependencies])

  return (
    <GlobalSessionListContext.Provider value={store}>
      {children}
    </GlobalSessionListContext.Provider>
  )
}

export const useGlobalSessionListStore = <T,>(
  selector: (state: GlobalSessionListStoreState) => T
): T => {
  const store = useContext(GlobalSessionListContext)
  if (!store) {
    throw new Error('useGlobalSessionListStore must be used within GlobalSessionListProvider')
  }
  return useStore(store, selector)
}
