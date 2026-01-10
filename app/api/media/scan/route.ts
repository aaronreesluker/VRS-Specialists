import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import { join } from "path";
import mediaData from "@/data/media-organization.json";

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
  try {
    const instagramDir = join(process.cwd(), "public", "videos", "instagram");
    const files = await readdir(instagramDir);
    
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
