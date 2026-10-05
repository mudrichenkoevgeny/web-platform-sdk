import React, { createContext, useContext, useState } from 'react'
import { createStore, useStore } from 'zustand'

export interface MainManagementStoreDependencies {
  onEditAuthSettingsClick: () => void
  onEditGlobalSettingsClick: () => void
  onEditSecuritySettingsClick: () => void
  onGlobalUserListClick: () => void
  onAuditEventListClick: () => void
  onGlobalSessionListClick: () => void
  onGlobalIdentifierListClick: () => void
}

export interface MainManagementStoreState {
  onEditAuthSettingsClick: () => void
  onEditGlobalSettingsClick: () => void
  onEditSecuritySettingsClick: () => void
  onGlobalUserListClick: () => void
  onAuditEventListClick: () => void
  onGlobalSessionListClick: () => void
  onGlobalIdentifierListClick: () => void
}

export type MainManagementStore = ReturnType<typeof createMainManagementStore>

export const createMainManagementStore = (deps: MainManagementStoreDependencies) => {
  return createStore<MainManagementStoreState>()(() => ({
    onEditAuthSettingsClick: deps.onEditAuthSettingsClick,
    onEditGlobalSettingsClick: deps.onEditGlobalSettingsClick,
    onEditSecuritySettingsClick: deps.onEditSecuritySettingsClick,
    onGlobalUserListClick: deps.onGlobalUserListClick,
    onAuditEventListClick: deps.onAuditEventListClick,
    onGlobalSessionListClick: deps.onGlobalSessionListClick,
    onGlobalIdentifierListClick: deps.onGlobalIdentifierListClick
  }))
}

const MainManagementContext = createContext<MainManagementStore | null>(null)

export interface MainManagementProviderProps {
  dependencies: MainManagementStoreDependencies
  children: React.ReactNode
}

export const MainManagementProvider: React.FC<MainManagementProviderProps> = ({
  dependencies,
  children
}) => {
  const [store] = useState(() => createMainManagementStore(dependencies))

  return (
    <MainManagementContext.Provider value={store}>
      {children}
    </MainManagementContext.Provider>
  )
}

export const useMainManagementStore = <T,>(
  selector: (state: MainManagementStoreState) => T
): T => {
  const store = useContext(MainManagementContext)
  if (!store) {
    throw new Error('useMainManagementStore must be used within MainManagementProvider')
  }
  return useStore(store, selector)
}
