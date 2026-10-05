import React, { createContext, useContext, useEffect, useState } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import { UserAuthProvider, UserSortValues } from '@mudrichenkoevgeny/shared-foundation'
import type { UserIdentifier, UserIdentifierId } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, ListingFilterState, ListingSortState, PaginationState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  appendResultToPaginationState,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementDeleteIdentifierUseCase } from '@/usecase/identifier/management-delete-identifier-use-case'
import type { ManagementGetIdentifiersUseCase } from '@/usecase/identifier/management-get-identifiers-use-case'

export type GlobalIdentifierListScreenState =
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
      sortState: ListingSortState | null
      filterStates: Record<string, ListingFilterState>
      isFilterPanelExpanded: boolean
      actionLoading: boolean
      actionError: AppError | null
    }

export interface GlobalIdentifierListStoreDependencies {
  managementGetIdentifiersUseCase: ManagementGetIdentifiersUseCase
  managementDeleteIdentifierUseCase: ManagementDeleteIdentifierUseCase
  onNavigateToIdentifierDetail: (identifierId: string) => void
  onBack: () => void
}

export interface GlobalIdentifierListStoreState {
  screenState: GlobalIdentifierListScreenState
  initScreen: () => Promise<void>
  onLoadNextPage: () => Promise<void>
  onRefresh: () => Promise<void>
  onToggleFilterPanel: () => void
  onSortChanged: (sortState: ListingSortState | null) => void
  onFilterChanged: (filterId: string, filterState: ListingFilterState) => void
  onApplyFilters: () => void
  onIdentifierClick: (identifierId: string) => void
  onDeleteIdentifierClick: (identifierId: UserIdentifierId) => Promise<void>
  onBackClick: () => void
}

export type GlobalIdentifierListStore = ReturnType<typeof createGlobalIdentifierListStore>

type SetState = StoreApi<GlobalIdentifierListStoreState>['setState']
type GetState = StoreApi<GlobalIdentifierListStoreState>['getState']

export const createGlobalIdentifierListStore = (
  deps: GlobalIdentifierListStoreDependencies,
  initialState?: GlobalIdentifierListScreenState
) => {
  const fetchPage = async (
    set: SetState,
    get: GetState,
    pageNumber: number,
    sortState: ListingSortState | null,
    filterStates: Record<string, ListingFilterState>
  ) => {
    const sortOrder = sortState ? (sortState.isAscending ? 'asc' as const : 'desc' as const) : null
    const sortBy = sortState?.optionId
      ? (Object.values(UserSortValues.UserIdentifierSortBy).find((v) => v === sortState.optionId) ?? null)
      : null

    const providerFilter = filterStates['userAuthProvider']
    const userIdFilter = filterStates['userId']
    const identifierFilter = filterStates['identifier']

    const userAuthProviders = providerFilter?.type === 'choice'
      ? Array.from(providerFilter.selectedIds).filter((id): id is UserAuthProvider =>
          Object.values(UserAuthProvider).includes(id as UserAuthProvider)
        )
      : undefined
    const userIds = userIdFilter?.type === 'text' && userIdFilter.value.trim() ? [userIdFilter.value.trim()] : undefined
    const identifiers = identifierFilter?.type === 'text' && identifierFilter.value.trim() ? [identifierFilter.value.trim()] : undefined

    const result = await deps.managementGetIdentifiersUseCase.execute({
      pageNumber,
      pageSize: 20,
      sortBy: sortBy as any,
      sortOrder,
      userAuthProviders,
      userIds,
      identifiers
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
            sortState,
            filterStates,
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
  }

  return createStore<GlobalIdentifierListStoreState>()((set, get) => ({
    screenState: initialState ?? { status: 'loading' },

    initScreen: async () => {
      set({ screenState: { status: 'loading' } })
      await fetchPage(set, get, 1, null, {})
    },

    onLoadNextPage: async () => {
      const current = get().screenState
      if (current.status !== 'content' || current.paging.pageNumber >= current.paging.totalPages) {
        return
      }

      const nextPaging = createNextPageLoadingPaginationState(current.paging)
      set({ screenState: { ...current, paging: nextPaging } })

      await fetchPage(
        set,
        get,
        current.paging.pageNumber + 1,
        current.sortState,
        current.filterStates
      )
    },

    onRefresh: async () => {
      const current = get().screenState
      const sortState = current.status === 'content' ? current.sortState : null
      const filterStates = current.status === 'content' ? current.filterStates : {}
      set({ screenState: { status: 'loading' } })
      await fetchPage(set, get, 1, sortState, filterStates)
    },

    onToggleFilterPanel: () => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      set({
        screenState: {
          ...current,
          isFilterPanelExpanded: !current.isFilterPanelExpanded
        }
      })
    },

    onSortChanged: (sortState: ListingSortState | null) => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      set({
        screenState: {
          ...current,
          sortState
        }
      })
    },

    onFilterChanged: (filterId: string, filterState: ListingFilterState) => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      set({
        screenState: {
          ...current,
          filterStates: {
            ...current.filterStates,
            [filterId]: filterState
          }
        }
      })
    },

    onApplyFilters: async () => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      set({
        screenState: {
          ...current,
          paging: createInitialPaginationState<UserIdentifier>()
        }
      })

      await fetchPage(set, get, 1, current.sortState, current.filterStates)
    },

    onIdentifierClick: (identifierId: string) => {
      deps.onNavigateToIdentifierDetail(identifierId)
    },

    onDeleteIdentifierClick: async (userId: UserId, identifierId: UserIdentifierId) => {
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

      const result = await deps.managementDeleteIdentifierUseCase.execute(userId, String(identifierId))

      if (isSuccess(result)) {
        const updated = get().screenState
        if (updated.status === 'content') {
          set({
            screenState: {
              ...updated,
              paging: {
                ...updated.paging,
                items: updated.paging.items.filter((item) => item.id !== identifierId),
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

const GlobalIdentifierListContext = createContext<GlobalIdentifierListStore | null>(null)

export interface GlobalIdentifierListProviderProps {
  dependencies: GlobalIdentifierListStoreDependencies
  initialState?: GlobalIdentifierListScreenState
  children: React.ReactNode
}

export const GlobalIdentifierListProvider: React.FC<GlobalIdentifierListProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createGlobalIdentifierListStore(dependencies, initialState))

  return (
    <GlobalIdentifierListContext.Provider value={store}>
      {children}
    </GlobalIdentifierListContext.Provider>
  )
}

export const useGlobalIdentifierListStore = <T,>(
  selector: (state: GlobalIdentifierListStoreState) => T
): T => {
  const store = useContext(GlobalIdentifierListContext)
  if (!store) {
    throw new Error('useGlobalIdentifierListStore must be used within GlobalIdentifierListProvider')
  }
  return useStore(store, selector)
}
