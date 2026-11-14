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
 * @param startDir - Starting directory for root resolution
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
 * @param packageName - Module name to resolve
 * @param relativeBinPath - Relative path to executable JS script inside package
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
 * Converts a kebab-case identifier into PascalCase.
 *
 * @param str - Kebab-case string
 * @returns Converted PascalCase string
 */
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

/**
 * Performs string replacements across a target text file.
 *
 * @param filePath - Path to file to interpolate
 * @param replacements - Key-value pair mapping strings to their replacements
 */
function interpolateFile(filePath: string, replacements: Record<string, string>): void {
  const content = fs.readFileSync(filePath, 'utf-8')
  let updated = content

  for (const [key, value] of Object.entries(replacements)) {
    updated = updated.split(key).join(value)
  }

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf-8')
  }
}

/**
 * Recursively walks directory and interpolates supported text files.
 *
 * @param dir - Target directory path
 * @param replacements - Key-value pair mapping strings to their replacements
 */
function walkAndInterpolate(dir: string, replacements: Record<string, string>): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        walkAndInterpolate(fullPath, replacements)
      }
    } else if (entry.isFile()) {
      const isTextFile =
        /\.(json|ts|tsx|js|mjs|cjs|html|md|yaml|yml|css)$/i.test(entry.name) ||
        entry.name === '.npmrc' ||
        entry.name === '.gitignore'
      if (isTextFile) {
        interpolateFile(fullPath, replacements)
      }
    }
  }
}

/**
 * Injects local workspace overrides mapping SDK packages to relative disk paths in pnpm-workspace.yaml.
 *
 * @param packageDir - Root directory path of @mudrichenkoevgeny/web-platform-sdk-tools package
 * @param targetDir - Scaffolded project target directory absolute path
 */
function injectLocalWorkspaceOverrides(packageDir: string, targetDir: string): void {
  const sdkMonorepoRoot = path.resolve(packageDir, '../..')
  const sdkPackagesDir = path.join(sdkMonorepoRoot, 'packages')

  if (!fs.existsSync(sdkPackagesDir)) {
    return
  }

  const entries = fs.readdirSync(sdkPackagesDir, { withFileTypes: true })
  const overridesMap: Record<string, string> = {}

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const pkgJsonPath = path.join(sdkPackagesDir, entry.name, 'package.json')
      if (fs.existsSync(pkgJsonPath)) {
        try {
          const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8')) as { name?: string }
          if (pkg.name && pkg.name.startsWith('@mudrichenkoevgeny/web-platform-sdk-')) {
            const absPkgDir = path.join(sdkPackagesDir, entry.name)
            const relPath = path.relative(targetDir, absPkgDir).replace(/\\/g, '/')
            overridesMap[pkg.name] = `link:${relPath}`
          }
        } catch {
          /* Ignore JSON parse errors */
        }
      }
    }
  }

  if (Object.keys(overridesMap).length === 0) {
    return
  }

  const pnpmWorkspacePath = path.join(targetDir, 'pnpm-workspace.yaml')
  let content = fs.existsSync(pnpmWorkspacePath)
    ? fs.readFileSync(pnpmWorkspacePath, 'utf-8')
    : "packages:\n  - 'apps/*'\n"

  const overridesLines = Object.entries(overridesMap)
    .map(([pkgName, linkPath]) => `  '${pkgName}': '${linkPath}'`)
    .join('\n')

  const overridesBlock = `\noverrides:\n${overridesLines}\n`

  if (content.includes('overrides:')) {
    content = content.replace(/overrides:\s*\n/, `overrides:\n${overridesLines}\n`)
  } else {
    content += overridesBlock
  }

  fs.writeFileSync(pnpmWorkspacePath, content, 'utf-8')
}

/**
 * Supported CLI command types.
 */
export type CliCommand = 'init' | 'sync' | 'sync-agent-rules' | 'generate' | 'check-exports' | 'api-extract' | 'help'

type CommandHandler = (args: string[]) => Promise<void> | void

/**
 * Runs the Web Platform SDK Tools CLI.
 *
 * @param args - CLI arguments array (default: process.argv.slice(2))
 */
