/**
 * Web Platform SDK Tools & Code Quality Kit.
 * Provides agent rules synchronization, ESLint configs, Dependency Cruiser rules, and CLI utilities for Web applications.
 */

/**
 * Current version of the Web Platform SDK Tools package.
 */
export const WEB_PLATFORM_SDK_TOOLS_VERSION = '0.1.0'

export { runCli } from './cli/cli-runner.js'
export { webSdkEslintConfig, sdkArchPlugin } from './eslint/index.js'
export { webSdkDepcruiseConfig } from './depcruise/index.js'
