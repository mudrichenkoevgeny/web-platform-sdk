import React, { createContext, useContext, useState } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import { ClientType, UserAuthProvider, UserRole, UserSortValues } from '@mudrichenkoevgeny/shared-foundation'
import type { UserSession, UserSessionId } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, ListingFilterState, ListingSortState, PaginationState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  appendResultToPaginationState,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementDeleteSessionUseCase } from '@/usecase/session/management-delete-session-use-case'
import type { ManagementGetSessionsUseCase } from '@/usecase/session/management-get-sessions-use-case'

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
  onNavigateToSessionDetail: (session: UserSession) => void
  onNavigateToUserDetail: (userId: string) => void
  onBack: () => void
}

export interface GlobalSessionListStoreState {
  screenState: GlobalSessionListScreenState
  initScreen: () => Promise<void>
  onLoadNextPage: () => Promise<void>
  onRefresh: () => Promise<void>
  onToggleFilterPanel: () => void
  onSortChanged: (sortState: ListingSortState | null) => void
  onFilterChanged: (filterId: string, filterState: ListingFilterState) => void
  onApplyFilters: () => void
  onSessionClick: (session: UserSession) => void
  onDeleteSessionClick: (userId: string, sessionId: UserSessionId) => Promise<void>
  onBackClick: () => void
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
    const sortOrder = sortState ? (sortState.isAscending ? 'asc' as const : 'desc' as const) : null
    const sortBy = sortState?.optionId
      ? (Object.values(UserSortValues.UserSessionSortBy).find((v) => v === sortState.optionId) ?? null)
      : null

    const roleFilter = filterStates['userRole']
    const providerFilter = filterStates['userAuthProvider']
    const clientTypeFilter = filterStates['clientType']
    const userIdFilter = filterStates['userId']
    const identifierFilter = filterStates['identifier']
    const identifierIdFilter = filterStates['identifierId']
    const ipAddressFilter = filterStates['ipAddress']
    const userAgentFilter = filterStates['userAgent']
    const languageFilter = filterStates['language']
    const deviceIdFilter = filterStates['deviceId']
    const deviceNameFilter = filterStates['deviceName']
    const appVersionFilter = filterStates['appVersion']
    const osVersionFilter = filterStates['operationSystemVersion']

    const userRoles = roleFilter?.type === 'choice'
      ? Array.from(roleFilter.selectedIds).filter((id): id is UserRole =>
          Object.values(UserRole).includes(id as UserRole)
        )
      : undefined
    const userAuthProviders = providerFilter?.type === 'choice'
      ? Array.from(providerFilter.selectedIds).filter((id): id is UserAuthProvider =>
          Object.values(UserAuthProvider).includes(id as UserAuthProvider)
        )
      : undefined
    const clientTypes = clientTypeFilter?.type === 'choice'
      ? Array.from(clientTypeFilter.selectedIds).filter((id): id is ClientType =>
          Object.values(ClientType).includes(id as ClientType)
        )
      : undefined

    const userIds = userIdFilter?.type === 'text' && userIdFilter.value.trim() ? [userIdFilter.value.trim()] : undefined
    const identifiers = identifierFilter?.type === 'text' && identifierFilter.value.trim() ? [identifierFilter.value.trim()] : undefined
    const identifierIds = identifierIdFilter?.type === 'text' && identifierIdFilter.value.trim() ? [identifierIdFilter.value.trim()] : undefined
    const ipAddresses = ipAddressFilter?.type === 'text' && ipAddressFilter.value.trim() ? [ipAddressFilter.value.trim()] : undefined
    const userAgents = userAgentFilter?.type === 'text' && userAgentFilter.value.trim() ? [userAgentFilter.value.trim()] : undefined
    const languages = languageFilter?.type === 'text' && languageFilter.value.trim() ? [languageFilter.value.trim()] : undefined
    const deviceIds = deviceIdFilter?.type === 'text' && deviceIdFilter.value.trim() ? [deviceIdFilter.value.trim()] : undefined
    const deviceNames = deviceNameFilter?.type === 'text' && deviceNameFilter.value.trim() ? [deviceNameFilter.value.trim()] : undefined
    const appVersions = appVersionFilter?.type === 'text' && appVersionFilter.value.trim() ? [appVersionFilter.value.trim()] : undefined
    const operationSystemVersions = osVersionFilter?.type === 'text' && osVersionFilter.value.trim() ? [osVersionFilter.value.trim()] : undefined

    const result = await deps.managementGetSessionsUseCase.execute({
      pageNumber,
      pageSize: 20,
      sortBy: sortBy as any,
      sortOrder,
      userIds,
      userRoles,
      identifiers,
      identifierIds,
      userAuthProviders,
      clientTypes,
      userAgents,
      ipAddresses,
      languages,
      deviceIds,
      deviceNames,
      appVersions,
      operationSystemVersions
    })

    if (isSuccess(result)) {
      const current = get().screenState
      const currentPaging = current.status === 'content' ? current.paging : createInitialPaginationState<UserSession>()
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

  return createStore<GlobalSessionListStoreState>()((set, get) => ({
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

    onToggleFilterPanel: () => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      set({
        screenState: {
          ...current,
          isFilterPanelExpanded: !current.isFilterPanelExpanded
        }
      })
    },

    onSortChanged: (sortState: ListingSortState | null) => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      set({
        screenState: {
          ...current,
          sortState
        }
      })
    },

    onFilterChanged: (filterId: string, filterState: ListingFilterState) => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      set({
        screenState: {
          ...current,
          filterStates: {
            ...current.filterStates,
            [filterId]: filterState
          }
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
          paging: createInitialPaginationState<UserSession>()
        }
      })

      await fetchPage(set, get, 1, current.sortState, current.filterStates)
    },

    onSessionClick: (session: UserSession) => {
      deps.onNavigateToSessionDetail(session)
    },

    onDeleteSessionClick: async (userId: string, sessionId: UserSessionId) => {
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

      const result = await deps.managementDeleteSessionUseCase.execute(userId as any, String(sessionId))

      if (isSuccess(result)) {
        const updated = get().screenState
        if (updated.status === 'content') {
          set({
            screenState: {
              ...updated,
              paging: {
                ...updated.paging,
                items: updated.paging.items.filter((item) => item.id !== sessionId),
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
