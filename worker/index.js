export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      if (url.pathname === '/api/health') {
        return Response.json({
          ok: true,
          databaseConfigured: Boolean(env.DB),
          geminiConfigured: Boolean(env.GEMINI_API_KEY)
        });
      }

      if (url.pathname.startsWith('/api/')) {
        return Response.json({ error: 'Not found' }, { status: 404 });
      }

      return await env.ASSETS.fetch(request);
    } catch (error) {
      console.error(JSON.stringify({
        message: 'request failed',
        path: url.pathname,
        error: error instanceof Error ? error.message : String(error)
      }));
      return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
};
