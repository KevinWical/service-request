import "dotenv-defaults/config";
import { chromium, Page } from "playwright";

export async function createSession(url: string): Promise<Page> {
  // headless variable for testing locally vs Cron on GitHub
  const headless = process.env.HEADLESS === 'false' ? false : true;
  const browser = await chromium.launch({
    args: ["--window-size=1366,768"],
    headless: headless
  });
  const activePage = await browser.newPage();
  if (!activePage) {
    throw new Error("No page found");
  }

  await activePage.goto(url);

  return activePage;
}
