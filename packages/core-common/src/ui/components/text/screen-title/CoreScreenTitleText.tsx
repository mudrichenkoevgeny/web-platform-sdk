import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface CoreScreenTitleTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text: string
}

export const CoreScreenTitleText = forwardRef<HTMLHeadingElement, CoreScreenTitleTextProps>(
  ({ text, className, ...rest }, ref) => {
    return (
      <h1
        ref={ref}
        className={cn('text-xl font-bold text-surface-foreground truncate', className)}
        {...rest}
      >
        {text}
      </h1>
    )
  }
)

CoreScreenTitleText.displayName = 'CoreScreenTitleText'
