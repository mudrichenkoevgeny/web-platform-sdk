import { forwardRef } from 'react'
import { CoreOutlinedTextField, CoreOutlinedTextFieldProps } from '@/outlined/CoreOutlinedTextField'
import { enStrings } from '@/locales/en/strings'

export interface CoreEmailTextFieldProps extends CoreOutlinedTextFieldProps {}

export const CoreEmailTextField = forwardRef<HTMLInputElement, CoreEmailTextFieldProps>(
  ({ label = enStrings.ui_common_email, placeholder = enStrings.ui_common_email, ...rest }, ref) => {
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
