import { forwardRef } from 'react'
import { CommonModuleStrings } from '@mudrichenkoevgeny/shared-foundation'
import { CoreOutlinedTextField, type CoreOutlinedTextFieldProps } from '@/ui/components/input/outlined/CoreOutlinedTextField'

const defaultCommonStrings = new CommonModuleStrings()

export type CoreEmailTextFieldProps = CoreOutlinedTextFieldProps

export const CoreEmailTextField = forwardRef<HTMLInputElement, CoreEmailTextFieldProps>(
  ({ label = defaultCommonStrings.ui.email, placeholder = defaultCommonStrings.ui.email, ...rest }, ref) => {
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
