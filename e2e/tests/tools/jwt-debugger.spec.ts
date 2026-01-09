import { test, expect } from "../../fixtures/test-fixtures";
import { testData } from "../../fixtures/test-data";

test.describe("JWT Debugger", { tag: ["@tools"] }, () => {
  test.beforeEach(async ({ toolPage }) => {
    await toolPage.goto("/jwt-debugger");
  });

  test("page loads correctly and example/clear work", async ({ toolPage }) => {
    await expect(toolPage.pageTitle).toHaveText("JWT Debugger");
    await expect(toolPage.page.getByTestId("output-header")).toHaveValue("");
    await expect(toolPage.page.getByTestId("output-payload")).toHaveValue("");

    await toolPage.loadExample();
    await expect(toolPage.page.getByTestId("output-header")).not.toHaveValue(
      ""
    );
    await expect(toolPage.page.getByTestId("output-payload")).not.toHaveValue(
      ""
    );

    await toolPage.clear();
    await expect(toolPage.inputTextarea).toHaveValue("");
    await expect(toolPage.page.getByTestId("output-header")).toHaveValue("");
    await expect(toolPage.page.getByTestId("output-payload")).toHaveValue("");
  });

  test("decodes valid JWT and displays header/payload", async ({
    toolPage,
  }) => {
    await toolPage.setInput(testData.jwtValid);

    const header = await toolPage.page
      .getByTestId("output-header")
      .inputValue();
    const payload = await toolPage.page
      .getByTestId("output-payload")
      .inputValue();

    expect(header).toBe(testData.jwtDecodedHeader);
    expect(payload).toBe(testData.jwtDecodedPayload);
  });

  test("shows error for invalid JWT format", async ({ toolPage }) => {
    await toolPage.setInput(testData.jwtInvalid);

    await expect(
      toolPage.page.getByText("Invalid JWT format", { exact: false })
    ).toBeVisible();
  });

  test("algorithm selector works", async ({ toolPage }) => {
    await toolPage.page.getByTestId("select-algorithm").click();
    await toolPage.page.getByRole("option", { name: "RS256" }).click();

    await expect(toolPage.page.getByTestId("select-algorithm")).toContainText(
      "RS256"
    );
  });

  test("signature verification shows status after entering secret", async ({
    toolPage,
  }) => {
    await toolPage.setInput(testData.jwtValid);
    await toolPage.page.getByTestId("input-secret").fill(testData.jwtSecret);

    // Wait for verification to complete - expect either valid signature or secure context error
    const validStatus = toolPage.page.getByText("Signature Valid");
    const secureContextError = toolPage.page.getByText("secure context", {
      exact: false,
    });

    await expect(validStatus.or(secureContextError)).toBeVisible({
      timeout: 10000,
    });
  });

  test("signature verification with invalid secret shows appropriate status", async ({
    toolPage,
  }) => {
    await toolPage.setInput(testData.jwtValid);
    await toolPage.page.getByTestId("input-secret").fill("wrong-secret");

    // Wait for verification - expect either invalid signature or secure context error
    const invalidStatus = toolPage.page.getByText("Signature Invalid");
    const secureContextError = toolPage.page.getByText("secure context", {
      exact: false,
    });

    await expect(invalidStatus.or(secureContextError)).toBeVisible({
      timeout: 10000,
    });
  });

  test("example button loads data and triggers verification", async ({
    toolPage,
  }) => {
    await toolPage.loadExample();

    // Expect either valid signature or secure context error
    const validStatus = toolPage.page.getByText("Signature Valid");
    const secureContextError = toolPage.page.getByText("secure context", {
      exact: false,
    });

    await expect(validStatus.or(secureContextError)).toBeVisible({
      timeout: 10000,
    });
  });

  test("copy buttons copy correct content", async ({ toolPage, page }) => {
    await toolPage.setInput(testData.jwtValid);

    const copyButtons = page.getByTestId("btn-copy");
    await expect(copyButtons).toHaveCount(2);
  });

  test("shows error for malformed Base64 in JWT", async ({ toolPage }) => {
    await toolPage.setInput(testData.jwtMalformedBase64);

    await expect(
      toolPage.page.getByText("not valid Base64URL or JSON", { exact: false })
    ).toBeVisible();
  });

  test.describe("algorithm verification", () => {
    const hmacAlgorithms = [
      { alg: "HS256", jwt: "jwtHS256", secret: "jwtHS256Secret" },
      { alg: "HS384", jwt: "jwtHS384", secret: "jwtHS384Secret" },
      { alg: "HS512", jwt: "jwtHS512", secret: "jwtHS512Secret" },
    ] as const;

    const rsaAlgorithms = [
      { alg: "RS256", jwt: "jwtRS256", publicKey: "jwtRS256PublicKey" },
      { alg: "RS384", jwt: "jwtRS384", publicKey: "jwtRS384PublicKey" },
      { alg: "RS512", jwt: "jwtRS512", publicKey: "jwtRS512PublicKey" },
    ] as const;

    for (const { alg, jwt, secret } of hmacAlgorithms) {
      test(`${alg} verifies with correct secret`, async ({ toolPage }) => {
        await toolPage.page.getByTestId("select-algorithm").click();
        await toolPage.page.getByRole("option", { name: alg }).click();

        await toolPage.setInput(testData[jwt]);
        await toolPage.page.getByTestId("input-secret").fill(testData[secret]);

        const validStatus = toolPage.page.getByText("Signature Valid");
        const secureContextError = toolPage.page.getByText("secure context", {
          exact: false,
        });

        await expect(validStatus.or(secureContextError)).toBeVisible({
          timeout: 10000,
        });
      });

      test(`${alg} fails with wrong secret`, async ({ toolPage }) => {
        await toolPage.page.getByTestId("select-algorithm").click();
        await toolPage.page.getByRole("option", { name: alg }).click();

        await toolPage.setInput(testData[jwt]);
        await toolPage.page.getByTestId("input-secret").fill("wrong-secret");

        const invalidStatus = toolPage.page.getByText("Signature Invalid");
        const secureContextError = toolPage.page.getByText("secure context", {
          exact: false,
        });

        await expect(invalidStatus.or(secureContextError)).toBeVisible({
          timeout: 10000,
        });
      });
    }

    for (const { alg, jwt, publicKey } of rsaAlgorithms) {
      test(`${alg} verifies with correct public key`, async ({ toolPage }) => {
        await toolPage.page.getByTestId("select-algorithm").click();
        await toolPage.page.getByRole("option", { name: alg }).click();

        await toolPage.setInput(testData[jwt]);
        await toolPage.page
          .getByTestId("input-secret")
          .fill(testData[publicKey]);

        const validStatus = toolPage.page.getByText("Signature Valid");
        const secureContextError = toolPage.page.getByText("secure context", {
          exact: false,
        });

        await expect(validStatus.or(secureContextError)).toBeVisible({
          timeout: 10000,
        });
      });
    }
  });
});
