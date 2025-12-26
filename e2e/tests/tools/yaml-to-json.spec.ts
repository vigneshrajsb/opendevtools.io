import { test, expect } from "../../fixtures/test-fixtures";
import { testData } from "../../fixtures/test-data";

test.describe("YAML to JSON", { tag: ["@tools"] }, () => {
  test.beforeEach(async ({ toolPage }) => {
    await toolPage.goto("/yaml-to-json");
  });

  test("page loads correctly and example/clear work", async ({ toolPage }) => {
    // Initial state
    await expect(toolPage.pageTitle).toHaveText("YAML to JSON");
    await expect(toolPage.outputTextarea).toHaveValue("");

    // Example loads data
    await toolPage.loadExample();
    await expect(toolPage.outputTextarea).not.toHaveValue("");

    // Clear resets
    await toolPage.clear();
    await expect(toolPage.inputTextarea).toHaveValue("");
    await expect(toolPage.outputTextarea).toHaveValue("");
  });

  test("invalid YAML shows error", async ({ toolPage }) => {
    await toolPage.setInput(testData.invalidYaml);
    await expect(toolPage.outputTextarea).toHaveValue(/error/i);
  });

  test("valid YAML converts to JSON", async ({ toolPage }) => {
    await toolPage.setInput(testData.validYaml);
    const output = await toolPage.getOutput();
    expect(output).toContain('"name"');
    expect(output).toContain('"Test User"');
  });

  test("indent toggle changes output formatting", async ({ toolPage, page }) => {
    await toolPage.loadExample();
    const output2Spaces = await toolPage.getOutput();

    await page.getByRole("radio", { name: "4 Spaces" }).click();
    const output4Spaces = await toolPage.getOutput();

    expect(output4Spaces).not.toBe(output2Spaces);
  });
});
