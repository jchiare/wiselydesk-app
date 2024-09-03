import { test, expect } from "@playwright/test";

const AI_EN_RESPONSE =
  "As a virtual assistant, I don't have access to personal data unless it has been shared with me in the course of our conversation. I'm designed to respect user privacy and confidentiality. Therefore, I'm unable to check the status of your payment. However, you can check the status of your payment by logging into your AMBOSS account and navigating to the Account > Payment info & Invoices section. If you're still unsure, please reach out to AMBOSS support for further assistance.";
const source = "1. How can I become an AMBOSS mem";

test("Demo page interaction", async ({ page }) => {
  // Set local storage before navigating to the page
  await page.context().addInitScript(() => {
    localStorage.setItem("wiselydesk-local-testing", "true");
  });

  // Navigate to the demo page
  await page.goto("/demo-nm12x.html?testingok1289");

  // Handle the prompt on page load
  page.on("dialog", async dialog => {
    expect(dialog.type()).toBe("prompt");
    await dialog.accept("amboss");
  });

  // Click the button on the bottom right
  await page.click('button:has-text("Ask AI")');

  // Type "hello" into the input field
  await page.fill('input[placeholder="Ask a question"]', "hello");

  // Wait for the SSE response to finish
  await page.waitForSelector(
    '.message:has-text("I can\'t find information about your")',
    { timeout: 10000 }
  );

  // Check if the response contains the expected text
  const responseText = await page.textContent(".message:last-child");
  expect(responseText).toContain("I can't find information about your");
});
