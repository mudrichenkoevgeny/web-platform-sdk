import React, { createContext, useContext, useState, useEffect } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import { managementGlobalIdentifierListParamsSchema } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalIdentifierListParams, UserIdentifierSummary, UserIdentifierId, UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, PaginationState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  appendResultToPaginationState,
  canLoadMorePages,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
  getNextPageNumber,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementDeleteIdentifierUseCase } from '@/usecase/identifier/management-delete-identifier-use-case'
import type { ManagementGetIdentifiersUseCase } from '@/usecase/identifier/management-get-identifiers-use-case'

import type { GlobalIdentifierListSearchParams } from '@/ui/screens/management/identifier/global-list/globalIdentifierListSearchSchema'

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
      paging: PaginationState<UserIdentifierSummary>
      isFilterPanelExpanded: boolean
      actionLoading: boolean
      actionError: AppError | null
    }

export interface GlobalIdentifierListStoreDependencies {
  managementGetIdentifiersUseCase: ManagementGetIdentifiersUseCase
  managementDeleteIdentifierUseCase: ManagementDeleteIdentifierUseCase
  onNavigateToIdentifierDetail: (identifierId: UserIdentifierId) => void
  onBack: () => void
  searchParams?: ManagementGlobalIdentifierListParams | GlobalIdentifierListSearchParams
  onSearchParamsChanged?: (params: ManagementGlobalIdentifierListParams | GlobalIdentifierListSearchParams) => void
}

export interface GlobalIdentifierListStoreState {
  dependencies: GlobalIdentifierListStoreDependencies
  screenState: GlobalIdentifierListScreenState
  initScreen: (searchParams?: ManagementGlobalIdentifierListParams | GlobalIdentifierListSearchParams) => Promise<void>
  onSearchParamsUpdated: (searchParams?: ManagementGlobalIdentifierListParams | GlobalIdentifierListSearchParams) => Promise<void>
  onLoadNextPage: () => Promise<void>
  onRefresh: () => Promise<void>
  onToggleFilterPanel: () => void
  onIdentifierClick: (identifierId: UserIdentifierId) => void
  onDeleteIdentifierClick: (userId: UserId, identifierId: UserIdentifierId) => Promise<void>
  onBackClick: () => void
}

export type GlobalIdentifierListStore = ReturnType<typeof createGlobalIdentifierListStore>

type SetState = StoreApi<GlobalIdentifierListStoreState>['setState']
type GetState = StoreApi<GlobalIdentifierListStoreState>['getState']

export const createGlobalIdentifierListStore = (
  deps: GlobalIdentifierListStoreDependencies,
  initialState?: GlobalIdentifierListScreenState
) => {
  let isFetching = false

  const fetchPage = async (
    set: SetState,
    get: GetState,
    pageNumber: number,
    overrideParams?: ManagementGlobalIdentifierListParams | GlobalIdentifierListSearchParams
  ) => {
    if (isFetching) {
      return
    }
    isFetching = true

    try {
      const activeDeps = get().dependencies
      const rawParams = overrideParams ?? activeDeps.searchParams ?? {}

      const mappedParams: Partial<ManagementGlobalIdentifierListParams> = { ...(rawParams as Partial<ManagementGlobalIdentifierListParams>) }
      if ('sort_by' in rawParams && rawParams.sort_by) mappedParams.sortBy = rawParams.sort_by as ManagementGlobalIdentifierListParams['sortBy']
      if ('sort_order' in rawParams && rawParams.sort_order) mappedParams.sortOrder = rawParams.sort_order as ManagementGlobalIdentifierListParams['sortOrder']
      if ('user_auth_providers' in rawParams && rawParams.user_auth_providers) mappedParams.userAuthProviders = rawParams.user_auth_providers as ManagementGlobalIdentifierListParams['userAuthProviders']
      if ('user_ids' in rawParams) mappedParams.userIds = rawParams.user_ids
      if ('identifiers' in rawParams) mappedParams.identifiers = rawParams.identifiers
      if ('page_number' in rawParams) mappedParams.pageNumber = rawParams.page_number
      if ('page_size' in rawParams) mappedParams.pageSize = rawParams.page_size

      const effectivePageNumber = pageNumber !== 1 ? pageNumber : (mappedParams.pageNumber ?? pageNumber)

      const result = await activeDeps.managementGetIdentifiersUseCase.execute(
        managementGlobalIdentifierListParamsSchema.parse({
          ...mappedParams,
          pageNumber: effectivePageNumber
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

  return createStore<GlobalIdentifierListStoreState>()((set, get) => ({
    dependencies: deps,
    screenState: initialState ?? { status: 'loading' },

    initScreen: async (searchParams?: ManagementGlobalIdentifierListParams) => {
      const current = get().screenState
      if (isFetching || current.status === 'content') {
        return
      }
      set({ screenState: { status: 'loading' } })
      const startPage = searchParams?.pageNumber ?? 1
      await fetchPage(set, get, startPage, searchParams)
    },

    onSearchParamsUpdated: async (searchParams?: ManagementGlobalIdentifierListParams) => {
      set({
        screenState: {
          status: 'content',
          paging: createInitialPaginationState<UserIdentifierSummary>(),
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

    onIdentifierClick: (identifierId: UserIdentifierId) => {
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

      const result = await deps.managementDeleteIdentifierUseCase.execute(userId, identifierId)

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

  useEffect(() => {
    store.setState((state) => ({ ...state, dependencies }))
  }, [store, dependencies])

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
