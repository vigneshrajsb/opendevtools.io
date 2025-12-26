import { test, expect } from "../../fixtures/test-fixtures";
import { testData } from "../../fixtures/test-data";

test.describe("Escape/Unescape Newlines", { tag: ["@tools"] }, () => {
  test.beforeEach(async ({ toolPage }) => {
    await toolPage.goto("/escape-newlines");
  });

  test("page loads correctly and example/clear work", async ({ toolPage }) => {
    // Initial state
    await expect(toolPage.pageTitle).toHaveText("Escape/Unescape Newlines");
    await expect(toolPage.outputTextarea).toHaveValue("");

    // Example loads data
    await toolPage.loadExample();
    await expect(toolPage.outputTextarea).not.toHaveValue("");

    // Clear resets
    await toolPage.clear();
    await expect(toolPage.inputTextarea).toHaveValue("");
    await expect(toolPage.outputTextarea).toHaveValue("");
  });

  test("escape mode converts newlines to \\n", async ({ toolPage, page }) => {
    await page.getByRole("radio", { name: "Escape" }).click();
    await toolPage.setInput(testData.textToEscape);
    const output = await toolPage.getOutput();
    expect(output).toContain("\\n");
    expect(output).not.toContain("\n");
  });

  test("unescape mode converts \\n to newlines", async ({ toolPage, page }) => {
    await page.getByRole("radio", { name: "Unescape" }).click();
    await toolPage.setInput(testData.escapedText);
    const output = await toolPage.getOutput();
    expect(output).toContain("\n");
    expect(output).not.toContain("\\n");
  });

  test("mode toggle switches between escape and unescape", async ({
    toolPage,
    page,
  }) => {
    await page.getByRole("radio", { name: "Escape" }).click();
    await toolPage.setInput(testData.textToEscape);
    const escaped = await toolPage.getOutput();
    expect(escaped).toContain("\\n");

    await page.getByRole("radio", { name: "Unescape" }).click();
    await toolPage.setInput(escaped);
    const unescaped = await toolPage.getOutput();
    expect(unescaped).toBe(testData.textToEscape);
  });

  test("swap button swaps input and output and toggles mode", async ({
    toolPage,
    page,
  }) => {
    // Start in escape mode
    await page.getByRole("radio", { name: "Escape" }).click();
    await toolPage.setInput(testData.textToEscape);
    const escapedOutput = await toolPage.getOutput();
    expect(escapedOutput).toContain("\\n");

    // Click swap button
    await page.getByTestId("btn-swap").click();

    // Verify input now contains the escaped output
    const newInput = await toolPage.inputTextarea.inputValue();
    expect(newInput).toBe(escapedOutput);

    // Verify mode switched to unescape
    await expect(page.getByRole("radio", { name: "Unescape" })).toBeChecked();

    // Verify output now shows unescaped text
    const newOutput = await toolPage.getOutput();
    expect(newOutput).toBe(testData.textToEscape);
  });

  test("swap button is disabled when output is empty", async ({ page }) => {
    await expect(page.getByTestId("btn-swap")).toBeDisabled();
  });
});
