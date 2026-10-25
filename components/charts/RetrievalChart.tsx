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

export const RETRIEVAL_SYSTEMS = ["BM25", "Dense", "Hybrid", "Hybrid+Rerank"] as const;

/** Broad-relevance metrics from docs/RETRIEVAL_EVALUATION_RESULTS.md (30 queries). */
export const RETRIEVAL_DATA = [
  { metric: "P@5", BM25: 0.833, Dense: 0.86, Hybrid: 0.873, "Hybrid+Rerank": 0.873 },
  { metric: "MRR@5", BM25: 0.917, Dense: 0.942, Hybrid: 0.961, "Hybrid+Rerank": 0.961 },
  { metric: "nDCG@5", BM25: 0.728, Dense: 0.786, Hybrid: 0.787, "Hybrid+Rerank": 0.819 },
];

export function RetrievalChart() {
  const theme = useChartTheme();
  return (
    <div
      className="h-80 w-full"
      role="img"
      aria-label="Grouped bar chart of P@5, MRR@5 and nDCG@5 for BM25, Dense, Hybrid and Hybrid plus Rerank. Hybrid plus Rerank is highest or tied on every metric; the exact values are in the table below."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={RETRIEVAL_DATA}
          margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
          barGap={2}
        >
          <CartesianGrid vertical={false} stroke={theme.grid} />
          <XAxis
            dataKey="metric"
            tickLine={false}
            axisLine={{ stroke: theme.grid }}
            tick={{ fill: theme.axis, fontSize: 12 }}
          />
          <YAxis
            domain={[0, 1]}
            ticks={[0, 0.25, 0.5, 0.75, 1]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: theme.axis, fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: theme.grid, opacity: 0.4 }}
            formatter={(value) => (typeof value === "number" ? value.toFixed(3) : String(value))}
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
            formatter={(value) => <span style={{ color: theme.text, fontSize: 12 }}>{value}</span>}
          />
          {RETRIEVAL_SYSTEMS.map((system, index) => (
            <Bar
              key={system}
              dataKey={system}
              fill={theme.series[index]}
              maxBarSize={24}
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
