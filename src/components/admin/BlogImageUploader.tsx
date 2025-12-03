"use client";

import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { X, Upload, ImagePlus } from "lucide-react";

interface BlogImageUploaderProps {
  imageUrl: string | null;
  onImageChange: (url: string | null) => void;
}

export function BlogImageUploader({
  imageUrl,
  onImageChange,
}: BlogImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const removeImage = async () => {
    if (!imageUrl) return;

    // Check if this is an UploadThing URL
    const isUploadThingUrl = imageUrl.includes("utfs.io");

    if (isUploadThingUrl) {
      setIsDeleting(true);
      try {
        const response = await fetch("/api/uploadthing/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileUrl: imageUrl }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete file");
        }
      } catch (error) {
        console.error("Error deleting file:", error);
        alert("Грешка при изтриване на файла от сървъра");
        setIsDeleting(false);
        return;
      }
      setIsDeleting(false);
    }

    // Remove from local state
    onImageChange(null);
  };

  const addImageByUrl = () => {
    const url = prompt("Въведете URL на изображението:");
    if (url) {
      onImageChange(url);
    }
  };

  return (
    <div className="space-y-4">
      {isUploading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-800 mr-3"></div>
          <span className="font-medium">Качване на снимка...</span>
        </div>
      )}

      {imageUrl ? (
        <div className="relative group">
          <div className="relative h-64 rounded-lg overflow-hidden border-2 border-gray-200">
            <Image
              src={imageUrl}
              alt="Blog post image"
              fill
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={removeImage}
            disabled={isDeleting}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isDeleting ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <X className="h-5 w-5" />
            )}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-green-500 transition">
          <ImagePlus className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Добавете изображение
          </h3>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Максимален размер до 4MB
          </p>

          <UploadButton
            endpoint="productImages"
            onClientUploadComplete={(res) => {
              if (res && res[0]) {
                onImageChange(res[0].url);
              }
              setIsUploading(false);
            }}
            onUploadError={(error: Error) => {
              alert(`Грешка при качване: ${error.message}`);
              setIsUploading(false);
            }}
            onUploadBegin={() => {
              setIsUploading(true);
            }}
            appearance={{
              button:
                "whitespace-nowrap bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium ut-ready:bg-green-600 ut-uploading:bg-green-700 ut-uploading:cursor-not-allowed disabled:bg-gray-300",
              allowedContent: "hidden",
            }}
            content={{
              button: isUploading ? "Качване..." : "Изберете файл",
            }}
          />

          <div className="mt-4">
            <button
              type="button"
              onClick={addImageByUrl}
              className="flex items-center space-x-2 text-green-600 hover:text-green-700 text-sm"
            >
              <Upload className="h-4 w-4" />
              <span>Или добавете изображение чрез URL</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
