// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import tseslint from 'typescript-eslint'
import tsdocPlugin from 'eslint-plugin-tsdoc'
import sdkArchPlugin from './tools/eslint-rules/index.js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const tsdocPluginCompat = {
  ...tsdocPlugin,
  rules: {
    ...tsdocPlugin.rules,
    syntax: {
      ...tsdocPlugin.rules.syntax,
      create(context) {
        const proxyContext = new Proxy(context, {
          get(target, prop, receiver) {
            if (prop === 'parserOptions') {
              return target.languageOptions?.parserOptions ?? {}
            }
            if (prop === 'getSourceCode') {
              return () => target.sourceCode
            }
            if (prop === 'getFilename') {
              return () => target.filename
            }
            return Reflect.get(target, prop, receiver)
          }
        })
        return tsdocPlugin.rules.syntax.create(proxyContext)
      }
    }
  }
}

export default tseslint.config({
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
    'samples/sandbox/**'
  ]
}, ...tseslint.configs.recommended, {
  files: ['**/*.ts', '**/*.tsx'],
  plugins: {
    tsdoc: tsdocPluginCompat,
    'sdk-arch': sdkArchPlugin
  },
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      tsconfigRootDir: __dirname,
      projectService: {
        allowDefaultProject: ['*.ts', '*.d.ts', '*.tsx']
      }
    }
  },
  rules: {
    'tsdoc/syntax': 'off',
    'sdk-arch/no-direct-branded-cast': 'error',
    'sdk-arch/no-throw-in-repo-usecase': 'error',
    'sdk-arch/no-empty-di-array': 'error'
  }
}, {
  rules: {
    'no-inline-comments': 'error',
    'no-warning-comments': [
      'error',
      {
        terms: ['todo', 'fixme'],
        location: 'anywhere'
      }
    ],
    'comma-dangle': ['error', 'never'],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'TSAsExpression[typeAnnotation.type="TSUnknownKeyword"] > TSAsExpression',
        message: 'Double type casting (as unknown as T) is strictly prohibited. Use Type Guards or domain parsers.'
      },
      {
        selector: 'TSAsExpression[typeAnnotation.type="TSAnyKeyword"]',
        message: 'Type assertion to any (as any) is strictly prohibited. Use Type Guards.'
      }
    ]
  }
}, {
  files: ['**/*.test.ts', '**/*.test.tsx', '**/*.stories.tsx', '**/mock/**', 'samples/**', '**/error-id.ts'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'sdk-arch/no-direct-branded-cast': 'off',
    'sdk-arch/no-empty-di-array': 'off',
    'no-restricted-syntax': [
      'error',
      {
        selector: 'TSAsExpression[typeAnnotation.type="TSUnknownKeyword"] > TSAsExpression',
        message: 'Double type casting (as unknown as T) is strictly prohibited.'
      }
    ]
  }
}, storybook.configs["flat/recommended"]);
