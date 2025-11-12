import { transliterate } from "transliteration";
import slugifyLib from "slugify";

/**
 * Генерира slug от текст с поддръжка на кирилица
 * Преобразува кирилица в латиница и форматира като slug
 */
export function generateSlug(text: string): string {
  // Първо транслитерираме кирилицата в латиница
  const transliterated = transliterate(text);
  
  // После използваме slugify за правилно форматиране
  return slugifyLib(transliterated, {
    lower: true,
    strict: true,
    locale: "en",
  });
}
