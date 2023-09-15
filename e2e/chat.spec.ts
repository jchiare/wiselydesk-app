import { test, expect } from "@playwright/test";

test("should navigate to the chat page for amboss en", async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto(
    "/chat/amboss?locale=en&client_api_key=hYn1picbsJfRm6vNUMOKv1ANYFSD4mZNTgsiw7LdHnE&create_support_ticket=true"
  );
  // Welcome message loaded
  await expect(page.getByRole("paragraph")).toContainText(
    "Hi there and welcome to AMBOSS! I'm a virtual assistant and happy to help you with your request."
  );
});
