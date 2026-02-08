import { test, expect } from "../../fixtures/test-fixtures";
import { testData } from "../../fixtures/test-data";

test.describe("URL Parser", { tag: ["@tools"] }, () => {
  test.beforeEach(async ({ toolPage }) => {
    await toolPage.goto("/url-parser");
  });

  test("page loads correctly", async ({ toolPage }) => {
    await expect(toolPage.pageTitle).toHaveText("URL Parser");
  });

  test("example button loads sample URL", async ({ toolPage }) => {
    await toolPage.loadExample();

    const input = await toolPage.getInput();
    expect(input).toContain("datadoghq.com");
    expect(input).toContain("logs");
  });

  test("clear button resets input", async ({ toolPage }) => {
    await toolPage.loadExample();
    await toolPage.clear();

    await expect(toolPage.inputTextarea).toHaveValue("");
  });

  test("parses URL components correctly", async ({ toolPage, page }) => {
    await toolPage.setInput(testData.urlValid);

    const components = page.getByTestId("url-components");
    await expect(components).toBeVisible();
    await expect(components).toContainText("https");
    await expect(components).toContainText("example.com:8080");
    await expect(components).toContainText("8080");
    await expect(components).toContainText("/path/file.html");
    await expect(components).toContainText("file.html");
    await expect(components).toContainText("#section");
  });

  test("parses query parameters as JSON", async ({ toolPage, page }) => {
    await toolPage.setInput(testData.urlValid);

    const queryParams = page.getByTestId("query-params");
    await expect(queryParams).toBeVisible();
    await expect(queryParams).toContainText('"key"');
    await expect(queryParams).toContainText('"value"');
  });

  test("handles array query parameters", async ({ toolPage, page }) => {
    await toolPage.setInput(testData.urlValid);

    const queryParams = page.getByTestId("query-params");
    await expect(queryParams).toContainText('"arr"');
    await expect(queryParams).toContainText('"1"');
    await expect(queryParams).toContainText('"2"');
  });

  test("shows error for invalid URL", async ({ toolPage, page }) => {
    await toolPage.setInput(testData.urlInvalid);

    await expect(page.locator(".text-red-500")).toBeVisible();
  });

  test("handles URL without query params", async ({ toolPage, page }) => {
    await toolPage.setInput(testData.urlNoQuery);

    const components = page.getByTestId("url-components");
    await expect(components).toBeVisible();
    await expect(components).toContainText("example.com");

    const queryParams = page.getByTestId("query-params");
    await expect(queryParams).toContainText("{}");
  });

  test("copy button is visible", async ({ toolPage }) => {
    await expect(toolPage.copyButton).toBeVisible();
  });

  test("example parses Datadog URL components", async ({ toolPage, page }) => {
    await toolPage.loadExample();

    const components = page.getByTestId("url-components");
    await expect(components).toBeVisible();
    await expect(components).toContainText("app.datadoghq.com");
    await expect(components).toContainText("/logs");

    const queryParams = page.getByTestId("query-params");
    await expect(queryParams).toContainText('"query"');
    await expect(queryParams).toContainText('"live"');
  });
});
