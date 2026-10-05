import React, { createContext, useContext, useEffect, useState } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import { ClientType, UserAuthProvider, UserRole, UserSortValues } from '@mudrichenkoevgeny/shared-foundation'
import type { UserSession, UserSessionId, UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, ListingFilterState, ListingSortState, PaginationState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  appendResultToPaginationState,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementDeleteSessionUseCase } from '@/usecase/session/ManagementDeleteSessionUseCase'
import type { ManagementGetSessionsUseCase } from '@/usecase/session/ManagementGetSessionsUseCase'

export type GlobalSessionListScreenState =
  | {
      status: 'loading'
    }
  | {
      status: 'error'
      error: AppError
    }
  | {
      status: 'content'
      paging: PaginationState<UserSession>
      sortState: ListingSortState | null
      filterStates: Record<string, ListingFilterState>
      isFilterPanelExpanded: boolean
      actionLoading: boolean
      actionError: AppError | null
    }

export interface GlobalSessionListStoreDependencies {
  managementGetSessionsUseCase: ManagementGetSessionsUseCase
  managementDeleteSessionUseCase: ManagementDeleteSessionUseCase
  onNavigateToSessionDetail?: (session: UserSession) => void
  onBack: () => void
}

export interface GlobalSessionListStoreState {
  screenState: GlobalSessionListScreenState
  initScreen: () => Promise<void>
  onLoadNextPage: () => Promise<void>
  onRefresh: () => Promise<void>
  onSessionClick: (session: UserSession) => void
  onDeleteSessionClick: (userId: UserId, sessionId: string) => Promise<void>
  onSessionRevoked: (sessionId: UserSessionId) => void
  onBackClick: () => void
  onToggleFilterPanel: () => void
  onSortChanged: (sortState: ListingSortState) => Promise<void>
  onFilterChanged: (filterId: string, filterState: ListingFilterState | null) => void
  onApplyFilters: () => Promise<void>
}

export type GlobalSessionListStore = ReturnType<typeof createGlobalSessionListStore>

type SetState = StoreApi<GlobalSessionListStoreState>['setState']
type GetState = StoreApi<GlobalSessionListStoreState>['getState']

