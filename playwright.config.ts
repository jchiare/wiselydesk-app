import { PlaywrightTestConfig, devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./src/tests/e2e/",
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    headless: process.env.HEADED ? false : true,
    launchOptions: { slowMo: 2000 },
    extraHTTPHeaders: {
      "x-vercel-protection-bypass": process.env.VERCEL_AUTOMATION_BYPASS_SECRET!
    }
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
