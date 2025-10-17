// Script to trigger GitHub Actions deployment from WordPress webhook
// This script can be called from your WordPress site to trigger automatic rebuilds

const https = require('https');
const crypto = require('crypto');

async function triggerGitHubDeployment() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'your-username';
  const REPO_NAME = process.env.GITHUB_REPO_NAME || 'your-repo-name';

  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN environment variable is required');
  }

  const data = JSON.stringify({
    event_type: 'wordpress_webhook',
    client_payload: {
      timestamp: new Date().toISOString(),
      source: 'wordpress'
    }
  });

  const options = {
    hostname: 'api.github.com',
    port: 443,
    path: `/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'WordPress-Webhook/1.0'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 204) {
          console.log('✅ GitHub deployment triggered successfully');
          resolve({ success: true, statusCode: res.statusCode });
        } else {
          console.error('❌ Failed to trigger GitHub deployment:', body);
          reject(new Error(`GitHub API error: ${res.statusCode} ${body}`));
        }
      });
    });

    req.on('error', (err) => {
      console.error('❌ Network error triggering GitHub deployment:', err);
      reject(err);
    });

    req.write(data);
    req.end();
  });
}

// Export for use in other scripts
module.exports = { triggerGitHubDeployment };

// If run directly
if (require.main === module) {
  triggerGitHubDeployment()
    .then(() => {
      console.log('🚀 Deployment trigger completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Deployment trigger failed:', error.message);
      process.exit(1);
    });
}
