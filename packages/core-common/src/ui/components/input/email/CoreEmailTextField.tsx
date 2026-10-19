import { forwardRef } from 'react'
import { commonStrings } from '@mudrichenkoevgeny/shared-foundation'
import { CoreOutlinedTextField, type CoreOutlinedTextFieldProps } from '@/ui/components/input/outlined/CoreOutlinedTextField'

export type CoreEmailTextFieldProps = CoreOutlinedTextFieldProps

export const CoreEmailTextField = forwardRef<HTMLInputElement, CoreEmailTextFieldProps>(
  ({ label = commonStrings.ui.email, placeholder = commonStrings.ui.email, ...rest }, ref) => {
    return (
      <CoreOutlinedTextField
        ref={ref}
        type="email"
        inputMode="email"
        label={label}
        placeholder={placeholder}
        {...rest}
      />
    )
  }
)

CoreEmailTextField.displayName = 'CoreEmailTextField'
