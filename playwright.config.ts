import { PlaywrightTestConfig, devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./src/tests/e2e/",
  use: {
    trace: "on-first-retry",
    headless: process.env.HEADED ? false : true,
    launchOptions: { slowMo: 2000 },
    extraHTTPHeaders: {
      "x-vercel-protection-bypass":
        process.env.VERCEL_AUTOMATION_BYPASS_SECRET ||
        "p65XLmSQzZEcyP0EcfJWFVNkhzJbMoAg"
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
  ],
  reporter: [["list"], ["json", { outputFile: "test-results.json" }]]
};

export default config;
