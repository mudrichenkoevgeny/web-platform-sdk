import React, { createContext, useContext, useEffect, useState } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import type { UserIdentifier, UserIdentifierId, UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, PaginationState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  appendResultToPaginationState,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
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
      paging: PaginationState<UserIdentifier>
      actionLoading: boolean
      actionError: AppError | null
    }

export interface UserIdentifierListStoreDependencies {
  userId: UserId
  managementGetIdentifiersUseCase: ManagementGetIdentifiersUseCase
  onIdentifierSelect?: (identifierId: string) => void
  onBack: () => void
}

export interface UserIdentifierListStoreState {
  screenState: UserIdentifierListScreenState
  initScreen: () => Promise<void>
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
  const fetchPage = async (set: SetState, get: GetState, pageNumber: number) => {
    const result = await deps.managementGetIdentifiersUseCase.execute({
      pageNumber,
      pageSize: 20,
      userIds: [deps.userId]
    })

    if (isSuccess(result)) {
      const current = get().screenState
      const currentPaging = current.status === 'content' ? current.paging : createInitialPaginationState<UserIdentifier>()
      const nextPaging = appendResultToPaginationState(currentPaging, result.data.items, result.data.pageNumber, result.data.totalPages, result.data.totalCount)

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
  }

  return createStore<UserIdentifierListStoreState>()((set, get) => ({
    screenState: initialState ?? { status: 'loading' },

    initScreen: async () => {
      set({ screenState: { status: 'loading' } })
      await fetchPage(set, get, 1)
    },

    onLoadNextPage: async () => {
      const current = get().screenState
      if (current.status !== 'content' || current.paging.pageNumber >= current.paging.totalPages) {
        return
      }

      const nextPaging = createNextPageLoadingPaginationState(current.paging)
      set({ screenState: { ...current, paging: nextPaging } })

      await fetchPage(set, get, current.paging.pageNumber + 1)
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
