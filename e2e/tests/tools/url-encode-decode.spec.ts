import { test, expect } from "../../fixtures/test-fixtures";
import { testData } from "../../fixtures/test-data";

test.describe("URL Encode/Decode", () => {
  test.beforeEach(async ({ toolPage }) => {
    await toolPage.goto("/url-encode-decode");
  });

  test("page loads correctly and example/clear work", async ({ toolPage }) => {
    // Initial state
    await expect(toolPage.pageTitle).toHaveText("URL Encode/Decode");
    await expect(toolPage.outputTextarea).toHaveValue("");

    // Example loads data
    await toolPage.loadExample();
    await expect(toolPage.outputTextarea).not.toHaveValue("");

    // Clear resets
    await toolPage.clear();
    await expect(toolPage.inputTextarea).toHaveValue("");
    await expect(toolPage.outputTextarea).toHaveValue("");
  });

  test("encode mode URL encodes text", async ({ toolPage, page }) => {
    await page.getByRole("radio", { name: "Encode" }).click();
    await toolPage.setInput(testData.urlToEncode);
    const output = await toolPage.getOutput();
    expect(output).toContain("%20");
  });

  test("decode mode URL decodes text", async ({ toolPage, page }) => {
    await page.getByRole("radio", { name: "Decode" }).click();
    await toolPage.setInput(testData.encodedUrl);
    const output = await toolPage.getOutput();
    expect(output).toContain("Hello World");
  });

  test("mode toggle switches between encode and decode", async ({
    toolPage,
    page,
  }) => {
    await page.getByRole("radio", { name: "Encode" }).click();
    await toolPage.setInput("Hello World");
    const encoded = await toolPage.getOutput();
    expect(encoded).toContain("%20");

    await page.getByRole("radio", { name: "Decode" }).click();
    await toolPage.setInput(encoded);
    const decoded = await toolPage.getOutput();
    expect(decoded).toBe("Hello World");
  });
});
