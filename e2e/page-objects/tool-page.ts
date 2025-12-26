import { Page, Locator } from "@playwright/test";

export class ToolPage {
  readonly page: Page;
  readonly exampleButton: Locator;
  readonly clearButton: Locator;
  readonly copyButton: Locator;
  readonly inputTextarea: Locator;
  readonly outputTextarea: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.exampleButton = page.getByTestId("btn-example");
    this.clearButton = page.getByTestId("btn-clear");
    this.copyButton = page.getByTestId("btn-copy");
    this.inputTextarea = page.getByTestId("tool-input");
    this.outputTextarea = page.getByTestId("tool-output");
    this.pageTitle = page.locator("h1");
  }

  async goto(path: string) {
    await this.page.goto(path);
  }

  async loadExample() {
    await this.exampleButton.click();
  }

  async clear() {
    await this.clearButton.click();
  }

  async copyOutput() {
    await this.copyButton.click();
  }

  async setInput(text: string) {
    await this.inputTextarea.fill(text);
  }

  async getInput(): Promise<string> {
    return await this.inputTextarea.inputValue();
  }

  async getOutput(): Promise<string> {
    return await this.outputTextarea.inputValue();
  }

  async clearLocalStorage() {
    await this.page.evaluate(() => localStorage.clear());
  }
}
