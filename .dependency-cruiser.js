/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-feature-cross-dependencies',
      severity: 'error',
      comment: 'Feature modules must not depend on other feature modules. Use composition in the host app or core modules.',
      from: { path: '^packages/feature-([^/]+)/' },
      to: { path: '^packages/feature-([^/]+)/', pathNot: '^packages/feature-$1/' }
    },
    {
      name: 'core-common-is-sacred',
      severity: 'error',
      comment: 'core-common must not depend on any higher-level layers (features, samples, other cores).',
      from: { path: '^packages/core-common/' },
      to: { path: '^(packages/feature-|packages/core-(?!common)|samples/)' }
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
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.base.json' }
  }
};
