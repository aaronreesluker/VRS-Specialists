import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPostsList } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Blog - Car Detailing Tips, Guides & News",
  description:
    "Expert advice, tips, and guides on car detailing, paint correction, ceramic coating, and vehicle care from VRS Specialists.",
  openGraph: {
    title: "Blog - VRS Specialists",
    description: "Expert advice and guides on car detailing and vehicle care.",
  },
};

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = parseInt(searchParams.page || "1", 10);
  const { posts, totalPages } = await getPostsList(10, currentPage);

  return (
    <div className="pt-20">
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="mb-4">Blog</h1>
            <p className="text-lg text-dark-700 max-w-2xl mx-auto">
              Expert advice, tips, and guides on car detailing, paint
              correction, and vehicle care.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-dark-700 mb-4">
                No blog posts available yet.
              </p>
              <p className="text-dark-600">
                Check back soon for expert tips and guides on vehicle care.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                        <h2 className="text-xl font-bold text-dark-900 mb-3 hover:text-primary-600 transition-colors">
                          {post.title.rendered}
                        </h2>
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4">
                  {currentPage > 1 && (
                    <Link
                      href={`/blog?page=${currentPage - 1}`}
                      className="btn-secondary"
                    >
                      Previous
                    </Link>
                  )}
                  <span className="text-dark-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  {currentPage < totalPages && (
                    <Link
                      href={`/blog?page=${currentPage + 1}`}
                      className="btn-secondary"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

