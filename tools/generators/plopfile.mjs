export default function (plop) {
  plop.setGenerator('usecase', {
    description: 'Scaffold a new Clean Architecture UseCase and Unit Test',
    prompts: [
      {
        type: 'list',
        name: 'module',
        message: 'Select target internal SDK module:',
        choices: [
          'core/common',
          'core/security',
          'core/settings',
          'core/storage',
          'feature/user',
          'feature/client-user',
          'feature/management-user'
        ]
      },
      {
        type: 'input',
        name: 'name',
        message: 'UseCase name (e.g. ResetPassword):'
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'packages/sdk/src/{{module}}/usecase/{{kebabCase name}}-use-case.ts',
        templateFile: 'tools/generators/generators/templates/usecase.ts.hbs'
      },
      {
        type: 'add',
        path: 'packages/sdk/src/{{module}}/usecase/{{kebabCase name}}-use-case.test.ts',
        templateFile: 'tools/generators/generators/templates/usecase.test.ts.hbs'
      }
    ]
  })

  plop.setGenerator('component', {
    description: 'Scaffold a new React UI Component folder with Test and Storybook Preview',
    prompts: [
      {
        type: 'list',
        name: 'module',
        message: 'Select target internal SDK module:',
        choices: [
          'core/common',
          'core/security',
          'core/settings',
          'core/storage',
          'feature/user',
          'feature/client-user',
          'feature/management-user'
        ]
      },
      {
        type: 'input',
        name: 'category',
        message: 'Component category subfolder (e.g. button, input, card):',
        default: 'common'
      },
      {
        type: 'input',
        name: 'name',
        message: 'Component name (e.g. PasswordStrengthMeter):'
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'packages/sdk/src/{{module}}/ui/components/{{kebabCase category}}/{{kebabCase name}}/{{pascalCase name}}.tsx',
        templateFile: 'tools/generators/generators/templates/component.tsx.hbs'
      },
      {
        type: 'add',
        path: 'packages/sdk/src/{{module}}/ui/components/{{kebabCase category}}/{{kebabCase name}}/{{pascalCase name}}.test.tsx',
        templateFile: 'tools/generators/generators/templates/component.test.tsx.hbs'
      },
      {
        type: 'add',
        path: 'packages/sdk/src/{{module}}/ui/components/{{kebabCase category}}/{{kebabCase name}}/{{pascalCase name}}.stories.tsx',
        templateFile: 'tools/generators/generators/templates/component.stories.tsx.hbs'
      }
    ]
  })
}
