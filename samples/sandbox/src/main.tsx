import React from 'react'
import ReactDOM from 'react-dom/client'
import { SandboxAppComponent } from './di/sandbox-app-component'
import { App } from './App'

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5173'

const bootstrapApp = async (): Promise<void> => {
  const sandboxAppComponent = new SandboxAppComponent({ baseUrl })
  await sandboxAppComponent.init()

  const rootElement = document.getElementById('root')
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App sandboxAppComponent={sandboxAppComponent} />
      </React.StrictMode>
    )
  }
}

void bootstrapApp()
