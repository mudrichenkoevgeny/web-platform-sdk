export default function (plop) {
  plop.setGenerator('usecase', {
    description: 'Scaffold a new Clean Architecture UseCase and Unit Test',
    prompts: [
      {
        type: 'list',
        name: 'package',
        message: 'Select target package:',
        choices: [
          'core-common',
          'core-security',
          'core-settings',
          'core-storage',
          'feature-user',
          'feature-clientuser',
          'feature-managementuser'
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
        path: 'packages/{{package}}/src/domain/usecase/{{kebabCase name}}-use-case.ts',
        templateFile: 'tools/generators/templates/usecase.ts.hbs'
      },
      {
        type: 'add',
        path: 'packages/{{package}}/src/domain/usecase/{{kebabCase name}}-use-case.test.ts',
        templateFile: 'tools/generators/templates/usecase.test.ts.hbs'
      }
    ]
  })

  plop.setGenerator('component', {
    description: 'Scaffold a new React UI Component folder with Test and Storybook Preview',
    prompts: [
      {
        type: 'list',
        name: 'package',
        message: 'Select target package:',
        choices: [
          'core-common',
          'core-security',
          'core-settings',
          'core-storage',
          'feature-user',
          'feature-clientuser',
          'feature-managementuser'
        ]
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
        path: 'packages/{{package}}/src/presentation/components/{{pascalCase name}}/{{pascalCase name}}.tsx',
        templateFile: 'tools/generators/templates/component.tsx.hbs'
      },
      {
        type: 'add',
        path: 'packages/{{package}}/src/presentation/components/{{pascalCase name}}/{{pascalCase name}}.test.tsx',
        templateFile: 'tools/generators/templates/component.test.tsx.hbs'
      },
      {
        type: 'add',
        path: 'packages/{{package}}/src/presentation/components/{{pascalCase name}}/{{pascalCase name}}.stories.tsx',
        templateFile: 'tools/generators/templates/component.stories.tsx.hbs'
      }
    ]
  })
}
