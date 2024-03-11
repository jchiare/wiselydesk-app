import { test, expect } from "@playwright/test";

const AI_EN_RESPONSE =
  "As a virtual assistant, I don't have access to personal data unless it has been shared with me in the course of our conversation. I'm designed to respect user privacy and confidentiality. Therefore, I'm unable to check the status of your payment. However, you can check the status of your payment by logging into your AMBOSS account and navigating to the Account > Payment info & Invoices section. If you're still unsure, please reach out to AMBOSS support for further assistance.";
const source = "1. How can I become an AMBOSS mem";

test("should navigate to the chat page for amboss en", async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  page.on("console", msg => {
    if (msg.type() === "error") {
      console.log(`Console error: ${msg.text()}`);
    }
  });

  // Listen for uncaught exceptions within the page
  page.on("pageerror", error => {
    console.log(`Page error: ${error.message}`);
  });
  await page.goto(
    "/chat/amboss?locale=en&client_api_key=7xwzrEf1Fr1_sFIv5c5D6Uqpyzocn2oXrnkl1DnaByQ&model=gpt-3.5-turbo"
  );
  // Welcome message loaded
  await expect(page.getByRole("paragraph")).toContainText(
    "Hi there and welcome to AMBOSS! I'm a virtual assistant and happy to help you with your request."
  );

  // Ask a question
  await page
    .getByPlaceholder("Ask me your questions!")
    .fill("This is from a test");

  // Press Enter
  await page.keyboard.press("Enter");

  await expect(page.getByRole("paragraph").nth(1)).toContainText(
    AI_EN_RESPONSE
  );

  // sleep two seconds to allow server to close SSE connection
  await page.waitForTimeout(2000);

  await expect(page.getByRole("paragraph").nth(1)).toContainText(
    AI_EN_RESPONSE
  );

  await expect(page.getByRole("link")).toContainText(source);
});

test("should navigate to the chat page for amboss de", async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  page.on("console", msg => {
    if (msg.type() === "error") {
      console.log(`Console error: ${msg.text()}`);
    }
  });

  // Listen for uncaught exceptions within the page
  page.on("pageerror", error => {
    console.log(`Page error: ${error.message}`);
  });

  await page.goto(
    "/chat/amboss?locale=de&client_api_key=7xwzrEf1Fr1_sFIv5c5D6Uqpyzocn2oXrnkl1DnaByQ&model=gpt-3.5-turbo"
  );
  // Welcome message loaded
  await expect(page.getByRole("paragraph")).toContainText(
    "Hallo und herzlich Willkommen bei AMBOSS! Ich bin ein virtueller Assistent und stehe dir bei Fragen gerne zur Verfügung!"
  );

  // Ask a question
  await page
    .getByPlaceholder("Wie kann ich dir helfen?")
    .fill("This is from a test");

  // Press Enter
  await page.keyboard.press("Enter");

  await expect(page.getByRole("paragraph").nth(1)).toContainText(
    AI_EN_RESPONSE
  );

  // sleep two seconds to allow server to close SSE connection
  await page.waitForTimeout(2000);

  await expect(page.getByRole("paragraph").nth(1)).toContainText(
    AI_EN_RESPONSE
  );

  await expect(page.getByRole("link")).toContainText(source);
});