export async function runCli(args: string[] = process.argv.slice(2)): Promise<void> {
  const rawCommand = args[0] as CliCommand | undefined
  const commandName: CliCommand = rawCommand && ['init', 'sync', 'sync-agent-rules', 'generate', 'check-exports', 'api-extract', 'help'].includes(rawCommand)
    ? rawCommand
    : 'help'

  const packageDir = findPackageDir(__dirname)
  const targetCwd = process.cwd()

  const toolsPackageJsonPath = path.join(packageDir, 'package.json')
  if (!fs.existsSync(toolsPackageJsonPath)) {
    throw new Error(`Failed to locate package.json for @mudrichenkoevgeny/web-platform-sdk-tools at ${toolsPackageJsonPath}`)
  }

  const pkgJson = JSON.parse(fs.readFileSync(toolsPackageJsonPath, 'utf-8'))
  if (!pkgJson.version) {
    throw new Error(`Package version is missing in ${toolsPackageJsonPath}`)
  }
  const toolsVersion = pkgJson.version as string

  const commandHandlers: Record<CliCommand, CommandHandler> = {
    init: async (cmdArgs: string[]) => {
      const scaffoldType = cmdArgs[1] as 'workspace' | 'client' | 'admin' | undefined
      const scaffoldName = cmdArgs[2]
      const skipInstall = cmdArgs.includes('--skip-install')
      const linkLocal = cmdArgs.includes('--link-local')

      if (!scaffoldType || !['workspace', 'client', 'admin'].includes(scaffoldType)) {
        throw new Error(
          'Invalid or missing scaffold type. Usage: web-sdk-tools init <workspace|client|admin> <name> [--skip-install] [--link-local]'
        )
      }

      if (!scaffoldName || !/^[a-z][a-z0-9-]*$/.test(scaffoldName)) {
        throw new Error(
          `Invalid project name "${scaffoldName ?? ''}". Project name must be a valid kebab-case string (e.g. "my-app" or "my-project").`
        )
      }

      const templatesDir = path.join(packageDir, 'templates')
      if (!fs.existsSync(templatesDir)) {
        throw new Error(
          `Templates directory missing at ${templatesDir}. Please build @mudrichenkoevgeny/web-platform-sdk-tools first.`
        )
      }

      const cwdBasename = path.basename(targetCwd)
      let targetDir: string
      if (cwdBasename === `${scaffoldName}-web` || cwdBasename === scaffoldName) {
        targetDir = targetCwd
      } else {
        const existingEntries = fs.existsSync(targetCwd) ? fs.readdirSync(targetCwd) : []
        if (existingEntries.length === 0) {
          targetDir = targetCwd
        } else {
          targetDir = path.join(targetCwd, `${scaffoldName}-web`)
        }
      }

      if (fs.existsSync(targetDir)) {
        const conflictFiles = ['package.json', 'apps', 'pnpm-workspace.yaml']
        for (const conflict of conflictFiles) {
          if (fs.existsSync(path.join(targetDir, conflict))) {
            throw new Error(
              `Target directory "${targetDir}" already contains conflicting "${conflict}". Aborting to prevent overwriting existing files.`
            )
          }
        }
      } else {
        fs.mkdirSync(targetDir, { recursive: true })
      }

      console.log(`[web-sdk-tools] Scaffolding ${scaffoldType} project "${scaffoldName}" into ${targetDir}...`)

      const workspaceTemplateDir = path.join(templatesDir, 'workspace')
      if (fs.existsSync(workspaceTemplateDir)) {
        fs.cpSync(workspaceTemplateDir, targetDir, { recursive: true })
      }

      const appsDir = path.join(targetDir, 'apps')
      fs.mkdirSync(appsDir, { recursive: true })

      if (scaffoldType === 'workspace' || scaffoldType === 'client') {
        const clientTemplateDir = path.join(templatesDir, 'client')
        if (fs.existsSync(clientTemplateDir)) {
          fs.cpSync(clientTemplateDir, path.join(appsDir, 'client'), { recursive: true })
        }
      }

      if (scaffoldType === 'workspace' || scaffoldType === 'admin') {
        const adminTemplateDir = path.join(templatesDir, 'admin')
        if (fs.existsSync(adminTemplateDir)) {
          fs.cpSync(adminTemplateDir, path.join(appsDir, 'admin'), { recursive: true })
        }
      }

      const pascalName = toPascalCase(scaffoldName)
      const replacements: Record<string, string> = {
        '{{projectName}}': scaffoldName,
        '{{PascalProjectName}}': pascalName,
        '{{pascalCase projectName}}': pascalName,
        '{{sdkVersion}}': toolsVersion
      }

      walkAndInterpolate(targetDir, replacements)

      if (linkLocal) {
        console.log('[web-sdk-tools] Injecting local workspace overrides (--link-local specified)...')
        injectLocalWorkspaceOverrides(packageDir, targetDir)
      }

      console.log(`[web-sdk-tools] Scaffolding complete for "${scaffoldName}".`)

      if (!skipInstall) {
        console.log('[web-sdk-tools] Running pnpm install...')
        try {
          execSync('pnpm install', { cwd: targetDir, stdio: 'inherit' })
        } catch {
          console.warn('[web-sdk-tools] Warning: pnpm install encountered issues. You may need to run "pnpm install" manually.')
        }

        console.log('[web-sdk-tools] Synchronizing agent rules...')
        try {
          syncAgentRules({
            sourceAgentDir: path.join(packageDir, '.agent/global'),
            relativeTargetSubdir: '.agent/global',
            packageName: 'Web Platform SDK Tools',
            targetRootDir: targetDir
          })
        } catch {
          console.warn('[web-sdk-tools] Warning: Agent rules sync completed with warnings.')
        }
      } else {
        console.log('[web-sdk-tools] Skipping pnpm install and sync (--skip-install specified).')
      }

      console.log(`
Project "${scaffoldName}" successfully scaffolded at ${targetDir}!
`)
    },
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
Web Platform SDK Tools CLI v${toolsVersion}

Available Commands:
  web-sdk-tools init <type> <name> [--skip-install] [--link-local]  Scaffold new project (type: workspace|client|admin)
  web-sdk-tools sync                                                Synchronize global agent rules into project .agent/global/
  web-sdk-tools generate                                           Scaffold UseCases or React components
  web-sdk-tools check-exports                                      Verify package.json exports via publint
  web-sdk-tools api-extract                                         Verify public API signatures via API Extractor
`)
    }
  }

  const handler = commandHandlers[commandName]
  await handler(args)
}
