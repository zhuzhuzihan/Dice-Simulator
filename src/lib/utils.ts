import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// LocalStorage helpers
export function saveToLocalStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadFromLocalStorage(key: string, defaultValue: any) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : defaultValue;
}
