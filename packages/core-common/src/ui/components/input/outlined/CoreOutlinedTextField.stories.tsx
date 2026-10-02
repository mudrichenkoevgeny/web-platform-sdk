import type { Meta, StoryObj } from '@storybook/react'
import { CoreOutlinedTextField } from './CoreOutlinedTextField'

const meta: Meta<typeof CoreOutlinedTextField> = {
  title: 'Core/Input/CoreOutlinedTextField',
  component: CoreOutlinedTextField,
  args: {
    label: 'Label',
    placeholder: 'Enter text...'
  }
}

export default meta
type Story = StoryObj<typeof CoreOutlinedTextField>

export const Default: Story = {}

export const ErrorState: Story = {
  args: {
    isError: true,
    errorText: 'An error occurred'
  }
}

export const Disabled: Story = {
  args: {
    disabled: true
  }
}
