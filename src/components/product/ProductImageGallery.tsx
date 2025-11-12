"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevious, goToNext]);

  if (images.length === 0) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-500">Няма налични изображения</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PhotoProvider
        maskOpacity={0.9}
        bannerVisible={true}
        toolbarRender={({ onScale, scale }) => {
          return (
            <>
              <svg
                className="PhotoView-Slider__toolbarIcon"
                onClick={() => onScale(scale + 0.5)}
                width="44"
                height="44"
                fill="white"
                viewBox="0 0 768 768"
              >
                <path d="M384 640.5q105 0 180.75-75.75t75.75-180.75-75.75-180.75-180.75-75.75-180.75 75.75-75.75 180.75 75.75 180.75 180.75 75.75zM384 64.5q132 0 225.75 93.75t93.75 225.75-93.75 225.75-225.75 93.75-225.75-93.75-93.75-225.75 93.75-225.75 225.75-93.75zM415.5 223.5v129h129v63h-129v129h-63v-129h-129v-63h129v-129h63z" />
              </svg>
              <svg
                className="PhotoView-Slider__toolbarIcon"
                onClick={() => onScale(scale - 0.5)}
                width="44"
                height="44"
                fill="white"
                viewBox="0 0 768 768"
              >
                <path d="M384 640.5q105 0 180.75-75.75t75.75-180.75-75.75-180.75-180.75-75.75-180.75 75.75-75.75 180.75 75.75 180.75 180.75 75.75zM384 64.5q132 0 225.75 93.75t93.75 225.75-93.75 225.75-225.75 93.75-225.75-93.75-93.75-225.75 93.75-225.75 225.75-93.75zM223.5 352.5h321v63h-321v-63z" />
              </svg>
            </>
          );
        }}
      >
        {/* Main Image */}
        <div className="relative h-[500px] bg-gray-100 rounded-lg overflow-hidden group">
          <PhotoView src={images[selectedIndex]}>
            <div className="relative w-full h-full cursor-pointer">
              <Image
                src={images[selectedIndex]}
                alt={`${productName} - изображение ${selectedIndex + 1}`}
                fill
                className="object-cover"
                priority
              />
              {/* Zoom Icon */}
              <div className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="h-5 w-5" />
              </div>
            </div>
          </PhotoView>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Предишна снимка"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Следваща снимка"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Hidden PhotoViews for all other images in the gallery */}
        {images.map((image, index) => 
          index !== selectedIndex ? (
            <PhotoView key={index} src={image}>
              <div style={{ display: "none" }} />
            </PhotoView>
          ) : null
        )}
      </PhotoProvider>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative h-20 bg-gray-100 rounded-lg overflow-hidden transition-all ${
                index === selectedIndex
                  ? "ring-2 ring-amber-500 scale-105"
                  : "hover:opacity-75 opacity-60"
              }`}
            >
              <Image
                src={image}
                alt={`${productName} - миниатюра ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
