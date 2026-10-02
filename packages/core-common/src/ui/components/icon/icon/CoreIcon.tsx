import React, { forwardRef } from 'react'
import { cn } from '../../../../utils/cn'

export interface CoreIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'src'> {
  src: React.ComponentType<React.SVGProps<SVGSVGElement>> | string
  size?: number
  alt?: string
}

export const CoreIcon = forwardRef<SVGSVGElement | HTMLImageElement, CoreIconProps>(
  ({ src, size = 24, className, alt = '', ...rest }, ref) => {
    if (typeof src === 'function' || typeof src === 'object') {
      const IconComponent = src as React.ComponentType<React.SVGProps<SVGSVGElement>>
      return (
        <IconComponent
          ref={ref as React.Ref<SVGSVGElement>}
          width={size}
          height={size}
          aria-label={alt}
          className={cn('inline-block shrink-0', className)}
          {...rest}
        />
      )
    }

    return (
      <img
        ref={ref as React.Ref<HTMLImageElement>}
        src={src as string}
        width={size}
        height={size}
        alt={alt}
        className={cn('inline-block shrink-0', className)}
      />
    )
  }
)

CoreIcon.displayName = 'CoreIcon'
