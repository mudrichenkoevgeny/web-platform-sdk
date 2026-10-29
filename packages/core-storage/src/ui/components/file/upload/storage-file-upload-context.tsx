import React, { createContext, useContext, useState } from 'react'
import { useStore } from 'zustand'
import type { StorageFileUploadUiConfig } from '@mudrichenkoevgeny/shared-foundation'
import type { StorageFileUploadStoreDependencies, StorageFileUploadStoreState } from './storage-file-upload.types'
import { createStorageFileUploadStore, type StorageFileUploadStore } from './storage-file-upload.store'

const StorageFileUploadContext = createContext<StorageFileUploadStore | null>(null)

/**
 * Props for {@link StorageFileUploadProvider}.
 */
export interface StorageFileUploadProviderProps {
  /** Dependency bindings for the file upload store. */
  dependencies: StorageFileUploadStoreDependencies
  /** Configuration constraints for the upload queue. */
  config: StorageFileUploadUiConfig
  /** React child elements wrapped by provider context. */
  children: React.ReactNode
}

/**
 * React Context Provider creating and binding a {@link StorageFileUploadStore} instance.
 *
 * @param props - Component props including dependencies, config, and children.
 * @returns Context provider element.
 */
export const StorageFileUploadProvider: React.FC<StorageFileUploadProviderProps> = ({
  dependencies,
  config,
  children
}) => {
  const [store] = useState(() => createStorageFileUploadStore(dependencies, config))

  return (
    <StorageFileUploadContext.Provider value={store}>
      {children}
    </StorageFileUploadContext.Provider>
  )
}

/**
 * Custom React hook to select state slices from {@link StorageFileUploadStore}.
 *
 * @template T - Selected state slice return type.
 * @param selector - Selector function extracting values from store state.
 * @returns Selected slice of store state.
 * @throws {Error} If called outside of {@link StorageFileUploadProvider}.
 */
export const useStorageFileUploadStore = <T,>(
  selector: (state: StorageFileUploadStoreState) => T
): T => {
  const store = useContext(StorageFileUploadContext)
  if (!store) {
    throw new Error('useStorageFileUploadStore must be used within StorageFileUploadProvider')
  }
  return useStore(store, selector)
}
