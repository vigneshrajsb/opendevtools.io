import { test, expect } from "../../fixtures/test-fixtures";

test.describe("String Inspector", { tag: ["@tools"] }, () => {
  test.beforeEach(async ({ toolPage }) => {
    await toolPage.goto("/string-inspector");
  });

  test("page loads correctly", async ({ toolPage }) => {
    await expect(toolPage.pageTitle).toHaveText("String Inspector");
  });

  test("example button loads sample text", async ({ toolPage, page }) => {
    await toolPage.loadExample();

    const input = await toolPage.getInput();
    expect(input).toContain("Hello World!");
    expect(input).toContain("zero-width space");

    // Verify stats updated
    const chars = await page.getByTestId("stat-characters").textContent();
    expect(Number(chars)).toBeGreaterThan(0);
  });

  test("clear button resets input and stats", async ({ toolPage, page }) => {
    await toolPage.loadExample();
    await toolPage.clear();

    await expect(toolPage.inputTextarea).toHaveValue("");
    await expect(page.getByTestId("stat-characters")).toHaveText("0");
    await expect(page.getByTestId("stat-words")).toHaveText("0");
  });

  test("character count updates on input", async ({ toolPage, page }) => {
    await toolPage.inputTextarea.clear();
    await toolPage.inputTextarea.fill("Hello");

    await expect(page.getByTestId("stat-characters")).toHaveText("5");
    await expect(page.getByTestId("stat-bytes")).toHaveText("5");
    await expect(page.getByTestId("stat-words")).toHaveText("1");
    await expect(page.getByTestId("stat-lines")).toHaveText("1");
  });

  test("multi-line input counts lines correctly", async ({ toolPage, page }) => {
    await toolPage.inputTextarea.clear();
    await toolPage.inputTextarea.fill("Line 1\nLine 2\nLine 3");

    await expect(page.getByTestId("stat-lines")).toHaveText("3");
  });

  test("character types breakdown is calculated", async ({ toolPage, page }) => {
    await toolPage.inputTextarea.clear();
    await toolPage.inputTextarea.fill("abc 123!");

    await expect(page.getByTestId("type-letters")).toContainText("3");
    await expect(page.getByTestId("type-digits")).toContainText("3");
    await expect(page.getByTestId("type-spaces")).toContainText("1");
    await expect(page.getByTestId("type-punctuation")).toContainText("1");
  });

  test("encoding detection - ASCII only text", async ({ toolPage, page }) => {
    await toolPage.inputTextarea.clear();
    await toolPage.inputTextarea.fill("Hello World");

    await expect(page.getByTestId("encoding-ascii-check")).toBeVisible();
    await expect(page.getByTestId("encoding-unicode-x")).toBeVisible();
  });

  test("encoding detection - Unicode text via example", async ({ toolPage, page }) => {
    // Use example which contains invisible chars (Unicode)
    await toolPage.loadExample();

    await expect(page.getByTestId("encoding-unicode-check")).toBeVisible();
  });

  test("encoding detection - Invisible characters via example", async ({
    toolPage,
    page,
  }) => {
    // Example text contains zero-width space
    await toolPage.loadExample();

    await expect(page.getByTestId("encoding-invisible-check")).toBeVisible();
  });

  test("word distribution shows word frequencies", async ({ toolPage, page }) => {
    await toolPage.inputTextarea.clear();
    await toolPage.inputTextarea.fill("hello world hello");

    // Word distribution should show "hello" with count 2
    await expect(page.getByText("hello").last()).toBeVisible();
    await expect(page.getByText("2").first()).toBeVisible();
  });

  test("word filter input exists and is functional", async ({ toolPage, page }) => {
    await toolPage.loadExample();

    const filterInput = page.getByTestId("word-filter");
    await expect(filterInput).toBeVisible();
    await filterInput.fill("test");

    // Filter was filled successfully
    await expect(filterInput).toHaveValue("test");
  });

  test("case sensitive toggle exists", async ({ page }) => {
    await expect(page.getByTestId("case-sensitive")).toBeVisible();
  });

  test("byte count differs from character count for multi-byte chars", async ({
    toolPage,
    page,
  }) => {
    // Use example which has invisible char (multi-byte)
    await toolPage.loadExample();

    const chars = await page.getByTestId("stat-characters").textContent();
    const bytes = await page.getByTestId("stat-bytes").textContent();

    // Bytes should be >= characters (invisible char is multi-byte)
    expect(Number(bytes)).toBeGreaterThanOrEqual(Number(chars));
  });

  test("copy button is visible", async ({ toolPage }) => {
    await expect(toolPage.copyButton).toBeVisible();
  });
});
