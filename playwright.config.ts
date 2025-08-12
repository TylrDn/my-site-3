import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:4173',
  },
  webServer: {

    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
