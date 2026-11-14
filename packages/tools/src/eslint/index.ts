import type { TSESLint } from '@typescript-eslint/utils'
import { sdkArchPlugin } from './sdk-arch-plugin.js'

/**
 * Pre-configured flat ESLint rules array for Web Platform SDK applications and packages.
 * Includes custom architectural AST rules, formatting constraints, and type safety rules.
 */
export const webSdkEslintConfig: TSESLint.FlatConfig.ConfigArray = [
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.storybook/**',
      '**/storybook-static/**',
      '**/coverage/**',
      '**/vite.config.ts',
      '**/vite-env.d.ts',
      '**/*.config.mjs',
      '**/*.config.js',
      'tools/**',
      'e2e/**',
      'docs/**'
    ]
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      'sdk-arch': sdkArchPlugin
    },
    rules: {
      'sdk-arch/no-direct-branded-cast': 'error',
      'sdk-arch/no-throw-in-repo-usecase': 'error',
      'sdk-arch/no-empty-di-array': 'error',
      'no-inline-comments': 'error'
    }
  }
]

export { sdkArchPlugin }
export default webSdkEslintConfig
