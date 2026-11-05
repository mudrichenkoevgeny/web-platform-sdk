import { describe, it, expect } from 'vitest'
import { TEST_EMAIL } from '@mudrichenkoevgeny/shared-foundation'
import { ExternalLauncherMock } from '@/mock/platform/external-launcher-mock'

describe('ExternalLauncherMock', () => {
  it('ExternalLauncherMock logs launch calls', () => {
    const launcher = new ExternalLauncherMock()
    launcher.openUrl('https://example.com')
    launcher.openMail(TEST_EMAIL, 'Subj', 'Body')
    launcher.openFile('https://example.com/file.pdf')

    expect(launcher.openedUrls).toEqual(['https://example.com'])
    expect(launcher.openedMails).toEqual([{ email: TEST_EMAIL, subject: 'Subj', body: 'Body' }])
    expect(launcher.openedFiles).toEqual(['https://example.com/file.pdf'])
  })
})