export const createGlobalSessionListStore = (
  deps: GlobalSessionListStoreDependencies,
  initialState?: GlobalSessionListScreenState
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
      ? (Object.values(UserSortValues.UserSessionSortBy).find((v) => v === sortState.optionId) ?? null)
      : null

    const roleFilter = filterStates['userRole'] as { selectedIds?: string[] } | undefined
    const providerFilter = filterStates['userAuthProvider'] as { selectedIds?: string[] } | undefined
    const clientTypeFilter = filterStates['clientType'] as { selectedIds?: string[] } | undefined
    const userIdFilter = filterStates['userId'] as { value?: string } | undefined
    const identifierFilter = filterStates['identifier'] as { value?: string } | undefined
    const identifierIdFilter = filterStates['identifierId'] as { value?: string } | undefined
    const ipAddressFilter = filterStates['ipAddress'] as { value?: string } | undefined
    const userAgentFilter = filterStates['userAgent'] as { value?: string } | undefined
    const languageFilter = filterStates['language'] as { value?: string } | undefined
    const deviceIdFilter = filterStates['deviceId'] as { value?: string } | undefined
    const deviceNameFilter = filterStates['deviceName'] as { value?: string } | undefined
    const appVersionFilter = filterStates['appVersion'] as { value?: string } | undefined
    const osVersionFilter = filterStates['operationSystemVersion'] as { value?: string } | undefined

    const userRoles = roleFilter?.selectedIds?.filter((id): id is UserRole =>
      Object.values(UserRole).includes(id as UserRole)
    )
    const userAuthProviders = providerFilter?.selectedIds?.filter((id): id is UserAuthProvider =>
      Object.values(UserAuthProvider).includes(id as UserAuthProvider)
    )
    const clientTypes = clientTypeFilter?.selectedIds?.filter((id): id is ClientType =>
      Object.values(ClientType).includes(id as ClientType)
    )

    const result = await deps.managementGetSessionsUseCase.execute({
      pageNumber,
      pageSize: 20,
      sortBy,
      sortOrder,
      userIds: userIdFilter?.value?.trim() ? [userIdFilter.value.trim()] : undefined,
      userRoles,
      identifiers: identifierFilter?.value?.trim() ? [identifierFilter.value.trim()] : undefined,
      identifierIds: identifierIdFilter?.value?.trim() ? [identifierIdFilter.value.trim()] : undefined,
      userAuthProviders,
      clientTypes,
      userAgents: userAgentFilter?.value?.trim() ? [userAgentFilter.value.trim()] : undefined,
      ipAddresses: ipAddressFilter?.value?.trim() ? [ipAddressFilter.value.trim()] : undefined,
      languages: languageFilter?.value?.trim() ? [languageFilter.value.trim()] : undefined,
      deviceIds: deviceIdFilter?.value?.trim() ? [deviceIdFilter.value.trim()] : undefined,
      deviceNames: deviceNameFilter?.value?.trim() ? [deviceNameFilter.value.trim()] : undefined,
      appVersions: appVersionFilter?.value?.trim() ? [appVersionFilter.value.trim()] : undefined,
      operationSystemVersions: osVersionFilter?.value?.trim() ? [osVersionFilter.value.trim()] : undefined
    })

    if (isSuccess(result)) {
      const current = get().screenState
      const currentPaging = current.status === 'content' ? current.paging : createInitialPaginationState<UserSession>()
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

  return createStore<GlobalSessionListStoreState>()((set, get) => ({
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

    onSessionClick: (session: UserSession) => {
      deps.onNavigateToSessionDetail?.(session)
    },

    onDeleteSessionClick: async (userId: UserId, sessionId: string) => {
      const current = get().screenState
      if (current.status !== 'content' || current.actionLoading) {
        return
      }

      set({ screenState: { ...current, actionLoading: true, actionError: null } })

      const result = await deps.managementDeleteSessionUseCase.execute(userId, sessionId)
      if (isSuccess(result)) {
        const filteredItems = current.paging.items.filter((item) => String(item.id) !== sessionId)
        set({
          screenState: {
            ...current,
            actionLoading: false,
            paging: {
              ...current.paging,
              items: filteredItems,
              totalItems: Math.max(0, current.paging.totalItems - 1)
            }
          }
        })
      } else {
        const updated = get().screenState
        if (updated.status === 'content') {
          set({ screenState: { ...updated, actionLoading: false, actionError: result.error } })
        }
      }
    },

    onSessionRevoked: (sessionId: UserSessionId) => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      const filteredItems = current.paging.items.filter((item) => item.id !== sessionId)
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
          paging: createInitialPaginationState<UserSession>()
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
          paging: createInitialPaginationState<UserSession>()
        }
      })

      await fetchPage(set, get, 1, current.sortState, current.filterStates)
    }
  }))
}

const GlobalSessionListContext = createContext<GlobalSessionListStore | null>(null)

export interface GlobalSessionListProviderProps {
  dependencies: GlobalSessionListStoreDependencies
  initialState?: GlobalSessionListScreenState
  children: React.ReactNode
}

export const GlobalSessionListProvider: React.FC<GlobalSessionListProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createGlobalSessionListStore(dependencies, initialState))

  return (
    <GlobalSessionListContext.Provider value={store}>
      {children}
    </GlobalSessionListContext.Provider>
  )
}

export const useGlobalSessionListStore = <T,>(
  selector: (state: GlobalSessionListStoreState) => T
): T => {
  const store = useContext(GlobalSessionListContext)
  if (!store) {
    throw new Error('useGlobalSessionListStore must be used within GlobalSessionListProvider')
  }
  return useStore(store, selector)
}
