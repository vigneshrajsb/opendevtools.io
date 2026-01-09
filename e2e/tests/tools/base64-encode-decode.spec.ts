import { test, expect } from "../../fixtures/test-fixtures";
import { testData } from "../../fixtures/test-data";

test.describe("Base64 Encode/Decode", { tag: ["@tools"] }, () => {
  test.beforeEach(async ({ toolPage }) => {
    await toolPage.goto("/base64-encode-decode");
  });

  test("page loads correctly and example/clear work", async ({ toolPage }) => {
    // Initial state
    await expect(toolPage.pageTitle).toHaveText("Base64 Encode/Decode");
    await expect(toolPage.outputTextarea).toHaveValue("");

    // Example loads data
    await toolPage.loadExample();
    await expect(toolPage.outputTextarea).not.toHaveValue("");

    // Clear resets
    await toolPage.clear();
    await expect(toolPage.inputTextarea).toHaveValue("");
    await expect(toolPage.outputTextarea).toHaveValue("");
  });

  test("encode mode encodes text to Base64", async ({ toolPage, page }) => {
    await page.getByRole("radio", { name: "Encode" }).click();
    await toolPage.setInput(testData.base64TextToEncode);
    const output = await toolPage.getOutput();
    expect(output).toBe(testData.base64EncodedText);
  });

  test("decode mode decodes Base64 to text", async ({ toolPage, page }) => {
    await page.getByRole("radio", { name: "Decode" }).click();
    await toolPage.setInput(testData.base64EncodedText);
    const output = await toolPage.getOutput();
    expect(output).toBe(testData.base64TextToEncode);
  });

  test("mode toggle switches between encode and decode", async ({
    toolPage,
    page,
  }) => {
    await page.getByRole("radio", { name: "Encode" }).click();
    await toolPage.setInput("Hello World");
    const encoded = await toolPage.getOutput();
    expect(encoded).toContain("SGVsbG8gV29ybGQ=");

    await page.getByRole("radio", { name: "Decode" }).click();
    await toolPage.setInput(encoded);
    const decoded = await toolPage.getOutput();
    expect(decoded).toBe("Hello World");
  });

  test("swap button swaps input and output and toggles mode", async ({
    toolPage,
    page,
  }) => {
    // Start in encode mode
    await page.getByRole("radio", { name: "Encode" }).click();
    await toolPage.setInput(testData.base64TextToEncode);
    const encodedOutput = await toolPage.getOutput();
    expect(encodedOutput).toBe(testData.base64EncodedText);

    // Click swap button
    await page.getByTestId("btn-swap").click();

    // Verify input now contains the encoded output
    const newInput = await toolPage.inputTextarea.inputValue();
    expect(newInput).toBe(encodedOutput);

    // Verify mode switched to decode
    await expect(page.getByRole("radio", { name: "Decode" })).toBeChecked();

    // Verify output now shows decoded text
    const newOutput = await toolPage.getOutput();
    expect(newOutput).toBe(testData.base64TextToEncode);
  });

  test("swap button is disabled when output is empty", async ({ page }) => {
    await expect(page.getByTestId("btn-swap")).toBeDisabled();
  });

  test("invalid Base64 in decode mode shows error", async ({
    toolPage,
    page,
  }) => {
    await page.getByRole("radio", { name: "Decode" }).click();
    await toolPage.setInput("This is not valid base64!!!");
    const output = await toolPage.getOutput();
    expect(output).toContain("Error:");
  });
});
