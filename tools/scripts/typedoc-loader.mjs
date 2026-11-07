export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'typescript' && context.parentURL && (context.parentURL.includes('typedoc') || context.parentURL.includes('typedoc-plugin'))) {
    return nextResolve('typescript-v5', context)
  }
  return nextResolve(specifier, context)
}
