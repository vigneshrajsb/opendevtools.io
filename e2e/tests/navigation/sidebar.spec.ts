import { test, expect } from "../../fixtures/test-fixtures";
import { tools } from "../../fixtures/test-data";

test.describe("Sidebar", { tag: ["@sidebar"] }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/json-to-yaml");
  });

  test("all tools are listed in Developer Tools section", { tag: ["@smoke"] }, async ({
    sidebarPage,
  }) => {
    const toolNames = await sidebarPage.getAllToolNames();
    expect(toolNames).toHaveLength(tools.length);

    for (const tool of tools) {
      expect(toolNames).toContain(tool.name);
    }
  });

  test("clicking a tool navigates to correct route", async ({
    sidebarPage,
    page,
  }) => {
    await sidebarPage.clickToolLink("JSON Format");
    await expect(page).toHaveURL("/json-format");
  });

  test("active tool is highlighted in sidebar", async ({ sidebarPage, page }) => {
    await page.goto("/csv-to-json");
    const toolLink = sidebarPage.getToolLink("CSV to JSON");
    await expect(toolLink).toBeVisible();
    await expect(page.locator("h1")).toContainText("CSV to JSON");
  });

  test("OpenDevTools logo links to home", async ({ sidebarPage, page }) => {
    await sidebarPage.logo.click();
    await expect(page).toHaveURL("/");
  });
});
