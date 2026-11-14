import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Resolves the package root directory for @mudrichenkoevgeny/web-platform-sdk-tools.
 *
 * @param startDir - Directory path to start traversing upwards from
 * @returns Absolute path to package root directory
 */
function findToolsPackageDir(startDir: string): string {
  let currentDir = path.resolve(startDir)
  while (currentDir !== path.parse(currentDir).root) {
    const packageJsonPath = path.join(currentDir, 'package.json')
    if (fs.existsSync(packageJsonPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as { name?: string }
        if (pkg.name === '@mudrichenkoevgeny/web-platform-sdk-tools') {
          return currentDir
        }
      } catch {
        /* Ignore JSON parse errors in parent traversal */
      }
    }
    currentDir = path.dirname(currentDir)
  }
  throw new Error('Failed to resolve @mudrichenkoevgeny/web-platform-sdk-tools package directory')
}

/**
 * Reads the current package version of @mudrichenkoevgeny/web-platform-sdk-tools from package.json.
 *
 * @returns Package version string
 */
function getToolsPackageVersion(): string {
  const currentDir = path.dirname(fileURLToPath(import.meta.url))
  const packageDir = findToolsPackageDir(currentDir)
  const packageJsonPath = path.join(packageDir, 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('Failed to resolve @mudrichenkoevgeny/web-platform-sdk-tools version from package.json')
  }

  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as { version?: string }
  if (!pkg.version) {
    throw new Error('Failed to resolve @mudrichenkoevgeny/web-platform-sdk-tools version from package.json')
  }

  return pkg.version
}

/**
 * Web Platform SDK Tools & Code Quality Kit.
 * Provides agent rules synchronization, ESLint configs, Dependency Cruiser rules, and CLI utilities for Web applications.
 */

/**
 * Current version of the Web Platform SDK Tools package.
 */
export const WEB_PLATFORM_SDK_TOOLS_VERSION: string = getToolsPackageVersion()

export { runCli } from './cli/cli-runner.js'
export { webSdkEslintConfig, sdkArchPlugin } from './eslint/index.js'
export { webSdkDepcruiseConfig } from './depcruise/index.js'
