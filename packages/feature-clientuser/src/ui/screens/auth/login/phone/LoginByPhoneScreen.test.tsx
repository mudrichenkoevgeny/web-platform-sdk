import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userStrings, commonStrings, TEST_PHONE } from '@mudrichenkoevgeny/shared-foundation'
import { LoginByPhoneScreen } from '@/ui/screens/auth/login/phone/LoginByPhoneScreen'
import { loginByPhoneDependenciesMock } from '@/mock/ui/screen/auth/login/phone/login-by-phone-component-mock'
import { SendLoginConfirmationToPhoneUseCaseMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('LoginByPhoneScreen', () => {
  it('renders phone input and enables send code button for valid phone number', async () => {
    const sendLoginConfirmationToPhoneUseCase = new SendLoginConfirmationToPhoneUseCaseMock()
    vi.spyOn(sendLoginConfirmationToPhoneUseCase, 'execute')

    const deps = loginByPhoneDependenciesMock({
      sendLoginConfirmationToPhoneUseCase
    })
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <LoginByPhoneScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const sendCodeButton = screen.getByRole('button', { name: userStrings.ui.sendCode })
    expect(sendCodeButton.getAttribute('disabled')).not.toBeNull()

    const phoneInput = screen.getByPlaceholderText(userStrings.ui.phoneNumber)
    await user.type(phoneInput, TEST_PHONE)

    expect(sendCodeButton.getAttribute('disabled')).toBeNull()

    await user.click(sendCodeButton)

    expect(await screen.findByText(userStrings.ui.enterConfirmationCode)).toBeDefined()
    expect(sendLoginConfirmationToPhoneUseCase.execute).toHaveBeenCalledWith(TEST_PHONE)
  })

  it('triggers onBack when back button is clicked on phone step', async () => {
    const deps = loginByPhoneDependenciesMock({
      onBack: vi.fn()
    })
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <LoginByPhoneScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const backButton = screen.getByRole('button', { name: commonStrings.ui.back })
    await user.click(backButton)

    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })
})
