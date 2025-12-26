# E2E Testing

E2E tests use Playwright. All new tools must have tests.

## Test Structure

```
e2e/
├── fixtures/           # Shared fixtures and test data
│   ├── test-fixtures.ts
│   └── test-data.ts    # Add tool to `tools` array here
├── page-objects/       # Page object classes
│   └── tool-page.ts    # Reusable tool page interactions
└── tests/
    ├── tools/          # Functional tests per tool
    │   └── [tool-name].spec.ts
    └── visual/         # Visual regression (auto-generated from tools array)
        └── snapshots.spec.ts
```

## Adding Tests for a New Tool

1. **Add to test-data.ts**: Add your tool to the `tools` array in `e2e/fixtures/test-data.ts`
2. **Create functional test**: `e2e/tests/tools/[tool-name].spec.ts`
3. **Visual tests**: Auto-generated from `tools` array (no action needed)

## Test Template

```typescript
import { test, expect } from "../../fixtures/test-fixtures";
import { testData } from "../../fixtures/test-data";

test.describe("Tool Name", { tag: ["@tools"] }, () => {
  test.beforeEach(async ({ toolPage }) => {
    await toolPage.goto("/tool-path");
  });

  test("page loads correctly and example/clear work", async ({ toolPage }) => {
    await expect(toolPage.pageTitle).toHaveText("Tool Name");
    await expect(toolPage.outputTextarea).toHaveValue("");

    await toolPage.loadExample();
    await expect(toolPage.outputTextarea).not.toHaveValue("");

    await toolPage.clear();
    await expect(toolPage.inputTextarea).toHaveValue("");
  });

  test("valid input produces expected output", async ({ toolPage }) => {
    await toolPage.setInput(testData.validInput);
    const output = await toolPage.getOutput();
    expect(output).toContain("expected");
  });

  test("invalid input shows error", async ({ toolPage }) => {
    await toolPage.setInput(testData.invalidInput);
    await expect(toolPage.outputTextarea).toHaveValue(/error/i);
  });
});
```

## Test Tags

| Tag | Usage |
|-----|-------|
| `@tools` | All tool tests (add to describe block) |
| `@smoke` | Critical tests for quick CI validation |
| `@navbar` | Navbar/command palette tests |
| `@sidebar` | Sidebar/favorites tests |
| `@visual` | Visual regression tests |

## Running Tests

```bash
pnpm test:e2e                    # Run all tests
pnpm test:e2e --grep @smoke      # Run smoke tests only
pnpm test:e2e --grep @tools      # Run tool tests only
pnpm test:e2e --grep-invert @visual  # Skip visual tests
```

## Docker (Linux snapshots for CI)

Visual snapshots differ between macOS and Linux. Use Docker to generate Linux-compatible snapshots:

```bash
tilt up                      # Start dev server
tilt trigger e2e-tests       # Run tests in Linux container
tilt trigger update-snapshots # Generate Linux snapshots
```
