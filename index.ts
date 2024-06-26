import { serve } from "https://deno.land/std@0.106.0/http/server.ts";
import puppeteer from "https://deno.land/x/puppeteer/mod.ts";

const server = serve();

for await (const req of server) {
  const url = new URL(req.url, `http://${req.headers.get("host")}`);
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    req.respond({ status: 400, body: "Missing 'url' query parameter" });
    continue;
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(targetUrl, { waitUntil: "networkidle2" });
  const screenshot = await page.screenshot({ encoding: "base64" });
  await browser.close();

  req.respond({ status: 200, body: JSON.stringify({ screenshot }) });
}

