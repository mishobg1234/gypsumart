// Фиксиран курс EUR към BGN
export const EUR_TO_BGN_RATE = 1.95583;

/**
 * Преобразува цена от EUR в BGN
 */
export function euroToBgn(euroAmount: number): number {
  return euroAmount * EUR_TO_BGN_RATE;
}

/**
 * Форматира цената показвайки първо лева, после евро
 * Пример: "195,58 лв (100,00 €)"
 */
export function formatPrice(euroAmount: number): string {
  const bgnAmount = euroToBgn(euroAmount);
  return `${bgnAmount.toFixed(2)} лв (${euroAmount.toFixed(2)} €)`;
}

/**
 * Форматира цената за HTML, показвайки първо лева, после евро
 */
export function formatPriceHTML(euroAmount: number): { bgn: string; eur: string; full: string } {
  const bgnAmount = euroToBgn(euroAmount);
  return {
    bgn: `${bgnAmount.toFixed(2)} лв`,
    eur: `${euroAmount.toFixed(2)} €`,
    full: `${bgnAmount.toFixed(2)} лв (${euroAmount.toFixed(2)} €)`,
  };
}
