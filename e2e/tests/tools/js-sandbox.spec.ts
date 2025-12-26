import { test, expect } from "../../fixtures/test-fixtures";

test.describe("JavaScript Sandbox", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/js-sandbox");
  });

  test("page loads with correct title", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("JavaScript Sandbox");
  });

  test("Example button loads sample code", async ({ page }) => {
    await page.getByTestId("btn-example").click();
    const editor = page.getByTestId("tool-input");
    await expect(editor).not.toBeEmpty();
  });

  test("Run button executes code and shows output", async ({ page }) => {
    await page.getByTestId("btn-example").click();
    await page.getByTestId("btn-run").click();
    await page.waitForTimeout(1000);

    const consoleOutput = page.getByTestId("tool-output");
    await expect(consoleOutput).toBeVisible();
  });

  test("Clear button is visible and clickable", async ({ page }) => {
    const clearButton = page.getByTestId("btn-clear");
    await expect(clearButton).toBeVisible();
    await clearButton.click();
  });

  test("Stop button is visible", async ({ page }) => {
    const stopButton = page.getByTestId("btn-stop");
    await expect(stopButton).toBeVisible();
  });

  test("Copy button is visible", async ({ page }) => {
    const copyButton = page.getByTestId("btn-copy");
    await expect(copyButton).toBeVisible();
  });
});
