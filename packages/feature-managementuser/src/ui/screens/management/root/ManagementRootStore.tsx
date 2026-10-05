import React, { createContext, useContext, useState } from 'react'
import { createStore, useStore } from 'zustand'
import type { ManagementDestination } from '@/ui/screens/management/ManagementDestination'
import type { GetAuditEventUseCase } from '@/usecase/audit/GetAuditEventUseCase'
import type { GetAuditEventsUseCase } from '@/usecase/audit/GetAuditEventsUseCase'
import type { GetManagementAuthSettingsUseCase } from '@/usecase/auth/settings/GetManagementAuthSettingsUseCase'
import type { ResetRemoteAuthSettingsUseCase } from '@/usecase/auth/settings/ResetRemoteAuthSettingsUseCase'
import type { SaveRemoteAuthSettingsUseCase } from '@/usecase/auth/settings/SaveRemoteAuthSettingsUseCase'
import type { GetManagementGlobalSettingsUseCase } from '@/usecase/globalsettings/GetManagementGlobalSettingsUseCase'
import type { ResetRemoteGlobalSettingsUseCase } from '@/usecase/globalsettings/ResetRemoteGlobalSettingsUseCase'
import type { SaveRemoteGlobalSettingsUseCase } from '@/usecase/globalsettings/SaveRemoteGlobalSettingsUseCase'
import type { ManagementDeleteIdentifierPasswordUseCase } from '@/usecase/identifier/ManagementDeleteIdentifierPasswordUseCase'
import type { ManagementDeleteIdentifierUseCase } from '@/usecase/identifier/ManagementDeleteIdentifierUseCase'
import type { ManagementGetIdentifierUseCase } from '@/usecase/identifier/ManagementGetIdentifierUseCase'
import type { ManagementGetIdentifiersUseCase } from '@/usecase/identifier/ManagementGetIdentifiersUseCase'
import type { GetManagementSecuritySettingsUseCase } from '@/usecase/security/settings/GetManagementSecuritySettingsUseCase'
import type { ResetRemoteSecuritySettingsUseCase } from '@/usecase/security/settings/ResetRemoteSecuritySettingsUseCase'
import type { SaveRemoteSecuritySettingsUseCase } from '@/usecase/security/settings/SaveRemoteSecuritySettingsUseCase'
import type { ManagementDeleteAllUserSessionsUseCase } from '@/usecase/session/ManagementDeleteAllUserSessionsUseCase'
import type { ManagementDeleteSessionUseCase } from '@/usecase/session/ManagementDeleteSessionUseCase'
import type { ManagementGetSessionUseCase } from '@/usecase/session/ManagementGetSessionUseCase'
import type { ManagementGetSessionsUseCase } from '@/usecase/session/ManagementGetSessionsUseCase'
import type { CreateUserUseCase } from '@/usecase/user/CreateUserUseCase'
import type { DeleteUserUseCase } from '@/usecase/user/DeleteUserUseCase'
import type { GetUserUseCase } from '@/usecase/user/GetUserUseCase'
import type { GetUsersUseCase } from '@/usecase/user/GetUsersUseCase'
import type { UpdateUserUseCase } from '@/usecase/user/UpdateUserUseCase'
import type { ManagementDisableTotpUseCase } from '@/usecase/user/security/ManagementDisableTotpUseCase'

export interface ManagementRootStoreDependencies {
  getManagementAuthSettingsUseCase: GetManagementAuthSettingsUseCase
  saveRemoteAuthSettingsUseCase: SaveRemoteAuthSettingsUseCase
  resetRemoteAuthSettingsUseCase: ResetRemoteAuthSettingsUseCase
  getManagementGlobalSettingsUseCase: GetManagementGlobalSettingsUseCase
  saveRemoteGlobalSettingsUseCase: SaveRemoteGlobalSettingsUseCase
  resetRemoteGlobalSettingsUseCase: ResetRemoteGlobalSettingsUseCase
  getManagementSecuritySettingsUseCase: GetManagementSecuritySettingsUseCase
  saveRemoteSecuritySettingsUseCase: SaveRemoteSecuritySettingsUseCase
  resetRemoteSecuritySettingsUseCase: ResetRemoteSecuritySettingsUseCase
  getUsersUseCase: GetUsersUseCase
  getUserUseCase: GetUserUseCase
  createUserUseCase: CreateUserUseCase
  updateUserUseCase: UpdateUserUseCase
  deleteUserUseCase: DeleteUserUseCase
  managementGetSessionsUseCase: ManagementGetSessionsUseCase
  managementGetSessionUseCase?: ManagementGetSessionUseCase
  managementGetIdentifiersUseCase: ManagementGetIdentifiersUseCase
  managementGetIdentifierUseCase?: ManagementGetIdentifierUseCase
  managementDisableTotpUseCase: ManagementDisableTotpUseCase
  managementDeleteSessionUseCase: ManagementDeleteSessionUseCase
  managementDeleteAllUserSessionsUseCase: ManagementDeleteAllUserSessionsUseCase
  managementDeleteIdentifierUseCase: ManagementDeleteIdentifierUseCase
  managementDeleteIdentifierPasswordUseCase: ManagementDeleteIdentifierPasswordUseCase
  getAuditEventsUseCase: GetAuditEventsUseCase
  getAuditEventUseCase: GetAuditEventUseCase
}

export interface ManagementRootStoreState {
  stack: ManagementDestination[]
  dependencies: ManagementRootStoreDependencies
  push: (dest: ManagementDestination) => void
  pop: () => void
}

export type ManagementRootStore = ReturnType<typeof createManagementRootStore>

export const createManagementRootStore = (
  deps: ManagementRootStoreDependencies,
  initialStack: ManagementDestination[] = [{ type: 'main' }]
) => {
  return createStore<ManagementRootStoreState>()((set, get) => ({
    stack: initialStack,
    dependencies: deps,

    push: (dest: ManagementDestination) => {
      set({ stack: [...get().stack, dest] })
    },

    pop: () => {
      const current = get().stack
      if (current.length > 1) {
        set({ stack: current.slice(0, current.length - 1) })
      }
    }
  }))
}

const ManagementRootContext = createContext<ManagementRootStore | null>(null)

export interface ManagementRootProviderProps {
  dependencies: ManagementRootStoreDependencies
  initialStack?: ManagementDestination[]
  children: React.ReactNode
}

export const ManagementRootProvider: React.FC<ManagementRootProviderProps> = ({
  dependencies,
  initialStack,
  children
}) => {
  const [store] = useState(() => createManagementRootStore(dependencies, initialStack))

  return (
    <ManagementRootContext.Provider value={store}>
      {children}
    </ManagementRootContext.Provider>
  )
}

export const useManagementRootStore = <T,>(
  selector: (state: ManagementRootStoreState) => T
): T => {
  const store = useContext(ManagementRootContext)
  if (!store) {
    throw new Error('useManagementRootStore must be used within ManagementRootProvider')
  }
  return useStore(store, selector)
}
