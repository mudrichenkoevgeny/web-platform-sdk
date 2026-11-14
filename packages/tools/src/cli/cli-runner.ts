import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { publint } from 'publint'
import { formatMessage } from 'publint/utils'
import { syncAgentRules } from '@mudrichenkoevgeny/shared-foundation/scripts/agent-rules-syncer.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Finds the package root directory for @mudrichenkoevgeny/web-platform-sdk-tools.
 *
 * @param startDir Starting directory for root resolution
 * @returns Resolved package root directory absolute path
 */
function findPackageDir(startDir: string): string {
  let currentDir = path.resolve(startDir)
  while (currentDir !== path.parse(currentDir).root) {
    const packageJsonPath = path.join(currentDir, 'package.json')
    if (fs.existsSync(packageJsonPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
        if (pkg.name === '@mudrichenkoevgeny/web-platform-sdk-tools') {
          return currentDir
        }
      } catch {
        /* Intentionally ignore JSON parse errors during parent traversal */
      }
    }
    currentDir = path.dirname(currentDir)
  }
  return process.cwd()
}

/**
 * Resolves binary executable path for a given node module.
 *
 * @param packageName Module name to resolve
 * @param relativeBinPath Relative path to executable JS script inside package
 * @returns Absolute file path to executable binary
 */
function resolveModuleBin(packageName: string, relativeBinPath: string): string {
  try {
    const resolvedUrl = import.meta.resolve(`${packageName}/package.json`)
    const pkgDir = path.dirname(fileURLToPath(resolvedUrl))
    return path.join(pkgDir, relativeBinPath)
  } catch {
    try {
      const entryUrl = import.meta.resolve(packageName)
      let currentDir = path.dirname(fileURLToPath(entryUrl))
      while (currentDir !== path.parse(currentDir).root) {
        const pkgJsonPath = path.join(currentDir, 'package.json')
        if (fs.existsSync(pkgJsonPath)) {
          return path.join(currentDir, relativeBinPath)
        }
        currentDir = path.dirname(currentDir)
      }
    } catch {
      /* Fallback to package name */
    }
    return packageName
  }
}

/**
 * Supported CLI command types.
 */
export type CliCommand = 'sync' | 'sync-agent-rules' | 'generate' | 'check-exports' | 'api-extract' | 'help'

type CommandHandler = (args: string[]) => Promise<void> | void

/**
 * Runs the Web Platform SDK Tools CLI.
 *
 * @param args CLI arguments array (default: process.argv.slice(2))
 */
export async function runCli(args: string[] = process.argv.slice(2)): Promise<void> {
  const rawCommand = args[0] as CliCommand | undefined
  const commandName: CliCommand = rawCommand && ['sync', 'sync-agent-rules', 'generate', 'check-exports', 'api-extract', 'help'].includes(rawCommand)
    ? rawCommand
    : 'help'

  const packageDir = findPackageDir(__dirname)
  const targetCwd = process.cwd()

  const commandHandlers: Record<CliCommand, CommandHandler> = {
    sync: () => {
      syncAgentRules({
        sourceAgentDir: path.join(packageDir, '.agent/global'),
        relativeTargetSubdir: '.agent/global',
        packageName: 'Web Platform SDK Tools',
        targetRootDir: targetCwd
      })
    },
    'sync-agent-rules': () => {
      syncAgentRules({
        sourceAgentDir: path.join(packageDir, '.agent/global'),
        relativeTargetSubdir: '.agent/global',
        packageName: 'Web Platform SDK Tools',
        targetRootDir: targetCwd
      })
    },
    generate: (cmdArgs: string[]) => {
      const plopfilePath = path.join(packageDir, 'generators/plopfile.mjs')
      const plopBin = resolveModuleBin('plop', 'bin/plop.js')
      const extraArgs = cmdArgs.slice(1).join(' ')

      if (fs.existsSync(plopBin)) {
        execSync(`node "${plopBin}" --plopfile "${plopfilePath}" --dest "${targetCwd}" ${extraArgs}`, { stdio: 'inherit' })
      } else {
        execSync(`npx plop --plopfile "${plopfilePath}" --dest "${targetCwd}" ${extraArgs}`, { stdio: 'inherit' })
      }
    },
    'check-exports': async () => {
      console.log('[web-sdk-tools] Verifying package exports via publint...')
      try {
        const pkgJsonPath = path.join(targetCwd, 'package.json')
        const pkg = fs.existsSync(pkgJsonPath) ? JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8')) : {}
        const { messages } = await publint({ pkgDir: targetCwd })

        if (messages.length === 0) {
          console.log('[web-sdk-tools] All package exports are valid!')
        } else {
          let hasError = false
          messages.forEach((msg) => {
            if (msg.type === 'error') {
              hasError = true
            }
            console.log(formatMessage(msg, pkg))
          })
          if (hasError) {
            process.exitCode = 1
          }
        }
      } catch {
        execSync('npx publint', { stdio: 'inherit' })
      }
    },
    'api-extract': () => {
      console.log('[web-sdk-tools] Extracting public API signatures via API Extractor...')
      const apiExtractorBin = resolveModuleBin('@microsoft/api-extractor', 'bin/api-extractor')
      if (fs.existsSync(apiExtractorBin)) {
        execSync(`node "${apiExtractorBin}" run --local`, { stdio: 'inherit' })
      } else {
        execSync('npx api-extractor run --local', { stdio: 'inherit' })
      }
    },
    help: () => {
      console.log(`
Web Platform SDK Tools CLI v0.1.0

Available Commands:
  web-sdk-tools sync            Synchronize global agent rules into project .agent/global/
  web-sdk-tools generate        Scaffold UseCases or React components
  web-sdk-tools check-exports   Verify package.json exports via publint
  web-sdk-tools api-extract     Verify public API signatures via API Extractor
`)
    }
  }

  const handler = commandHandlers[commandName]
  await handler(args)
}
