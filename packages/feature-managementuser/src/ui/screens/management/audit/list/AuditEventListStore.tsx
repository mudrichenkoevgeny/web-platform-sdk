import React, { createContext, useContext, useState, useEffect } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import { managementAuditEventListParamsSchema } from '@mudrichenkoevgeny/shared-foundation'
import type { AuditEventId, AuditEventSummary, ManagementAuditEventListParams } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, PaginationState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  appendResultToPaginationState,
  canLoadMorePages,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
  getNextPageNumber,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { GetAuditEventsUseCase } from '@/usecase/audit/get-audit-events-use-case'
import type { AuditEventListSearchParams } from './auditEventListSearchSchema'

export type AuditEventListScreenState =
  | {
      status: 'loading'
    }
  | {
      status: 'error'
      error: AppError
    }
  | {
      status: 'content'
      paging: PaginationState<AuditEventSummary>
      isFilterPanelExpanded: boolean
      actionLoading: boolean
      actionError: AppError | null
    }

export interface AuditEventListStoreDependencies {
  getAuditEventsUseCase: GetAuditEventsUseCase
  onNavigateToEventDetail: (eventId: AuditEventId) => void
  onBack: () => void
  searchParams?: ManagementAuditEventListParams | AuditEventListSearchParams
  onSearchParamsChanged?: (params: ManagementAuditEventListParams) => void
}

export interface AuditEventListStoreState {
  dependencies: AuditEventListStoreDependencies
  screenState: AuditEventListScreenState
  initScreen: (searchParams?: ManagementAuditEventListParams | AuditEventListSearchParams) => Promise<void>
  onSearchParamsUpdated: (searchParams?: ManagementAuditEventListParams | AuditEventListSearchParams) => Promise<void>
  onLoadNextPage: () => Promise<void>
  onRefresh: () => Promise<void>
  onEventClick: (eventId: AuditEventId) => void
  onBackClick: () => void
  onToggleFilterPanel: () => void
}

export type AuditEventListStore = ReturnType<typeof createAuditEventListStore>

type SetState = StoreApi<AuditEventListStoreState>['setState']
type GetState = StoreApi<AuditEventListStoreState>['getState']

export const createAuditEventListStore = (
  deps: AuditEventListStoreDependencies,
  initialState?: AuditEventListScreenState
) => {
  let isFetching = false

  const fetchPage = async (
    set: SetState,
    get: GetState,
    pageNumber: number,
    overrideParams?: ManagementAuditEventListParams | AuditEventListSearchParams
  ) => {
    if (isFetching) {
      return
    }
    isFetching = true

    try {
      const activeDeps = get().dependencies
      const searchParams = overrideParams ?? activeDeps.searchParams
      const result = await activeDeps.getAuditEventsUseCase.execute(
        managementAuditEventListParamsSchema.parse({
          ...searchParams,
          pageNumber
        })
      )

      if (isSuccess(result)) {
        const current = get().screenState
        const currentPaging = current.status === 'content' ? current.paging : createInitialPaginationState<AuditEventSummary>()
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

  return createStore<AuditEventListStoreState>()((set, get) => ({
    dependencies: deps,
    screenState: initialState ?? { status: 'loading' },

    initScreen: async (searchParams?: ManagementAuditEventListParams | AuditEventListSearchParams) => {
      const current = get().screenState
      if (isFetching || current.status === 'content') {
        return
      }
      set({ screenState: { status: 'loading' } })
      await fetchPage(set, get, 1, searchParams)
    },

    onSearchParamsUpdated: async (searchParams?: ManagementAuditEventListParams | AuditEventListSearchParams) => {
      set({
        screenState: {
          status: 'content',
          paging: createInitialPaginationState<AuditEventSummary>(),
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

    onEventClick: (eventId: AuditEventId) => {
      get().dependencies.onNavigateToEventDetail(eventId)
    },

    onBackClick: () => {
      get().dependencies.onBack()
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
    }
  }))
}

const AuditEventListContext = createContext<AuditEventListStore | null>(null)

export interface AuditEventListProviderProps {
  dependencies: AuditEventListStoreDependencies
  initialState?: AuditEventListScreenState
  children: React.ReactNode
}

export const AuditEventListProvider: React.FC<AuditEventListProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createAuditEventListStore(dependencies, initialState))

  useEffect(() => {
    store.setState((state) => ({ ...state, dependencies }))
  }, [store, dependencies])

  return (
    <AuditEventListContext.Provider value={store}>
      {children}
    </AuditEventListContext.Provider>
  )
}

export const useAuditEventListStore = <T,>(
  selector: (state: AuditEventListStoreState) => T
): T => {
  const store = useContext(AuditEventListContext)
  if (!store) {
    throw new Error('useAuditEventListStore must be used within AuditEventListProvider')
  }
  return useStore(store, selector)
}

