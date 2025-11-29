"use client";

import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { X, Upload, ImagePlus } from "lucide-react";

interface ProductImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export function ProductImageUploader({
  images,
  onImagesChange,
}: ProductImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const removeImage = async (index: number, url: string) => {
    // Check if this is an UploadThing URL
    const isUploadThingUrl = url.includes("utfs.io");

    if (isUploadThingUrl) {
      setDeletingIndex(index);
      try {
        const response = await fetch("/api/uploadthing/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileUrl: url }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete file");
        }
      } catch (error) {
        console.error("Error deleting file:", error);
        alert("Грешка при изтриване на файла от сървъра");
        setDeletingIndex(null);
        return;
      }
      setDeletingIndex(null);
    }

    // Remove from local state
    onImagesChange(images.filter((_, i) => i !== index));
  };

  const addImageByUrl = () => {
    const url = prompt("Въведете URL на изображението:");
    if (url) {
      onImagesChange([...images, url]);
    }
  };

  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">
            {images.length} {images.length === 1 ? 'снимка' : 'снимки'} от максимум 5
          </p>
          {images.length === 5 && (
            <span className="text-xs text-green-600 font-medium">
              ✓ Максимален брой снимки
            </span>
          )}
        </div>
      )}

      {isUploading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-800 mr-3"></div>
          <span className="font-medium">Качване на снимки...</span>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                <Image
                  src={url}
                  alt={`Product ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index, url)}
                disabled={deletingIndex === index}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingIndex === index ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </button>
              {index === 0 && (
                <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                  Главно
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length < 5 && (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-amber-500 transition">
          <ImagePlus className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Добавете снимки на продукта
          </h3>
          <p className="text-sm text-gray-500 mb-4 text-center">
            Макс. {5 - images.length} {5 - images.length === 1 ? 'снимка' : 'снимки'} до 8MB всяка
          </p>
          
          <UploadButton
            endpoint="productImages"
            onClientUploadComplete={(res) => {
              if (res) {
                const newImages = res.map((file) => file.url);
                onImagesChange([...images, ...newImages]);
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
                "bg-amber-600 text-white px-6 py-2.5 rounded-lg hover:bg-amber-700 transition-colors font-medium ut-ready:bg-amber-600 ut-uploading:bg-amber-700 ut-uploading:cursor-not-allowed disabled:bg-gray-300",
              allowedContent: "hidden",
            }}
            content={{
              button: isUploading ? "Качване..." : "Изберете файлове",
            }}
          />
        </div>
      )}

      {images.length < 5 && (
        <button
          type="button"
          onClick={addImageByUrl}
          className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 text-sm"
        >
          <Upload className="h-4 w-4" />
          <span>Или добавете изображение чрез URL</span>
        </button>
      )}

      {images.length === 0 && (
        <p className="text-sm text-gray-600 text-center">
          Първата снимка ще бъде главната снимка на продукта
        </p>
      )}
    </div>
  );
}
