import { register } from 'node:module'
import { pathToFileURL } from 'node:url'

register(pathToFileURL('./tools/scripts/typedoc-loader.mjs').href)

const { Application } = await import('typedoc')

const app = await Application.bootstrapWithPlugins({
  options: './tools/config/typedoc.json'
})

const project = await app.convert()

if (project) {
  await app.generateDocs(project, app.options.getValue('out'))
} else {
  console.error('TypeDoc failed to convert project.')
  process.exit(1)
}
