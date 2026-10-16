import React, { createContext, useContext, useState, useEffect } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import { managementUserIdentifierListParamsSchema } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserIdentifierListParams, UserIdentifierSummary, UserIdentifierId, UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, PaginationState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  appendResultToPaginationState,
  canLoadMorePages,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
  getNextPageNumber,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementGetIdentifiersUseCase } from '@/usecase/identifier/management-get-identifiers-use-case'

export type UserIdentifierListScreenState =
  | {
      status: 'loading'
    }
  | {
      status: 'error'
      error: AppError
    }
  | {
      status: 'content'
      paging: PaginationState<UserIdentifierSummary>
      actionLoading: boolean
      actionError: AppError | null
    }

export interface UserIdentifierListStoreDependencies {
  userId: UserId
  managementGetIdentifiersUseCase: ManagementGetIdentifiersUseCase
  onIdentifierSelect?: (identifierId: string) => void
  onBack: () => void
  searchParams?: ManagementUserIdentifierListParams
  onSearchParamsChanged?: (params: ManagementUserIdentifierListParams) => void
}

export interface UserIdentifierListStoreState {
  dependencies: UserIdentifierListStoreDependencies
  screenState: UserIdentifierListScreenState
  initScreen: (searchParams?: ManagementUserIdentifierListParams) => Promise<void>
  onSearchParamsUpdated: (searchParams?: ManagementUserIdentifierListParams) => Promise<void>
  onLoadNextPage: () => Promise<void>
  onRefresh: () => Promise<void>
  onIdentifierClick: (identifierId: string) => void
  onIdentifierDeleted: (identifierId: UserIdentifierId) => void
  onBackClick: () => void
}

export type UserIdentifierListStore = ReturnType<typeof createUserIdentifierListStore>

type SetState = StoreApi<UserIdentifierListStoreState>['setState']
type GetState = StoreApi<UserIdentifierListStoreState>['getState']

export const createUserIdentifierListStore = (
  deps: UserIdentifierListStoreDependencies,
  initialState?: UserIdentifierListScreenState
) => {
  let isFetching = false

  const fetchPage = async (
    set: SetState,
    get: GetState,
    pageNumber: number,
    overrideParams?: ManagementUserIdentifierListParams
  ) => {
    if (isFetching) {
      return
    }
    isFetching = true

    try {
      const activeDeps = get().dependencies
      const searchParams = overrideParams ?? activeDeps.searchParams
      const result = await activeDeps.managementGetIdentifiersUseCase.execute(
        managementUserIdentifierListParamsSchema.parse({
          userIds: [activeDeps.userId],
          ...searchParams,
          pageNumber
        })
      )

      if (isSuccess(result)) {
        const current = get().screenState
        const currentPaging = current.status === 'content' ? current.paging : createInitialPaginationState<UserIdentifierSummary>()
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

  return createStore<UserIdentifierListStoreState>()((set, get) => ({
    dependencies: deps,
    screenState: initialState ?? { status: 'loading' },

    initScreen: async (searchParams?: ManagementUserIdentifierListParams) => {
      const current = get().screenState
      if (isFetching || current.status === 'content') {
        return
      }
      set({ screenState: { status: 'loading' } })
      const startPage = searchParams?.pageNumber ?? 1
      await fetchPage(set, get, startPage, searchParams)
    },

    onSearchParamsUpdated: async (searchParams?: ManagementUserIdentifierListParams) => {
      set({
        screenState: {
          status: 'content',
          paging: createInitialPaginationState<UserIdentifierSummary>(),
          actionLoading: false,
          actionError: null
        }
      })
      const startPage = searchParams?.pageNumber ?? 1
      await fetchPage(set, get, startPage, searchParams)
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

    onIdentifierClick: (identifierId: string) => {
      deps.onIdentifierSelect?.(identifierId)
    },

    onIdentifierDeleted: (identifierId: UserIdentifierId) => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      const filteredItems = current.paging.items.filter((item) => item.id !== identifierId)
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

const UserIdentifierListContext = createContext<UserIdentifierListStore | null>(null)

export interface UserIdentifierListProviderProps {
  dependencies: UserIdentifierListStoreDependencies
  initialState?: UserIdentifierListScreenState
  children: React.ReactNode
}

export const UserIdentifierListProvider: React.FC<UserIdentifierListProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createUserIdentifierListStore(dependencies, initialState))

  useEffect(() => {
    store.setState((state) => ({ ...state, dependencies }))
  }, [store, dependencies])

  return (
    <UserIdentifierListContext.Provider value={store}>
      {children}
    </UserIdentifierListContext.Provider>
  )
}

export const useUserIdentifierListStore = <T,>(
  selector: (state: UserIdentifierListStoreState) => T
): T => {
  const store = useContext(UserIdentifierListContext)
  if (!store) {
    throw new Error('useUserIdentifierListStore must be used within UserIdentifierListProvider')
  }
  return useStore(store, selector)
}
