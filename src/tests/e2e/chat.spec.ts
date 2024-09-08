import { test, expect } from "@playwright/test";

const BASE_URL =
  process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000";

test("Demo page interaction", async ({ page }) => {
  // Set local storage before navigating to the page
  await page.context().addInitScript(() => {
    localStorage.setItem("wiselydesk-local-testing", "true");
  });

  // Navigate to the demo page
  await page.goto(`${BASE_URL}/demo-nm12x.html?en-us`);
  // Click the button on the bottom right
  await page.getByRole("button", { name: "Open support widget" }).click();

  await page.waitForSelector("#wiselyDeskIframe");

  await page
    .frameLocator("#wiselyDeskIframe")
    .getByPlaceholder("Ask me your questions!")
    .fill("hello");

  await page
    .frameLocator("#wiselyDeskIframe")
    .getByRole("button", { name: "Input for Chat" })
    .click();

  await expect(
    page
      .frameLocator("#wiselyDeskIframe")
      .getByText(
        "Hello! How can I assist you today with AMBOSS-related questions?"
      )
  ).toBeVisible();
});
