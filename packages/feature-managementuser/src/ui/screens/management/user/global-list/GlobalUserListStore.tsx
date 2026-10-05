import React, { createContext, useContext, useState } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import { AccountLockoutType, UserAccountStatus, UserFilterValues, UserRole, UserSortValues } from '@mudrichenkoevgeny/shared-foundation'
import type { UserDetails, UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, ListingFilterState, ListingSortState, PaginationState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  appendResultToPaginationState,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
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
    const sortOrder = sortState ? (sortState.isAscending ? 'asc' as const : 'desc' as const) : null
    const sortBy = sortState?.optionId
      ? (Object.values(UserSortValues.UserSortBy).find((v) => v === sortState.optionId) as UserSortValues.UserSortBy | undefined ?? null)
      : null

    const roleFilter = filterStates[UserFilterValues.UserFilterValues.ROLE]
    const statusFilter = filterStates[UserFilterValues.UserFilterValues.ACCOUNT_STATUS]
    const lockoutFilter = filterStates[UserFilterValues.UserFilterValues.ACCOUNT_LOCKOUT_TYPE]
    const totpFilter = filterStates[UserFilterValues.UserFilterValues.IS_TOTP_ENABLED]
    const fromFilter = filterStates[UserFilterValues.UserFilterValues.AUTHORITY_LEVEL_FROM]
    const toFilter = filterStates[UserFilterValues.UserFilterValues.AUTHORITY_LEVEL_TO]

    const roles = roleFilter?.type === 'choice'
      ? Array.from(roleFilter.selectedIds).filter((id): id is UserRole =>
          Object.values(UserRole).includes(id as UserRole)
        )
      : undefined
    const accountStatuses = statusFilter?.type === 'choice'
      ? Array.from(statusFilter.selectedIds).filter((id): id is UserAccountStatus =>
          Object.values(UserAccountStatus).includes(id as UserAccountStatus)
        )
      : undefined
    const accountLockoutTypes = lockoutFilter?.type === 'choice'
      ? Array.from(lockoutFilter.selectedIds).filter((id): id is AccountLockoutType =>
          Object.values(AccountLockoutType).includes(id as AccountLockoutType)
        )
      : undefined
    const isTotpEnabled = totpFilter?.type === 'boolean' ? totpFilter.value : undefined
    const authorityLevelFrom = fromFilter?.type === 'number' ? fromFilter.value : (fromFilter?.type === 'text' && fromFilter.value ? parseInt(fromFilter.value, 10) : undefined)
    const authorityLevelTo = toFilter?.type === 'number' ? toFilter.value : (toFilter?.type === 'text' && toFilter.value ? parseInt(toFilter.value, 10) : undefined)

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
      const nextPaging = appendResultToPaginationState(currentPaging, result.data.items, result.data.pageNumber, result.data.totalPages, result.data.totalCount)

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
