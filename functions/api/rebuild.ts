export async function onRequestPost({ request, env }) {
  // Verify webhook secret for security
  const authHeader = request.headers.get('authorization');
  const expectedSecret = env.REBUILD_SECRET;

  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    console.log('🔄 WordPress rebuild requested at:', new Date().toISOString());

    // For Cloudflare Pages, we have two options:
    // 1. Trigger a rebuild via Cloudflare API (requires API token)
    // 2. Simply acknowledge and let git push handle deployment

    const CLOUDFLARE_API_TOKEN = env.CLOUDFLARE_API_TOKEN;
    const CLOUDFLARE_ACCOUNT_ID = env.CLOUDFLARE_ACCOUNT_ID;
    const CLOUDFLARE_PROJECT_NAME = env.CLOUDFLARE_PROJECT_NAME;

    // Option 1: Direct Cloudflare Pages API trigger (if tokens available)
    if (CLOUDFLARE_API_TOKEN && CLOUDFLARE_ACCOUNT_ID && CLOUDFLARE_PROJECT_NAME) {
      try {
        const response = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/${CLOUDFLARE_PROJECT_NAME}/deployments`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              branch: 'main'
            })
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Cloudflare Pages deployment triggered successfully');

          return new Response(JSON.stringify({
            success: true,
            message: 'Rebuild request received and Cloudflare Pages deployment triggered.',
            timestamp: new Date().toISOString(),
            deployment: {
              method: 'cloudflare_pages',
              trigger: 'api_automatic',
              deployment_id: result.result?.id,
              status: 'Deployment initiated'
            }
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } else {
          const errorText = await response.text();
          console.error('❌ Cloudflare Pages API trigger failed:', response.status, errorText);
        }
      } catch (apiError) {
        console.error('❌ Cloudflare Pages API error:', apiError);
      }
    }

    // Option 2: Fallback - acknowledge webhook (git push will trigger build)
    console.log('📝 Webhook received - Cloudflare Pages will build on next git push');

    return new Response(JSON.stringify({
      success: true,
      message: 'Rebuild request received. Cloudflare Pages will build on next git push.',
      timestamp: new Date().toISOString(),
      deployment: {
        method: 'cloudflare_pages',
        trigger: 'git_push_required',
        note: 'Push to main branch or trigger rebuild manually in Cloudflare Pages dashboard',
        project_url: `https://dash.cloudflare.com/pages/${CLOUDFLARE_ACCOUNT_ID}/${CLOUDFLARE_PROJECT_NAME}`
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
      message: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestGet() {
  return new Response(JSON.stringify({
    success: true,
    message: 'Rebuild API endpoint is working. Use POST method to trigger rebuild.',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
