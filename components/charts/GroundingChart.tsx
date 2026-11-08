"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useChartTheme } from "./useChartTheme";

export const GROUNDING_SERIES = ["Paired (24 queries)", "Public", "Professional"] as const;

/**
 * Share of schema-valid answers with at least one claim citing valid retrieved evidence, in percent.
 * docs/evaluation/EVALUATION_2026-10.md (October 2026 three-configuration run, 30 queries).
 */
export const GROUNDING_DATA = [
  {
    config: "A: LLM only",
    "Paired (24 queries)": 0,
    Public: 0,
    Professional: 0,
  },
  {
    config: "B: Dense RAG",
    "Paired (24 queries)": 87.5,
    Public: 80.0,
    Professional: 92.9,
  },
  {
    config: "C: Full LegalAI",
    "Paired (24 queries)": 95.8,
    Public: 92.3,
    Professional: 93.3,
  },
];

export function GroundingChart() {
  const theme = useChartTheme();
  return (
    <div
      className="h-80 w-full"
      role="img"
      aria-label="Grouped bar chart of answers with at least one validly cited claim, for configurations A (LLM only), B (dense RAG) and C (full LegalAI). A is 0% by construction because it has no evidence; C is highest in the paired set, 95.8% against 87.5% for B. The exact values are in the table below."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={GROUNDING_DATA}
          margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
          barGap={2}
        >
          <CartesianGrid vertical={false} stroke={theme.grid} />
          <XAxis
            dataKey="config"
            tickLine={false}
            axisLine={{ stroke: theme.grid }}
            tick={{ fill: theme.axis, fontSize: 12 }}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickFormatter={(value: number) => `${value}%`}
            tickLine={false}
            axisLine={false}
            tick={{ fill: theme.axis, fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: theme.grid, opacity: 0.4 }}
            formatter={(value) =>
              typeof value === "number" ? `${value.toFixed(1)}%` : String(value)
            }
            contentStyle={{
              background: theme.surface,
              border: `1px solid ${theme.grid}`,
              borderRadius: 8,
              color: theme.text,
              fontSize: 12,
            }}
            labelStyle={{ color: theme.text, fontWeight: 600 }}
            itemStyle={{ color: theme.text }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={8}
            itemSorter={null}
            formatter={(value) => <span style={{ color: theme.text, fontSize: 12 }}>{value}</span>}
          />
          {GROUNDING_SERIES.map((series, index) => (
            <Bar
              key={series}
              dataKey={series}
              fill={theme.series[index]}
              maxBarSize={28}
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
