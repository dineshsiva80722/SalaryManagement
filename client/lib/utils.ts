import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMonthName(monthNumber: number): string {
  return new Date(2000, monthNumber - 1).toLocaleString('default', { month: 'long' });
}
