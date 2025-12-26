import { test, expect } from "../../fixtures/test-fixtures";
import { testData } from "../../fixtures/test-data";

test.describe("CSV to JSON", () => {
  test.beforeEach(async ({ toolPage }) => {
    await toolPage.goto("/csv-to-json");
  });

  test("page loads correctly and example/clear work", async ({ toolPage }) => {
    // Initial state
    await expect(toolPage.pageTitle).toHaveText("CSV to JSON");
    await expect(toolPage.outputTextarea).toHaveValue("");

    // Example loads data
    await toolPage.loadExample();
    await expect(toolPage.outputTextarea).not.toHaveValue("");

    // Clear resets
    await toolPage.clear();
    await expect(toolPage.inputTextarea).toHaveValue("");
    await expect(toolPage.outputTextarea).toHaveValue("");
  });

  test("valid CSV converts to JSON array", async ({ toolPage }) => {
    await toolPage.setInput(testData.validCsv);
    const output = await toolPage.getOutput();
    expect(output).toContain("[");
    expect(output).toContain('"name"');
    expect(output).toContain('"John"');
  });

  test("delimiter toggle changes parsing", async ({ toolPage, page }) => {
    const tabCsv = "name\tage\tcity\nJohn\t30\tNew York";
    await toolPage.setInput(tabCsv);
    await page.getByRole("radio", { name: "Tab", exact: true }).click();

    const output = await toolPage.getOutput();
    expect(output).toContain("[");
    expect(output).toContain("John");
  });
});
