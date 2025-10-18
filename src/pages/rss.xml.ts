// WordPress RSS Feed Generator
import type { Post } from '~/types';
import { SITE, METADATA, APP_BLOG } from 'astrowind:config';
import { getPermalink } from '~/utils/permalinks';

// Try to fetch posts directly from REST API, but don't fail if WordPress API is unavailable
let posts: Post[] = [];
try {
  const WORDPRESS_API_URL = 'https://blogg.rygg.nu/wp-json/wp/v2/posts';
  const response = await fetch(`${WORDPRESS_API_URL}?per_page=50&_embed`);
  const wpPosts = await response.json();

  posts = await Promise.all(
    wpPosts.map(async (wpPost: any) => {
      const post: Post = {
        slug: wpPost.slug,
        publishDate: new Date(wpPost.date),
        title: wpPost.title.rendered,
        excerpt: wpPost.excerpt.rendered.replace(/<[^>]*>/g, '').trim(),
        image: wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url,
        category: {
          slug: wpPost._embedded?.['wp:term']?.[0]?.[0]?.slug,
          title: wpPost._embedded?.['wp:term']?.[0]?.[0]?.name,
        },
        author: wpPost._embedded?.['wp:term']?.[0]?.[0]?.name || 'Johny Åhman',
        content: wpPost.content.rendered.replace(/<[^>]*>/g, '').trim(),
        draft: wpPost.status !== 'publish',
        id: wpPost.id.toString(),
        permalink: wpPost.slug,
        updateDate: new Date(wpPost.modified),
        tags: wpPost._embedded?.['wp:term']?.[1]?.map((tag: any) => ({ slug: tag.slug, title: tag.name })) || [],
        metadata: {},
        readingTime: undefined,
      };
      return post;
    })
  );
} catch (error) {
  // Log error but continue with empty posts array
  console.warn(`RSS generation: WordPress REST API failed (${error?.message || 'unknown error'}), generating empty feed`);
  posts = [];
}

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
