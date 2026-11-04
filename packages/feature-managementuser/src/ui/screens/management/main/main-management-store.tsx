import React, { createContext, useContext, useState } from 'react'
import { createStore, useStore } from 'zustand'

export interface MainManagementStoreDependencies {
  onSettingsClick: () => void
  onGlobalUserListClick: () => void
  onAuditEventListClick: () => void
  onGlobalSessionListClick: () => void
  onGlobalIdentifierListClick: () => void
  onStorageFileListClick: () => void
}

export interface MainManagementStoreState {
  onSettingsClick: () => void
  onGlobalUserListClick: () => void
  onAuditEventListClick: () => void
  onGlobalSessionListClick: () => void
  onGlobalIdentifierListClick: () => void
  onStorageFileListClick: () => void
}

export type MainManagementStore = ReturnType<typeof createMainManagementStore>

export const createMainManagementStore = (deps: MainManagementStoreDependencies) => {
  return createStore<MainManagementStoreState>()(() => ({
    onSettingsClick: deps.onSettingsClick,
    onGlobalUserListClick: deps.onGlobalUserListClick,
    onAuditEventListClick: deps.onAuditEventListClick,
    onGlobalSessionListClick: deps.onGlobalSessionListClick,
    onGlobalIdentifierListClick: deps.onGlobalIdentifierListClick,
    onStorageFileListClick: deps.onStorageFileListClick
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
