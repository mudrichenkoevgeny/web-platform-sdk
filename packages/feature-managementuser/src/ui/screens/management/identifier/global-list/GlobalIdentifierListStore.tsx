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
import type { ManagementGetIdentifiersUseCase } from '@/usecase/identifier/ManagementGetIdentifiersUseCase'

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
  onIdentifierSelect?: (identifierId: string) => void
  onBack: () => void
}

export interface GlobalIdentifierListStoreState {
  screenState: GlobalIdentifierListScreenState
  initScreen: () => Promise<void>
  onLoadNextPage: () => Promise<void>
  onRefresh: () => Promise<void>
  onIdentifierClick: (identifierId: string) => void
  onIdentifierDeleted: (identifierId: UserIdentifierId) => void
  onBackClick: () => void
  onToggleFilterPanel: () => void
  onSortChanged: (sortState: ListingSortState) => Promise<void>
  onFilterChanged: (filterId: string, filterState: ListingFilterState | null) => void
  onApplyFilters: () => Promise<void>
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
    const sortOrder = sortState?.isAscending ? 'ASC' : 'DESC'
    const sortBy = sortState?.optionId
      ? (Object.values(UserSortValues.UserIdentifierSortBy).find((v) => v === sortState.optionId) ?? null)
      : null

    const providerFilter = filterStates['userAuthProvider'] as { selectedIds?: string[] } | undefined
    const userIdFilter = filterStates['userId'] as { value?: string } | undefined
    const identifierFilter = filterStates['identifier'] as { value?: string } | undefined

    const userAuthProviders = providerFilter?.selectedIds?.filter((id): id is UserAuthProvider =>
      Object.values(UserAuthProvider).includes(id as UserAuthProvider)
    )

    const result = await deps.managementGetIdentifiersUseCase.execute({
      pageNumber,
      pageSize: 20,
      sortBy,
      sortOrder,
      userAuthProviders,
      userIds: userIdFilter?.value?.trim() ? [userIdFilter.value.trim()] : undefined,
      identifiers: identifierFilter?.value?.trim() ? [identifierFilter.value.trim()] : undefined
    })

    if (isSuccess(result)) {
      const current = get().screenState
      const currentPaging = current.status === 'content' ? current.paging : createInitialPaginationState<UserIdentifier>()
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
      if (current.status !== 'content' || !current.paging.canLoadMore) {
        return
      }

      const nextPaging = createNextPageLoadingPaginationState(current.paging)
      set({ screenState: { ...current, paging: nextPaging } })

      await fetchPage(
        set,
        get,
        nextPaging.nextPageNumber,
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

    onSortChanged: async (sortState: ListingSortState) => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      set({
        screenState: {
          ...current,
          sortState,
          paging: createInitialPaginationState<UserIdentifier>()
        }
      })

      await fetchPage(set, get, 1, sortState, current.filterStates)
    },

    onFilterChanged: (filterId: string, filterState: ListingFilterState | null) => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      const nextFilters = { ...current.filterStates }
      if (filterState === null) {
        delete nextFilters[filterId]
      } else {
        nextFilters[filterId] = filterState
      }

      set({
        screenState: {
          ...current,
          filterStates: nextFilters
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
          isFilterPanelExpanded: false,
          paging: createInitialPaginationState<UserIdentifier>()
        }
      })

      await fetchPage(set, get, 1, current.sortState, current.filterStates)
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
