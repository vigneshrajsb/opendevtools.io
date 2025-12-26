import { test, expect } from "../../fixtures/test-fixtures";
import { testData } from "../../fixtures/test-data";

test.describe("JSON to YAML", () => {
  test.beforeEach(async ({ toolPage }) => {
    await toolPage.goto("/json-to-yaml");
  });

  test("page loads correctly and example/clear work", async ({ toolPage }) => {
    // Initial state
    await expect(toolPage.pageTitle).toHaveText("JSON to YAML");
    await expect(toolPage.outputTextarea).toHaveValue("");

    // Example loads data
    await toolPage.loadExample();
    await expect(toolPage.outputTextarea).not.toHaveValue("");

    // Clear resets
    await toolPage.clear();
    await expect(toolPage.inputTextarea).toHaveValue("");
    await expect(toolPage.outputTextarea).toHaveValue("");
  });

  test("copy button works", async ({ toolPage }) => {
    await toolPage.loadExample();
    await toolPage.copyOutput();
    await expect(toolPage.copyButton.locator("svg")).toBeVisible();
  });

  test("invalid JSON shows error", async ({ toolPage }) => {
    await toolPage.setInput(testData.invalidJson);
    await expect(toolPage.outputTextarea).toHaveValue(/error/i);
  });

  test("valid JSON converts to YAML", async ({ toolPage }) => {
    await toolPage.setInput(testData.validJson);
    const output = await toolPage.getOutput();
    expect(output).toContain("name: Test User");
    expect(output).toContain("age: 25");
  });
});
