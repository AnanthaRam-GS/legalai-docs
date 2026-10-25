"use client";

import { useTheme } from "next-themes";
import { useMounted } from "@/lib/useMounted";

/*
 * Chart colours are chosen per theme rather than flipped: each dark step was
 * validated against the dark surface (#111b2f) and each light step against
 * #ffffff with the dataviz palette validator. Slots are used in fixed order.
 */
const LIGHT = {
  series: ["#2a78d6", "#eb6834", "#1baf7a", "#eda100"],
  grid: "#e6e9ee",
  axis: "#5d6a7d",
  text: "#0e1a2b",
  surface: "#ffffff",
};

const DARK = {
  series: ["#3987e5", "#d95926", "#199e70", "#c98500"],
  grid: "#24324d",
  axis: "#a7b2c6",
  text: "#e6ebf3",
  surface: "#111b2f",
};

export type ChartTheme = typeof LIGHT;

export function useChartTheme(): ChartTheme {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  return mounted && resolvedTheme === "dark" ? DARK : LIGHT;
}
