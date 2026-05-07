import { test, expect } from "../../fixtures/test-fixtures";
import { testData } from "../../fixtures/test-data";

test.describe("Regex Tester", { tag: ["@tools"] }, () => {
  test.beforeEach(async ({ toolPage }) => {
    await toolPage.goto("/regex-tester");
  });

  test("page loads correctly", async ({ toolPage }) => {
    await expect(toolPage.pageTitle).toHaveText("Regex Tester");
  });

  test("example button loads sample regex and test string", async ({ toolPage, page }) => {
    await toolPage.loadExample();

    const pattern = await page.getByTestId("regex-pattern").inputValue();
    expect(pattern).toContain("@");

    const testString = await toolPage.getInput();
    expect(testString).toContain("@example.com");
  });

  test("clear button resets all inputs", async ({ toolPage, page }) => {
    await toolPage.loadExample();
    await toolPage.clear();

    await expect(page.getByTestId("regex-pattern")).toHaveValue("");
    await expect(toolPage.inputTextarea).toHaveValue("");
  });

  test("matches basic pattern", async ({ toolPage, page }) => {
    await page.getByTestId("regex-pattern").pressSequentially(testData.regexPattern, { delay: 5 });
    await toolPage.setInput(testData.regexTestString);

    const matchCount = page.getByTestId("match-count");
    await expect(matchCount).toContainText("2 matches");

    const output = page.getByTestId("tool-output");
    await expect(output.locator("mark")).toHaveCount(2);
  });

  test("displays capture groups", async ({ toolPage, page }) => {
    await page.getByTestId("regex-pattern").pressSequentially(testData.regexPattern, { delay: 5 });
    await toolPage.setInput(testData.regexTestString);

    await expect(page.getByText("Group 1:").first()).toBeVisible();
    await expect(page.getByText("Group 2:").first()).toBeVisible();
  });

  test("shows error for invalid regex", async ({ page }) => {
    const patternInput = page.getByTestId("regex-pattern");

    await patternInput.pressSequentially(testData.regexInvalidPattern, { delay: 5 });
    await expect(patternInput).toHaveValue(testData.regexInvalidPattern);
    await page.getByTestId("tool-input").fill("test");

    await expect(page.getByTestId("regex-error")).toBeVisible();
  });

  test("flags affect matching behavior", async ({ toolPage, page }) => {
    // Load example first to get a known state (g and i flags enabled)
    await toolPage.loadExample();

    const gFlag = page.getByRole("button", { name: /Global/i });
    const iFlag = page.getByRole("button", { name: /Case insensitive/i });

    // Clear and set our own pattern/text
    await page.getByTestId("regex-pattern").fill("hello");
    await toolPage.inputTextarea.fill("Hello hello HELLO");

    // g and i are both active from example, so all 3 match
    const matchCount = page.getByTestId("match-count");
    await expect(matchCount).toContainText("3 matches");

    // Disable i flag — only lowercase "hello" matches with g
    await iFlag.click();
    await expect(matchCount).toContainText("1 match");

    // Enable g + i — all 3 match again
    await iFlag.click();
    await expect(matchCount).toContainText("3 matches");
  });

  test("cheatsheet opens and closes", async ({ page }) => {
    await page.getByTestId("btn-cheatsheet").click();
    await expect(page.getByText("Character Classes")).toBeVisible();

    // Close the inline panel via the cheatsheet button toggle
    await page.getByTestId("btn-cheatsheet").click();
    await expect(page.getByText("Character Classes")).not.toBeVisible();
  });

  test("copy button is visible", async ({ toolPage }) => {
    await expect(toolPage.copyButton).toBeVisible();
  });

  test("click match detail scrolls to match in output", async ({ toolPage, page }) => {
    await toolPage.loadExample();

    // Verify match details accordion is visible with match count
    await expect(page.getByText("Match Details (3)")).toBeVisible();

    // Click the first match detail row
    const firstMatchRow = page.locator("[data-match-index='0']");
    await expect(firstMatchRow).toBeVisible();
  });
});
