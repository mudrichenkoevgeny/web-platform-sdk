import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { runCli } from '@/cli/cli-runner'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const toolsPkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf-8')) as { version: string }
const expectedVersion = toolsPkg.version

describe('CLI Runner init command', () => {
  let tempDir: string
  let originalCwd: string

  beforeEach(() => {
    originalCwd = process.cwd()
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'web-sdk-tools-test-'))
    process.chdir(tempDir)
  })

  afterEach(() => {
    process.chdir(originalCwd)
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }
  })

  it('throws error when scaffold type is missing or invalid', async () => {
    await expect(runCli(['init'])).rejects.toThrow(/Invalid or missing scaffold type/)
    await expect(runCli(['init', 'invalid-type', 'my-app'])).rejects.toThrow(/Invalid or missing scaffold type/)
  })

  it('throws error when project name is invalid kebab-case', async () => {
    await expect(runCli(['init', 'workspace', 'Invalid_Name'])).rejects.toThrow(/Invalid project name/)
    await expect(runCli(['init', 'workspace', '123-app'])).rejects.toThrow(/Invalid project name/)
  })

  it('scaffolds full workspace into empty CWD correctly with --skip-install', async () => {
    const projectName = 'my-app'
    const targetProjectDir = tempDir

    await runCli(['init', 'workspace', projectName, '--skip-install'])

    expect(fs.existsSync(path.join(targetProjectDir, 'package.json'))).toBe(true)
    expect(fs.existsSync(path.join(targetProjectDir, 'pnpm-workspace.yaml'))).toBe(true)
    expect(fs.existsSync(path.join(targetProjectDir, '.agent/global/web/ts-coding-style-web.md'))).toBe(true)
    expect(fs.existsSync(path.join(targetProjectDir, 'apps/client/package.json'))).toBe(true)
    expect(fs.existsSync(path.join(targetProjectDir, 'apps/admin/package.json'))).toBe(true)

    const rootPkg = JSON.parse(fs.readFileSync(path.join(targetProjectDir, 'package.json'), 'utf-8'))
    expect(rootPkg.name).toBe('my-app-web')
    expect(rootPkg.devDependencies['@mudrichenkoevgeny/web-platform-sdk-tools']).toBe(`^${expectedVersion}`)
    expect(rootPkg.pnpm).toBeUndefined()

    const pnpmWorkspace = fs.readFileSync(path.join(targetProjectDir, 'pnpm-workspace.yaml'), 'utf-8')
    expect(pnpmWorkspace).toContain("  - 'apps/*'")
    expect(pnpmWorkspace).not.toContain('samples/*')
    expect(pnpmWorkspace).not.toContain('packages/*')
    expect(pnpmWorkspace).toContain('catalog:')
    expect(pnpmWorkspace).toContain('onlyBuiltDependencies:')
    expect(pnpmWorkspace).toContain('@mudrichenkoevgeny/shared-foundation')
    expect(pnpmWorkspace).toContain('@mudrichenkoevgeny/web-platform-sdk-tools')

    const clientPkg = JSON.parse(fs.readFileSync(path.join(targetProjectDir, 'apps/client/package.json'), 'utf-8'))
    expect(clientPkg.name).toBe('@my-app/client')
    expect(clientPkg.dependencies['@mudrichenkoevgeny/web-platform-sdk']).toBe(`^${expectedVersion}`)

    const adminPkg = JSON.parse(fs.readFileSync(path.join(targetProjectDir, 'apps/admin/package.json'), 'utf-8'))
    expect(adminPkg.name).toBe('@my-app/admin')

    const clientDi = fs.readFileSync(path.join(targetProjectDir, 'apps/client/src/di/client-app-component.ts'), 'utf-8')
    expect(clientDi).toContain('export class MyAppClientAppComponent')
    expect(clientDi).not.toContain('MyAppMyApp')

    const adminDi = fs.readFileSync(path.join(targetProjectDir, 'apps/admin/src/di/management-app-component.ts'), 'utf-8')
    expect(adminDi).toContain('export class MyAppManagementAppComponent')
    expect(adminDi).not.toContain('MyAppMyApp')

    const verifyNoPlaceholders = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          if (entry.name !== 'node_modules' && entry.name !== 'dist') {
            verifyNoPlaceholders(fullPath)
          }
        } else if (entry.isFile()) {
          const isTextFile = /\.(json|ts|tsx|js|mjs|cjs|html|md|yaml|yml|css)$/i.test(entry.name)
          if (isTextFile) {
            const content = fs.readFileSync(fullPath, 'utf-8')
            expect(content).not.toMatch(/\{\{[a-zA-Z0-9_-]+\}\}/)
          }
        }
      }
    }

    verifyNoPlaceholders(targetProjectDir)
  }, 15000)

  it('scaffolds workspace with --link-local overrides', async () => {
    const projectName = 'my-app'
    const targetProjectDir = tempDir

    await runCli(['init', 'workspace', projectName, '--skip-install', '--link-local'])

    const pnpmWorkspace = fs.readFileSync(path.join(targetProjectDir, 'pnpm-workspace.yaml'), 'utf-8')
    expect(pnpmWorkspace).toContain('overrides:')
    const overridesSection = pnpmWorkspace.substring(pnpmWorkspace.indexOf('overrides:'))
    expect(overridesSection).toContain("'@mudrichenkoevgeny/web-platform-sdk': 'link:")
    expect(overridesSection).toContain("'@mudrichenkoevgeny/web-platform-sdk-tools': 'link:")
    expect(overridesSection).not.toContain('\\')
  }, 15000)

  it('scaffolds into <name>-web subdirectory when CWD is non-empty', async () => {
    const projectName = 'my-app'
    fs.writeFileSync(path.join(tempDir, 'some-file.txt'), 'hello')

    await runCli(['init', 'workspace', projectName, '--skip-install'])

    const targetProjectDir = path.join(tempDir, `${projectName}-web`)
    expect(fs.existsSync(targetProjectDir)).toBe(true)
    expect(fs.existsSync(path.join(targetProjectDir, 'package.json'))).toBe(true)
    expect(fs.existsSync(path.join(targetProjectDir, 'apps/client/package.json'))).toBe(true)
  }, 15000)

  it('scaffolds client-only app when type is client', async () => {
    const projectName = 'consumer-app'
    const targetProjectDir = tempDir

    await runCli(['init', 'client', projectName, '--skip-install'])

    expect(fs.existsSync(path.join(targetProjectDir, 'apps/client/package.json'))).toBe(true)
    expect(fs.existsSync(path.join(targetProjectDir, 'apps/admin'))).toBe(false)
  })

  it('scaffolds admin-only app when type is admin', async () => {
    const projectName = 'admin-app'
    const targetProjectDir = tempDir

    await runCli(['init', 'admin', projectName, '--skip-install'])

    expect(fs.existsSync(path.join(targetProjectDir, 'apps/admin/package.json'))).toBe(true)
    expect(fs.existsSync(path.join(targetProjectDir, 'apps/client'))).toBe(false)
  })

  it('prevents overwriting when target directory contains conflicting files', async () => {
    const projectName = 'existing-app'
    const targetProjectDir = path.join(tempDir, `${projectName}-web`)
    fs.mkdirSync(targetProjectDir, { recursive: true })
    fs.writeFileSync(path.join(targetProjectDir, 'package.json'), '{}')

    await expect(runCli(['init', 'workspace', projectName, '--skip-install'])).rejects.toThrow(
      /already contains conflicting/
    )
  })
})
