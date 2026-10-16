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
import type { GlobalUserListSearchParams } from '@/ui/screens/management/user/global-list/globalUserListSearchSchema'

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
  searchParams?: ManagementUserListParams | GlobalUserListSearchParams
  onSearchParamsChanged?: (params: ManagementUserListParams | GlobalUserListSearchParams) => void
}

export interface GlobalUserListStoreState {
  dependencies: GlobalUserListStoreDependencies
  screenState: GlobalUserListScreenState
  initScreen: (searchParams?: ManagementUserListParams | GlobalUserListSearchParams) => Promise<void>
  onSearchParamsUpdated: (searchParams?: ManagementUserListParams | GlobalUserListSearchParams) => Promise<void>
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
    overrideParams?: ManagementUserListParams | GlobalUserListSearchParams
  ) => {
    if (isFetching) {
      return
    }
    isFetching = true

    try {
      const activeDeps = get().dependencies
      const rawParams = overrideParams ?? activeDeps.searchParams ?? {}

      const mappedParams: Partial<ManagementUserListParams> = { ...(rawParams as Partial<ManagementUserListParams>) }
      if ('sort_by' in rawParams && rawParams.sort_by) mappedParams.sortBy = rawParams.sort_by as ManagementUserListParams['sortBy']
      if ('sort_order' in rawParams && rawParams.sort_order) mappedParams.sortOrder = rawParams.sort_order as ManagementUserListParams['sortOrder']
      if ('user_roles' in rawParams && rawParams.user_roles) mappedParams.userRoles = rawParams.user_roles as ManagementUserListParams['userRoles']
      if ('account_statuses' in rawParams && rawParams.account_statuses) mappedParams.accountStatuses = rawParams.account_statuses as ManagementUserListParams['accountStatuses']
      if ('account_lockout_types' in rawParams && rawParams.account_lockout_types) mappedParams.accountLockoutTypes = rawParams.account_lockout_types as ManagementUserListParams['accountLockoutTypes']
      if ('authority_level_from' in rawParams) mappedParams.authorityLevelFrom = rawParams.authority_level_from
      if ('authority_level_to' in rawParams) mappedParams.authorityLevelTo = rawParams.authority_level_to
      if ('is_totp_enabled' in rawParams) mappedParams.isTotpEnabled = rawParams.is_totp_enabled
      if ('page_number' in rawParams) mappedParams.pageNumber = rawParams.page_number
      if ('page_size' in rawParams) mappedParams.pageSize = rawParams.page_size

      const effectivePageNumber = pageNumber !== 1 ? pageNumber : (mappedParams.pageNumber ?? pageNumber)

      const result = await activeDeps.getUsersUseCase.execute(
        managementUserListParamsSchema.parse({
          ...mappedParams,
          pageNumber: effectivePageNumber
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
      const startPage = searchParams?.pageNumber ?? 1
      await fetchPage(set, get, startPage, searchParams)
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
