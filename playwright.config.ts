import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e/tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { outputFolder: "playwright-report" }], ["list"]],
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],

  webServer: process.env.BASE_URL
    ? undefined // Skip webServer when BASE_URL is set (external server)
    : {
        command: "pnpm dev",
        url: "http://localhost:3000",
        timeout: 120 * 1000,
        reuseExistingServer: true,
      },

  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05,
    },
  },
});
