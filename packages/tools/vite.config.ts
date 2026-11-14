import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { fileURLToPath, URL } from 'node:url'

/**
 * Locates the root workspace directory containing pnpm-workspace.yaml.
 *
 * @param startDir - Directory path to start traversing upwards from
 * @returns Absolute path to workspace root directory
 */
function findWorkspaceRoot(startDir: string): string {
  let currentDir = path.resolve(startDir)
  while (currentDir !== path.parse(currentDir).root) {
    if (fs.existsSync(path.join(currentDir, 'pnpm-workspace.yaml'))) {
      return currentDir
    }
    currentDir = path.dirname(currentDir)
  }
  return process.cwd()
}

/**
 * Vite plugin that synchronizes global agent rules into packages/tools/.agent/global.
 *
 * @returns Vite plugin object
 */
function copyAgentRulesPlugin() {
  return {
    name: 'copy-agent-rules',
    buildStart() {
      const currentFileDir = fileURLToPath(new URL('.', import.meta.url))
      const rootDir = findWorkspaceRoot(currentFileDir)
      const rootAgentGlobal = path.join(rootDir, '.agent/global')
      const targetAgentGlobal = path.join(currentFileDir, '.agent/global')

      if (fs.existsSync(rootAgentGlobal)) {
        fs.rmSync(targetAgentGlobal, { recursive: true, force: true })
        fs.mkdirSync(targetAgentGlobal, { recursive: true })
        fs.cpSync(rootAgentGlobal, targetAgentGlobal, { recursive: true, force: true })
      }
    }
  }
}

/**
 * Vite plugin that extracts application templates from samples/ into packages/tools/templates.
 *
 * @returns Vite plugin object
 */
