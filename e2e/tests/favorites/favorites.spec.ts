import { test, expect } from "../../fixtures/test-fixtures";

test.describe("Favorites", { tag: ["@sidebar"] }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/json-to-yaml");
  });

  test("shows empty favorites state initially", { tag: ["@smoke"] }, async ({ sidebarPage }) => {
    await expect(sidebarPage.noFavoritesText).toBeVisible();
  });

  test("add favorite via bookmark icon in sidebar", async ({ sidebarPage }) => {
    await sidebarPage.toggleFavorite("JSON Format");
    await expect(sidebarPage.getFavoriteLink("JSON Format")).toBeVisible();
  });

  test("remove favorite via bookmark icon in sidebar", async ({ sidebarPage }) => {
    await sidebarPage.toggleFavorite("JSON Format");
    await expect(sidebarPage.getFavoriteLink("JSON Format")).toBeVisible();

    const favoriteButton = sidebarPage.favoritesSection.getByTestId("sidebar-favorite-json-format");
    await favoriteButton.click();

    await expect(sidebarPage.getFavoriteLink("JSON Format")).not.toBeVisible();
  });

  test("favorites persist after page reload", async ({ sidebarPage, page }) => {
    await sidebarPage.toggleFavorite("CSV to JSON");
    await expect(sidebarPage.getFavoriteLink("CSV to JSON")).toBeVisible();

    await page.reload();
    await page.waitForLoadState("networkidle");

    await expect(sidebarPage.getFavoriteLink("CSV to JSON")).toBeVisible();
  });

  test("multiple tools can be favorited", async ({ sidebarPage }) => {
    await sidebarPage.toggleFavorite("JSON to YAML");
    await sidebarPage.toggleFavorite("URL Encode/Decode");
    await sidebarPage.toggleFavorite("Text Diff Checker");

    await expect(sidebarPage.getFavoriteLink("JSON to YAML")).toBeVisible();
    await expect(sidebarPage.getFavoriteLink("URL Encode/Decode")).toBeVisible();
    await expect(sidebarPage.getFavoriteLink("Text Diff Checker")).toBeVisible();

    const count = await sidebarPage.getFavoriteCount();
    expect(count).toBe(3);
  });

  test("favorites appear on toolbox page", async ({ sidebarPage, page }) => {
    await sidebarPage.toggleFavorite("Markdown Preview");
    await expect(sidebarPage.getFavoriteLink("Markdown Preview")).toBeVisible();

    await page.goto("/toolbox");
    await page.waitForLoadState("networkidle");

    const favoritesHeading = page.getByRole("heading", { name: "Favorites" });
    await expect(favoritesHeading).toBeVisible();

    const favoritesGrid = favoritesHeading.locator("~ div").first();
    await expect(
      favoritesGrid.getByRole("link", { name: /Markdown Preview/i })
    ).toBeVisible();
  });
});
