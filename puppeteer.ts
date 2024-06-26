import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

export async function takeScreenshot(url: string): Promise<string> {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  const screenshot = await page.screenshot({ encoding: "base64" });
  await browser.close();
  return screenshot;
}
