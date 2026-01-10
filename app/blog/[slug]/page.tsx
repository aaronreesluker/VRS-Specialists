import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getAllPostSlugs } from "@/lib/wordpress";

export const revalidate = 60; // ISR: revalidate every 60 seconds

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  // Strip HTML tags from excerpt for description
  const excerpt = post.excerpt.rendered
    .replace(/<[^>]*>/g, "")
    .substring(0, 160);

  return {
    title: post.title.rendered,
    description: excerpt,
    openGraph: {
      title: post.title.rendered,
      description: excerpt,
      images: post.featured_media_url
        ? [post.featured_media_url]
        : undefined,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const publishDate = new Date(post.date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="pt-20">
      <article className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8 font-medium"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-4">
              {post.title.rendered}
            </h1>
            <div className="text-dark-600">
              Published on {publishDate}
            </div>
          </header>

          {/* Featured Image */}
          {post.featured_media_url && (
            <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden">
              <Image
                src={post.featured_media_url}
                alt={post.title.rendered}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-dark-900 prose-p:text-dark-700 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-dark-900 prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/blog"
              className="btn-secondary"
            >
              View All Posts
            </Link>
          </footer>
        </div>
      </article>
    </div>
  );
}

