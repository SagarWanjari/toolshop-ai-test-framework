import { defineConfig, devices } from '@playwright/test';
import dotenv from "dotenv"
dotenv.config();

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  timeout: 45000,
  expect : { timeout: 10000 },

  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['json',{ outputFile: 'reports/results.json' }]
  ],
  
  use: {
    baseURL: process.env.BASE_URL || 'https://practicesoftwaretesting.com/',
    // headless: false,
    screenshot : 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout : 30000,
    trace: 'on-first-retry',
    viewport: null,
    launchOptions: {
    args: ['--start-maximized']
  },
  },

  projects: [
    {name : 'setup', testMatch: /.*\.setup\.ts/},
    {
      name: 'chromium',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        storageState: 'src/.auth/user.json',
      }
    },

    {
      name: 'firefox',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'src/.auth/user.json',
      }
    },

    {
      name: 'webkit',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Safari'],
        storageState: 'src/.auth/user.json',
      }
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      dependencies: ['setup'],
      use: {
        ...devices['Pixel 5'],
        storageState: 'src/.auth/user.json',
      }
    },
    {
      name: 'Mobile Safari',
      dependencies: ['setup'],
      use: {
        ...devices['iPhone 15'],
        storageState: 'src/.auth/user.json',
      }
    },

  ],
});
