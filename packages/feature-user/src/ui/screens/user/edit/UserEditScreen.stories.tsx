import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestUserPrivatePayload, toUserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { UserEditScreen } from './UserEditScreen'
import { GetUserUseCaseMock } from '@/mock/usecase/user/get-user-use-case-mock'
import { SelfUpdateUserUseCaseMock } from '@/mock/usecase/user/self-update-user-use-case-mock'
import { ValidateNicknameUseCaseMock } from '@/mock/usecase/user/validation/validate-nickname-use-case-mock'
import { ValidateDisplayNameUseCaseMock } from '@/mock/usecase/user/validation/validate-display-name-use-case-mock'

const mockUser = toUserPrivate(createTestUserPrivatePayload({
  nickname: 'jdoe',
  display_name: 'John Doe'
}))

const getUserUseCase = new GetUserUseCaseMock()
getUserUseCase.resultProvider = async () => appResultSuccess(mockUser)

const selfUpdateUserUseCase = new SelfUpdateUserUseCaseMock()
selfUpdateUserUseCase.resultProvider = async () => appResultSuccess(mockUser)

const validateNicknameUseCase = new ValidateNicknameUseCaseMock()
validateNicknameUseCase.resultProvider = async () => appResultSuccess(undefined)

const validateDisplayNameUseCase = new ValidateDisplayNameUseCaseMock()
validateDisplayNameUseCase.resultProvider = async () => appResultSuccess(undefined)

const meta: Meta<typeof UserEditScreen> = {
  title: 'Feature/User/Screens/UserEditScreen',
  component: UserEditScreen,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <div className="w-full h-screen">
          <Story />
        </div>
      </ComponentTestHarness>
    )
  ]
}

export default meta
type Story = StoryObj<typeof UserEditScreen>

export const Default: Story = {
  args: {
    dependencies: {
      getUserUseCase,
      selfUpdateUserUseCase,
      validateNicknameUseCase,
      validateDisplayNameUseCase,
      onBack: () => {}
    }
  }
}
