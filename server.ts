import { serve } from "https://deno.land/std@0.180.0/http/server.ts";
import { takeScreenshot } from "./puppeteer.ts";

const server = serve({ port: 8000 });

console.log("HTTP webserver running on port 8000");

for await (const req of server) {
  const url = new URL(req.url, `http://${req.headers.get("host")}`);
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    req.respond({ status: 400, body: "Missing 'url' query parameter" });
    continue;
  }

  try {
    const screenshot = await takeScreenshot(targetUrl);
    req.respond({ status: 200, body: JSON.stringify({ screenshot }) });
  } catch (error) {
    req.respond({ status: 500, body: `Failed to take screenshot: ${error.message}` });
  }
}

