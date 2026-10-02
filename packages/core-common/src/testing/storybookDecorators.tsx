import React from 'react'
import {
  ComponentSizePreviewSpecs,
  DialogSizePreviewSpecs
} from './previewSpecs'

export interface ContainerProps {
  children: React.ReactNode
}

export const NarrowContainer: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div style={{ width: `${ComponentSizePreviewSpecs.WIDTH_NARROW}px` }}>
      {children}
    </div>
  )
}

export const StandardComponentContainer: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div style={{ width: `${ComponentSizePreviewSpecs.WIDTH_STANDARD}px` }}>
      {children}
    </div>
  )
}

export const DialogContainer: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div
      style={{
        width: `${DialogSizePreviewSpecs.WIDTH_STANDARD}px`,
        height: `${DialogSizePreviewSpecs.HEIGHT_STANDARD}px`
      }}
    >
      {children}
    </div>
  )
}

export const MobileSheetContainer: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div
      style={{
        width: `${DialogSizePreviewSpecs.WIDTH_MOBILE_SHEET}px`,
        height: `${DialogSizePreviewSpecs.HEIGHT_MOBILE_SHEET}px`
      }}
    >
      {children}
    </div>
  )
}
