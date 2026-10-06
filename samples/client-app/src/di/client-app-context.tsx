import React, { createContext, useContext } from 'react'
import type { ClientAppComponent } from '@/di/client-app-component'

const ClientAppComponentContext = createContext<ClientAppComponent | null>(null)

export interface ClientAppComponentProviderProps {
  readonly component: ClientAppComponent
  readonly children: React.ReactNode
}

/**
 * Provides {@link ClientAppComponent} to the React subtree.
 */
export function ClientAppComponentProvider({
  component,
  children
}: ClientAppComponentProviderProps): React.JSX.Element {
  return (
    <ClientAppComponentContext.Provider value={component}>
      {children}
    </ClientAppComponentContext.Provider>
  )
}

/**
 * Accesses {@link ClientAppComponent} from React context.
 *
 * @throws Error if used outside of {@link ClientAppComponentProvider}
 */
export function useClientAppComponent(): ClientAppComponent {
  const context = useContext(ClientAppComponentContext)
  if (!context) {
    throw new Error('useClientAppComponent must be used within a ClientAppComponentProvider')
  }
  return context
}
