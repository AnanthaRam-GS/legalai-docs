import { Inter, Source_Serif_4 } from "next/font/google";

// next/font downloads these at build time and serves them from the site's own
// origin, so no request goes to Google at runtime.
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700"],
  variable: "--font-source-serif",
});
