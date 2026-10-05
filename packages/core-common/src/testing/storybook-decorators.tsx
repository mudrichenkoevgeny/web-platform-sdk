import type React from 'react'
import {
  ComponentSizePreviewSpecs,
  DialogSizePreviewSpecs
} from '@/testing/preview-specs'

/** Props for Storybook preview container components. */
export interface ContainerProps {
  /** React node children to render inside fixed-size container. */
  children: React.ReactNode
}

/**
 * Storybook decorator container applying narrow component dimensions.
 *
 * @param props - Container properties
 * @returns JSX wrapper div
 */
export const NarrowContainer: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div style={{ width: `${ComponentSizePreviewSpecs.WIDTH_NARROW}px` }}>
      {children}
    </div>
  )
}

/**
 * Storybook decorator container applying standard component dimensions.
 *
 * @param props - Container properties
 * @returns JSX wrapper div
 */
export const StandardComponentContainer: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div style={{ width: `${ComponentSizePreviewSpecs.WIDTH_STANDARD}px` }}>
      {children}
    </div>
  )
}

/**
 * Storybook decorator container applying standard dialog dimensions.
 *
 * @param props - Container properties
 * @returns JSX wrapper div
 */
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

/**
 * Storybook decorator container applying mobile sheet dialog dimensions.
 *
 * @param props - Container properties
 * @returns JSX wrapper div
 */
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
