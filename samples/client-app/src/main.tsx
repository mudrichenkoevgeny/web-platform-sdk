import React from 'react'
import { createRoot } from 'react-dom/client'
import { ClientAppComponent } from '@/di/client-app-component'
import { RootContent } from '@/ui/root/RootContent'
import '@/index.css'

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

const appComponent = new ClientAppComponent({
  baseUrl
})

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <RootContent clientAppComponent={appComponent} />
    </React.StrictMode>
  )
}
