import React, { createContext, useContext, useState, useEffect } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import { ManagementGlobalIdentifierListParamsParser, managementGlobalIdentifierListParamsSchema } from '@mudrichenkoevgeny/shared-foundation'
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

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null
}

/** Discriminated union representing screen states for the global identifier list view. */
export type GlobalIdentifierListScreenState =
  | {
      /** Loading state while identifiers list is being loaded initially. */
      status: 'loading'
    }
  | {
      /** Error state when loading identifiers list failed. */
      status: 'error'
      /** Error instance describing the failure. */
      error: AppError
    }
  | {
      /** Content state containing paginated identifiers. */
      status: 'content'
      /** Current pagination state for identifier items. */
      paging: PaginationState<UserIdentifierSummary>
      /** Whether the filter panel drawer is expanded. */
      isFilterPanelExpanded: boolean
      /** Whether a background deletion action is currently loading. */
      actionLoading: boolean
      /** Action error instance if deletion action failed. */
      actionError: AppError | null
    }

/** External dependencies required by {@link createGlobalIdentifierListStore}. */
export interface GlobalIdentifierListStoreDependencies {
  /** Use case for loading paginated global user identifiers. */
  managementGetIdentifiersUseCase: ManagementGetIdentifiersUseCase
  /** Use case for deleting a user identifier. */
  managementDeleteIdentifierUseCase: ManagementDeleteIdentifierUseCase
  /** Optional current identifier ID. */
  currentIdentifierId?: UserIdentifierId | null
  /** Optional current user ID. */
  currentUserId?: UserId | null
  /** Navigation callback to open identifier detail screen. */
  onNavigateToIdentifierDetail: (identifierId: UserIdentifierId) => void
  /** Navigation callback to return to previous screen. */
  onBack: () => void
  /** Optional initial search parameters. */
  searchParams?: ManagementGlobalIdentifierListParams | GlobalIdentifierListSearchParams
  /** Optional callback when search parameters change. */
  onSearchParamsChanged?: (params: ManagementGlobalIdentifierListParams | GlobalIdentifierListSearchParams) => void
}

/** Reactive store state and action interface for global identifier list screen. */
export interface GlobalIdentifierListStoreState {
  /** Dependencies injected into store. */
  dependencies: GlobalIdentifierListStoreDependencies
  /** Current screen UI state. */
  screenState: GlobalIdentifierListScreenState
  /** Initializes screen state by fetching first page of identifiers. */
  initScreen: (searchParams?: ManagementGlobalIdentifierListParams | GlobalIdentifierListSearchParams) => Promise<void>
  /** Updates search parameters and reloads identifiers list from first page. */
  onSearchParamsUpdated: (searchParams?: ManagementGlobalIdentifierListParams | GlobalIdentifierListSearchParams) => Promise<void>
  /** Fetches next page of identifiers when scrolling. */
  onLoadNextPage: () => Promise<void>
  /** Refreshes identifiers list from first page. */
  onRefresh: () => Promise<void>
  /** Toggles filter panel expansion state. */
  onToggleFilterPanel: () => void
  /** Handles click on identifier item. */
  onIdentifierClick: (identifierId: UserIdentifierId) => void
  /** Handles deletion of an identifier. */
  onDeleteIdentifierClick: (userId: UserId, identifierId: UserIdentifierId) => Promise<void>
  /** Handles back navigation button click. */
  onBackClick: () => void
}

/** Type alias for Zustand store instance returned by {@link createGlobalIdentifierListStore}. */
export type GlobalIdentifierListStore = ReturnType<typeof createGlobalIdentifierListStore>

type SetState = StoreApi<GlobalIdentifierListStoreState>['setState']
type GetState = StoreApi<GlobalIdentifierListStoreState>['getState']

/**
 * Creates a reactive Zustand store instance for global identifier list screen.
 *
 * @param deps - Injected store dependencies
 * @param initialState - Optional initial screen state override
 * @returns Initialized store instance
 */
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
      const rawParams = overrideParams ?? activeDeps.searchParams
      const searchRecord = isRecord(rawParams) ? rawParams : {}
      const parsedParams = ManagementGlobalIdentifierListParamsParser.parse(searchRecord)
      const effectivePageNumber = pageNumber !== 1 ? pageNumber : (parsedParams.pageNumber ?? pageNumber)

      const identifiersResult = await activeDeps.managementGetIdentifiersUseCase.execute(
        managementGlobalIdentifierListParamsSchema.parse({
          ...parsedParams,
          pageNumber: effectivePageNumber
        })
      )

      if (isSuccess(identifiersResult)) {
        const current = get().screenState
        const currentPaging = current.status === 'content' ? current.paging : createInitialPaginationState<UserIdentifierSummary>()
        const nextPaging = appendResultToPaginationState(currentPaging, identifiersResult.data)

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
              actionError: identifiersResult.error
            }
          })
        } else {
          set({
            screenState: {
              status: 'error',
              error: identifiersResult.error
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

    initScreen: async (searchParams?: ManagementGlobalIdentifierListParams | GlobalIdentifierListSearchParams) => {
      const current = get().screenState
      if (isFetching || current.status === 'content') {
        return
      }
      set({ screenState: { status: 'loading' } })
      const parsedParams = isRecord(searchParams) ? ManagementGlobalIdentifierListParamsParser.parse(searchParams) : undefined
      const startPage = parsedParams?.pageNumber ?? 1
      await fetchPage(set, get, startPage, searchParams)
    },

    onSearchParamsUpdated: async (searchParams?: ManagementGlobalIdentifierListParams | GlobalIdentifierListSearchParams) => {
      set({
        screenState: {
          status: 'content',
          paging: createInitialPaginationState<UserIdentifierSummary>(),
          isFilterPanelExpanded: false,
          actionLoading: false,
          actionError: null
        }
      })
      const parsedParams = isRecord(searchParams) ? ManagementGlobalIdentifierListParamsParser.parse(searchParams) : undefined
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

      const deleteIdentifierResult = await deps.managementDeleteIdentifierUseCase.execute(userId, identifierId)

      if (isSuccess(deleteIdentifierResult)) {
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
              actionError: deleteIdentifierResult.error
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

/** Props for {@link GlobalIdentifierListProvider}. */
export interface GlobalIdentifierListProviderProps {
  /** Injected dependencies. */
  dependencies: GlobalIdentifierListStoreDependencies
  /** Optional initial state override. */
  initialState?: GlobalIdentifierListScreenState
  /** React child nodes. */
  children: React.ReactNode
}

/** Context provider wrapping React components with global identifier list store state. */
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

/**
 * Custom React hook for selecting reactive state from {@link GlobalIdentifierListStore}.
 *
 * @param selector - Selector function transforming store state
 * @returns Selected slice of store state
 */
export const useGlobalIdentifierListStore = <T,>(
  selector: (state: GlobalIdentifierListStoreState) => T
): T => {
  const store = useContext(GlobalIdentifierListContext)
  if (!store) {
    throw new Error('useGlobalIdentifierListStore must be used within GlobalIdentifierListProvider')
  }
  return useStore(store, selector)
}
