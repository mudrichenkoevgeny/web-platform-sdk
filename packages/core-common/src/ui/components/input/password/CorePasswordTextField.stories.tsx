import type { Meta, StoryObj } from '@storybook/react'
import { CorePasswordTextField } from './CorePasswordTextField'

const meta: Meta<typeof CorePasswordTextField> = {
  title: 'Core/Input/CorePasswordTextField',
  component: CorePasswordTextField,
  args: {
    placeholder: 'Enter password',
    isPasswordVisible: false,
    onTogglePasswordVisibility: () => undefined
  }
}

export default meta
type Story = StoryObj<typeof CorePasswordTextField>

export const Default: Story = {}

export const PasswordVisible: Story = {
  args: {
    isPasswordVisible: true
  }
}
