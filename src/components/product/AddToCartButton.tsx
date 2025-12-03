"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image?: string;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddToCart = () => {
    setIsAnimating(true);
    addItem(product, quantity);
    
    // След 800ms (след като анимацията свърши) показваме успешния статус
    setTimeout(() => {
      setAdded(true);
      setIsAnimating(false);
    }, 800);
    
    // Връщаме бутона в нормално състояние след 2.5 секунди
    setTimeout(() => {
      setAdded(false);
    }, 3300);
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <label className="text-gray-700 font-medium">Количество:</label>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 text-center border border-gray-300 rounded-lg px-3 py-2"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <motion.button
        onClick={handleAddToCart}
        disabled={isAnimating}
        className="relative w-full px-8 py-4 rounded-lg text-center font-semibold text-lg overflow-hidden text-white"
        style={{ backgroundColor: "#16a34a" }}
        whileHover={!isAnimating && !added ? { scale: 1.02 } : {}}
        whileTap={!isAnimating && !added ? { scale: 0.98 } : {}}
        animate={{
          backgroundColor: added ? "#15803d" : "#16a34a"
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {/* Ripple ефект */}
        <AnimatePresence>
          {added && (
            <>
              <motion.div
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0 bg-white rounded-full"
                style={{
                  left: "50%",
                  top: "100%",
                  transform: "translate(-50%, -50%)",
                }}
              />
              <motion.div
                initial={{ scale: 0, opacity: 0.3 }}
                animate={{ scale: 3.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                className="absolute inset-0 bg-white rounded-full"
                style={{
                  left: "50%",
                  top: "100%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Съдържание на бутона */}
        <div className="relative flex items-center justify-center space-x-2">
          <AnimatePresence mode="wait">
            {isAnimating ? (
              // Анимация на количката която скрива текста
              <motion.div
                key="animating"
                className="flex items-center justify-center w-full"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  animate={{
                    x: [0, 200],
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    times: [0, 0.7, 1],
                    ease: "easeInOut",
                  }}
                >
                  <ShoppingCart className="h-6 w-6" />
                </motion.div>
                <motion.span
                  className="ml-2"
                  animate={{
                    opacity: [1, 0],
                    x: [0, -20],
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                >
                  Добави в кошницата
                </motion.span>
              </motion.div>
            ) : added ? (
              // Успешно добавен статус
              <motion.div
                key="added"
                className="flex items-center justify-center space-x-2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: "backOut" }}
              >
                <motion.div
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                >
                  <Check className="h-6 w-6" />
                </motion.div>
                <span>Добавено в кошницата</span>
              </motion.div>
            ) : (
              // Нормално състояние
              <motion.div
                key="normal"
                className="flex items-center justify-center space-x-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ShoppingCart className="h-6 w-6" />
                <span>Добави в кошницата</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    </div>
  );
}
