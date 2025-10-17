// Local Poster System - manages blog posts from local folder
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface LocalPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  category?: string;
  tags?: string[];
  author?: string;
  publishDate: Date;
  updateDate: Date;
  draft?: boolean;
}

const POSTER_DIR = path.join(process.cwd(), 'src/data/post');

/**
 * Get all posts from the local poster folder
 */
export async function getLocalPosts(): Promise<LocalPost[]> {
  try {
    if (!fs.existsSync(POSTER_DIR)) {
      return [];
    }

    const files = fs.readdirSync(POSTER_DIR);
    const posts: LocalPost[] = [];

    for (const file of files) {
      if (file.endsWith('.md') || file.endsWith('.mdx')) {
        const post = await getLocalPost(file.replace(/\.(md|mdx)$/, ''));
        if (post && !post.draft) {
          posts.push(post);
        }
      }
    }

    // Sort by publish date (newest first)
    return posts.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  } catch (error) {
    console.error('Error reading local posts:', error);
    return [];
  }
}

/**
 * Get a single post by slug
 */
export async function getLocalPost(slug: string): Promise<LocalPost | null> {
  try {
    const filePath = path.join(POSTER_DIR, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      id: slug,
      slug,
      title: data.title || 'Untitled',
      excerpt: data.excerpt || '',
      content,
      image: data.image,
      category: data.category,
      tags: data.tags || [],
      author: data.author || 'Admin',
      publishDate: new Date(data.publishDate || Date.now()),
      updateDate: new Date(data.updateDate || data.publishDate || Date.now()),
      draft: data.draft || false,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

/**
 * Get posts by category
 */
export async function getLocalPostsByCategory(category: string): Promise<LocalPost[]> {
  const posts = await getLocalPosts();
  return posts.filter(post =>
    post.category?.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get posts by tag
 */
export async function getLocalPostsByTag(tag: string): Promise<LocalPost[]> {
  const posts = await getLocalPosts();
  return posts.filter(post =>
    post.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Search posts by title or content
 */
export async function searchLocalPosts(query: string): Promise<LocalPost[]> {
  const posts = await getLocalPosts();
  const searchTerm = query.toLowerCase();

  return posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm)
  );
}

/**
 * Create a new post in the poster folder
 */
export async function createLocalPost(postData: {
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  author?: string;
  draft?: boolean;
}): Promise<string> {
  const slug = postData.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();

  const now = new Date().toISOString();
  const frontmatter = {
    title: postData.title,
    publishDate: now,
    updateDate: now,
    ...(postData.excerpt && { excerpt: postData.excerpt }),
    ...(postData.category && { category: postData.category }),
    ...(postData.tags && { tags: postData.tags }),
    ...(postData.author && { author: postData.author }),
    ...(postData.draft !== undefined && { draft: postData.draft }),
  };

  const fileContent = matter.stringify(postData.content, frontmatter);
  const filePath = path.join(POSTER_DIR, `${slug}.md`);

  fs.writeFileSync(filePath, fileContent);

  return slug;
}

/**
 * Update an existing post
 */
export async function updateLocalPost(slug: string, updates: Partial<LocalPost>): Promise<boolean> {
  try {
    const existingPost = await getLocalPost(slug);
    if (!existingPost) return false;

    const updatedPost = { ...existingPost, ...updates, updateDate: new Date() };
    const frontmatter = {
      title: updatedPost.title,
      publishDate: updatedPost.publishDate.toISOString(),
      updateDate: updatedPost.updateDate.toISOString(),
      excerpt: updatedPost.excerpt,
      category: updatedPost.category,
      tags: updatedPost.tags,
      author: updatedPost.author,
      draft: updatedPost.draft,
    };

    const fileContent = matter.stringify(updatedPost.content, frontmatter);
    const filePath = path.join(POSTER_DIR, `${slug}.md`);

    fs.writeFileSync(filePath, fileContent);
    return true;
  } catch (error) {
    console.error(`Error updating post ${slug}:`, error);
    return false;
  }
}
