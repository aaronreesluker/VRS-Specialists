/**
 * WordPress Posts Health Check Endpoint
 * Non-negotiable requirement for blog infrastructure
 * Proves CMS is connected and accessible
 */

import { NextResponse } from "next/server";
import { getPostsList } from "@/lib/wordpress";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await getPostsList(10, 1);
    
    const response = {
      ok: true,
      count: result.total,
      posts: result.posts.length,
      slugs: result.posts.map((post) => post.slug),
      titles: result.posts.map((post) => post.title.rendered),
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return NextResponse.json(
      {
        ok: false,
        error: errorMessage,
        count: 0,
        posts: 0,
        slugs: [],
        titles: [],
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

