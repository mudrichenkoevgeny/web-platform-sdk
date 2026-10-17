import React, { createContext, useContext, useState, useEffect } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import { ManagementAuditEventListParamsParser, managementAuditEventListParamsSchema } from '@mudrichenkoevgeny/shared-foundation'
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

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null
}

/** Discriminated union representing screen states for the audit event list view. */
export type AuditEventListScreenState =
  | {
      /** Loading state while audit events list is being loaded initially. */
      status: 'loading'
    }
  | {
      /** Error state when loading audit events list failed. */
      status: 'error'
      /** Error instance describing the failure. */
      error: AppError
    }
  | {
      /** Content state containing paginated audit events. */
      status: 'content'
      /** Current pagination state for audit event items. */
      paging: PaginationState<AuditEventSummary>
      /** Whether the filter panel drawer is expanded. */
      isFilterPanelExpanded: boolean
      /** Whether a background action is currently loading. */
      actionLoading: boolean
      /** Action error instance if an action failed. */
      actionError: AppError | null
    }

/** External dependencies required by {@link createAuditEventListStore}. */
export interface AuditEventListStoreDependencies {
  /** Use case for loading paginated audit events. */
  getAuditEventsUseCase: GetAuditEventsUseCase
  /** Navigation callback to open audit event detail screen. */
  onNavigateToEventDetail: (eventId: AuditEventId) => void
  /** Navigation callback to return to previous screen. */
  onBack: () => void
  /** Optional initial search parameters. */
  searchParams?: ManagementAuditEventListParams | AuditEventListSearchParams
  /** Optional callback when search parameters change. */
  onSearchParamsChanged?: (params: ManagementAuditEventListParams | AuditEventListSearchParams) => void
}

/** Reactive store state and action interface for audit event list screen. */
export interface AuditEventListStoreState {
  /** Dependencies injected into store. */
  dependencies: AuditEventListStoreDependencies
  /** Current screen UI state. */
  screenState: AuditEventListScreenState
  /** Initializes screen state by fetching first page of audit events. */
  initScreen: (searchParams?: ManagementAuditEventListParams | AuditEventListSearchParams) => Promise<void>
  /** Updates search parameters and reloads audit events list from first page. */
  onSearchParamsUpdated: (searchParams?: ManagementAuditEventListParams | AuditEventListSearchParams) => Promise<void>
  /** Fetches next page of audit events when scrolling. */
  onLoadNextPage: () => Promise<void>
  /** Refreshes audit events list from first page. */
  onRefresh: () => Promise<void>
  /** Handles click on audit event item. */
  onEventClick: (eventId: AuditEventId) => void
  /** Handles back navigation button click. */
  onBackClick: () => void
  /** Toggles filter panel expansion state. */
  onToggleFilterPanel: () => void
}

/** Type alias for Zustand store instance returned by {@link createAuditEventListStore}. */
export type AuditEventListStore = ReturnType<typeof createAuditEventListStore>

type SetState = StoreApi<AuditEventListStoreState>['setState']
type GetState = StoreApi<AuditEventListStoreState>['getState']

/**
 * Creates a reactive Zustand store instance for audit event list screen.
 *
 * @param deps - Injected store dependencies
 * @param initialState - Optional initial screen state override
 * @returns Initialized store instance
 */
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
      const rawParams = overrideParams ?? activeDeps.searchParams
      const searchRecord = isRecord(rawParams) ? rawParams : {}
      const parsedParams = ManagementAuditEventListParamsParser.parse(searchRecord)
      const effectivePageNumber = pageNumber !== 1 ? pageNumber : (parsedParams.pageNumber ?? pageNumber)

      const auditEventsResult = await activeDeps.getAuditEventsUseCase.execute(
        managementAuditEventListParamsSchema.parse({
          ...parsedParams,
          pageNumber: effectivePageNumber
        })
      )

      if (isSuccess(auditEventsResult)) {
        const current = get().screenState
        const currentPaging = current.status === 'content' ? current.paging : createInitialPaginationState<AuditEventSummary>()
        const nextPaging = appendResultToPaginationState(currentPaging, auditEventsResult.data)

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
              actionError: auditEventsResult.error
            }
          })
        } else {
          set({
            screenState: {
              status: 'error',
              error: auditEventsResult.error
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
      const parsedParams = isRecord(searchParams) ? ManagementAuditEventListParamsParser.parse(searchParams) : undefined
      const startPage = parsedParams?.pageNumber ?? 1
      await fetchPage(set, get, startPage, searchParams)
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
      const parsedParams = isRecord(searchParams) ? ManagementAuditEventListParamsParser.parse(searchParams) : undefined
      const startPage = parsedParams?.pageNumber ?? 1
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

/** Props for {@link AuditEventListProvider}. */
export interface AuditEventListProviderProps {
  /** Injected dependencies. */
  dependencies: AuditEventListStoreDependencies
  /** Optional initial state override. */
  initialState?: AuditEventListScreenState
  /** React child nodes. */
  children: React.ReactNode
}

/** Context provider wrapping React components with audit event list store state. */
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

/**
 * Custom React hook for selecting reactive state from {@link AuditEventListStore}.
 *
 * @param selector - Selector function transforming store state
 * @returns Selected slice of store state
 */
export const useAuditEventListStore = <T,>(
  selector: (state: AuditEventListStoreState) => T
): T => {
  const store = useContext(AuditEventListContext)
  if (!store) {
    throw new Error('useAuditEventListStore must be used within AuditEventListProvider')
  }
  return useStore(store, selector)
}
