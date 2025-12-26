import { test, expect } from "../../fixtures/test-fixtures";

test.describe("Lorem Ipsum Generator", { tag: ["@tools"] }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/lorem-ipsum");
  });

  test("page loads with correct title", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Lorem Ipsum Generator");
  });

  test("selecting paragraph type generates text", async ({ page }) => {
    const outputTextarea = page.getByTestId("tool-output");
    await page.getByRole("radio", { name: "Paragraph" }).click();
    await expect(outputTextarea).not.toHaveValue("");
  });

  test("Clear button resets output", async ({ page }) => {
    await page.getByRole("radio", { name: "Paragraph" }).click();
    const outputTextarea = page.getByTestId("tool-output");
    await expect(outputTextarea).not.toHaveValue("");

    await page.getByTestId("btn-clear").click();
    await expect(outputTextarea).toHaveValue("");
  });

  test("Copy button works", async ({ page }) => {
    await page.getByRole("radio", { name: "Paragraph" }).click();
    await page.getByTestId("btn-copy").click();
    await expect(page.getByTestId("btn-copy").locator("svg")).toBeVisible();
  });

  test("type toggle changes output format", async ({ page }) => {
    const outputTextarea = page.getByTestId("tool-output");

    await page.getByRole("radio", { name: "Paragraph" }).click();
    const paragraphOutput = await outputTextarea.inputValue();

    await page.getByRole("radio", { name: "Sentence" }).click();
    const sentenceOutput = await outputTextarea.inputValue();

    expect(sentenceOutput).not.toBe(paragraphOutput);
  });

  test("count multiplier increases output", async ({ page }) => {
    const outputTextarea = page.getByTestId("tool-output");

    await page.getByRole("radio", { name: "Paragraph" }).click();
    await page.getByRole("radio", { name: "1 item" }).click();
    const output1x = await outputTextarea.inputValue();

    await page.getByRole("radio", { name: "10 items" }).click();
    const output10x = await outputTextarea.inputValue();

    expect(output10x.length).toBeGreaterThan(output1x.length);
  });
});
