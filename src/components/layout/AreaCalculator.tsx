"use client";

import { useState } from "react";
import { Calculator, X } from "lucide-react";

export function AreaCalculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [length, setLength] = useState<string>("");
  const [width, setWidth] = useState<string>("");
  const [area, setArea] = useState<number | null>(null);

  const calculateArea = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    
    if (!isNaN(l) && !isNaN(w) && l > 0 && w > 0) {
      setArea(l * w);
    } else {
      setArea(null);
    }
  };

  const reset = () => {
    setLength("");
    setWidth("");
    setArea(null);
  };

  return (
    <div className="relative">
      {/* Calculator Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white hover:bg-green-700 transition shadow-md"
        aria-label="Калкулатор за площ"
      >
        <Calculator className="h-5 w-5" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Calculator Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-green-600" />
                Калкулатор за площ
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дължина (м)
                </label>
                <input
                  type="number"
                  value={length}
                  onChange={(e) => {
                    setLength(e.target.value);
                    setArea(null);
                  }}
                  placeholder="Въведете дължина"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Широчина (м)
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => {
                    setWidth(e.target.value);
                    setArea(null);
                  }}
                  placeholder="Въведете широчина"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateArea}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition mb-3"
            >
              Изчисли
            </button>

            {/* Result */}
            {area !== null && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                <p className="text-sm text-gray-600 mb-1">Обща площ:</p>
                <p className="text-2xl font-bold text-green-600">
                  {area.toFixed(2)} м²
                </p>
              </div>
            )}

            {/* Reset Button */}
            <button
              onClick={reset}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition text-sm"
            >
              Изчисти
            </button>
          </div>
        </>
      )}
    </div>
  );
}
