import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { fileURLToPath, URL } from 'node:url'

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

function copyAgentRulesPlugin() {
  return {
    name: 'copy-agent-rules',
    buildStart() {
      const currentFileDir = fileURLToPath(new URL('.', import.meta.url))
      const rootDir = findWorkspaceRoot(currentFileDir)
      const rootAgentGlobal = path.join(rootDir, '.agent/global')
      const targetAgentGlobal = path.join(currentFileDir, '.agent/global')

      if (fs.existsSync(rootAgentGlobal)) {
        fs.mkdirSync(targetAgentGlobal, { recursive: true })
        fs.cpSync(rootAgentGlobal, targetAgentGlobal, { recursive: true, force: true })
      }
    }
  }
}

export default defineConfig(({ command, mode }) => {
  const isTest = mode === 'test' || process.env.NODE_ENV === 'test'
  const plugins = [copyAgentRulesPlugin()]

  if (!isTest && command === 'build') {
    plugins.push(dts({ rollupTypes: true }))
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
        external: ['node:fs', 'node:path', 'node:url']
      }
    }
  }
})
