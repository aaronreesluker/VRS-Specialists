/**
 * BlogSection - Server Component
 * Fetches data from WordPress
 * Part of the two-layer pattern (non-negotiable)
 */
import { getLatestPosts } from "@/lib/wordpress";
import BlogSectionClient from "./BlogSection.client";

export default async function BlogSection() {
  const posts = await getLatestPosts(3);

  // Don't render if no posts
  if (posts.length === 0) {
    return null;
  }

  return <BlogSectionClient posts={posts} />;
}

