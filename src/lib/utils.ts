import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats service price display according to business rules:
 * - If max_price is present and > min_price: Display "KES [min_price] - [max_price]"
 * - If max_price is null or max_price <= min_price: Display "KES [min_price]"
 * - If min_price is 0 or null: Display "Price Varies" or "Contact for Price"
 */
export function formatServicePrice(minPrice: number | null, maxPrice: number | null): string {
  // Handle null or zero min_price
  if (!minPrice || minPrice === 0) {
    return "Price Varies";
  }

  const formattedMinPrice = minPrice.toLocaleString();
  
  // If no max_price or max_price <= min_price, show only min_price
  if (!maxPrice || maxPrice <= minPrice) {
    return `KES ${formattedMinPrice}`;
  }

  // Show price range
  const formattedMaxPrice = maxPrice.toLocaleString();
  return `KES ${formattedMinPrice} - ${formattedMaxPrice}`;
}

/**
 * Formats a single price value for currency display
 */
export function formatPrice(price: number): string {
  return `KES ${price.toLocaleString()}`;
}
