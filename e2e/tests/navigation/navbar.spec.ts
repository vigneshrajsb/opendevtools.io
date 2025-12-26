import { test, expect } from "../../fixtures/test-fixtures";

test.describe("Navbar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/json-to-yaml");
  });

  test("toolbox link navigates to toolbox page", async ({ navbarPage, page }) => {
    await navbarPage.clickToolbox();
    await expect(page).toHaveURL("/toolbox");
  });

  test("github link has correct href and opens in new tab", async ({ navbarPage }) => {
    const href = await navbarPage.getGithubHref();
    expect(href).toBe("https://github.com/vigneshrajsb/opendevtools.io");

    const target = await navbarPage.githubLink.getAttribute("target");
    expect(target).toBe("_blank");
  });

  test("theme toggle switches to light mode", async ({ navbarPage, page }) => {
    await navbarPage.themeToggle.click();
    await page.getByRole("menuitem", { name: "Light" }).click();
    await expect(navbarPage.htmlElement).not.toHaveClass(/dark/);
  });

  test("theme toggle switches to dark mode", async ({ navbarPage, page }) => {
    await navbarPage.themeToggle.click();
    await page.getByRole("menuitem", { name: "Light" }).click();
    await expect(navbarPage.htmlElement).not.toHaveClass(/dark/);

    // Wait for dropdown to close before opening again
    await expect(page.getByRole("menuitem", { name: "Light" })).not.toBeVisible();

    await navbarPage.themeToggle.click();
    await page.getByRole("menuitem", { name: "Dark" }).click();
    await expect(navbarPage.htmlElement).toHaveClass(/dark/);
  });
});
