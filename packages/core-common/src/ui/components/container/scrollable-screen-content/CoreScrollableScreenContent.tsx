import React, { forwardRef } from 'react'
import { cn } from '../../../../utils/cn'

export interface CoreScrollableScreenContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  containerClassName?: string
}

export const CoreScrollableScreenContent = forwardRef<HTMLDivElement, CoreScrollableScreenContentProps>(
  ({ children, className, containerClassName, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'w-full min-h-full flex justify-center overflow-y-auto scrollbar-thin scrollbar-thumb-border',
          containerClassName
        )}
        {...rest}
      >
        <div className={cn('w-full max-w-core-content p-6 flex flex-col items-center gap-4', className)}>
          {children}
        </div>
      </div>
    )
  }
)

CoreScrollableScreenContent.displayName = 'CoreScrollableScreenContent'
