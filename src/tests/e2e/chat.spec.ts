import { test, expect } from "@playwright/test";

const AI_EN_RESPONSE =
  "As a virtual assistant, I don't have access to personal data unless it has been shared with me in the course of our conversation. I'm designed to respect user privacy and confidentiality. Therefore, I'm unable to check the status of your payment. However, you can check the status of your payment by logging into your AMBOSS account and navigating to the Account > Payment info & Invoices section. If you're still unsure, please reach out to AMBOSS support for further assistance.";
const source = "1. How can I become an AMBOSS mem";

test("Demo page interaction", async ({ page }) => {
  // bypass prompt
  await page.context().addInitScript(() => {
    localStorage.setItem("wiselydesk-local-testing", "true");
  });

  // Navigate to the demo page
  await page.goto("/demo-nm12x.html");

  // Click the button on the bottom right
  await page.click('button[aria-label="Open support widget"]');

  // Wait for 3 seconds
  await page.waitForSelector('iframe[id="wiselyDeskIframe"]');

  const iframe = page.frameLocator("#wiselyDeskIframe");

  // Wait for the iframe to load
  // await iframe.

  // await page.waitForSelector(
  //   frameLocator("#wiselyDeskIframe").locator("form div").nth(1)
  // );

  // Input chat text

  await iframe.getByPlaceholder("Ask me your questions!").fill("Heyyyaa");

  await page.waitForTimeout(2000);

  // Press Enter key
  await iframe
    .getByPlaceholder("Ask me your questions!")
    .press("Enter", { delay: 500 });

  await expect(async () => {
    await iframe.getByTestId("123");
    const updates = await iframe.$$eval(".sse-update", elements =>
      elements.map(el => el.textContent)
    );
    expect(updates.length).toBeGreaterThan(0);
    expect(updates[0]).toContain("Update 1");
  }).toPass();

  await page.waitForTimeout(15000);

  // Wait for the SSE response to finish
  await page.waitForSelector(
    '.message:has-text("I can\'t find information about your")',
    { timeout: 30000 }
  );

  // Check if the response contains the expected text
  const responseText = await page.textContent(".message:last-child");
  expect(responseText).toContain("I can't find information about your");
});
