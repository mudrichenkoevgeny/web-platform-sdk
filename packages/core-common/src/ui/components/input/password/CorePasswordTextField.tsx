import { forwardRef } from 'react'
import { CoreOutlinedTextField } from '@/ui/components/input/outlined/CoreOutlinedTextField'
import type { CoreOutlinedTextFieldProps } from "@/ui/components/input/outlined/CoreOutlinedTextField";
import { CoreIcon } from '@/ui/components/icon/icon/CoreIcon'
import { icons } from '@/assets/icons/index.js'
export interface CorePasswordTextFieldProps
  extends Omit<CoreOutlinedTextFieldProps, 'trailingIcon' | 'type'> {
  isPasswordVisible: boolean
  onTogglePasswordVisibility: () => void
}

export const CorePasswordTextField = forwardRef<
  HTMLInputElement,
  CorePasswordTextFieldProps
>(
  (
    { isPasswordVisible, onTogglePasswordVisibility, disabled, ...rest },
    ref
  ) => {
    return (
      <CoreOutlinedTextField
        ref={ref}
        type={isPasswordVisible ? 'text' : 'password'}
        disabled={disabled}
        trailingIcon={
          <button
            type="button"
            onClick={onTogglePasswordVisibility}
            disabled={disabled}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-50 transition-colors"
          >
            <CoreIcon
              src={isPasswordVisible ? icons.hide : icons.show}
              size={20}
            />
          </button>
        }
        {...rest}
      />
    )
  }
)

CorePasswordTextField.displayName = 'CorePasswordTextField'
