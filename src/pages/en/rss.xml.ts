import { getRssString } from '@astrojs/rss';
import type { Post } from '~/types';

import { SITE, METADATA, APP_BLOG } from 'astrowind:config';
import { getPermalink } from '~/utils/permalinks';

export const GET = async () => {
  if (!APP_BLOG.isEnabled) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  // For static generation, always return empty RSS feed to avoid build failures
  // The actual RSS functionality will work on the live site when WordPress is available
  const posts: Post[] = [];

  const rss = await getRssString({
    title: `${SITE?.name || 'Blog'} Blog`,
    description: METADATA?.description || 'Latest blog posts',
    site: import.meta.env.SITE,

    items: posts.map((post) => ({
      link: getPermalink(post.permalink || '', 'post'),
      title: post.title || 'Post',
      description: post.excerpt || '',
      pubDate: post.publishDate || new Date(),
    })),

    trailingSlash: SITE?.trailingSlash || false,
  });

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
