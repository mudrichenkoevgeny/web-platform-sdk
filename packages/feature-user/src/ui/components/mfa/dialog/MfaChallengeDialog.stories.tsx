import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { MfaChallengeDialog } from '@/ui/components/mfa/dialog/MfaChallengeDialog'
import type { MfaChallengeRequest } from '@/network/httpclient/mfa/mfa-challenge-request'

const mockRequest: MfaChallengeRequest = {
  mfaToken: 'mock_token',
  confirm: () => {},
  cancel: () => {}
}

const meta: Meta<typeof MfaChallengeDialog> = {
  title: 'Feature/User/MFA/MfaChallengeDialog',
  component: MfaChallengeDialog,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <Story />
      </ComponentTestHarness>
    )
  ],
  args: {
    request: mockRequest
  }
}

export default meta
type Story = StoryObj<typeof MfaChallengeDialog>

export const Default: Story = {}
