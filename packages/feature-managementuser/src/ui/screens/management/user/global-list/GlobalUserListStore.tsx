import React, { createContext, useContext, useState, useEffect } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import { managementUserListParamsSchema } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserListParams, UserSummary, UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, PaginationState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  appendResultToPaginationState,
  canLoadMorePages,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
  getNextPageNumber,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { GetUsersUseCase } from '@/usecase/user/get-users-use-case'

export type GlobalUserListScreenState =
  | {
      status: 'loading'
    }
  | {
      status: 'error'
      error: AppError
    }
  | {
      status: 'content'
      paging: PaginationState<UserSummary>
      isFilterPanelExpanded: boolean
      actionLoading: boolean
      actionError: AppError | null
    }

export interface GlobalUserListStoreDependencies {
  getUsersUseCase: GetUsersUseCase
  onNavigateToUserDetail: (userId: UserId) => void
  onNavigateToCreateUser: () => void
  onBack: () => void
  searchParams?: ManagementUserListParams
  onSearchParamsChanged?: (params: ManagementUserListParams) => void
}

export interface GlobalUserListStoreState {
  dependencies: GlobalUserListStoreDependencies
  screenState: GlobalUserListScreenState
  initScreen: (searchParams?: ManagementUserListParams) => Promise<void>
  onSearchParamsUpdated: (searchParams?: ManagementUserListParams) => Promise<void>
  onLoadNextPage: () => Promise<void>
  onRefresh: () => Promise<void>
  onToggleFilterPanel: () => void
  onUserClick: (userId: UserId) => void
  onCreateUserClick: () => void
  onBackClick: () => void
}

export type GlobalUserListStore = ReturnType<typeof createGlobalUserListStore>

type SetState = StoreApi<GlobalUserListStoreState>['setState']
type GetState = StoreApi<GlobalUserListStoreState>['getState']

export const createGlobalUserListStore = (
  deps: GlobalUserListStoreDependencies,
  initialState?: GlobalUserListScreenState
) => {
  let isFetching = false

  const fetchPage = async (
    set: SetState,
    get: GetState,
    pageNumber: number,
    overrideParams?: ManagementUserListParams
  ) => {
    if (isFetching) {
      return
    }
    isFetching = true

    try {
      const activeDeps = get().dependencies
      const searchParams = overrideParams ?? activeDeps.searchParams
      const result = await activeDeps.getUsersUseCase.execute(
        managementUserListParamsSchema.parse({
          ...searchParams,
          pageNumber
        })
      )

      if (isSuccess(result)) {
        const current = get().screenState
        const currentPaging = current.status === 'content' ? current.paging : createInitialPaginationState<UserSummary>()
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

  return createStore<GlobalUserListStoreState>()((set, get) => ({
    dependencies: deps,
    screenState: initialState ?? { status: 'loading' },

    initScreen: async (searchParams?: ManagementUserListParams) => {
      const current = get().screenState
      if (isFetching || current.status === 'content') {
        return
      }
      set({ screenState: { status: 'loading' } })
      await fetchPage(set, get, 1, searchParams)
    },

    onSearchParamsUpdated: async (searchParams?: ManagementUserListParams) => {
      set({
        screenState: {
          status: 'content',
          paging: createInitialPaginationState<UserSummary>(),
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

    onUserClick: (userId: UserId) => {
      deps.onNavigateToUserDetail(userId)
    },

    onCreateUserClick: () => {
      deps.onNavigateToCreateUser()
    },

    onBackClick: () => {
      deps.onBack()
    }
  }))
}

const GlobalUserListContext = createContext<GlobalUserListStore | null>(null)

export interface GlobalUserListProviderProps {
  dependencies: GlobalUserListStoreDependencies
  initialState?: GlobalUserListScreenState
  children: React.ReactNode
}

export const GlobalUserListProvider: React.FC<GlobalUserListProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createGlobalUserListStore(dependencies, initialState))

  useEffect(() => {
    store.setState((state) => ({ ...state, dependencies }))
  }, [store, dependencies])

  return (
    <GlobalUserListContext.Provider value={store}>
      {children}
    </GlobalUserListContext.Provider>
  )
}

export const useGlobalUserListStore = <T,>(
  selector: (state: GlobalUserListStoreState) => T
): T => {
  const store = useContext(GlobalUserListContext)
  if (!store) {
    throw new Error('useGlobalUserListStore must be used within GlobalUserListProvider')
  }
  return useStore(store, selector)
}
