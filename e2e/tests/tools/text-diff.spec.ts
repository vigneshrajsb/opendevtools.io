import { test, expect } from "../../fixtures/test-fixtures";
import { testData } from "../../fixtures/test-data";

test.describe("Text Diff Checker", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/text-diff");
  });

  test("page loads with correct title", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Text Diff Checker");
  });

  test("Example button loads sample data", async ({ page }) => {
    await page.getByTestId("btn-example").click();

    const originalTextarea = page.getByTestId("tool-input-original");
    const modifiedTextarea = page.getByTestId("tool-input-modified");

    await expect(originalTextarea).not.toHaveValue("");
    await expect(modifiedTextarea).not.toHaveValue("");
  });

  test("Clear button resets all inputs", async ({ page }) => {
    await page.getByTestId("btn-example").click();
    await page.getByTestId("btn-clear").click();

    const originalTextarea = page.getByTestId("tool-input-original");
    const modifiedTextarea = page.getByTestId("tool-input-modified");

    await expect(originalTextarea).toHaveValue("");
    await expect(modifiedTextarea).toHaveValue("");
  });

  test("shows diff output when texts differ", async ({ page }) => {
    const originalTextarea = page.getByTestId("tool-input-original");
    const modifiedTextarea = page.getByTestId("tool-input-modified");

    await originalTextarea.clear();
    await originalTextarea.pressSequentially(testData.diffOriginal, { delay: 5 });
    await modifiedTextarea.clear();
    await modifiedTextarea.pressSequentially(testData.diffModified, { delay: 5 });

    const diffOutput = page.getByTestId("tool-output");
    await expect(diffOutput).not.toBeEmpty();
  });

  test("mode toggle changes diff format", async ({ page }) => {
    await page.getByTestId("btn-example").click();

    const diffOutput = page.getByTestId("tool-output");
    const patchText = await diffOutput.innerText();

    await page.getByRole("radio", { name: "Lines" }).click();
    const linesText = await diffOutput.innerText();

    expect(linesText).not.toBe(patchText);
  });
});
