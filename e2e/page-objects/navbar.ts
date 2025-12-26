import { Page, Locator } from "@playwright/test";

export class NavbarPage {
  readonly page: Page;
  readonly searchButton: Locator;
  readonly toolboxLink: Locator;
  readonly githubLink: Locator;
  readonly themeToggle: Locator;
  readonly commandDialog: Locator;
  readonly commandInput: Locator;
  readonly htmlElement: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchButton = page.getByTestId("nav-search");
    this.toolboxLink = page.getByTestId("nav-toolbox");
    this.githubLink = page.getByTestId("nav-github");
    this.themeToggle = page.getByTestId("nav-theme");
    this.commandDialog = page.getByTestId("command-dialog");
    this.commandInput = page.getByTestId("command-input");
    this.htmlElement = page.locator("html");
  }

  async goto(path: string) {
    await this.page.goto(path);
  }

  async openCommandPalette() {
    await this.searchButton.click();
  }

  async openCommandPaletteWithKeyboard() {
    await this.page.keyboard.press("Meta+k");
  }

  async closeCommandPalette() {
    await this.page.keyboard.press("Escape");
  }

  async searchInPalette(query: string) {
    await this.commandInput.fill(query);
  }

  async selectCommandResult(name: string) {
    await this.page.getByRole("option", { name: new RegExp(name, "i") }).click();
  }

  async setTheme(theme: "light" | "dark") {
    await this.themeToggle.click();
    await this.page.getByTestId(`theme-${theme}`).click();
  }

  async getTheme(): Promise<"light" | "dark"> {
    const htmlClass = await this.htmlElement.getAttribute("class");
    return htmlClass?.includes("dark") ? "dark" : "light";
  }

  async clickToolbox() {
    await this.toolboxLink.click();
  }

  getGithubHref(): Promise<string | null> {
    return this.githubLink.getAttribute("href");
  }
}
