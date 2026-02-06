// Cloudflare Worker - SPA Router
// Serves static assets from dist/, falls back to index.html for SPA routes
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Try to serve the static asset directly
    const assetResponse = await env.ASSETS.fetch(request);

    // If asset found (not 404), return it
    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    // SPA fallback: serve index.html for any non-file route
    return env.ASSETS.fetch(new URL("/index.html", url.origin));
  },
};
