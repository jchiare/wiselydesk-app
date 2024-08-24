import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function concatClassNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatDateTime(stringDate: string | Date): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });

  const dateTime = new Date(stringDate);
  return formatter.format(dateTime);
}

export function generateRandomLorem(minLength = 15, maxLength = 70) {
  const lorem =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

  const randomLength =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  const start = Math.floor(Math.random() * (lorem.length - randomLength));

  return lorem.slice(start, start + randomLength);
}

export const isDevDb = () => process.env.DATABASE_URL?.includes("ad3l0rv");
