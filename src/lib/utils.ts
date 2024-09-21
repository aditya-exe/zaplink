import { env } from "~/env";
import { createClient } from "@supabase/supabase-js";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import colors from "tailwindcss/colors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl() {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  } else if (process.env.NODE_ENV === "production") {
    return "http://zplnk.vercel.app";
  }
}

export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_API_KEY,
);

export const USER_HEADERS = "user_headers";

function getRandomItem(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function isNotAllowed(color: string) {
  if (!color.match(/^[a-z]+$/)) return true;
  const unallowed = ["black", "white", "inherit", "current", "transparent"];
  if (unallowed.includes(color)) return true;

  return false;
}

export function getRandomColor(prevColor = ""): string {
  const allColors = Object.keys(colors);
  const color = getRandomItem(allColors);
  return isNotAllowed(color) || prevColor === color
    ? getRandomColor(prevColor)
    : color;
}

export const getGradient = (
  firstColor: string,
  secondColor: string,
  intensity = 300,
  direction = "br",
) => {
  return `bg-gradient-to-${direction} from-${firstColor}-${intensity} to-${secondColor}-${intensity}`;
};
