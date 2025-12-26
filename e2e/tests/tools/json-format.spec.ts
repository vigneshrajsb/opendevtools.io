import { test, expect } from "../../fixtures/test-fixtures";
import { testData } from "../../fixtures/test-data";

test.describe("JSON Format", { tag: ["@tools"] }, () => {
  test.beforeEach(async ({ toolPage }) => {
    await toolPage.goto("/json-format");
  });

  test("page loads correctly and example/clear work", async ({ toolPage }) => {
    // Initial state
    await expect(toolPage.pageTitle).toHaveText("JSON Format");
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

  test("valid JSON is formatted", async ({ toolPage }) => {
    await toolPage.setInput('{"name":"test","value":123}');
    const output = await toolPage.getOutput();
    expect(output).toContain('"name"');
    expect(output).toContain("  ");
  });

  test("indent toggle changes output formatting", async ({ toolPage, page }) => {
    await toolPage.loadExample();

    await page.getByRole("radio", { name: "4 Spaces" }).click();
    const output4 = await toolPage.getOutput();
    expect(output4).toContain("    ");

    await page.getByRole("radio", { name: "Minify" }).click();
    const outputMinified = await toolPage.getOutput();
    expect(outputMinified).not.toContain("\n");
  });
});
