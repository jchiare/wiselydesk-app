import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.PORT || 3000;
const baseURL = `http://localhost:${PORT}`;

// Reference: https://playwright.dev/docs/test-configuration
export default defineConfig({
  timeout: 30 * 1000,
  testDir: "e2e",
  fullyParallel: true,
  outputDir: "test-results/",
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 2 : "75%",
  expect: {
    timeout: 10 * 1000
  },

  webServer: [
    {
      command: "npm run dev",
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 31 * 1000,
      stdout: "pipe"
    },
    {
      command: "npm run test:e2e:server",
      url: "http://localhost:5000",
      reuseExistingServer: !process.env.CI,
      timeout: 31 * 1000,
      stdout: "pipe"
    }
  ],

  use: {
    baseURL,
    trace: "retry-with-trace",
    bypassCSP: true,
    launchOptions: {
      args: ["--disable-web-security"]
    }
  },

  projects: [
    {
      name: "Desktop Chrome",
      use: {
        ...devices["Desktop Chrome"]
      }
    },
    {
      name: "Mobile Chrome",
      use: {
        ...devices["Pixel 5"]
      }
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] }
    }
  ]
});
