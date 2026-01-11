import { NextResponse } from "next/server";
import mediaData from "@/data/media-organization.json";

// This route is disabled in production/Vercel as it requires filesystem access
// which isn't available for public files on Vercel serverless functions
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface MediaFile {
  filename: string;
  path: string;
  type: "image" | "video";
}

interface MediaItem {
  src: string;
  alt?: string;
  type: string;
}

interface Project {
  media: MediaItem[];
}

interface Service {
  projects: Project[];
}

interface MediaData {
  services: Service[];
}

// Get all media files already used in media-organization.json
function getUsedMediaFiles(): Set<string> {
  const usedFiles = new Set<string>();
  const data = mediaData as unknown as MediaData;
  
  data.services.forEach((service) => {
    service.projects.forEach((project) => {
      project.media.forEach((media) => {
        // Extract filename from path like "/videos/instagram/bmw1.jpg"
        const filename = media.src.split("/").pop();
        if (filename) {
          // Store exact filename for matching
          usedFiles.add(filename);
        }
      });
    });
  });
  
  return usedFiles;
}

export async function GET() {
  // This route is disabled in production/Vercel to prevent bundling issues
  // Public files on Vercel are static and not accessible via filesystem in serverless functions
  // Return empty result for production/pitch site deployments
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return NextResponse.json({
      success: true,
      files: [],
      total: 0,
      used: getUsedMediaFiles().size,
      message: "Media scanning only available in local development environment",
    });
  }

  // Only execute filesystem operations in local development
  // This code is never reached in production, preventing Next.js from bundling the files
  try {
    // Dynamically import to prevent static analysis during build
    const fs = await import("fs/promises");
    const path = await import("path");
    
    // Construct path dynamically to prevent Next.js from analyzing it at build time
    const parts = ["public", "videos", "instagram"];
    const instagramDir = path.join(process.cwd(), ...parts);
    
    const files = await fs.readdir(instagramDir);
    const usedFiles = getUsedMediaFiles();
    
    // Filter to only show files not already used (exact filename match)
    const availableFiles: MediaFile[] = files
      .filter((filename) => {
        // Check if file is already used (exact match, case-sensitive)
        return !usedFiles.has(filename);
      })
      .map((filename) => {
        const extension = filename.split(".").pop()?.toLowerCase() || "";
        const type: "image" | "video" = 
          ["jpg", "jpeg", "png", "gif", "webp"].includes(extension)
            ? "image"
            : "video";
        
        return {
          filename,
          path: `/videos/instagram/${filename}`,
          type,
        };
      })
      .sort((a, b) => a.filename.localeCompare(b.filename));
    
    return NextResponse.json({
      success: true,
      files: availableFiles,
      total: availableFiles.length,
      used: usedFiles.size,
    });
  } catch (error: any) {
    console.error("Error scanning media directory:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to scan media directory",
      },
      { status: 500 }
    );
  }
}
