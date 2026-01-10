import { MetadataRoute } from "next";
import { getAllPostSlugs } from "@/lib/wordpress";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.vrsspecialists.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages - Only homepage for pitch/portfolio site
  // Other pages will be added when ready
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // Dynamic blog posts
  try {
    const postSlugs = await getAllPostSlugs();
    const blogPosts: MetadataRoute.Sitemap = postSlugs.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    return [...staticPages, ...blogPosts];
  } catch (error) {
    // If WordPress is not connected, return static pages only
    console.warn("Could not fetch blog posts for sitemap:", error);
    return staticPages;
  }
}

