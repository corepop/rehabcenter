import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request }) => {
  // Verify webhook secret for security
  const authHeader = request.headers.get('authorization');
  const expectedSecret = process.env.REBUILD_SECRET;

  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // For manual deployments, just log the rebuild request
    console.log('🔄 WordPress rebuild requested at:', new Date().toISOString());

    // You can add custom logic here, such as:
    // - Sending notifications
    // - Triggering local build scripts
    // - Updating timestamps

    return new Response(JSON.stringify({
      success: true,
      message: 'Rebuild request received. Run "npm run build" to update content.',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Rebuild request failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Rebuild request failed'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
