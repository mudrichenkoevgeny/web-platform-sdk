import { forwardRef } from 'react'
import { CoreOutlinedTextField, type CoreOutlinedTextFieldProps } from '@/ui/components/input/outlined/CoreOutlinedTextField'

export type CoreCodeTextFieldProps = CoreOutlinedTextFieldProps

export const CoreCodeTextField = forwardRef<HTMLInputElement, CoreCodeTextFieldProps>(
  (props, ref) => {
    return (
      <CoreOutlinedTextField
        ref={ref}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        {...props}
      />
    )
  }
)

CoreCodeTextField.displayName = 'CoreCodeTextField'
