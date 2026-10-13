import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  CommonAuditMetadataKey,
  CommonAuditResourceType,
  CompositeAuditActionTypeParser,
  CompositeAuditMetadataKeyParser,
  CompositeAuditResourceTypeParser,
  SecurityAuditActionType,
  SecurityAuditResourceType,
  SettingsAuditActionType,
  SettingsAuditResourceType,
  UserAuditActionType,
  UserAuditMetadataKey,
  UserAuditResourceType
} from '@mudrichenkoevgeny/shared-foundation'
import { ManagementAppComponent } from '@/di/management-app-component'
import { RootContent } from '@/ui/root/RootContent'
import '@/index.css'

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:9091'
const googleClientId = import.meta.env.GOOGLE_WEB_CLIENT_ID ?? import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID ?? import.meta.env.VITE_GOOGLE_CLIENT_ID

const appComponent = new ManagementAppComponent({
  baseUrl,
  googleClientId,
  compositeActionTypeParser: new CompositeAuditActionTypeParser([
    UserAuditActionType,
    SecurityAuditActionType,
    SettingsAuditActionType
  ]),
  compositeResourceTypeParser: new CompositeAuditResourceTypeParser([
    UserAuditResourceType,
    SecurityAuditResourceType,
    SettingsAuditResourceType,
    CommonAuditResourceType
  ]),
  compositeMetadataKeyParser: new CompositeAuditMetadataKeyParser([
    CommonAuditMetadataKey,
    UserAuditMetadataKey
  ])
})

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <RootContent managementAppComponent={appComponent} />
    </React.StrictMode>
  )
}
