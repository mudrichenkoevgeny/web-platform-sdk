import React, { forwardRef, useEffect, useState } from 'react'
import { cn } from '@/utils/cn'

export const FULLSCREEN_LOADING_DELAY_MILLIS = 250

export interface FullscreenLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  delayMillis?: number
}

export const FullscreenLoading = forwardRef<HTMLDivElement, FullscreenLoadingProps>(
  ({ delayMillis = FULLSCREEN_LOADING_DELAY_MILLIS, className, ...rest }, ref) => {
    const [isVisible, setIsVisible] = useState(delayMillis <= 0)

    useEffect(() => {
      if (delayMillis <= 0) {
        setIsVisible(true)
        return
      }

      const timer = setTimeout(() => {
        setIsVisible(true)
      }, delayMillis)

      return () => {
        clearTimeout(timer)
      }
    }, [delayMillis])

    if (!isVisible) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn('h-full w-full flex items-center justify-center p-6 text-center', className)}
        {...rest}
      >
        <div
          role="status"
          aria-label="Loading"
          className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"
        />
      </div>
    )
  }
)

FullscreenLoading.displayName = 'FullscreenLoading'
