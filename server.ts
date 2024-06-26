import { takeScreenshot } from "./puppeteer.ts";

const listener = Deno.listen({ port: 8000 });

console.log("HTTP webserver running on port 8000");

for await (const conn of listener) {
  handle(conn);
}

async function handle(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    const url = new URL(requestEvent.request.url);
    const targetUrl = url.searchParams.get("url");

    if (!targetUrl) {
      requestEvent.respondWith(
        new Response("Missing 'url' query parameter", { status: 400 })
      );
      continue;
    }

    try {
      const screenshot = await takeScreenshot(targetUrl);
      requestEvent.respondWith(
        new Response(JSON.stringify({ screenshot }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      );
    } catch (error) {
      requestEvent.respondWith(
        new Response(`Failed to take screenshot: ${error.message}`, {
          status: 500,
        })
      );
    }
  }
}

