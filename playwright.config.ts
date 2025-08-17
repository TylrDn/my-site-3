import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['html',  { outputFolder: 'playwright-report', open: 'never' }]
  ],
  use: {
    baseURL: 'http://localhost:4173',
  },
  webServer: {
    command: 'node scripts/serve.mjs',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
