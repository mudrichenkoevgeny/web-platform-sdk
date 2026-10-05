import React, { createContext, useContext, useEffect, useState } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import { AccountLockoutType, UserAccountStatus, UserRole, UserSortValues } from '@mudrichenkoevgeny/shared-foundation'
import type { UserDetails, UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, ListingFilterState, ListingSortState, PaginationState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  appendResultToPaginationState,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
  isSuccess,
  parseIntegerOrDefault
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { GetUsersUseCase } from '@/usecase/user/GetUsersUseCase'

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
      paging: PaginationState<UserDetails>
      sortState: ListingSortState | null
      filterStates: Record<string, ListingFilterState>
      isFilterPanelExpanded: boolean
      actionLoading: boolean
      actionError: AppError | null
    }

export interface GlobalUserListStoreDependencies {
  getUsersUseCase: GetUsersUseCase
  onNavigateToUserDetail: (userId: UserId) => void
  onNavigateToCreateUser: () => void
  onBack: () => void
}

export interface GlobalUserListStoreState {
  screenState: GlobalUserListScreenState
  initScreen: () => Promise<void>
  onLoadNextPage: () => Promise<void>
  onRefresh: () => Promise<void>
  onUserClick: (userId: UserId) => void
  onCreateUserClick: () => void
  onBackClick: () => void
  onToggleFilterPanel: () => void
  onSortChanged: (sortState: ListingSortState) => Promise<void>
  onFilterChanged: (filterId: string, filterState: ListingFilterState | null) => void
  onApplyFilters: () => Promise<void>
}

export type GlobalUserListStore = ReturnType<typeof createGlobalUserListStore>

type SetState = StoreApi<GlobalUserListStoreState>['setState']
type GetState = StoreApi<GlobalUserListStoreState>['getState']

export const createGlobalUserListStore = (
  deps: GlobalUserListStoreDependencies,
  initialState?: GlobalUserListScreenState
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
      ? (Object.values(UserSortValues.UserSortBy).find((v) => v === sortState.optionId) ?? null)
      : null

    const roleFilter = filterStates['role'] as { selectedIds?: string[] } | undefined
    const statusFilter = filterStates['accountStatus'] as { selectedIds?: string[] } | undefined
    const lockoutFilter = filterStates['accountLockoutType'] as { selectedIds?: string[] } | undefined
    const totpFilter = filterStates['isTotpEnabled'] as { value?: boolean } | undefined
    const fromFilter = filterStates['authorityLevelFrom'] as { value?: number | string } | undefined
    const toFilter = filterStates['authorityLevelTo'] as { value?: number | string } | undefined

    const roles = roleFilter?.selectedIds?.filter((id): id is UserRole =>
      Object.values(UserRole).includes(id as UserRole)
    )
    const accountStatuses = statusFilter?.selectedIds?.filter((id): id is UserAccountStatus =>
      Object.values(UserAccountStatus).includes(id as UserAccountStatus)
    )
    const accountLockoutTypes = lockoutFilter?.selectedIds?.filter((id): id is AccountLockoutType =>
      Object.values(AccountLockoutType).includes(id as AccountLockoutType)
    )
    const isTotpEnabled = totpFilter?.value
    const authorityLevelFrom = fromFilter?.value !== undefined ? parseIntegerOrDefault(String(fromFilter.value), 0) : undefined
    const authorityLevelTo = toFilter?.value !== undefined ? parseIntegerOrDefault(String(toFilter.value), 100) : undefined

    const result = await deps.getUsersUseCase.execute({
      pageNumber,
      pageSize: 20,
      sortBy,
      sortOrder,
      roles,
      accountStatuses,
      accountLockoutTypes,
      isTotpEnabled,
      authorityLevelFrom,
      authorityLevelTo
    })

    if (isSuccess(result)) {
      const current = get().screenState
      const currentPaging = current.status === 'content' ? current.paging : createInitialPaginationState<UserDetails>()
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

  return createStore<GlobalUserListStoreState>()((set, get) => ({
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

    onUserClick: (userId: UserId) => {
      deps.onNavigateToUserDetail(userId)
    },

    onCreateUserClick: () => {
      deps.onNavigateToCreateUser()
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
          paging: createInitialPaginationState<UserDetails>()
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
          paging: createInitialPaginationState<UserDetails>()
        }
      })

      await fetchPage(set, get, 1, current.sortState, current.filterStates)
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
