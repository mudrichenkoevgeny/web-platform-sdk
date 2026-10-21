import React from 'react'
import { createRoot } from 'react-dom/client'
import { ClientAppComponent } from '@/di/client-app-component'
import { RootContent } from '@/ui/root/RootContent'
import '@/index.css'

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
const googleClientId = import.meta.env.GOOGLE_WEB_CLIENT_ID ?? import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID ?? import.meta.env.VITE_GOOGLE_CLIENT_ID
const appVersion = import.meta.env.VITE_APP_VERSION
const apiVersion = import.meta.env.VITE_API_VERSION

const appComponent = new ClientAppComponent({
  baseUrl,
  googleClientId,
  appVersion,
  apiVersion
})

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <RootContent clientAppComponent={appComponent} />
    </React.StrictMode>
  )
}
