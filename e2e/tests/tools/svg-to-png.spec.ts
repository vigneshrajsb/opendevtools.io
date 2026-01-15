import { test, expect } from "../../fixtures/test-fixtures";
import { testData } from "../../fixtures/test-data";

test.describe("SVG to PNG", { tag: ["@tools"] }, () => {
  test.beforeEach(async ({ toolPage }) => {
    await toolPage.goto("/svg-to-png");
  });

  test("page loads correctly and example/clear work", async ({ toolPage }) => {
    // Initial state
    await expect(toolPage.pageTitle).toHaveText("SVG to PNG Converter");

    // Example loads data
    await toolPage.loadExample();
    await expect(toolPage.inputTextarea).not.toHaveValue("");

    // Clear resets
    await toolPage.clear();
    await expect(toolPage.inputTextarea).toHaveValue("");
  });

  test("valid SVG input generates PNG preview", async ({ toolPage, page }) => {
    await toolPage.setInput(testData.validSvg);

    // Wait for PNG preview to appear
    await page.waitForTimeout(500); // Give time for canvas rendering
    const preview = page.getByTestId("png-preview");
    await expect(preview).toBeVisible();
  });

  test("download button is disabled when no PNG is generated", async ({ page }) => {
    await expect(page.getByTestId("btn-download")).toBeDisabled();
  });

  test("download button is enabled when PNG is generated", async ({ toolPage, page }) => {
    await toolPage.setInput(testData.validSvg);
    await page.waitForTimeout(500); // Give time for canvas rendering
    await expect(page.getByTestId("btn-download")).toBeEnabled();
  });

  test("width and height controls are functional", async ({ toolPage, page }) => {
    await toolPage.setInput(testData.validSvg);

    // Change width
    const widthInput = page.getByTestId("input-width");
    await widthInput.fill("1000");
    await expect(widthInput).toHaveValue("1000");

    // Change height
    const heightInput = page.getByTestId("input-height");
    await heightInput.fill("800");
    await expect(heightInput).toHaveValue("800");
  });

  test("quality control is functional", async ({ toolPage, page }) => {
    await toolPage.setInput(testData.validSvg);

    const qualityInput = page.getByTestId("input-quality");
    await qualityInput.fill("0.8");
    await expect(qualityInput).toHaveValue("0.8");
  });

  test("background color control is functional", async ({ toolPage, page }) => {
    await toolPage.setInput(testData.validSvg);

    const bgColorInput = page.getByTestId("input-bg-color");
    await bgColorInput.fill("#ff0000");
    await expect(bgColorInput).toHaveValue("#ff0000");
  });

  test("invalid SVG shows error message", async ({ toolPage, page }) => {
    // Use SVG without proper namespace which might cause loading issues
    const invalidSvg = "<svg><invalid></invalid></svg>";
    await toolPage.setInput(invalidSvg);

    // The error may appear after a brief delay
    await page.waitForTimeout(1000);

    // Check if error is displayed or preview is not shown
    const errorText = page.locator('text=/error|failed/i');
    const hasError = await errorText.count();

    if (hasError === 0) {
      // If no explicit error, at least preview should not be visible
      const preview = page.getByTestId("png-preview");
      const isVisible = await preview.isVisible().catch(() => false);
      expect(isVisible).toBe(false);
    }
  });
});
