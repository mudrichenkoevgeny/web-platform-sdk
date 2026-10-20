import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { TEST_EMAIL } from '@mudrichenkoevgeny/shared-foundation'
import { RegistrationByEmailScreen, RegistrationByEmailTestTags } from '@/ui/screens/auth/registration/email/RegistrationByEmailScreen'
import { registrationByEmailDependenciesMock } from '@/mock/ui/screen/auth/registration/email/registration-by-email-component-mock'
import { SendRegistrationConfirmationToEmailUseCaseMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('RegistrationByEmailScreen', () => {
  it('renders email input and enables send code button for valid email', async () => {
    const sendRegistrationConfirmationToEmailUseCase = new SendRegistrationConfirmationToEmailUseCaseMock()
    vi.spyOn(sendRegistrationConfirmationToEmailUseCase, 'execute')

    const deps = registrationByEmailDependenciesMock({
      sendRegistrationConfirmationToEmailUseCase
    })
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <RegistrationByEmailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const sendCodeButton = screen.getByTestId(RegistrationByEmailTestTags.SEND_CODE_BUTTON)
    expect(sendCodeButton.getAttribute('disabled')).not.toBeNull()

    const emailInput = screen.getByTestId(RegistrationByEmailTestTags.EMAIL_INPUT)
    await user.type(emailInput, TEST_EMAIL)

    expect(sendCodeButton.getAttribute('disabled')).toBeNull()

    await user.click(sendCodeButton)

    expect(sendRegistrationConfirmationToEmailUseCase.execute).toHaveBeenCalledWith(TEST_EMAIL)
  })

  it('triggers onBack when back button is clicked on initial step', async () => {
    const deps = registrationByEmailDependenciesMock({
      onBack: vi.fn()
    })
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <RegistrationByEmailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const backButton = screen.getByTestId(RegistrationByEmailTestTags.BACK_BUTTON)
    await user.click(backButton)

    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })
})
