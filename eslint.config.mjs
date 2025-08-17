import globals from 'globals';

export default [
  {
    files: ['**/*.{js,mjs,ts}'],
    ignores: ['public/**/*', 'archive/**/*', 'node_modules'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
        $w: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  }
];
