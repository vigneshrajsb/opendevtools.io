import { test, expect } from "@playwright/test";
import { tools } from "../../fixtures/test-data";

test.describe("Visual Regression", () => {
  test("home page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("home-page.png", {
      fullPage: true,
    });
  });

  test("toolbox page", async ({ page }) => {
    await page.goto("/toolbox");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("toolbox-page.png", {
      fullPage: true,
    });
  });

  for (const tool of tools) {
    test(`${tool.name} - with example loaded`, async ({ page }) => {
      await page.goto(tool.path);
      await page.waitForLoadState("networkidle");

      const exampleButton = page.getByRole("button", { name: /example/i });
      if (await exampleButton.isVisible()) {
        await exampleButton.click();
        await page.waitForTimeout(300);
      }

      await expect(page).toHaveScreenshot(`${tool.path.slice(1)}.png`, {
        fullPage: true,
      });
    });
  }

  test("sidebar collapsed state", async ({ page }) => {
    await page.goto("/json-to-yaml");
    await page.waitForLoadState("networkidle");

    const collapseButton = page.getByRole("button", {
      name: /collapse sidebar/i,
    });
    await collapseButton.click();
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot("sidebar-collapsed.png");
  });
});
