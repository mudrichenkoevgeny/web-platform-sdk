import React, { createContext, useContext, useState, useEffect } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import { AuditActorType, AuditEventSortBy, AuditStatus, SortOrder, UserRole } from '@mudrichenkoevgeny/shared-foundation'
import type { AuditEventId, AuditEventSummary } from '@mudrichenkoevgeny/shared-foundation'
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
  searchParams?: AuditEventListSearchParams
  onSearchParamsChanged?: (params: AuditEventListSearchParams) => void
}

export interface AuditEventListStoreState {
  dependencies: AuditEventListStoreDependencies
  screenState: AuditEventListScreenState
  initScreen: (searchParams?: AuditEventListSearchParams) => Promise<void>
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
    overrideParams?: AuditEventListSearchParams
  ) => {
    if (isFetching) {
      return
    }
    isFetching = true

    try {
      const activeDeps = get().dependencies
      const params = overrideParams ?? activeDeps.searchParams

      const sortOrder = params?.sortOrder === 'ASC' ? SortOrder.ASC : params?.sortOrder === 'DESC' ? SortOrder.DESC : null
      const sortBy = params?.sortBy ? (params.sortBy as AuditEventSortBy) : null

      const actorTypes = params?.actorTypes?.filter((id): id is AuditActorType =>
        Object.values(AuditActorType).includes(id as AuditActorType)
      )
      const actorUserRoles = params?.actorUserRoles?.filter((id): id is UserRole =>
        Object.values(UserRole).includes(id as UserRole)
      )
      const statuses = params?.statuses?.filter((id): id is AuditStatus =>
        Object.values(AuditStatus).includes(id as AuditStatus)
      )

      const actorIds = params?.actorIds
      const actions = params?.actions
      const resources = params?.resources
      const resourceIds = params?.resourceIds
      const messages = params?.messages

      const result = await activeDeps.getAuditEventsUseCase.execute({
        pageNumber,
        pageSize: 20,
        sortBy,
        sortOrder,
        actorIds,
        actorTypes,
        actorUserRoles,
        actions,
        resources,
        resourceIds,
        statuses,
        messages
      })

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

    initScreen: async (searchParams?: AuditEventListSearchParams) => {
      const current = get().screenState
      if (isFetching || current.status === 'content') {
        return
      }
      set({ screenState: { status: 'loading' } })
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
