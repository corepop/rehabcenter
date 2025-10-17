import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request }) => {
  // Verify webhook secret for security
  const authHeader = request.headers.get('authorization');
  const expectedSecret = process.env.REBUILD_SECRET;

  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    console.log('🔄 WordPress rebuild requested at:', new Date().toISOString());

    // For GitHub Pages deployment, we don't need to trigger anything
    // The workflow will run automatically on webhook or push to main
    console.log('🔄 WordPress rebuild requested at:', new Date().toISOString());

    return new Response(JSON.stringify({
      success: true,
      message: 'Rebuild request received. Deploy via GitHub Actions or push to main branch.',
      timestamp: new Date().toISOString(),
      deployment: {
        method: 'github_pages',
        trigger: 'manual_or_push_required',
        note: 'Push to main branch or trigger workflow manually in GitHub Actions'
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('💥 Rebuild request failed:', error);

    return new Response(JSON.stringify({
      success: false,
      error: 'Rebuild request failed',
      message: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
