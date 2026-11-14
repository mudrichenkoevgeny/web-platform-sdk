import React, { useMemo } from 'react'
import { SdkProvider } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { LoginByEmailScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-clientuser'
import type { LoginByEmailStoreDependencies } from '@mudrichenkoevgeny/web-platform-sdk-feature-clientuser'
import type { SandboxAppComponent } from './di/sandbox-app-component'

export interface AppProps {
  /** Injected sandbox application DI container. */
  sandboxAppComponent: SandboxAppComponent
}

export const App: React.FC<AppProps> = ({ sandboxAppComponent }) => {
  const loginByEmailDependencies: LoginByEmailStoreDependencies = useMemo(() => {
    const comp = sandboxAppComponent.clientUserComponent
    return {
      loginRepository: comp.loginRepository,
      sendLoginConfirmationToEmailUseCase: comp.sendLoginConfirmationToEmailUseCase,
      loginByEmailUseCase: comp.loginByEmailUseCase,
      onNavigateToForgotPassword: () => {},
      onNavigateToRegistration: () => {},
      onNavigateToTotp: () => {},
      onNavigateToPendingDeletion: () => {},
      onLoginSuccess: () => {}
    }
  }, [sandboxAppComponent])

  return (
    <SdkProvider component={sandboxAppComponent.commonComponent}>
      <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Web Platform SDK — Interactive Sandbox</h1>
          <p style={{ color: '#666' }}>
            Interactive client identity and authentication sandbox environment (Email Authentication).
          </p>
        </header>
        <main>
          <LoginByEmailScreen dependencies={loginByEmailDependencies} />
        </main>
      </div>
    </SdkProvider>
  )
}
