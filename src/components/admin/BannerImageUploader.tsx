"use client";

import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { X, Upload, GripVertical } from "lucide-react";

interface BannerImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export function BannerImageUploader({
  images,
  onImagesChange,
}: BannerImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    onImagesChange(newImages);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const removeImage = async (index: number, url: string) => {
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
            {images.length} {images.length === 1 ? 'изображение' : 'изображения'}
          </p>
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
            <div
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group cursor-move ${
                draggedIndex === index ? 'opacity-50' : ''
              }`}
            >
              <div className="relative h-32 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-green-500 transition">
                <Image
                  src={url}
                  alt={`Banner ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center">
                  <GripVertical className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition" />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeImage(index, url)}
                disabled={deletingIndex === index}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition disabled:opacity-50 disabled:cursor-not-allowed z-10"
              >
                {deletingIndex === index ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </button>
              {index === 0 && (
                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded z-10">
                  Главно
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-green-500 transition">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Upload className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Добавете изображения за банер
          </h3>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Препоръчителни размери: 1920x600px
            <br />
            Максимален размер до 4MB всяко
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
                "whitespace-nowrap bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium ut-ready:bg-green-600 ut-uploading:bg-green-700 ut-uploading:cursor-not-allowed disabled:bg-gray-300",
              allowedContent: "hidden",
            }}
            content={{
              button: isUploading ? "Качване..." : "Изберете файлове",
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
      </div>

      {images.length === 0 && (
        <p className="text-sm text-gray-600 text-center">
          Първото изображение ще бъде главното изображение на банера
        </p>
      )}

      {images.length > 1 && (
        <p className="text-sm text-gray-500 text-center">
          💡 Влачете и пускайте изображенията за да промените реда
        </p>
      )}
    </div>
  );
}
