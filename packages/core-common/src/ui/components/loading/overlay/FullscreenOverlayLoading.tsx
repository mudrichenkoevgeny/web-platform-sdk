import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { enStrings } from '@/locales/en/strings'

export interface FullscreenOverlayLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  isFixed?: boolean
}

export const FullscreenOverlayLoading = forwardRef<HTMLDivElement, FullscreenOverlayLoadingProps>(
  ({ isFixed = false, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          isFixed ? 'fixed' : 'absolute',
          'inset-0 z-50 bg-surface/60 backdrop-blur-[2px] flex items-center justify-center pointer-events-auto',
          className
        )}
        {...rest}
      >
        <div
          role="status"
          aria-label={enStrings.ui_common_loading}
          className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"
        />
      </div>
    )
  }
)

FullscreenOverlayLoading.displayName = 'FullscreenOverlayLoading'
