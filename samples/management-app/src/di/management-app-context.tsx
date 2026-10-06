import React, { createContext, useContext } from 'react'
import type { ManagementAppComponent } from '@/di/management-app-component'

const ManagementAppComponentContext = createContext<ManagementAppComponent | null>(null)

export interface ManagementAppComponentProviderProps {
  readonly component: ManagementAppComponent
  readonly children: React.ReactNode
}

/**
 * Provides {@link ManagementAppComponent} to the React subtree.
 */
export function ManagementAppComponentProvider({
  component,
  children
}: ManagementAppComponentProviderProps): React.JSX.Element {
  return (
    <ManagementAppComponentContext.Provider value={component}>
      {children}
    </ManagementAppComponentContext.Provider>
  )
}

/**
 * Accesses {@link ManagementAppComponent} from React context.
 *
 * @throws Error if used outside of {@link ManagementAppComponentProvider}
 */
export function useManagementAppComponent(): ManagementAppComponent {
  const context = useContext(ManagementAppComponentContext)
  if (!context) {
    throw new Error('useManagementAppComponent must be used within a ManagementAppComponentProvider')
  }
  return context
}
