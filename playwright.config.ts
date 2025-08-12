import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:4173',
  },
  webServer: {
    command: 'vite public --port 4173',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
