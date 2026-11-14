import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default function (plop) {
  plop.setGenerator('usecase', {
    description: 'Scaffold a new Clean Architecture UseCase and Unit Test',
    prompts: [
      {
        type: 'input',
        name: 'package',
        message: 'Target package or directory (e.g. core-common or src):',
        default: 'src'
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
        path: '{{package}}/usecase/{{pascalCase name}}UseCase.ts',
        templateFile: path.join(__dirname, 'templates/usecase.ts.hbs')
      },
      {
        type: 'add',
        path: '{{package}}/usecase/{{pascalCase name}}UseCase.test.ts',
        templateFile: path.join(__dirname, 'templates/usecase.test.ts.hbs')
      }
    ]
  })

  plop.setGenerator('component', {
    description: 'Scaffold a new React UI Component folder with Test and Storybook Preview',
    prompts: [
      {
        type: 'input',
        name: 'package',
        message: 'Target package or directory (e.g. feature-clientuser or src):',
        default: 'src'
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
        path: '{{package}}/ui/components/{{kebabCase category}}/{{kebabCase name}}/{{pascalCase name}}.tsx',
        templateFile: path.join(__dirname, 'templates/component.tsx.hbs')
      },
      {
        type: 'add',
        path: '{{package}}/ui/components/{{kebabCase category}}/{{kebabCase name}}/{{pascalCase name}}.test.tsx',
        templateFile: path.join(__dirname, 'templates/component.test.tsx.hbs')
      },
      {
        type: 'add',
        path: '{{package}}/ui/components/{{kebabCase category}}/{{kebabCase name}}/{{pascalCase name}}.stories.tsx',
        templateFile: path.join(__dirname, 'templates/component.stories.tsx.hbs')
      }
    ]
  })
}
