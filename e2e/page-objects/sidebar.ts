import { Page, Locator } from "@playwright/test";

export class SidebarPage {
  readonly page: Page;
  readonly sidebar: Locator;
  readonly favoritesSection: Locator;
  readonly developerToolsSection: Locator;
  readonly collapseSidebarButton: Locator;
  readonly logo: Locator;
  readonly noFavoritesText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = page.locator("[data-sidebar='sidebar']");
    this.favoritesSection = page.getByTestId("sidebar-favorites");
    this.developerToolsSection = page.getByTestId("sidebar-tools");
    this.collapseSidebarButton = page.getByTestId("sidebar-collapse");
    this.logo = page.getByRole("link", { name: /opendevtools/i });
    this.noFavoritesText = page.getByTestId("sidebar-no-favorites");
  }

  async goto(path: string) {
    await this.page.goto(path);
  }

  getToolLink(toolName: string): Locator {
    return this.sidebar.getByRole("link", { name: toolName });
  }

  getToolLinkByPath(toolPath: string): Locator {
    return this.page.getByTestId(`sidebar-tool-${toolPath}`);
  }

  async clickToolLink(toolName: string) {
    await this.getToolLink(toolName).click();
  }

  getFavoriteButton(toolPath: string): Locator {
    return this.page.getByTestId(`sidebar-favorite-${toolPath}`);
  }

  async toggleFavorite(toolName: string) {
    const toolRow = this.developerToolsSection
      .locator("[data-sidebar='menu-item']")
      .filter({ has: this.page.getByRole("link", { name: toolName }) });
    await toolRow.hover();
    await toolRow
      .getByRole("button", { name: /add to favorites|remove from favorites/i })
      .click();
  }

  async isFavorited(toolName: string): Promise<boolean> {
    const favoriteLink = this.favoritesSection.getByRole("link", {
      name: toolName,
    });
    return await favoriteLink.isVisible();
  }

  async getFavoriteCount(): Promise<number> {
    const favorites = this.favoritesSection.locator("[data-sidebar='menu-item']");
    return await favorites.count();
  }

  getFavoriteLink(toolName: string): Locator {
    return this.favoritesSection.getByRole("link", { name: toolName });
  }

  async getAllToolNames(): Promise<string[]> {
    const links = this.developerToolsSection.locator(
      "[data-sidebar='menu-item'] a"
    );
    const count = await links.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await links.nth(i).innerText();
      names.push(text.trim());
    }
    return names;
  }

  async clearLocalStorage() {
    await this.page.evaluate(() => localStorage.clear());
  }
}
