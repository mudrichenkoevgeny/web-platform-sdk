import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.storybook/**',
      '**/coverage/**'
    ]
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ]
    }
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.stories.tsx', '**/mock/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
)
