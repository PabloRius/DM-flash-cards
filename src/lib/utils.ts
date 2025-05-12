import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to get a weighted random index based on weights array
export function getWeightedRandomIndex(
  weights: number[],
  excludeIndex?: number
): number {
  const adjustedWeights = [...weights];

  // Prevent selecting the same card again
  if (excludeIndex !== undefined) {
    adjustedWeights[excludeIndex] = 0;
  }

  const totalWeight = adjustedWeights.reduce((sum, w) => sum + w, 0);
  if (totalWeight === 0) return Math.floor(Math.random() * weights.length);

  let random = Math.random() * totalWeight;
  for (let i = 0; i < adjustedWeights.length; i++) {
    random -= adjustedWeights[i];
    if (random <= 0) return i;
  }

  return Math.floor(Math.random() * weights.length);
}
