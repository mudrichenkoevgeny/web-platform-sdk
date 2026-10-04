import React, { forwardRef, useEffect, useRef } from 'react'
import { cn } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

export interface ProfileRootContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  onDismiss: () => void
  isMobile?: boolean
  children?: React.ReactNode
}

export const ProfileRootContainer = forwardRef<HTMLDivElement, ProfileRootContainerProps>(
  (
    {
      onDismiss,
      isMobile = false,
      children,
      className,
      ...rest
    },
    ref
  ) => {
    const dialogRef = useRef<HTMLDivElement>(null)
    const previousActiveElementRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
      previousActiveElementRef.current = document.activeElement as HTMLElement
      return () => {
        previousActiveElementRef.current?.focus()
      }
    }, [])

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onDismiss()
          return
        }

        if (e.key === 'Tab' && dialogRef.current) {
          const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
          if (focusables.length === 0) {
            return
          }

          const first = focusables[0]
          const last = focusables[focusables.length - 1]

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault()
            last?.focus()
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault()
            first?.focus()
          }
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }, [onDismiss])

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onDismiss}
        {...rest}
      >
        <div
          ref={dialogRef}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'bg-surface text-surface-foreground border border-border rounded-xl shadow-lg overflow-hidden flex flex-col relative transition-all',
            isMobile
              ? 'w-full max-w-lg h-full max-h-screen rounded-b-none self-end'
              : 'w-full max-w-md h-full max-h-dialog-default',
            className
          )}
        >
          {children}
        </div>
      </div>
    )
  }
)

ProfileRootContainer.displayName = 'ProfileRootContainer'
