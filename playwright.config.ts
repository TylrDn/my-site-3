import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  maxFailures: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [
        ['line'],
        ['junit', { outputFile: 'test-results/junit.xml' }],
      ]
    : [['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4173',
    timezoneId: 'UTC',
  },
  webServer: {
    command: 'vite public --port 4173',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
  coverage: {
    provider: 'v8',
    include: ['src/**/*.js', 'public/**/*.js'],
    thresholds: {
      global: { lines: 80, branches: 80, functions: 80, statements: 80 },
    },
  },
});
