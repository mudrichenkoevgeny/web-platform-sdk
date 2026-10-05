import React, { createContext, useContext, useState } from 'react'
import { createStore, useStore } from 'zustand'
import type { ManagementDestination } from '@/ui/screens/management/management-destination'
import type { GetAuditEventUseCase } from '@/usecase/audit/get-audit-event-use-case'
import type { GetAuditEventsUseCase } from '@/usecase/audit/get-audit-events-use-case'
import type { GetManagementAuthSettingsUseCase } from '@/usecase/auth/settings/get-management-auth-settings-use-case'
import type { ResetRemoteAuthSettingsUseCase } from '@/usecase/auth/settings/reset-remote-auth-settings-use-case'
import type { SaveRemoteAuthSettingsUseCase } from '@/usecase/auth/settings/save-remote-auth-settings-use-case'
import type { GetManagementGlobalSettingsUseCase } from '@/usecase/global-settings/get-management-global-settings-use-case'
import type { ResetRemoteGlobalSettingsUseCase } from '@/usecase/global-settings/reset-remote-global-settings-use-case'
import type { SaveRemoteGlobalSettingsUseCase } from '@/usecase/global-settings/save-remote-global-settings-use-case'
import type { ManagementDeleteIdentifierPasswordUseCase } from '@/usecase/identifier/management-delete-identifier-password-use-case'
import type { ManagementDeleteIdentifierUseCase } from '@/usecase/identifier/management-delete-identifier-use-case'
import type { ManagementGetIdentifierUseCase } from '@/usecase/identifier/management-get-identifier-use-case'
import type { ManagementGetIdentifiersUseCase } from '@/usecase/identifier/management-get-identifiers-use-case'
import type { GetManagementSecuritySettingsUseCase } from '@/usecase/security/settings/get-management-security-settings-use-case'
import type { ResetRemoteSecuritySettingsUseCase } from '@/usecase/security/settings/reset-remote-security-settings-use-case'
import type { SaveRemoteSecuritySettingsUseCase } from '@/usecase/security/settings/save-remote-security-settings-use-case'
import type { ManagementDeleteAllUserSessionsUseCase } from '@/usecase/session/management-delete-all-user-sessions-use-case'
import type { ManagementDeleteSessionUseCase } from '@/usecase/session/management-delete-session-use-case'
import type { ManagementGetSessionUseCase } from '@/usecase/session/management-get-session-use-case'
import type { ManagementGetSessionsUseCase } from '@/usecase/session/management-get-sessions-use-case'
import type { CreateUserUseCase } from '@/usecase/user/create-user-use-case'
import type { DeleteUserUseCase } from '@/usecase/user/delete-user-use-case'
import type { GetUserUseCase } from '@/usecase/user/get-user-use-case'
import type { GetUsersUseCase } from '@/usecase/user/get-users-use-case'
import type { UpdateUserUseCase } from '@/usecase/user/update-user-use-case'
import type { ManagementDisableTotpUseCase } from '@/usecase/user/security/management-disable-totp-use-case'

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
