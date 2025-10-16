// Simple WordPress headless CMS integration for Astro
// Based on: https://docs.astro.build/en/guides/cms/wordpress/

import { processContentForDisplay, processExcerptForDisplay } from './shortcodes';

export interface WordPressPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    author?: Array<{
      id: number;
      name: string;
      avatar_urls?: Record<string, string>;
    }>;
    'wp:featuredmedia'?: Array<{
      id: number;
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
}

const WORDPRESS_URL = import.meta.env.WORDPRESS_URL || 'https://your-wordpress-site.com';

export async function fetchWordPressPosts(params?: {
  per_page?: number;
  page?: number;
  search?: string;
  categories?: number[];
  tags?: number[];
  slug?: string;
}): Promise<WordPressPost[]> {
  const url = new URL(`${WORDPRESS_URL}/wp-json/wp/v2/posts`);

  // Add default parameters
  const queryParams = {
    _embed: 'true',
    status: 'publish',
    ...params,
  };

  // Add parameters to URL
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        url.searchParams.append(key, value.join(','));
      } else {
        url.searchParams.append(key, String(value));
      }
    }
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchWordPressPost(id: number): Promise<WordPressPost> {
  const response = await fetch(
    `${WORDPRESS_URL}/wp-json/wp/v2/posts/${id}?_embed=true`
  );

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchWordPressCategories(): Promise<Array<{
  id: number;
  name: string;
  slug: string;
  count: number;
}>> {
  const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/categories`);

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchWordPressTags(): Promise<Array<{
  id: number;
  name: string;
  slug: string;
  count: number;
}>> {
  const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/tags`);

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Convert WordPress post to Astro's Post type
export function convertWordPressPostToPost(wpPost: WordPressPost) {
  const embedded = wpPost._embedded || {};

  // Get featured image
  const featuredMedia = embedded['wp:featuredmedia']?.[0];
  const image = featuredMedia?.source_url || '~/assets/images/default.png';

  // Get author
  const author = embedded.author?.[0];
  const authorName = author?.name || 'Unknown';

  // Get categories and tags
  const terms = embedded['wp:term'] || [];
  const categories = terms[0]?.map(cat => ({
    slug: cat.slug,
    title: cat.name,
  })) || [];

  const tags = terms[1]?.map(tag => ({
    slug: tag.slug,
    title: tag.name,
  })) || [];

  // Convert dates
  const publishDate = new Date(wpPost.date);
  const updateDate = new Date(wpPost.modified);

  return {
    id: wpPost.id.toString(),
    slug: wpPost.slug,
    permalink: wpPost.slug,

    publishDate,
    updateDate,

    title: wpPost.title.rendered,
    excerpt: processExcerptForDisplay(wpPost.excerpt.rendered),
    image,

    category: categories[0],
    tags,
    author: authorName,

    draft: wpPost.status !== 'publish',

    metadata: {},

    content: processContentForDisplay(wpPost.content.rendered, 'full'),
    readingTime: undefined,
  };
}
