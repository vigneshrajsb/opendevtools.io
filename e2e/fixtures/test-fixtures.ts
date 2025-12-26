import { test as base, expect } from "@playwright/test";
import { ToolPage } from "../page-objects/tool-page";
import { SidebarPage } from "../page-objects/sidebar";
import { NavbarPage } from "../page-objects/navbar";

type Fixtures = {
  toolPage: ToolPage;
  sidebarPage: SidebarPage;
  navbarPage: NavbarPage;
};

export const test = base.extend<Fixtures>({
  toolPage: async ({ page }, use) => {
    const toolPage = new ToolPage(page);
    await use(toolPage);
  },

  sidebarPage: async ({ page }, use) => {
    const sidebarPage = new SidebarPage(page);
    await use(sidebarPage);
  },

  navbarPage: async ({ page }, use) => {
    const navbarPage = new NavbarPage(page);
    await use(navbarPage);
  },
});

export { expect };
