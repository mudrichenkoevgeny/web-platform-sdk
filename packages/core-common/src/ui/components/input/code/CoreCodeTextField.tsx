import { forwardRef } from 'react'
import { CoreOutlinedTextField, CoreOutlinedTextFieldProps } from '@/outlined/CoreOutlinedTextField'

export interface CoreCodeTextFieldProps extends CoreOutlinedTextFieldProps {}

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
