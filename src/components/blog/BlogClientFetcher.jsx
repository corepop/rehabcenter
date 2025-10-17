import { useState, useEffect } from 'react';

const WORDPRESS_URL = import.meta.env.WORDPRESS_URL || 'https://rygg.nu/wordpress/wp-json/wp/v2/';

export default function BlogClientFetcher({ children, endpoint, params = {}, render }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const url = new URL(endpoint, WORDPRESS_URL);
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`WordPress API error: ${response.status}`);
        }

        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [endpoint, JSON.stringify(params)]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Laddar blogginlägg...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 py-4">
        Kunde inte ladda blogginlägg. Vänligen försök igen senare.
      </div>
    );
  }

  if (render && typeof render === 'function') {
    return render(data);
  }

  return children ? children(data) : null;
}

// Pre-built components for common use cases
export function BlogPostsList({ perPage = 10 }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Blogg</h1>
      <BlogClientFetcher
        endpoint="posts"
        params={{ per_page: perPage, _embed: true }}
        render={(posts) => (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts && posts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                  <img
                    src={post._embedded['wp:featuredmedia'][0].source_url}
                    alt={post.title.rendered}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {post.title.rendered}
                  </h2>
                  <div
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                    className="text-gray-600 mb-4"
                  />
                  <a
                    href={`/blogg/${post.slug}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Läs mer →
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      />
    </div>
  );
}

export function SingleBlogPost({ slug }) {
  return (
    <BlogClientFetcher
      endpoint={`posts?slug=${slug}`}
      params={{ _embed: true }}
      render={(posts) => {
        const post = posts?.[0];
        if (!post) {
          return <div className="text-center py-8">Inlägg hittades inte.</div>;
        }

        return (
          <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {post.title.rendered}
            </h1>

            {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
              <img
                src={post._embedded['wp:featuredmedia'][0].source_url}
                alt={post.title.rendered}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}

            <div
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              className="prose prose-lg max-w-none"
            />
          </article>
        );
      }}
    />
  );
}
