import { test, expect } from "../../fixtures/test-fixtures";
import { testData } from "../../fixtures/test-data";

test.describe("Markdown Preview", () => {
  test.beforeEach(async ({ toolPage }) => {
    await toolPage.goto("/markdown-preview");
  });

  test("page loads correctly and example/clear work", async ({ toolPage }) => {
    // Initial state
    await expect(toolPage.pageTitle).toHaveText("Markdown Preview");
    await expect(toolPage.inputTextarea).toHaveValue("");

    // Example loads data
    await toolPage.loadExample();
    await expect(toolPage.inputTextarea).not.toHaveValue("");

    // Clear resets
    await toolPage.clear();
    await expect(toolPage.inputTextarea).toHaveValue("");
  });

  test("preview renders markdown as HTML", async ({ toolPage, page }) => {
    await toolPage.setInput(testData.markdownSample);

    const preview = page.locator(".prose");
    await expect(preview.locator("h1")).toContainText("Hello World");
    await expect(preview.locator("strong")).toContainText("bold");
    await expect(preview.locator("em")).toContainText("italic");
  });

  test("preview updates live as input changes", async ({ toolPage, page }) => {
    await toolPage.setInput("# First Title");

    const preview = page.locator(".prose");
    await expect(preview.locator("h1")).toContainText("First Title");

    await toolPage.setInput("# Updated Title");
    await expect(preview.locator("h1")).toContainText("Updated Title");
  });

  test("Copy button works", async ({ toolPage }) => {
    await toolPage.loadExample();
    await toolPage.copyOutput();
    await expect(toolPage.copyButton.locator("svg")).toBeVisible();
  });
});
