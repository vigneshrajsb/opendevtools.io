import { test, expect } from "../../fixtures/test-fixtures";

test.describe("Command Palette", { tag: ["@navbar"] }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/json-to-yaml");
  });

  test("opens with search button click", { tag: ["@smoke"] }, async ({ navbarPage }) => {
    await navbarPage.openCommandPalette();
    await expect(navbarPage.commandDialog).toBeVisible();
  });

  test("opens with Cmd+K keyboard shortcut", async ({ navbarPage }) => {
    await navbarPage.openCommandPaletteWithKeyboard();
    await expect(navbarPage.commandDialog).toBeVisible();
  });

  test("closes with Escape key", async ({ navbarPage }) => {
    await navbarPage.openCommandPalette();
    await expect(navbarPage.commandDialog).toBeVisible();
    await navbarPage.closeCommandPalette();
    await expect(navbarPage.commandDialog).not.toBeVisible();
  });

  test("search filters tools correctly", async ({ navbarPage, page }) => {
    await navbarPage.openCommandPalette();
    await expect(navbarPage.commandDialog).toBeVisible();
    await navbarPage.searchInPalette("yaml");

    // Should show exactly the 2 YAML-related tools (order depends on fuzzy search)
    const results = navbarPage.page.locator("[cmdk-item]");
    await expect(results).toHaveCount(2);
    await expect(page.getByRole("option", { name: /JSON to YAML/i })).toBeVisible();
    await expect(page.getByRole("option", { name: /YAML to JSON/i })).toBeVisible();
  });

  test("selecting a tool navigates to that page", async ({ navbarPage, page }) => {
    await navbarPage.openCommandPalette();
    await expect(navbarPage.commandDialog).toBeVisible();
    await navbarPage.searchInPalette("csv to json");
    await navbarPage.selectCommandResult("CSV to JSON");
    await expect(page).toHaveURL("/csv-to-json");
  });
});
