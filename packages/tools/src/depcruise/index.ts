/**
 * Pre-configured Dependency Cruiser rules for Web Platform SDK applications and packages.
 * Enforces architectural module boundaries, core layer isolation, and bans forbidden dependencies.
 */
export const webSdkDepcruiseConfig = {
  forbidden: [
    {
      name: 'no-feature-cross-dependencies',
      severity: 'error',
      comment: 'Feature modules must not depend on other feature modules. Use composition in the host application or core modules.',
      from: { path: '(^packages/feature-[^/]+/src/|.*/feature-[^/]+/src/)' },
      to: { path: '(^packages/feature-[^/]+/src/|.*/feature-[^/]+/src/)', pathNot: '$1' }
    },
    {
      name: 'core-common-is-sacred',
      severity: 'error',
      comment: 'core-common must not depend on any higher-level layers (features, samples, or other cores).',
      from: { path: '(^packages/core-common/src/|.*/core-common/src/)' },
      to: { path: '(packages/feature-|core-(?!common)|samples/)' }
    },
    {
      name: 'ban-axios-and-react-query',
      severity: 'error',
      comment: 'Axios and TanStack Query are strictly forbidden by architectural guidelines.',
      from: {},
      to: { path: 'node_modules/(axios|@tanstack/react-query)' }
    }
  ],
  options: {
    doNotFollow: { path: '(node_modules|dist|build)' },
    exclude: { path: '(dist|build)' },
    tsPreCompilationDeps: true
  }
}
