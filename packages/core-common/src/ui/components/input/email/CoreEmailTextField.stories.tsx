import type { Meta, StoryObj } from '@storybook/react'
import { CoreEmailTextField } from './CoreEmailTextField'

const meta: Meta<typeof CoreEmailTextField> = {
  title: 'Core/Input/CoreEmailTextField',
  component: CoreEmailTextField
}

export default meta
type Story = StoryObj<typeof CoreEmailTextField>

export const Default: Story = {}
