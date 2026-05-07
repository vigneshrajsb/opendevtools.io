import { test, expect } from "../../fixtures/test-fixtures";
import { testData } from "../../fixtures/test-data";

test.describe("Mermaid Diagram Preview", { tag: ["@tools"] }, () => {
  test.beforeEach(async ({ toolPage }) => {
    await toolPage.goto("/mermaid-preview");
  });

  test("page loads correctly and example/clear work", async ({
    toolPage,
    page,
  }) => {
    await expect(toolPage.pageTitle).toHaveText("Mermaid Diagram Preview");
    await expect(toolPage.inputTextarea).toHaveValue("");

    await toolPage.loadExample();
    await expect(toolPage.inputTextarea).not.toHaveValue("");
    await expect(page.getByTestId("mermaid-diagram").locator("svg")).toBeVisible();

    await toolPage.clear();
    await expect(toolPage.inputTextarea).toHaveValue("");
    await expect(page.getByTestId("mermaid-diagram")).not.toBeVisible();
  });

  test("renders raw Mermaid input as SVG", async ({ toolPage, page }) => {
    await toolPage.setInput(testData.mermaidSample);

    const diagram = page.getByTestId("mermaid-diagram");
    await expect(diagram.locator("svg")).toBeVisible();
    await expect(diagram).toContainText("User");
    await expect(diagram).toContainText("API");
  });

  test("renders a fenced Mermaid block", async ({ toolPage, page }) => {
    await toolPage.setInput(testData.mermaidFencedSample);

    const diagram = page.getByTestId("mermaid-diagram");
    await expect(diagram.locator("svg")).toBeVisible();
    await expect(diagram).toContainText("Rendered SVG");
  });

  test("invalid Mermaid input shows an error", async ({ toolPage, page }) => {
    await toolPage.setInput(testData.mermaidInvalid);

    await expect(page.getByTestId("mermaid-error")).toBeVisible();
    await expect(page.getByTestId("mermaid-error")).toContainText(
      "Mermaid syntax error"
    );
  });

  test("expanded preview opens and closes", async ({ toolPage, page }) => {
    await toolPage.setInput(testData.mermaidSample);
    await expect(page.getByTestId("mermaid-diagram").locator("svg")).toBeVisible();

    await page.getByTestId("btn-expand").click();
    await expect(page.getByTestId("expanded-mermaid-diagram").locator("svg")).toBeVisible();

    await page.getByRole("button", { name: "Close expanded preview" }).click();
    await expect(page.getByTestId("expanded-mermaid-diagram")).not.toBeVisible();
  });

  test("expanded preview supports pan and zoom controls", async ({
    toolPage,
    page,
  }) => {
    await toolPage.setInput(testData.mermaidSample);
    await expect(page.getByTestId("mermaid-diagram").locator("svg")).toBeVisible();

    await page.getByTestId("btn-expand").click();
    const panLayer = page.getByTestId("mermaid-pan-layer");
    await expect(page.getByTestId("mermaid-zoom-level")).toHaveText("400%");

    await page.getByTestId("btn-zoom-in").click();
    await expect(page.getByTestId("mermaid-zoom-level")).toHaveText("420%");

    for (let index = 0; index < 19; index += 1) {
      await page.getByTestId("btn-zoom-in").click();
    }
    await expect(page.getByTestId("mermaid-zoom-level")).toHaveText("800%");
    await expect(page.getByTestId("btn-zoom-in")).toBeDisabled();

    await page.getByTestId("btn-reset-view").click();
    await expect(page.getByTestId("mermaid-zoom-level")).toHaveText("400%");

    await page.getByTestId("btn-zoom-out").click();
    await expect(page.getByTestId("mermaid-zoom-level")).toHaveText("380%");

    await page.getByTestId("btn-zoom-in").click();
    await page.getByTestId("btn-reset-view").click();
    await expect(page.getByTestId("mermaid-zoom-level")).toHaveText("400%");

    await page.getByTestId("mermaid-pan-viewport").focus();
    await page.keyboard.press("=");
    await expect(page.getByTestId("mermaid-zoom-level")).toHaveText("420%");
    await page.keyboard.press("-");
    await expect(page.getByTestId("mermaid-zoom-level")).toHaveText("400%");

    const beforeKeyboardPan = await panLayer.evaluate(
      (element) => (element as HTMLElement).style.transform
    );
    await page.keyboard.press("ArrowRight");
    await expect
      .poll(() =>
        panLayer.evaluate((element) => (element as HTMLElement).style.transform)
      )
      .not.toBe(beforeKeyboardPan);

    await page.getByTestId("btn-reset-view").click();
    await expect(page.getByTestId("mermaid-zoom-level")).toHaveText("400%");

    const beforeDrag = await panLayer.evaluate(
      (element) => (element as HTMLElement).style.transform
    );
    const viewportBox = await page.getByTestId("mermaid-pan-viewport").boundingBox();
    expect(viewportBox).not.toBeNull();

    if (viewportBox) {
      await page.mouse.move(
        viewportBox.x + viewportBox.width / 2,
        viewportBox.y + viewportBox.height / 2
      );
      await page.mouse.down();
      await page.mouse.move(
        viewportBox.x + viewportBox.width / 2 + 80,
        viewportBox.y + viewportBox.height / 2 + 40
      );
      await page.mouse.up();
    }

    await expect
      .poll(() =>
        panLayer.evaluate((element) => (element as HTMLElement).style.transform)
      )
      .not.toBe(beforeDrag);
  });
});
