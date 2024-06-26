import { takeScreenshot } from "./puppeteer.ts";

Deno.serve(async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return (
      new Response("Missing 'url' query parameter", { status: 400 })
    );
  }

  try {
    const screenshot = await takeScreenshot(targetUrl);
    return new Response(JSON.stringify({ screenshot }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(`Failed to take screenshot: ${error.message}`, {
      status: 500,
    });
  }
});