function copyTemplatesPlugin() {
  return {
    name: 'copy-templates',
    buildStart() {
      const currentFileDir = fileURLToPath(new URL('.', import.meta.url))
      const rootDir = findWorkspaceRoot(currentFileDir)
      const templatesDir = path.join(currentFileDir, 'templates')

      fs.rmSync(templatesDir, { recursive: true, force: true })
      fs.mkdirSync(templatesDir, { recursive: true })

      const toolsPkgPath = path.join(currentFileDir, 'package.json')
      if (!fs.existsSync(toolsPkgPath)) {
        throw new Error(`Failed to locate package.json for @mudrichenkoevgeny/web-platform-sdk-tools at ${toolsPkgPath}`)
      }
      const toolsPkg = JSON.parse(fs.readFileSync(toolsPkgPath, 'utf-8'))
      if (!toolsPkg.version) {
        throw new Error(`Package version is missing in ${toolsPkgPath}`)
      }
      const sdkVersion = toolsPkg.version as string

      const rootPkgPath = path.join(rootDir, 'package.json')
      if (!fs.existsSync(rootPkgPath)) {
        throw new Error(`Failed to locate root package.json at ${rootPkgPath}`)
      }
      const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf-8'))
      if (!rootPkg.packageManager) {
        throw new Error(`packageManager field is missing in ${rootPkgPath}`)
      }
      const packageManager = rootPkg.packageManager as string

      /**
       * Recursively copies source directory contents to destination with filtering and transformations.
       *
       * @param srcDir - Source directory absolute path
       * @param destDir - Target destination directory absolute path
       * @param transformContent - Optional text transformer function
       * @param transformPkgJson - Optional package.json object transformer function
       */
      const copyDir = (
        srcDir: string,
        destDir: string,
        transformContent?: (filePath: string, content: string) => string,
        transformPkgJson?: (pkg: Record<string, any>) => Record<string, any>
      ) => {
        fs.mkdirSync(destDir, { recursive: true })
        const entries = fs.readdirSync(srcDir, { withFileTypes: true })
        const excludedDirs = new Set(['node_modules', 'dist', '.vitest-cache', 'build', 'coverage', '.tanstack', '.turbo', '.cache'])
        const excludedFiles = new Set(['.env.local', 'tsconfig.tsbuildinfo'])

        for (const entry of entries) {
          const srcPath = path.join(srcDir, entry.name)
          const destPath = path.join(destDir, entry.name)

          if (entry.isDirectory()) {
            if (!excludedDirs.has(entry.name)) {
              copyDir(srcPath, destPath, transformContent, transformPkgJson)
            }
          } else if (entry.isFile()) {
            if (excludedFiles.has(entry.name)) {
              continue
            }
            if (entry.name === 'package.json' && transformPkgJson) {
              const raw = fs.readFileSync(srcPath, 'utf-8')
              const pkgObj = JSON.parse(raw)
              const updatedObj = transformPkgJson(pkgObj)
              fs.writeFileSync(destPath, JSON.stringify(updatedObj, null, 2) + '\n', 'utf-8')
            } else if (entry.name === 'tsconfig.json') {
              const raw = fs.readFileSync(srcPath, 'utf-8')
              const tsconfigObj = JSON.parse(raw)
              if (tsconfigObj.compilerOptions?.paths) {
                const paths = tsconfigObj.compilerOptions.paths
                for (const key of Object.keys(paths)) {
                  if (key.startsWith('@mudrichenkoevgeny/web-platform-sdk-')) {
                    delete paths[key]
                  }
                }
              }
              fs.writeFileSync(destPath, JSON.stringify(tsconfigObj, null, 2) + '\n', 'utf-8')
            } else {
              const isTextFile =
                /\.(json|ts|tsx|js|mjs|cjs|html|md|yaml|yml|css)$/i.test(entry.name) ||
                entry.name === '.npmrc' ||
                entry.name === '.gitignore'
              if (isTextFile && transformContent) {
                const content = fs.readFileSync(srcPath, 'utf-8')
                const updated = transformContent(srcPath, content)
                fs.writeFileSync(destPath, updated, 'utf-8')
              } else {
                fs.copyFileSync(srcPath, destPath)
              }
            }
          }
        }
      }

      const sampleClientDir = path.join(rootDir, 'samples/client-app')
      const templateClientDir = path.join(templatesDir, 'client')
      if (fs.existsSync(sampleClientDir)) {
        copyDir(
          sampleClientDir,
          templateClientDir,
          (_filePath, content) => content.replace(/ClientAppComponent/g, '{{PascalProjectName}}ClientAppComponent'),
          (pkg) => {
            const updated = { ...pkg, name: '@{{projectName}}/client' }
            if (updated.dependencies) {
              for (const dep of Object.keys(updated.dependencies)) {
                if (dep.startsWith('@mudrichenkoevgeny/web-platform-sdk-')) {
                  updated.dependencies[dep] = '^{{sdkVersion}}'
                }
              }
            }
            if (updated.devDependencies) {
              for (const dep of Object.keys(updated.devDependencies)) {
                if (dep.startsWith('@mudrichenkoevgeny/web-platform-sdk-')) {
                  updated.devDependencies[dep] = '^{{sdkVersion}}'
                }
              }
            }
            return updated
          }
        )
      }

      const sampleAdminDir = path.join(rootDir, 'samples/management-app')
      const templateAdminDir = path.join(templatesDir, 'admin')
      if (fs.existsSync(sampleAdminDir)) {
        copyDir(
          sampleAdminDir,
          templateAdminDir,
          (_filePath, content) => content.replace(/ManagementAppComponent/g, '{{PascalProjectName}}ManagementAppComponent'),
          (pkg) => {
            const updated = { ...pkg, name: '@{{projectName}}/admin' }
            if (updated.dependencies) {
              for (const dep of Object.keys(updated.dependencies)) {
                if (dep.startsWith('@mudrichenkoevgeny/web-platform-sdk-')) {
                  updated.dependencies[dep] = '^{{sdkVersion}}'
                }
              }
            }
            if (updated.devDependencies) {
              for (const dep of Object.keys(updated.devDependencies)) {
                if (dep.startsWith('@mudrichenkoevgeny/web-platform-sdk-')) {
                  updated.devDependencies[dep] = '^{{sdkVersion}}'
                }
              }
            }
            return updated
          }
        )
      }

      const templateWorkspaceDir = path.join(templatesDir, 'workspace')
      fs.mkdirSync(templateWorkspaceDir, { recursive: true })

      const workspacePkg = {
        name: '{{projectName}}-web',
        private: true,
        type: 'module',
        packageManager,
        scripts: {
          build: 'pnpm -r run build',
          test: 'pnpm -r exec vitest run --passWithNoTests',
          lint: 'eslint . --max-warnings 0',
          depcruise: 'depcruise --config .dependency-cruiser.js apps',
          typecheck: 'pnpm -r run typecheck',
          sync: 'web-sdk-tools sync'
        },
        devDependencies: {
          '@mudrichenkoevgeny/web-platform-sdk-tools': '^{{sdkVersion}}',
          'dependency-cruiser': '^16.10.0',
          eslint: 'catalog:',
          typescript: 'catalog:',
          vitest: 'catalog:'
        }
      }
      fs.writeFileSync(
        path.join(templateWorkspaceDir, 'package.json'),
        JSON.stringify(workspacePkg, null, 2) + '\n',
        'utf-8'
      )

      const rootPnpmWorkspacePath = path.join(rootDir, 'pnpm-workspace.yaml')
      let pnpmWorkspaceContent = "packages:\n  - 'apps/*'\n"
      if (fs.existsSync(rootPnpmWorkspacePath)) {
        const rootPnpmWorkspace = fs.readFileSync(rootPnpmWorkspacePath, 'utf-8')
        const packagesRegex = /packages:\s*\n(\s*-[^\n]*\n)*/
        pnpmWorkspaceContent = rootPnpmWorkspace.replace(
          packagesRegex,
          "packages:\n  - 'apps/*'\n\n"
        )
      }
      if (!pnpmWorkspaceContent.includes('onlyBuiltDependencies:')) {
        pnpmWorkspaceContent += "\nonlyBuiltDependencies:\n  - '@mudrichenkoevgeny/shared-foundation'\n  - '@mudrichenkoevgeny/web-platform-sdk-tools'\n  - 'esbuild'\n  - 'msw'\n"
      } else {
        const requiredBuiltDeps = [
          '@mudrichenkoevgeny/shared-foundation',
          '@mudrichenkoevgeny/web-platform-sdk-tools',
          'esbuild',
          'msw'
        ]
        for (const dep of requiredBuiltDeps) {
          if (!pnpmWorkspaceContent.includes(dep)) {
            pnpmWorkspaceContent = pnpmWorkspaceContent.replace(
              /onlyBuiltDependencies:\s*\n/,
              `onlyBuiltDependencies:\n  - '${dep}'\n`
            )
          }
        }
      }
      fs.writeFileSync(path.join(templateWorkspaceDir, 'pnpm-workspace.yaml'), pnpmWorkspaceContent, 'utf-8')

      const rootNpmrcPath = path.join(rootDir, '.npmrc')
      if (fs.existsSync(rootNpmrcPath)) {
        fs.copyFileSync(rootNpmrcPath, path.join(templateWorkspaceDir, '.npmrc'))
      }

      const rootTsconfigBasePath = path.join(rootDir, 'tsconfig.base.json')
      if (fs.existsSync(rootTsconfigBasePath)) {
        const tsconfigBaseObj = JSON.parse(fs.readFileSync(rootTsconfigBasePath, 'utf-8'))
        if (tsconfigBaseObj.compilerOptions) {
          delete tsconfigBaseObj.compilerOptions.paths
        }
        fs.writeFileSync(
          path.join(templateWorkspaceDir, 'tsconfig.base.json'),
          JSON.stringify(tsconfigBaseObj, null, 2) + '\n',
          'utf-8'
        )
      }

      const rootGitignorePath = path.join(rootDir, '.gitignore')
      if (fs.existsSync(rootGitignorePath)) {
        fs.copyFileSync(rootGitignorePath, path.join(templateWorkspaceDir, '.gitignore'))
      } else {
        fs.writeFileSync(
          path.join(templateWorkspaceDir, '.gitignore'),
          'node_modules/\ndist/\nbuild/\ncoverage/\n.env.local\n',
          'utf-8'
        )
      }

      fs.writeFileSync(
        path.join(templateWorkspaceDir, 'vitest.workspace.ts'),
        "import { defineWorkspace } from 'vitest/config'\n\nexport default defineWorkspace([\n  'apps/*'\n])\n",
        'utf-8'
      )

      fs.writeFileSync(
        path.join(templateWorkspaceDir, 'eslint.config.js'),
        "import webSdkEslintConfig from '@mudrichenkoevgeny/web-platform-sdk-tools/eslint'\n\nexport default [\n  ...webSdkEslintConfig\n]\n",
        'utf-8'
      )

      fs.writeFileSync(
        path.join(templateWorkspaceDir, '.dependency-cruiser.js'),
        "import webSdkDepcruiseConfig from '@mudrichenkoevgeny/web-platform-sdk-tools/depcruise'\n\nexport default webSdkDepcruiseConfig\n",
        'utf-8'
      )

      const readmeContent = `# {{PascalProjectName}} Web Applications

Monorepo containing application packages scaffolded using \`@mudrichenkoevgeny/web-platform-sdk-tools\`.

## Workspace Structure

- \`apps/client\` - Consumer Web Application (\`@{{projectName}}/client\`)
- \`apps/admin\` - Administrative Management Application (\`@{{projectName}}/admin\`)

## Available Scripts

- \`pnpm build\` - Build all applications
- \`pnpm test\` - Run test suite across applications
- \`pnpm lint\` - Run ESLint checks
- \`pnpm typecheck\` - Run TypeScript type checking
- \`pnpm depcruise\` - Validate architectural dependency boundaries
- \`pnpm sync\` - Synchronize SDK agent rules into \`.agent/global\`

## Business Logic Integration (@{{projectName}}/shared)

To introduce custom domain use cases, repositories, or contracts:

1. Create a shared workspace package (e.g. \`packages/shared\` or \`@{{projectName}}/shared\`).
2. Add the dependency to client or admin apps:
   \`\`\`bash
   pnpm add @{{projectName}}/shared --filter @{{projectName}}/client
   \`\`\`
3. Wire custom components inside the DI extension slot in \`src/di/client-app-component.ts\` / \`src/di/management-app-component.ts\`.
`
      fs.writeFileSync(path.join(templateWorkspaceDir, 'README.md'), readmeContent, 'utf-8')
    }
  }
}

export default defineConfig(({ command, mode }) => {
  const isTest = mode === 'test' || process.env.NODE_ENV === 'test'
  const plugins = [copyAgentRulesPlugin(), copyTemplatesPlugin()]

  if (!isTest && command === 'build') {
    plugins.push(dts({ rollupTypes: false }))
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    test: {
      name: 'tools',
      globals: true,
      environment: 'node',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
    },
    build: {
      lib: {
        entry: {
          index: './src/index.ts',
          'eslint/index': './src/eslint/index.ts',
          'depcruise/index': './src/depcruise/index.ts'
        },
        name: 'WebPlatformSdkTools',
        formats: ['es']
      },
      rollupOptions: {
        external: [
          /^node:/,
          '@mudrichenkoevgeny/shared-foundation',
          /^@mudrichenkoevgeny\/shared-foundation\//,
          '@typescript-eslint/utils',
          'typescript-eslint',
          'eslint',
          'plop',
          /^publint(\/.*)?$/
        ]
      }
    }
  }
})
