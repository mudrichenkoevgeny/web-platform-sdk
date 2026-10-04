import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface CoreTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  text: string
}

export const CoreBodyText = forwardRef<HTMLParagraphElement, CoreTextProps>(
  ({ text, className, ...rest }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-base text-surface-foreground', className)}
        {...rest}
      >
        {text}
      </p>
    )
  }
)

CoreBodyText.displayName = 'CoreBodyText'

export const CoreSmallText = forwardRef<HTMLParagraphElement, CoreTextProps>(
  ({ text, className, ...rest }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-xs text-muted-foreground', className)}
        {...rest}
      >
        {text}
      </p>
    )
  }
)

CoreSmallText.displayName = 'CoreSmallText'

export interface CoreTitleTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text: string
}

export const CoreTitleText = forwardRef<HTMLHeadingElement, CoreTitleTextProps>(
  ({ text, className, ...rest }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn('text-lg font-semibold text-surface-foreground', className)}
        {...rest}
      >
        {text}
      </h2>
    )
  }
)

CoreTitleText.displayName = 'CoreTitleText'
