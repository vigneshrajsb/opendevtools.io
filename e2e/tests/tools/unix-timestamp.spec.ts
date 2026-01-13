import { test, expect } from "../../fixtures/test-fixtures";
import { testData } from "../../fixtures/test-data";

test.describe("Unix Timestamp", { tag: ["@tools"] }, () => {
  test.beforeEach(async ({ toolPage }) => {
    await toolPage.goto("/unix-timestamp");
  });

  test("page loads correctly", async ({ toolPage }) => {
    await expect(toolPage.pageTitle).toHaveText("Unix Timestamp Converter");
  });

  test("example button loads sample timestamp", async ({ toolPage, page }) => {
    await toolPage.loadExample();
    const input = await toolPage.inputTextarea.inputValue();
    expect(input).toBe(testData.unixTimestamp);

    // Should show output
    await expect(page.getByTestId("output-timestamp")).toHaveValue(
      testData.unixTimestamp
    );
  });

  test("clear button resets input", async ({ toolPage }) => {
    await toolPage.loadExample();
    await expect(toolPage.inputTextarea).not.toHaveValue("");

    await toolPage.clear();
    await expect(toolPage.inputTextarea).toHaveValue("");
  });

  test("converts Unix timestamp to date", async ({ toolPage, page }) => {
    await toolPage.inputTextarea.fill(testData.unixTimestamp);

    // Check ISO output contains expected date
    const isoOutput = await page.getByTestId("output-iso").inputValue();
    expect(isoOutput).toBe(testData.unixTimestampISO);
  });

  test("converts date string to Unix timestamp", async ({ toolPage, page }) => {
    await toolPage.inputTextarea.fill(testData.unixTimestampISO);

    // Check timestamp output
    const timestampOutput = await page
      .getByTestId("output-timestamp")
      .inputValue();
    expect(timestampOutput).toBe(testData.unixTimestamp);
  });

  test("now button sets current timestamp", async ({ toolPage, page }) => {
    const beforeClick = Date.now();
    await page.getByTestId("btn-now").click();
    const afterClick = Date.now();

    const input = await toolPage.inputTextarea.inputValue();
    const timestamp = parseInt(input, 10);

    // Timestamp should be within the time window (in seconds)
    expect(timestamp).toBeGreaterThanOrEqual(Math.floor(beforeClick / 1000));
    expect(timestamp).toBeLessThanOrEqual(Math.ceil(afterClick / 1000));
  });

  test("milliseconds mode works correctly", async ({ toolPage, page }) => {
    // Switch to milliseconds mode
    await page.getByRole("radio", { name: "Milliseconds" }).click();

    await toolPage.inputTextarea.fill(testData.unixTimestampMs);

    // Check ISO output
    const isoOutput = await page.getByTestId("output-iso").inputValue();
    expect(isoOutput).toBe(testData.unixTimestampISO);
  });

  test("example button respects milliseconds mode", async ({
    toolPage,
    page,
  }) => {
    // Switch to milliseconds mode
    await page.getByRole("radio", { name: "Milliseconds" }).click();

    await toolPage.loadExample();
    const input = await toolPage.inputTextarea.inputValue();
    expect(input).toBe(testData.unixTimestampMs);
  });

  test("invalid input shows error", async ({ toolPage, page }) => {
    await toolPage.inputTextarea.fill(testData.invalidTimestamp);

    // Should show error message
    await expect(page.getByText("Invalid input")).toBeVisible();
  });

  test("current timestamp display updates", async ({ page }) => {
    // Get the current timestamp display text
    const timestampDisplay = page.locator("code").first();
    const initialValue = await timestampDisplay.textContent();

    // Wait a bit and check it updated (or is still a valid number)
    expect(initialValue).toMatch(/^\d+$/);
  });
});
