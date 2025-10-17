// WordPress RSS Feed Generator
import type { Post } from '~/types';
import { SITE, METADATA, APP_BLOG } from 'astrowind:config';
import { fetchPosts } from '~/lib/blog-wordpress';
import { getPermalink } from '~/utils/permalinks';

const posts = await fetchPosts();

export async function GET(context: { url: URL }) {
  const { url } = context;

  if (!APP_BLOG.isEnabled) {
    return new Response('', {
      status: 404,
      statusText: 'Not found',
    });
  }

  const rss = generateRSSResponse(posts, url);

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

function generateRSSResponse(posts: Post[], cdnUrl: URL) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title><![CDATA[${SITE?.name}]]></title>
<description><![CDATA[${METADATA?.description}]]></description>
<link>${new URL(getPermalink('/blogg'), cdnUrl)}</link>
<atom:link href="${new URL('rss.xml', cdnUrl)}" rel="self" type="application/rss+xml"/>
${posts
  .map((post) => `<item>
  <title><![CDATA[${post.title}]]></title>
  <description><![CDATA[${post.excerpt}]]></description>
  <link>${new URL(getPermalink(post.permalink, 'post'), cdnUrl).href}</link>
  <guid isPermaLink="true">${new URL(getPermalink(post.permalink, 'post'), cdnUrl).href}</guid>
  <pubDate>${post.publishDate.toUTCString()}</pubDate>
  <author><![CDATA[${post.author}]]></author>
  <category><![CDATA[${post.category?.title || ''}]]></category>
  ${post.tags ? post.tags.map((tag: { title: string }) => `<category><![CDATA[${tag.title}]]></category>`).join('') : ''}
</item>`)
  .join('')}
</channel>
</rss>`
}
