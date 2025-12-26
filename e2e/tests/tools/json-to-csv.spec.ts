import { test, expect } from "../../fixtures/test-fixtures";
import { testData } from "../../fixtures/test-data";

test.describe("JSON to CSV", { tag: ["@tools"] }, () => {
  test.beforeEach(async ({ toolPage }) => {
    await toolPage.goto("/json-to-csv");
  });

  test("page loads correctly and example/clear work", async ({ toolPage }) => {
    // Initial state
    await expect(toolPage.pageTitle).toHaveText("JSON to CSV");
    await expect(toolPage.outputTextarea).toHaveValue("");

    // Example loads data
    await toolPage.loadExample();
    await expect(toolPage.outputTextarea).not.toHaveValue("");

    // Clear resets
    await toolPage.clear();
    await expect(toolPage.inputTextarea).toHaveValue("");
    await expect(toolPage.outputTextarea).toHaveValue("");
  });

  test("invalid JSON shows error", async ({ toolPage }) => {
    await toolPage.setInput(testData.invalidJson);
    await expect(toolPage.outputTextarea).toHaveValue(/error/i);
  });

  test("valid JSON array converts to CSV", async ({ toolPage }) => {
    await toolPage.setInput(testData.validJsonArray);
    const output = await toolPage.getOutput();
    expect(output).toContain("name");
    expect(output).toContain("age");
    expect(output).toContain("John");
  });

  test("non-array JSON shows error", async ({ toolPage }) => {
    await toolPage.setInput('{"single": "object"}');
    await expect(toolPage.outputTextarea).toHaveValue(/error/i);
  });
});
