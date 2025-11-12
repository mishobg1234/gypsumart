import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import { auth } from "@/auth";

const utapi = new UTApi();

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { fileUrl } = await req.json();

    if (!fileUrl) {
      return NextResponse.json(
        { error: "File URL is required" },
        { status: 400 }
      );
    }

    // Extract file key from URL
    // UploadThing URLs are in format: https://utfs.io/f/{fileKey}
    const fileKey = fileUrl.split("/f/")[1];

    if (!fileKey) {
      return NextResponse.json(
        { error: "Invalid file URL" },
        { status: 400 }
      );
    }

    // Delete file from UploadThing
    await utapi.deleteFiles(fileKey);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
