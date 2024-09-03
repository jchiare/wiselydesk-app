import { PlaywrightTestConfig, devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./src/tests/e2e/",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    headless: process.env.HEADED ? false : true,
    launchOptions: { slowMo: 200 }
  },
  projects: [
    {}
    // {
    // name: "chromium",
    // use: { ...devices["Desktop Chrome"] }
    // }
    // {
    // name: "firefox",
    // use: devices["Desktop Firefox"]
    // }
    // {
    // name: "webkit",
    // use: devices["Desktop Safari"]
    // }
  ]
};

export default config;
