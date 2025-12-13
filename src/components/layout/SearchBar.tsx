"use client";

import { Search, SearchIcon, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/currency";
import Image from "next/image";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  shortDescription: string | null;
}

interface SearchBarProps {
  isMobile?: boolean;
}

export function SearchBar({ isMobile = false }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Затваря резултатите при клик извън търсачката
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Търсене с debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length === 0) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      if (query.trim().length < 2) {
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.products) {
          setResults(data.products);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  };

  const handleSearch = () => {
    query.trim().length >= 2 && router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    setIsOpen(false);
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter" && query.trim().length >= 2) {
      // Препраща към страница с резултати от търсенето
      handleSearch();
    }
  };

  return (
    <div 
      ref={searchRef} 
      className={`relative ${isMobile ? "w-full" : "w-full max-w-lg"}`}
    >
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Търсене на продукти..."
          className="w-full px-4 py-2 pl-10 pr-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {isLoading && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
          </div>
        )}
      </div>

      {/* Резултати от търсенето */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          {results.slice(0, 3).map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              onClick={handleResultClick}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              {product.image ? (
                <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={256}
                    height={256}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded flex items-center justify-center">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </h4>
                {product.categoryName && (
                  <p className="text-xs text-gray-500 truncate">
                    {product.categoryName}
                  </p>
                )}
                <p className="text-sm font-semibold text-green-600 mt-1">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
          
          {/* Виж всички резултати */}
          <Link
            href={`/shop?search=${encodeURIComponent(query.trim())}`}
            onClick={handleResultClick}
            className="block p-3 text-center text-sm font-medium text-green-600 hover:bg-gray-50 transition-colors"
          >
            Виж всички резултати ({results.length})
          </Link>
        </div>
      )}

      {/* Съобщение когато няма резултати */}
      {isOpen && !isLoading && query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500 text-center">
            Няма намерени продукти за &quot;{query}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
