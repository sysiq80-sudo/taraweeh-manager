// Cloudflare Worker - SPA Router
// Serves static assets from dist/, falls back to index.html for SPA routes
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const accept = request.headers.get("accept") || "";
    const isHtmlRequest = accept.includes("text/html");
    const hasExtension = /\.[a-zA-Z0-9]+$/.test(url.pathname);

    // Try to serve the static asset directly
    const assetResponse = await env.ASSETS.fetch(request);

    // If asset found (not 404), return it
    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    // SPA fallback: only for HTML navigation without a file extension
    if (isHtmlRequest && !hasExtension) {
      return env.ASSETS.fetch(new URL("/index.html", url.origin));
    }

    return new Response("Not Found", { status: 404 });
  },
};
