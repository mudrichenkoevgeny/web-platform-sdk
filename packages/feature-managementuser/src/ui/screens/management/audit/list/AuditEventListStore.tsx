import React, { createContext, useContext, useState } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import { AuditActorType, AuditEventSortBy, AuditFilterValues, AuditStatus, SortOrder, UserRole } from '@mudrichenkoevgeny/shared-foundation'
import type { AuditEvent, AuditEventId } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, ListingFilterState, ListingSortState, PaginationState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  appendResultToPaginationState,
  canLoadMorePages,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
  getNextPageNumber,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { GetAuditEventsUseCase } from '@/usecase/audit/get-audit-events-use-case'

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
      paging: PaginationState<AuditEvent>
      sortState: ListingSortState | null
      filterStates: Record<string, ListingFilterState>
      isFilterPanelExpanded: boolean
      actionLoading: boolean
      actionError: AppError | null
    }

export interface AuditEventListStoreDependencies {
  getAuditEventsUseCase: GetAuditEventsUseCase
  onNavigateToEventDetail: (eventId: AuditEventId) => void
  onBack: () => void
}

export interface AuditEventListStoreState {
  screenState: AuditEventListScreenState
  initScreen: () => Promise<void>
  onLoadNextPage: () => Promise<void>
  onRefresh: () => Promise<void>
  onEventClick: (eventId: AuditEventId) => void
  onBackClick: () => void
  onToggleFilterPanel: () => void
  onSortChanged: (sortState: ListingSortState) => Promise<void>
  onFilterChanged: (filterId: string, filterState: ListingFilterState | null) => void
  onApplyFilters: () => Promise<void>
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
    sortState: ListingSortState | null,
    filterStates: Record<string, ListingFilterState>
  ) => {
    if (isFetching) {
      return
    }
    isFetching = true

    try {
      const sortOrder = sortState ? (sortState.isAscending ? SortOrder.ASC : SortOrder.DESC) : null
      const sortBy = sortState?.optionId ? AuditEventSortBy.CREATED_AT : null

      const actorIdFilter = filterStates[AuditFilterValues.AuditEventFilterValues.ACTOR_ID]
      const actorTypeFilter = filterStates[AuditFilterValues.AuditEventFilterValues.ACTOR_TYPE]
      const actorRoleFilter = filterStates[AuditFilterValues.AuditEventFilterValues.ACTOR_USER_ROLE]
      const actionFilter = filterStates[AuditFilterValues.AuditEventFilterValues.ACTION]
      const resourceFilter = filterStates[AuditFilterValues.AuditEventFilterValues.RESOURCE]
      const resourceIdFilter = filterStates[AuditFilterValues.AuditEventFilterValues.RESOURCE_ID]
      const statusFilter = filterStates[AuditFilterValues.AuditEventFilterValues.STATUS]
      const messageFilter = filterStates[AuditFilterValues.AuditEventFilterValues.MESSAGE]

      const actorTypes = actorTypeFilter?.type === 'choice'
        ? Array.from(actorTypeFilter.selectedIds).filter((id): id is AuditActorType =>
            Object.values(AuditActorType).includes(id as AuditActorType)
          )
        : undefined
      const actorUserRoles = actorRoleFilter?.type === 'choice'
        ? Array.from(actorRoleFilter.selectedIds).filter((id): id is UserRole =>
            Object.values(UserRole).includes(id as UserRole)
          )
        : undefined
      const statuses = statusFilter?.type === 'choice'
        ? Array.from(statusFilter.selectedIds).filter((id): id is AuditStatus =>
            Object.values(AuditStatus).includes(id as AuditStatus)
          )
        : undefined

      const actorIds = actorIdFilter?.type === 'text' && actorIdFilter.value.trim() ? [actorIdFilter.value.trim()] : undefined
      const actions = actionFilter?.type === 'text' && actionFilter.value.trim() ? [actionFilter.value.trim()] : undefined
      const resources = resourceFilter?.type === 'text' && resourceFilter.value.trim() ? [resourceFilter.value.trim()] : undefined
      const resourceIds = resourceIdFilter?.type === 'text' && resourceIdFilter.value.trim() ? [resourceIdFilter.value.trim()] : undefined
      const messages = messageFilter?.type === 'text' && messageFilter.value.trim() ? [messageFilter.value.trim()] : undefined

      const result = await deps.getAuditEventsUseCase.execute({
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
        const currentPaging = current.status === 'content' ? current.paging : createInitialPaginationState<AuditEvent>()
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
    } finally {
      isFetching = false
    }
  }

  return createStore<AuditEventListStoreState>()((set, get) => ({
    screenState: initialState ?? { status: 'loading' },

    initScreen: async () => {
      const current = get().screenState
      if (isFetching || current.status === 'content') {
        return
      }
      set({ screenState: { status: 'loading' } })
      await fetchPage(set, get, 1, null, {})
    },

    onLoadNextPage: async () => {
      const current = get().screenState
      if (current.status !== 'content' || !canLoadMorePages(current.paging)) {
        return
      }

      const nextPaging = createNextPageLoadingPaginationState(current.paging)
      set({ screenState: { ...current, paging: nextPaging } })

      await fetchPage(
        set,
        get,
        getNextPageNumber(current.paging),
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

    onEventClick: (eventId: AuditEventId) => {
      deps.onNavigateToEventDetail(eventId)
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
          paging: createInitialPaginationState<AuditEvent>()
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
          paging: createInitialPaginationState<AuditEvent>()
        }
      })

      await fetchPage(set, get, 1, current.sortState, current.filterStates)
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
