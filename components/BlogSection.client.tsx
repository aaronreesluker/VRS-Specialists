"use client";

/**
 * BlogSectionClient - Client Component
 * Handles UI and animations
 * Part of the two-layer pattern (non-negotiable)
 */

import Link from "next/link";
import Image from "next/image";
import { WordPressPost } from "@/lib/wordpress";

interface BlogSectionClientProps {
  posts: WordPressPost[];
}

export default function BlogSectionClient({ posts }: BlogSectionClientProps) {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="mb-4">Latest from Our Blog</h2>
          <p className="text-lg text-dark-700 max-w-2xl mx-auto">
            Expert tips, guides, and insights on vehicle care and detailing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-primary-500 transition-all hover:shadow-lg"
            >
              {post.featured_media_url && (
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={post.featured_media_url}
                      alt={post.title.rendered}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </Link>
              )}
              <div className="p-6">
                <div className="text-sm text-dark-600 mb-2">
                  {new Date(post.date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-xl font-bold text-dark-900 mb-3 hover:text-primary-600 transition-colors">
                    {post.title.rendered}
                  </h3>
                </Link>
                <div
                  className="text-dark-700 mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: post.excerpt.rendered,
                  }}
                />
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-primary-600 font-semibold hover:underline"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Link href="/blog" className="btn-secondary">
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  );
}

