/**
 * WordPress API Layer
 * Single source of truth for all CMS data
 */

export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  featured_media: number;
  featured_media_url?: string;
  categories: number[];
  tags: number[];
}

interface WordPressAPIError {
  code: string;
  message: string;
  data?: {
    status: number;
  };
}

const WORDPRESS_SITE_ID = process.env.WORDPRESS_SITE_ID;
const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.vrsspecialists.com";

/**
 * Get WordPress API base URL
 * Returns null if WORDPRESS_SITE_ID is not configured
 */
function getWordPressAPIBase(): string | null {
  if (!WORDPRESS_SITE_ID) {
    return null;
  }

  // For WordPress.com sites, use the public API
  return `https://public-api.wordpress.com/rest/v1.1/sites/${WORDPRESS_SITE_ID}`;
}

/**
 * Fetch posts list from WordPress
 */
export async function getPostsList(perPage: number = 10, page: number = 1): Promise<{
  posts: WordPressPost[];
  total: number;
  totalPages: number;
}> {
  try {
    const baseUrl = getWordPressAPIBase();
    if (!baseUrl) {
      console.warn("WORDPRESS_SITE_ID not configured. WordPress features disabled.");
      return {
        posts: [],
        total: 0,
        totalPages: 0,
      };
    }
    const response = await fetch(
      `${baseUrl}/posts?number=${perPage}&page=${page}&status=publish&orderby=date&order=desc`,
      {
        next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error: WordPressAPIError = await response.json().catch(() => ({
        code: "fetch_error",
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(error.message || "Failed to fetch posts");
    }

    const data = await response.json();
    
    // WordPress.com API returns posts in a specific format
    const posts: WordPressPost[] = data.posts || [];
    const total = data.found || 0;
    const totalPages = data.pages || 1;

    // Enhance posts with featured media URLs if available
    const postsWithMedia = await Promise.all(
      posts.map(async (post) => {
        if (post.featured_media) {
          try {
            const mediaResponse = await fetch(
              `${baseUrl}/media/${post.featured_media}`,
              { next: { revalidate: 3600 } }
            );
            if (mediaResponse.ok) {
              const mediaData = await mediaResponse.json();
              post.featured_media_url = mediaData.source || mediaData.URL;
            }
          } catch (e) {
            // Silent fail for featured media
          }
        }
        return post;
      })
    );

    return {
      posts: postsWithMedia,
      total,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching posts list:", error);
    return {
      posts: [],
      total: 0,
      totalPages: 0,
    };
  }
}

/**
 * Get post by slug
 */
export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  try {
    const baseUrl = getWordPressAPIBase();
    if (!baseUrl) {
      console.warn("WORDPRESS_SITE_ID not configured. WordPress features disabled.");
      return null;
    }
    const response = await fetch(
      `${baseUrl}/posts/slug:${slug}?status=publish`,
      {
        next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }

    const post: WordPressPost = await response.json();

    // Fetch featured media if available
    if (post.featured_media) {
      try {
        const mediaResponse = await fetch(
          `${baseUrl}/media/${post.featured_media}`,
          { next: { revalidate: 3600 } }
        );
        if (mediaResponse.ok) {
          const mediaData = await mediaResponse.json();
          post.featured_media_url = mediaData.source || mediaData.URL;
        }
      } catch (e) {
        // Silent fail for featured media
      }
    }

    return post;
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return null;
  }
}

/**
 * Get all post slugs for static generation
 */
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const baseUrl = getWordPressAPIBase();
    if (!baseUrl) {
      console.warn("WORDPRESS_SITE_ID not configured. WordPress features disabled.");
      return [];
    }
    const response = await fetch(
      `${baseUrl}/posts?number=100&status=publish&fields=slug`,
      {
        next: { revalidate: 3600 }, // Revalidate hourly
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch post slugs: ${response.statusText}`);
    }

    const data = await response.json();
    const posts: WordPressPost[] = data.posts || [];
    return posts.map((post) => post.slug);
  } catch (error) {
    console.error("Error fetching post slugs:", error);
    return [];
  }
}

/**
 * Get latest posts for homepage preview
 */
export async function getLatestPosts(limit: number = 3): Promise<WordPressPost[]> {
  const result = await getPostsList(limit, 1);
  return result.posts;
}
