import type { Meta, StoryObj } from '@storybook/react'
import { CoreIcon } from './CoreIcon'
import { icons } from '../../../../assets/icons/index.js'

const meta: Meta<typeof CoreIcon> = {
  title: 'Core/Icon/CoreIcon',
  component: CoreIcon,
  args: {
    src: icons.warning,
    size: 32,
    alt: 'Warning'
  }
}

export default meta
type Story = StoryObj<typeof CoreIcon>

export const Default: Story = {}

export const StyledColor: Story = {
  args: {
    src: icons.warning,
    className: 'text-error'
  }
}

export const RasterFallback: Story = {
  args: {
    src: 'https://via.placeholder.com/32',
    alt: 'Raster fallback'
  }
}
